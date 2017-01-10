/*!
 * puck.all.js 2016/10/12
 * @author: chenguohui
 */

/*
 Base.js, version 1.1a
 Copyright 2006-2010, Dean Edwards
 License: http://www.opensource.org/licenses/mit-license.php
 */

var Base = function () {
    // dummy
};

Base.extend = function (_instance, _static) { // subclass
    var extend = Base.prototype.extend;

    // build the prototype
    Base._prototyping = true;
    var proto = new this;
    extend.call(proto, _instance);
    proto.base = function () {
        // call this method from any other method to invoke that method's ancestor
    };
    delete Base._prototyping;

    // create the wrapper for the constructor function
    //var constructor = proto.constructor.valueOf(); //-dean
    var constructor = proto.constructor;
    var klass = proto.constructor = function () {
        if (!Base._prototyping) {
            if (this._constructing || this.constructor == klass) { // instantiation
                this._constructing = true;
                constructor.apply(this, arguments);
                delete this._constructing;
            } else if (arguments[0] != null) { // casting
                return (arguments[0].extend || extend).call(arguments[0], proto);
            }
        }
    };

    // build the class interface
    klass.ancestor = this;
    klass.extend = this.extend;
    klass.forEach = this.forEach;
    klass.implement = this.implement;
    klass.prototype = proto;
    klass.toString = this.toString;
    klass.valueOf = function (type) {
        //return (type == "object") ? klass : constructor; //-dean
        return (type == "object") ? klass : constructor.valueOf();
    };
    extend.call(klass, _static);
    // class initialisation
    if (typeof klass.init == "function") klass.init();
    return klass;
};

Base.prototype = {
    extend: function (source, value) {
        if (arguments.length > 1) { // extending with a name/value pair
            var ancestor = this[source];
            if (ancestor && (typeof value == "function") && // overriding a method?
                // the valueOf() comparison is to avoid circular references
                (!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
                /\bbase\b/.test(value)) {
                // get the underlying method
                var method = value.valueOf();
                // override
                value = function () {
                    var previous = this.base || Base.prototype.base;
                    this.base = ancestor;
                    var returnValue = method.apply(this, arguments);
                    this.base = previous;
                    return returnValue;
                };
                // point to the underlying method
                value.valueOf = function (type) {
                    return (type == "object") ? value : method;
                };
                value.toString = Base.toString;
            }
            this[source] = value;
        } else if (source) { // extending with an object literal
            var extend = Base.prototype.extend;
            // if this object has a customised extend method then use it
            if (!Base._prototyping && typeof this != "function") {
                extend = this.extend || extend;
            }
            var proto = {toSource: null};
            // do the "toString" and other methods manually
            var hidden = ["constructor", "toString", "valueOf"];
            // if we are prototyping then include the constructor
            var i = Base._prototyping ? 0 : 1;
            while (key = hidden[i++]) {
                if (source[key] != proto[key]) {
                    extend.call(this, key, source[key]);

                }
            }
            // copy each of the source object's properties to this object
            for (var key in source) {
                if (!proto[key]) extend.call(this, key, source[key]);
            }
        }
        return this;
    }
};

// initialise
Base = Base.extend({
    constructor: function () {
        this.extend(arguments[0]);
    }
}, {
    ancestor: Object,
    version: "1.1",

    forEach: function (object, block, context) {
        for (var key in object) {
            if (this.prototype[key] === undefined) {
                block.call(context, object[key], key, object);
            }
        }
    },

    implement: function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "function") {
                // if it's a function, call it
                arguments[i](this.prototype);
            } else {
                // add the interface using the extend method
                this.prototype.extend(arguments[i]);
            }
        }
        return this;
    },

    toString: function () {
        return String(this.valueOf());
    }
});

/**
 * Event 用以事件处理
 */
window.Event = Base.extend({
    _callbacks : null,
    bind : function(ev, callback) {
        var calls = this._callbacks || (this._callbacks = {});
        var list = this._callbacks[ev] || (this._callbacks[ev] = []);
        list.push(callback);
        return this;
    },
    unbind : function(ev, callback) {
        var calls;
        if (!ev) {
            this._callbacks = {};
        } else if (calls = this._callbacks) {
            if (!callback) {
                calls[ev] = [];
            } else {
                var list = calls[ev];
                if (!list)
                    return this;
                for (var i = 0, l = list.length; i < l; i++) {
                    if (callback === list[i]) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        }
        return this;
    },
    unbindAll : function() {
        for (var callbakes in this._callbacks) {
            for (var callback in callbakes) {
                callbakes[callback] = null;
                delete callbakes[callback];
            }
            callbakes = null;
            delete callbakes;
        }
    },
    trigger : function(ev) {
        var list, calls, i, l, result = true;
        if (!(calls = this._callbacks))
            return result;
        if (list = calls[ev]) {
            for (i = list.length - 1; i > -1; i--) {
                var r = list[i].apply(this, Array.prototype.slice.call(arguments, 1));
                result = result && r == false ? false : true;
            }
        }
        if (list = calls['all']) {
            for (i = 0, l = list.length; i < l; i++) {
                var r = list[i].apply(this, arguments);
                result = result && r == false ? false : true;
            }
        }
        return result;
    },
    _handleListeners : function() {// 处理监听器
        if (!(this.listeners instanceof Object)) {
            return;
        }
        for (var key in this.listeners) {
            this.bind(key, this.listeners[key]);
            this.listeners[key] = null;
        }
        this.listeners = null;
    }
});
/**
 * Component 所有组件的基类
 * @author chenguohui
 */
(function () {
    var no = 1; //组件计数
    function _init() {
        var mno; //组件缓存no
        this.extend({
            /**
             * 生成组件标识
             * @param n
             * @returns {*}
             */
            no: function (n) {
                if (mno)
                    return mno;
                if (n)
                    mno = n;
                else
                    mno = '_component_' + (no++) + '_';
                return mno;
            }
        });
    }

    window.Component = Event.extend({
        vision: '1.0',
        el: null,
        opts: null,
        listeners: null,
        constructor: function (opts) {
            if (!opts.el || opts.el.length < 1) {// 没有对应的el则抛出异常
                throw new Error('no element');
            }
            _init.call(this);
            this.el = opts.el;
            this.opts = $.extend(true, {}, this._defaultOpts, opts);
            this.listeners = this.opts.listeners;
            this._handleListeners();// 事件监听处理
        }
    });
})();

/*该版本仅仅引入了JQueryUI的dialog组件和其依赖项*/

/*! jQuery UI - v1.9.2 - 2016-05-23
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.resizable.js, jquery.ui.button.js, jquery.ui.dialog.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.9.2",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,'position')) && (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().andSelf().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	// access offsetHeight before setting the style to prevent a layout bug
	// in IE 9 which causes the element to continue to take up space even
	// after it is removed from the DOM (#8026)
	div.offsetHeight;

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated

(function() {
	var uaMatch = /msie ([\w.]+)/.exec( navigator.userAgent.toLowerCase() ) || [];
	$.ui.ie = uaMatch.length ? true : false;
	$.ui.ie6 = parseFloat( uaMatch[ 1 ], 10 ) === 6;
})();

$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	contains: $.contains,

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},

	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( $.isFunction( value ) ) {
			prototype[ prop ] = (function() {
				var _super = function() {
						return base.prototype[ prop ].apply( this, arguments );
					},
					_superApply = function( args ) {
						return base.prototype[ prop ].apply( this, args );
					};
				return function() {
					var __super = this._super,
						__superApply = this._superApply,
						returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply( this, arguments );

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			})();
		}
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, prototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		// TODO remove widgetBaseClass, see #8155
		widgetBaseClass: fullName,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			// 1.9 BC for #7810
			// TODO remove dual storage
			$.data( element, this.widgetName, this );
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	$.Widget.prototype._getCreateOptions = function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	};
}

})( jQuery );
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function( e ) {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.9.2",
	options: {
		cancel: 'input,textarea,button,select,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + '.preventClickEvent')) {
					$.removeData(event.target, that.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
				.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})(jQuery);
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseInt( offsets[ 0 ], 10 ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseInt( offsets[ 1 ], 10 ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}
function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
			overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowX ? $.position.scrollbarWidth() : 0,
			height: hasOverflowY ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] );
		return {
			element: withinElement,
			isWindow: isWindow,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		targetElem = target[0],
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	if ( targetElem.nodeType === 9 ) {
		targetWidth = target.width();
		targetHeight = target.height();
		targetOffset = { top: 0, left: 0 };
	} else if ( $.isWindow( targetElem ) ) {
		targetWidth = target.width();
		targetHeight = target.height();
		targetOffset = { top: target.scrollTop(), left: target.scrollLeft() };
	} else if ( targetElem.preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
		targetWidth = targetHeight = 0;
		targetOffset = { top: targetElem.pageY, left: targetElem.pageX };
	} else {
		targetWidth = target.outerWidth();
		targetHeight = target.outerHeight();
		targetOffset = target.offset();
	}
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( $.fn.bgiframe ) {
			elem.bgiframe();
		}

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	// offset option
	(function( $ ) {
		var _position = $.fn.position;
		$.fn.position = function( options ) {
			if ( !options || !options.offset ) {
				return _position.call( this, options );
			}
			var offset = options.offset.split( " " ),
				at = options.at.split( " " );
			if ( offset.length === 1 ) {
				offset[ 1 ] = offset[ 0 ];
			}
			if ( /^\d/.test( offset[ 0 ] ) ) {
				offset[ 0 ] = "+" + offset[ 0 ];
			}
			if ( /^\d/.test( offset[ 1 ] ) ) {
				offset[ 1 ] = "+" + offset[ 1 ];
			}
			if ( at.length === 1 ) {
				if ( /left|center|right/.test( at[ 0 ] ) ) {
					at[ 1 ] = "center";
				} else {
					at[ 1 ] = at[ 0 ];
					at[ 0 ] = "center";
				}
			}
			return _position.call( this, $.extend( options, {
				at: at[ 0 ] + offset[ 0 ] + " " + at[ 1 ] + offset[ 1 ],
				offset: undefined
			} ) );
		};
	}( jQuery ) );
}

}( jQuery ) );
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	_destroy: function() {
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;

		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);


		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);

		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('drag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		//if the original element is no longer in the DOM don't bother to continue (see #8269)
		var element = this.element[0], elementInDom = false;
		while ( element && (element = element.parentNode) ) {
			if (element == document ) {
				elementInDom = true;
			}
		}
		if ( !elementInDom && this.options.helper === "original" )
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var that = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function(event) {
		//Remove frame helpers
		$("div.ui-draggable-iframeFix").each(function() {
			this.parentNode.removeChild(this);
		});

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
			o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
			var c = $(o.containment);
			var ce = c[0]; if(!ce) return;
			var co = c.offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				(parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
				(parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
				(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
				(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
			];
			this.relative_container = c;

		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
			var containment;
			if(this.containment) {
			if (this.relative_container){
				var co = this.relative_container.offset();
				containment = [ this.containment[0] + co.left,
					this.containment[1] + co.top,
					this.containment[2] + co.left,
					this.containment[3] + co.top ];
			}
			else {
				containment = this.containment;
			}

				if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, 'sortable');
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), that = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {

			var innermostIntersecting = false;
			var thisSortable = this;
			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;

			if(this.instance._intersectsWith(this.instance.containerCache)) {
				innermostIntersecting = true;
				$.each(inst.sortables, function () {
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;
					if  (this != thisSortable
						&& this.instance._intersectsWith(this.instance.containerCache)
						&& $.ui.contains(thisSortable.instance.element[0], this.instance.element[0]))
						innermostIntersecting = false;
						return innermostIntersecting;
				});
			}


			if(innermostIntersecting) {
				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(that).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;

					//Prevent reverting on this forced stop
					this.instance.options.revert = false;

					// The out event needs to be triggered independently
					this.instance._trigger('out', event, this.instance._uiHash(this.instance));

					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
		});
		if (!group.length) { return; }

		var min = parseInt(group[0].style.zIndex) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});

		this[0].style.zIndex = min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})(jQuery);
(function( $, undefined ) {

$.widget("ui.resizable", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		zIndex: 1000
	},
	_create: function() {

		var that = this, o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
					position: this.element.css('position'),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css('top'),
					left: this.element.css('left')
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"resizable", this.element.data('resizable')
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css('resize');
			this.originalElement.css('resize', 'none');

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css('margin') });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' });
		if(this.handles.constructor == String) {

			if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
			var n = this.handles.split(","); this.handles = {};

			for(var i = 0; i < n.length; i++) {

				var handle = $.trim(n[i]), hname = 'ui-resizable-'+handle;
				var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

				// Apply zIndex to all handles - see #7960
				axis.css({ zIndex: o.zIndex });

				//TODO : What's going on here?
				if ('se' == handle) {
					axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
				};

				//Insert into internal handles object and append to element
				this.handles[handle] = '.ui-resizable-'+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			target = target || this.element;

			for(var i in this.handles) {

				if(this.handles[i].constructor == String)
					this.handles[i] = $(this.handles[i], this.element).show();

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					var axis = $(this.handles[i], this.element), padWrapper = 0;

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					var padPos = [ 'padding',
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' :
						/^e$/.test(i) ? 'Right' : 'Left' ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length)
					continue;

			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $('.ui-resizable-handle', this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className)
					var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				//Axis, default = se
				that.axis = axis && axis[1] ? axis[1] : 'se';
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) return;
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function(){
					if (o.disabled) return;
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	_destroy: function() {

		this._mouseDestroy();

		var _destroy = function(exp) {
			$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
				.removeData("resizable").removeData("ui-resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
		};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			var wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css('position'),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css('top'),
				left: wrapper.css('left')
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css('resize', this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var handle = false;
		for (var i in this.handles) {
			if ($(this.handles[i])[0] == event.target) {
				handle = true;
			}
		}

		return !this.options.disabled && handle;
	},

	_mouseStart: function(event) {

		var o = this.options, iniPos = this.element.position(), el = this.element;

		this.resizing = true;
		this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

		// bugfix for http://dev.jquery.com/ticket/1749
		if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
			el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
		}

		this._renderProxy();

		var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

		var cursor = $('.ui-resizable-' + this.axis).css('cursor');
		$('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var el = this.helper, o = this.options, props = {},
			that = this, smp = this.originalMousePosition, a = this.axis;

		var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
		var trigger = this._change[a];
		if (!trigger) return false;

		// Calculate the attrs that will be change
		var data = trigger.apply(this, [event, dx, dy]);

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey)
			data = this._updateRatio(data, event);

		data = this._respectSize(data, event);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		el.css({
			top: this.position.top + "px", left: this.position.left + "px",
			width: this.size.width + "px", height: this.size.height + "px"
		});

		if (!this._helper && this._proportionallyResizeElements.length)
			this._proportionallyResize();

		this._updateCache(data);

		// calling the user callback at the end
		this._trigger('resize', event, this.ui());

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var o = this.options, that = this;

		if(this._helper) {
			var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
				soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
				soffsetw = ista ? 0 : that.sizeDiff.width;

			var s = { width: (that.helper.width()  - soffsetw), height: (that.helper.height() - soffseth) },
				left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
				top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

			if (!o.animate)
				this.element.css($.extend(s, { top: top, left: left }));

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) this._proportionallyResize();
		}

		$('body').css('cursor', 'auto');

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) this.helper.remove();
		return false;

	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var o = this.options, pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b;

		b = {
			minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if(this._aspectRatio || forceAspectRatio) {
			// We want to create an enclosing box whose aspect ration is the requested one
			// First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if(pMinWidth > b.minWidth) b.minWidth = pMinWidth;
			if(pMinHeight > b.minHeight) b.minHeight = pMinHeight;
			if(pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
			if(pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		var o = this.options;
		this.offset = this.helper.offset();
		if (isNumber(data.left)) this.position.left = data.left;
		if (isNumber(data.top)) this.position.top = data.top;
		if (isNumber(data.height)) this.size.height = data.height;
		if (isNumber(data.width)) this.size.width = data.width;
	},

	_updateRatio: function(data, event) {

		var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

		if (isNumber(data.height)) data.width = (data.height * this.aspectRatio);
		else if (isNumber(data.width)) data.height = (data.width / this.aspectRatio);

		if (a == 'sw') {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a == 'nw') {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function(data, event) {

		var el = this.helper, o = this._vBoundaries, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
				ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

		if (isminw) data.width = o.minWidth;
		if (isminh) data.height = o.minHeight;
		if (ismaxw) data.width = o.maxWidth;
		if (ismaxh) data.height = o.maxHeight;

		var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
		var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

		if (isminw && cw) data.left = dw - o.minWidth;
		if (ismaxw && cw) data.left = dw - o.maxWidth;
		if (isminh && ch)	data.top = dh - o.minHeight;
		if (ismaxh && ch)	data.top = dh - o.maxHeight;

		// fixing jump error on top/left - bug #2330
		var isNotwh = !data.width && !data.height;
		if (isNotwh && !data.left && data.top) data.top = null;
		else if (isNotwh && !data.top && data.left) data.left = null;

		return data;
	},

	_proportionallyResize: function() {

		var o = this.options;
		if (!this._proportionallyResizeElements.length) return;
		var element = this.helper || this.element;

		for (var i=0; i < this._proportionallyResizeElements.length; i++) {

			var prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
					p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

				this.borderDif = $.map(b, function(v, i) {
					var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
					return border + padding;
				});
			}

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		};

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

			// fix ie6 offset TODO: This seems broken
			var ie6offset = ($.ui.ie6 ? 1 : 0),
			pxyoffset = ( $.ui.ie6 ? 2 : -1 );

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() + pxyoffset,
				height: this.element.outerHeight() + pxyoffset,
				position: 'absolute',
				left: this.elementOffset.left - ie6offset +'px',
				top: this.elementOffset.top - ie6offset +'px',
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx, dy) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n != "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

	start: function (event, ui) {
		var that = $(this).data("resizable"), o = that.options;

		var _store = function (exp) {
			$(exp).each(function() {
				var el = $(this);
				el.data("resizable-alsoresize", {
					width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
					left: parseInt(el.css('left'), 10), top: parseInt(el.css('top'), 10)
				});
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var that = $(this).data("resizable"), o = that.options, os = that.originalSize, op = that.originalPosition;

		var delta = {
			height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
			top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
		},

		_alsoResize = function (exp, c) {
			$(exp).each(function() {
				var el = $(this), start = $(this).data("resizable-alsoresize"), style = {},
					css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

				$.each(css, function (i, prop) {
					var sum = (start[prop]||0) + (delta[prop]||0);
					if (sum && sum >= 0)
						style[prop] = sum || null;
				});

				el.css(style);
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function (event, ui) {
		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "animate", {

	stop: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options;

		var pr = that._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
						soffsetw = ista ? 0 : that.sizeDiff.width;

		var style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
					left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
						top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

		that.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(that.element.css('width'), 10),
						height: parseInt(that.element.css('height'), 10),
						top: parseInt(that.element.css('top'), 10),
						left: parseInt(that.element.css('left'), 10)
					};

					if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

					// propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options, el = that.element;
		var oc = o.containment,	ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
		if (!ce) return;

		that.containerElement = $(ce);

		if (/document/.test(oc) || oc == document) {
			that.containerOffset = { left: 0, top: 0 };
			that.containerPosition = { left: 0, top: 0 };

			that.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			var element = $(ce), p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			var co = that.containerOffset, ch = that.containerSize.height,	cw = that.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			that.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options,
				ps = that.containerSize, co = that.containerOffset, cs = that.size, cp = that.position,
				pRatio = that._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = that.containerElement;

		if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

		if (cp.left < (that._helper ? co.left : 0)) {
			that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
			if (pRatio) that.size.height = that.size.width / that.aspectRatio;
			that.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (that._helper ? co.top : 0)) {
			that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
			if (pRatio) that.size.width = that.size.height * that.aspectRatio;
			that.position.top = that._helper ? co.top : 0;
		}

		that.offset.left = that.parentData.left+that.position.left;
		that.offset.top = that.parentData.top+that.position.top;

		var woset = Math.abs( (that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width ),
					hoset = Math.abs( (that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height );

		var isParent = that.containerElement.get(0) == that.element.parent().get(0),
			isOffsetRelative = /relative|absolute/.test(that.containerElement.css('position'));

		if(isParent && isOffsetRelative) woset -= that.parentData.left;

		if (woset + that.size.width >= that.parentData.width) {
			that.size.width = that.parentData.width - woset;
			if (pRatio) that.size.height = that.size.width / that.aspectRatio;
		}

		if (hoset + that.size.height >= that.parentData.height) {
			that.size.height = that.parentData.height - hoset;
			if (pRatio) that.size.width = that.size.height * that.aspectRatio;
		}
	},

	stop: function(event, ui){
		var that = $(this).data("resizable"), o = that.options, cp = that.position,
				co = that.containerOffset, cop = that.containerPosition, ce = that.containerElement;

		var helper = $(that.helper), ho = helper.offset(), w = helper.outerWidth() - that.sizeDiff.width, h = helper.outerHeight() - that.sizeDiff.height;

		if (that._helper && !o.animate && (/relative/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

		if (that._helper && !o.animate && (/static/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function(event, ui) {

		var that = $(this).data("resizable"), o = that.options, cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost
			.css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass('ui-resizable-ghost')
			.addClass(typeof o.ghost == 'string' ? o.ghost : '');

		that.ghost.appendTo(that.helper);

	},

	resize: function(event, ui){
		var that = $(this).data("resizable"), o = that.options;
		if (that.ghost) that.ghost.css({ position: 'relative', height: that.size.height, width: that.size.width });
	},

	stop: function(event, ui){
		var that = $(this).data("resizable"), o = that.options;
		if (that.ghost && that.helper) that.helper.get(0).removeChild(that.ghost.get(0));
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options, cs = that.size, os = that.originalSize, op = that.originalPosition, a = that.axis, ratio = o._aspectRatio || event.shiftKey;
		o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
		var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

		if (/^(se|s|e)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
		}
		else if (/^(ne)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.top = op.top - oy;
		}
		else if (/^(sw)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.left = op.left - ox;
		}
		else {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.top = op.top - oy;
			that.position.left = op.left - ox;
		}
	}

});

var num = function(v) {
	return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
	return !isNaN(parseInt(value, 10));
};

})(jQuery);
(function( $, undefined ) {

var lastActive, startXPos, startYPos, clickDragged,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	stateClasses = "ui-state-hover ui-state-active ",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function() {
		var buttons = $( this ).find( ":ui-button" );
		setTimeout(function() {
			buttons.button( "refresh" );
		}, 1 );
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	version: "1.9.2",
	defaultElement: "<button>",
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + this.eventNamespace )
			.bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = !!this.element.prop( "disabled" );
		} else {
			this.element.prop( "disabled", this.options.disabled );
		}

		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr( "title" );

		var that = this,
			options = this.options,
			toggleButton = this.type === "checkbox" || this.type === "radio",
			activeClass = !toggleButton ? "ui-state-active" : "",
			focusClass = "ui-state-focus";

		if ( options.label === null ) {
			options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
		}

		this._hoverable( this.buttonElement );

		this.buttonElement
			.addClass( baseClasses )
			.attr( "role", "button" )
			.bind( "mouseenter" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				if ( this === lastActive ) {
					$( this ).addClass( "ui-state-active" );
				}
			})
			.bind( "mouseleave" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( activeClass );
			})
			.bind( "click" + this.eventNamespace, function( event ) {
				if ( options.disabled ) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});

		this.element
			.bind( "focus" + this.eventNamespace, function() {
				// no need to check disabled, focus won't be triggered anyway
				that.buttonElement.addClass( focusClass );
			})
			.bind( "blur" + this.eventNamespace, function() {
				that.buttonElement.removeClass( focusClass );
			});

		if ( toggleButton ) {
			this.element.bind( "change" + this.eventNamespace, function() {
				if ( clickDragged ) {
					return;
				}
				that.refresh();
			});
			// if mouse moves between mousedown and mouseup (drag) set clickDragged flag
			// prevents issue where button state changes but checkbox/radio checked state
			// does not in Firefox (see ticket #6970)
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						return;
					}
					clickDragged = false;
					startXPos = event.pageX;
					startYPos = event.pageY;
				})
				.bind( "mouseup" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						return;
					}
					if ( startXPos !== event.pageX || startYPos !== event.pageY ) {
						clickDragged = true;
					}
			});
		}

		if ( this.type === "checkbox" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled || clickDragged ) {
					return false;
				}
				$( this ).toggleClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", that.element[0].checked );
			});
		} else if ( this.type === "radio" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled || clickDragged ) {
					return false;
				}
				$( this ).addClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", "true" );

				var radio = that.element[ 0 ];
				radioGroup( radio )
					.not( radio )
					.map(function() {
						return $( this ).button( "widget" )[ 0 ];
					})
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			});
		} else {
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).addClass( "ui-state-active" );
					lastActive = this;
					that.document.one( "mouseup", function() {
						lastActive = null;
					});
				})
				.bind( "mouseup" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).removeClass( "ui-state-active" );
				})
				.bind( "keydown" + this.eventNamespace, function(event) {
					if ( options.disabled ) {
						return false;
					}
					if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
						$( this ).addClass( "ui-state-active" );
					}
				})
				.bind( "keyup" + this.eventNamespace, function() {
					$( this ).removeClass( "ui-state-active" );
				});

			if ( this.buttonElement.is("a") ) {
				this.buttonElement.keyup(function(event) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						// TODO pass through original event correctly (just as 2nd argument doesn't work)
						$( this ).click();
					}
				});
			}
		}

		// TODO: pull out $.Widget's handling for the disabled option into
		// $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
		// be overridden by individual plugins
		this._setOption( "disabled", options.disabled );
		this._resetButton();
	},

	_determineButtonType: function() {
		var ancestor, labelSelector, checked;

		if ( this.element.is("[type=checkbox]") ) {
			this.type = "checkbox";
		} else if ( this.element.is("[type=radio]") ) {
			this.type = "radio";
		} else if ( this.element.is("input") ) {
			this.type = "input";
		} else {
			this.type = "button";
		}

		if ( this.type === "checkbox" || this.type === "radio" ) {
			// we don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();
			labelSelector = "label[for='" + this.element.attr("id") + "']";
			this.buttonElement = ancestor.find( labelSelector );
			if ( !this.buttonElement.length ) {
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
				this.buttonElement = ancestor.filter( labelSelector );
				if ( !this.buttonElement.length ) {
					this.buttonElement = ancestor.find( labelSelector );
				}
			}
			this.element.addClass( "ui-helper-hidden-accessible" );

			checked = this.element.is( ":checked" );
			if ( checked ) {
				this.buttonElement.addClass( "ui-state-active" );
			}
			this.buttonElement.prop( "aria-pressed", checked );
		} else {
			this.buttonElement = this.element;
		}
	},

	widget: function() {
		return this.buttonElement;
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-helper-hidden-accessible" );
		this.buttonElement
			.removeClass( baseClasses + " " + stateClasses + " " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" )
			.html( this.buttonElement.find(".ui-button-text").html() );

		if ( !this.hasTitle ) {
			this.buttonElement.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" ) {
			if ( value ) {
				this.element.prop( "disabled", true );
			} else {
				this.element.prop( "disabled", false );
			}
			return;
		}
		this._resetButton();
	},

	refresh: function() {
		//See #8237 & #8828
		var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOption( "disabled", isDisabled );
		}
		if ( this.type === "radio" ) {
			radioGroup( this.element[0] ).each(function() {
				if ( $( this ).is( ":checked" ) ) {
					$( this ).button( "widget" )
						.addClass( "ui-state-active" )
						.attr( "aria-pressed", "true" );
				} else {
					$( this ).button( "widget" )
						.removeClass( "ui-state-active" )
						.attr( "aria-pressed", "false" );
				}
			});
		} else if ( this.type === "checkbox" ) {
			if ( this.element.is( ":checked" ) ) {
				this.buttonElement
					.addClass( "ui-state-active" )
					.attr( "aria-pressed", "true" );
			} else {
				this.buttonElement
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			}
		}
	},

	_resetButton: function() {
		if ( this.type === "input" ) {
			if ( this.options.label ) {
				this.element.val( this.options.label );
			}
			return;
		}
		var buttonElement = this.buttonElement.removeClass( typeClasses ),
			buttonText = $( "<span></span>", this.document[0] )
				.addClass( "ui-button-text" )
				.html( this.options.label )
				.appendTo( buttonElement.empty() )
				.text(),
			icons = this.options.icons,
			multipleIcons = icons.primary && icons.secondary,
			buttonClasses = [];

		if ( icons.primary || icons.secondary ) {
			if ( this.options.text ) {
				buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
			}

			if ( icons.primary ) {
				buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
			}

			if ( icons.secondary ) {
				buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
			}

			if ( !this.options.text ) {
				buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

				if ( !this.hasTitle ) {
					buttonElement.attr( "title", $.trim( buttonText ) );
				}
			}
		} else {
			buttonClasses.push( "ui-button-text-only" );
		}
		buttonElement.addClass( buttonClasses.join( " " ) );
	}
});

$.widget( "ui.buttonset", {
	version: "1.9.2",
	options: {
		items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"
	},

	_create: function() {
		this.element.addClass( "ui-buttonset" );
	},

	_init: function() {
		this.refresh();
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.buttons.button( "option", key, value );
		}

		this._super( key, value );
	},

	refresh: function() {
		var rtl = this.element.css( "direction" ) === "rtl";

		this.buttons = this.element.find( this.options.items )
			.filter( ":ui-button" )
				.button( "refresh" )
			.end()
			.not( ":ui-button" )
				.button()
			.end()
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
				.filter( ":first" )
					.addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
				.end()
				.filter( ":last" )
					.addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
				.end()
			.end();
	},

	_destroy: function() {
		this.element.removeClass( "ui-buttonset" );
		this.buttons
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-left ui-corner-right" )
			.end()
			.button( "destroy" );
	}
});

}( jQuery ) );
(function( $, undefined ) {

var uiDialogClasses = "ui-dialog ui-widget ui-widget-content ui-corner-all ",
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	};

$.widget("ui.dialog", {
	version: "1.9.2",
	options: {
		autoOpen: true,
		buttons: {},
		closeOnEscape: true,
		closeText: "close",
		dialogClass: "",
		draggable: true,
		hide: null,
		height: "auto",
		maxHeight: false,
		maxWidth: false,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",
			// ensure that the titlebar is never outside the document
			using: function( pos ) {
				var topOffset = $( this ).css( pos ).offset().top;
				if ( topOffset < 0 ) {
					$( this ).css( "top", pos.top - topOffset );
				}
			}
		},
		resizable: true,
		show: null,
		stack: true,
		title: "",
		width: 300,
		zIndex: 1000
	},

	_create: function() {
		this.originalTitle = this.element.attr( "title" );
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}
		this.oldPosition = {
			parent: this.element.parent(),
			index: this.element.parent().children().index( this.element )
		};
		this.options.title = this.options.title || this.originalTitle;
		var that = this,
			options = this.options,

			title = options.title || "&#160;",
			uiDialog,
			uiDialogTitlebar,
			uiDialogTitlebarClose,
			uiDialogTitle,
			uiDialogButtonPane;

			uiDialog = ( this.uiDialog = $( "<div>" ) )
				.addClass( uiDialogClasses + options.dialogClass )
				.css({
					display: "none",
					outline: 0, // TODO: move to stylesheet
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				.attr( "tabIndex", -1)
				.keydown(function( event ) {
					if ( options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
							event.keyCode === $.ui.keyCode.ESCAPE ) {
						that.close( event );
						event.preventDefault();
					}
				})
				.mousedown(function( event ) {
					that.moveToTop( false, event );
				})
				.appendTo( "body" );

			this.element
				.show()
				.removeAttr( "title" )
				.addClass( "ui-dialog-content ui-widget-content" )
				.appendTo( uiDialog );

			uiDialogTitlebar = ( this.uiDialogTitlebar = $( "<div>" ) )
				.addClass( "ui-dialog-titlebar  ui-widget-header  " +
					"ui-corner-all  ui-helper-clearfix" )
				.bind( "mousedown", function() {
					// Dialog isn't getting focus when dragging (#8063)
					uiDialog.focus();
				})
				.prependTo( uiDialog );

			uiDialogTitlebarClose = $( "<a href='#'></a>" )
				.addClass( "ui-dialog-titlebar-close  ui-corner-all" )
				.attr( "role", "button" )
				.click(function( event ) {
					event.preventDefault();
					that.close( event );
				})
				.appendTo( uiDialogTitlebar );

			( this.uiDialogTitlebarCloseText = $( "<span>" ) )
				.addClass( "ui-icon ui-icon-closethick" )
				.text( options.closeText )
				.appendTo( uiDialogTitlebarClose );

			uiDialogTitle = $( "<span>" )
				.uniqueId()
				.addClass( "ui-dialog-title" )
				.html( title )
				.prependTo( uiDialogTitlebar );

			uiDialogButtonPane = ( this.uiDialogButtonPane = $( "<div>" ) )
				.addClass( "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" );

			( this.uiButtonSet = $( "<div>" ) )
				.addClass( "ui-dialog-buttonset" )
				.appendTo( uiDialogButtonPane );

		uiDialog.attr({
			role: "dialog",
			"aria-labelledby": uiDialogTitle.attr( "id" )
		});

		uiDialogTitlebar.find( "*" ).add( uiDialogTitlebar ).disableSelection();
		this._hoverable( uiDialogTitlebarClose );
		this._focusable( uiDialogTitlebarClose );

		if ( options.draggable && $.fn.draggable ) {
			this._makeDraggable();
		}
		if ( options.resizable && $.fn.resizable ) {
			this._makeResizable();
		}

		this._createButtons( options.buttons );
		this._isOpen = false;

		if ( $.fn.bgiframe ) {
			uiDialog.bgiframe();
		}

		// prevent tabbing out of modal dialogs
		this._on( uiDialog, { keydown: function( event ) {
			if ( !options.modal || event.keyCode !== $.ui.keyCode.TAB ) {
				return;
			}

			var tabbables = $( ":tabbable", uiDialog ),
				first = tabbables.filter( ":first" ),
				last  = tabbables.filter( ":last" );

			if ( event.target === last[0] && !event.shiftKey ) {
				first.focus( 1 );
				return false;
			} else if ( event.target === first[0] && event.shiftKey ) {
				last.focus( 1 );
				return false;
			}
		}});
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	_destroy: function() {
		var next,
			oldPosition = this.oldPosition;

		if ( this.overlay ) {
			this.overlay.destroy();
		}
		this.uiDialog.hide();
		this.element
			.removeClass( "ui-dialog-content ui-widget-content" )
			.hide()
			.appendTo( "body" );
		this.uiDialog.remove();

		if ( this.originalTitle ) {
			this.element.attr( "title", this.originalTitle );
		}

		next = oldPosition.parent.children().eq( oldPosition.index );
		// Don't try to place the dialog next to itself (#8613)
		if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
			next.before( this.element );
		} else {
			oldPosition.parent.append( this.element );
		}
	},

	widget: function() {
		return this.uiDialog;
	},

	close: function( event ) {
		var that = this,
			maxZ, thisZ;

		if ( !this._isOpen ) {
			return;
		}

		if ( false === this._trigger( "beforeClose", event ) ) {
			return;
		}

		this._isOpen = false;

		if ( this.overlay ) {
			this.overlay.destroy();
		}

		if ( this.options.hide ) {
			this._hide( this.uiDialog, this.options.hide, function() {
				that._trigger( "close", event );
			});
		} else {
			this.uiDialog.hide();
			this._trigger( "close", event );
		}

		$.ui.dialog.overlay.resize();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		if ( this.options.modal ) {
			maxZ = 0;
			$( ".ui-dialog" ).each(function() {
				if ( this !== that.uiDialog[0] ) {
					thisZ = $( this ).css( "z-index" );
					if ( !isNaN( thisZ ) ) {
						maxZ = Math.max( maxZ, thisZ );
					}
				}
			});
			$.ui.dialog.maxZ = maxZ;
		}

		return this;
	},

	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal dialogs to their correct
	// position on open
	moveToTop: function( force, event ) {
		var options = this.options,
			saveScroll;

		if ( ( options.modal && !force ) ||
				( !options.stack && !options.modal ) ) {
			return this._trigger( "focus", event );
		}

		if ( options.zIndex > $.ui.dialog.maxZ ) {
			$.ui.dialog.maxZ = options.zIndex;
		}
		if ( this.overlay ) {
			$.ui.dialog.maxZ += 1;
			$.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ;
			this.overlay.$el.css( "z-index", $.ui.dialog.overlay.maxZ );
		}

		// Save and then restore scroll
		// Opera 9.5+ resets when parent z-index is changed.
		// http://bugs.jqueryui.com/ticket/3193
		saveScroll = {
			scrollTop: this.element.scrollTop(),
			scrollLeft: this.element.scrollLeft()
		};
		$.ui.dialog.maxZ += 1;
		this.uiDialog.css( "z-index", $.ui.dialog.maxZ );
		this.element.attr( saveScroll );
		this._trigger( "focus", event );

		return this;
	},

	open: function() {
		if ( this._isOpen ) {
			return;
		}

		var hasFocus,
			options = this.options,
			uiDialog = this.uiDialog;

		this._size();
		this._position( options.position );
		uiDialog.show( options.show );
		this.overlay = options.modal ? new $.ui.dialog.overlay( this ) : null;
		this.moveToTop( true );

		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the dialog itself
		hasFocus = this.element.find( ":tabbable" );
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
			if ( !hasFocus.length ) {
				hasFocus = uiDialog;
			}
		}
		//hasFocus.eq( 0 ).focus();

		this._isOpen = true;
		this._trigger( "open" );

		return this;
	},

	_createButtons: function( buttons ) {
		var that = this,
			hasButtons = false;

		// if we already have a button pane, remove it
		this.uiDialogButtonPane.remove();
		this.uiButtonSet.empty();

		if ( typeof buttons === "object" && buttons !== null ) {
			$.each( buttons, function() {
				return !(hasButtons = true);
			});
		}
		if ( hasButtons ) {
			$.each( buttons, function( name, props ) {
				var button, click;
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				// Default to a non-submitting button
				props = $.extend( { type: "button" }, props );
				// Change the context for the click callback to be the main element
				click = props.click;
				props.click = function() {
					click.apply( that.element[0], arguments );
				};
				button = $( "<button></button>", props )
					.appendTo( that.uiButtonSet );
				if ( $.fn.button ) {
					button.button();
				}
			});
			this.uiDialog.addClass( "ui-dialog-buttons" );
			this.uiDialogButtonPane.appendTo( this.uiDialog );
		} else {
			this.uiDialog.removeClass( "ui-dialog-buttons" );
		}
	},

	_makeDraggable: function() {
		var that = this,
			options = this.options;

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uiDialog.draggable({
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: "document",
			start: function( event, ui ) {
				$( this )
					.addClass( "ui-dialog-dragging" );
				that._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.position = [
					ui.position.left - that.document.scrollLeft(),
					ui.position.top - that.document.scrollTop()
				];
				$( this )
					.removeClass( "ui-dialog-dragging" );
				that._trigger( "dragStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		});
	},

	_makeResizable: function( handles ) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var that = this,
			options = this.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css( "position" ),
			resizeHandles = typeof handles === 'string' ?
				handles	:
				"n,e,s,w,se,sw,ne,nw";

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		this.uiDialog.resizable({
			cancel: ".ui-dialog-content",
			containment: "document",
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			start: function( event, ui ) {
				$( this ).addClass( "ui-dialog-resizing" );
				that._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				$( this ).removeClass( "ui-dialog-resizing" );
				options.height = $( this ).height();
				options.width = $( this ).width();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		})
		.css( "position", position )
		.find( ".ui-resizable-se" )
			.addClass( "ui-icon ui-icon-grip-diagonal-se" );
	},

	_minHeight: function() {
		var options = this.options;

		if ( options.height === "auto" ) {
			return options.minHeight;
		} else {
			return Math.min( options.minHeight, options.height );
		}
	},

	_position: function( position ) {
		var myAt = [],
			offset = [ 0, 0 ],
			isVisible;

		if ( position ) {
			// deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
	//		if (typeof position == 'string' || $.isArray(position)) {
	//			myAt = $.isArray(position) ? position : position.split(' ');

			if ( typeof position === "string" || (typeof position === "object" && "0" in position ) ) {
				myAt = position.split ? position.split( " " ) : [ position[ 0 ], position[ 1 ] ];
				if ( myAt.length === 1 ) {
					myAt[ 1 ] = myAt[ 0 ];
				}

				$.each( [ "left", "top" ], function( i, offsetPosition ) {
					if ( +myAt[ i ] === myAt[ i ] ) {
						offset[ i ] = myAt[ i ];
						myAt[ i ] = offsetPosition;
					}
				});

				position = {
					my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " +
						myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
					at: myAt.join( " " )
				};
			}

			position = $.extend( {}, $.ui.dialog.prototype.options.position, position );
		} else {
			position = $.ui.dialog.prototype.options.position;
		}

		// need to show the dialog to get the actual offset in the position plugin
		isVisible = this.uiDialog.is( ":visible" );
		if ( !isVisible ) {
			this.uiDialog.show();
		}
		this.uiDialog.position( position );
		if ( !isVisible ) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var that = this,
			resizableOptions = {},
			resize = false;

		$.each( options, function( key, value ) {
			that._setOption( key, value );

			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
		}
		if ( this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function( key, value ) {
		var isDraggable, isResizable,
			uiDialog = this.uiDialog;

		switch ( key ) {
			case "buttons":
				this._createButtons( value );
				break;
			case "closeText":
				// ensure that we always pass a string
				this.uiDialogTitlebarCloseText.text( "" + value );
				break;
			case "dialogClass":
				uiDialog
					.removeClass( this.options.dialogClass )
					.addClass( uiDialogClasses + value );
				break;
			case "disabled":
				if ( value ) {
					uiDialog.addClass( "ui-dialog-disabled" );
				} else {
					uiDialog.removeClass( "ui-dialog-disabled" );
				}
				break;
			case "draggable":
				isDraggable = uiDialog.is( ":data(draggable)" );
				if ( isDraggable && !value ) {
					uiDialog.draggable( "destroy" );
				}

				if ( !isDraggable && value ) {
					this._makeDraggable();
				}
				break;
			case "position":
				this._position( value );
				break;
			case "resizable":
				// currently resizable, becoming non-resizable
				isResizable = uiDialog.is( ":data(resizable)" );
				if ( isResizable && !value ) {
					uiDialog.resizable( "destroy" );
				}

				// currently resizable, changing handles
				if ( isResizable && typeof value === "string" ) {
					uiDialog.resizable( "option", "handles", value );
				}

				// currently non-resizable, becoming resizable
				if ( !isResizable && value !== false ) {
					this._makeResizable( value );
				}
				break;
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				$( ".ui-dialog-title", this.uiDialogTitlebar )
					.html( "" + ( value || "&#160;" ) );
				break;
		}

		this._super( key, value );
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var nonContentHeight, minContentHeight, autoHeight,
			options = this.options,
			isVisible = this.uiDialog.is( ":visible" );

		// reset content sizing
		this.element.show().css({
			width: "auto",
			minHeight: 0,
			height: 0
		});

		if ( options.minWidth > options.width ) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: "auto",
				width: options.width
			})
			.outerHeight();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );

		if ( options.height === "auto" ) {
			// only needed for IE6 support
			if ( $.support.minHeight ) {
				this.element.css({
					minHeight: minContentHeight,
					height: "auto"
				});
			} else {
				this.uiDialog.show();
				autoHeight = this.element.css( "height", "auto" ).height();
				if ( !isVisible ) {
					this.uiDialog.hide();
				}
				this.element.height( Math.max( autoHeight, minContentHeight ) );
			}
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
		}
	}
});

$.extend($.ui.dialog, {
	uuid: 0,
	maxZ: 0,

	getTitleId: function($el) {
		var id = $el.attr( "id" );
		if ( !id ) {
			this.uuid += 1;
			id = this.uuid;
		}
		return "ui-dialog-title-" + id;
	},

	overlay: function( dialog ) {
		this.$el = $.ui.dialog.overlay.create( dialog );
	}
});

$.extend( $.ui.dialog.overlay, {
	instances: [],
	// reuse old instances due to IE memory leak with alpha transparency (see #5185)
	oldInstances: [],
	maxZ: 0,
	events: $.map(
		"focus,mousedown,mouseup,keydown,keypress,click".split( "," ),
		function( event ) {
			return event + ".dialog-overlay";
		}
	).join( " " ),
	create: function( dialog ) {
		if ( this.instances.length === 0 ) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ( $.ui.dialog.overlay.instances.length ) {
					$( document ).bind( $.ui.dialog.overlay.events, function( event ) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ( $( event.target ).zIndex() < $.ui.dialog.overlay.maxZ ) {
							return false;
						}
					});
				}
			}, 1 );

			// handle window resize
			$( window ).bind( "resize.dialog-overlay", $.ui.dialog.overlay.resize );
		}

		var $el = ( this.oldInstances.pop() || $( "<div>" ).addClass( "ui-widget-overlay" ) );

		// allow closing by pressing the escape key
		$( document ).bind( "keydown.dialog-overlay", function( event ) {
			var instances = $.ui.dialog.overlay.instances;
			// only react to the event if we're the top overlay
			if ( instances.length !== 0 && instances[ instances.length - 1 ] === $el &&
				dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
				event.keyCode === $.ui.keyCode.ESCAPE ) {

				dialog.close( event );
				event.preventDefault();
			}
		});

		$el.appendTo( document.body ).css({
			width: this.width(),
			height: this.height()
		});

		if ( $.fn.bgiframe ) {
			$el.bgiframe();
		}

		this.instances.push( $el );
		return $el;
	},

	destroy: function( $el ) {
		var indexOf = $.inArray( $el, this.instances ),
			maxZ = 0;

		if ( indexOf !== -1 ) {
			this.oldInstances.push( this.instances.splice( indexOf, 1 )[ 0 ] );
		}

		if ( this.instances.length === 0 ) {
			$( [ document, window ] ).unbind( ".dialog-overlay" );
		}

		$el.height( 0 ).width( 0 ).remove();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		$.each( this.instances, function() {
			maxZ = Math.max( maxZ, this.css( "z-index" ) );
		});
		this.maxZ = maxZ;
	},

	height: function() {
		var scrollHeight,
			offsetHeight;
		// handle IE
		if ( $.ui.ie ) {
			scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if ( scrollHeight < offsetHeight ) {
				return $( window ).height() + "px";
			} else {
				return scrollHeight + "px";
			}
		// handle "good" browsers
		} else {
			return $( document ).height() + "px";
		}
	},

	width: function() {
		var scrollWidth,
			offsetWidth;
		// handle IE
		if ( $.ui.ie ) {
			scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if ( scrollWidth < offsetWidth ) {
				return $( window ).width() + "px";
			} else {
				return scrollWidth + "px";
			}
		// handle "good" browsers
		} else {
			return $( document ).width() + "px";
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $( [] );
		$.each( $.ui.dialog.overlay.instances, function() {
			$overlays = $overlays.add( this );
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.dialog.overlay.width(),
			height: $.ui.dialog.overlay.height()
		});
	}
});

$.extend( $.ui.dialog.overlay.prototype, {
	destroy: function() {
		$.ui.dialog.overlay.destroy( this.$el );
	}
});

}( jQuery ) );

// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
// jAlert( message, [title, callback] )
// jConfirm( message, [title, callback] )
// jPrompt( message, [value, title, callback] )
// 
// History:
//
// 1.00 - Released (29 December 2008)
//
// 1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC.
//
(function($) {

	$.alerts = {

		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

		verticalOffset : -75, // vertical offset of the dialog from center screen, in pixels
		horizontalOffset : 0, // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize : true, // re-centers the dialog on window resize
		overlayOpacity : .5, // transparency level of overlay
		overlayColor : '#000', // base color of overlay
		draggable : false, // make the dialogs draggable (requires UI Draggables plugin)
		okButton : '确定', // text for the OK button
		cancelButton : '取消', // text for the Cancel button
		dialogClass : null, // if specified, this class will be applied to all dialogs

		// Public methods

		alert : function(message, title, level, callback) {
			var obj = valToObj(message, title, level, callback);
			obj.type = null;
			handleTitle(obj, 'attention');
			$.alerts._show(obj);
		},

		confirm : function(message, title, callback) {
			var obj = valToObj(message, title, "question", callback);
			obj.type = 'confirm';
			obj.level = "question";
			if (obj.title == null)
				obj.title = '确认';
			$.alerts._show(obj);
		},

		prompt : function(message, value, title, callback) {
			var obj = valToObj(message, title, "attention", callback);
			obj.value = value;
			obj.type = 'prompt';
			if (obj.title == null)
				obj.title = '提示';
			$.alerts._show(obj);
		},

        // added by chenguohui
        autoJump : function(message, level, jumpOpts) {
            var obj = valToObj(message, '', level, jumpOpts);
            obj.type = 'plain';
            $.alerts._show(obj);
        },

		// Private methods

		_show : function(title, msg, value, type, level, callback) {
			if ($.isPlainObject(title)) {
				msg = title.message;
				value = title.value;
				type = title.type;
				level = title.level;
				callback = title.callback;
				title = title.title;
			}
			type = type || 'alert';
			$.alerts._hide();
			$.alerts._overlay('show');

			var html = [];
			if (level != "" && level != null && type != "prompt") {
				html.push('<div class="msg-b-weak msg-b-' + level + '"><i></i><div class="msg-cnt">');
				html.push('<div id="popup_message">');
				html.push('</div>');
				html.push('</div></div>');
			} else {
				html.push('<div id="popup_message"></div>');
			}

            // 加上position:absolute;可以在IE6下面使页面不跳动
			$("BODY").append('<div id="popup_container" style="position:absolute;top:0;left:0;" class="popup-' + type + '"><div id="popup_wrapper">'
					+ (type != 'plain' ? '<h5 id="popup_title"></h5>':'') + '<div id="popup_content">' + html.join('') + '</div>' + '</div></div>');

			if ($.alerts.dialogClass)
				$("#popup_container").addClass($.alerts.dialogClass);

			// IE6 Fix
			var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed';

			$("#popup_container").css({
				position : pos,
				zIndex : 99999,
				margin : 0
			});
            type != 'plain' && $("#popup_title").text(title);
			$("#popup_content").addClass(type);
			$("#popup_message").text(msg);
			$("#popup_message").html($("#popup_message").text().replace(/\n/g,
					'<br />'));
					
			switch (type) {
				case 'plain' :
					if($.isPlainObject(callback)){
						var jumpOpt = callback;
						$("#popup_wrapper .msg-b-weak").append('<div class="auto-jump"><span class="tick">3</span>秒后将跳转到' + jumpOpt.jumpName + '<a style="margin-left:10px" href="' + jumpOpt.jumpUrl + '">立即前往</a></div>');
						var timer = setInterval(function(){
							var tickEl = $("#popup_wrapper .msg-b-weak .tick");
							tickEl.html(parseInt(tickEl.html()) - 1);
						}, 1000);
						setTimeout(function(){
							clearInterval(timer);
							window.location.href = jumpOpt.jumpUrl;
						}, 3000);
					}
					break;
				case 'alert' :
					$("#popup_wrapper")
							.append('<div id="popup_panel"><a href="javascript:void(0);" class="button button-minor" id="popup_ok">'+ $.alerts.okButton + '</a></div>');
					$("#popup_ok").click(function() {
						$.alerts._hide();
						if (callback)
							callback(true);
					});
					$("#popup_ok").focus().keypress(function(e) {
						if (e.keyCode == 13 || e.keyCode == 27)
							$("#popup_ok").trigger('click');
					});
					break;
				case 'confirm' :
					$("#popup_wrapper")
							.append('<div id="popup_panel"><a href="javascript:void(0);" class="button button-minor" id="popup_ok" >'+ $.alerts.okButton + '</a>'
                            + '<a href="javascript:void(0);" class="button button-cancel" id="popup_cancel" >' + $.alerts.cancelButton + '</a></div>');
					$("#popup_ok").click(function() {
						$.alerts._hide();
						if (callback)
							callback(true);
					});
					$("#popup_cancel").click(function() {
						$.alerts._hide();
						if (callback)
							callback(false);
					});
					$("#popup_ok").focus();
					$("#popup_ok, #popup_cancel").keypress(function(e) {
						if (e.keyCode == 13)
							$("#popup_ok").trigger('click');
						if (e.keyCode == 27)
							$("#popup_cancel").trigger('click');
					});
					break;
				case 'prompt' :
					$("#popup_message").append('<br /><input type="text" size="20" id="popup_prompt" />')
							.parent()
							.after('<div id="popup_panel"><a href="javascript:void(0);" class="button button-minor" id="popup_ok" >'+ $.alerts.okButton + '</a>'
                            + '<a href="javascript:void(0);" class="button button-cancel" id="popup_cancel" >' + $.alerts.cancelButton + '</a></div>');
					$("#popup_ok").click(function() {
						var val = $("#popup_prompt").val();
						$.alerts._hide();
						if (callback)
							callback(val);
					});
					$("#popup_cancel").click(function() {
						$.alerts._hide();
						if (callback)
							callback(null);
					});
					$("#popup_prompt, #popup_ok, #popup_cancel").keypress(function(e) {
						if (e.keyCode == 13)
							$("#popup_ok").trigger('click');
						if (e.keyCode == 27)
							$("#popup_cancel").trigger('click');
					});
					if (value)
						$("#popup_prompt").val(value);
					$("#popup_prompt").focus().select();
					break;
			}

			$("#popup_container").css({
				minWidth : $("#popup_container").outerWidth(),
				maxWidth : $("#popup_container").outerWidth(),
				width : $("#popup_container").outerWidth()
			});
            if($.browser.msie && parseInt($.browser.version) <= 6) {
                var contentWidth = $("#popup_content").outerWidth() + 2;
                $("#popup_container").css({
                    width : type == 'plain' ? (contentWidth > 200 ? contentWidth : 200) : (contentWidth > 352 ? contentWidth : 352)
                });
            }

			$.alerts._reposition();
			$.alerts._maintainPosition(true);

			if ($.fn.bgiframe) {
				$('#popup_container').bgiframe();
			}

			// Make draggable
			if ($.alerts.draggable) {
				try {
					$("#popup_container").draggable({
						handle : $("#popup_title")
					});
					$("#popup_title").css({
						cursor : 'move'
					});
				} catch (e) { /* requires jQuery UI draggables */
				}
			}
		},

		_hide : function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},

		_overlay : function(status) {
			switch (status) {
				case 'show' :
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position : 'absolute',
						zIndex : 99998,
						top : '0px',
						left : '0px',
						width : '100%',
						height : $(window.document).height(),
						background : $.alerts.overlayColor,
						opacity : $.alerts.overlayOpacity
					});
                    if ($.fn.bgiframe) {
                        $('#popup_overlay').bgiframe();
                    }
					break;
				case 'hide' :
					$("#popup_overlay").remove();
					break;
			}
		},

		_reposition : function() {
			var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2))
					+ $.alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2))
					+ $.alerts.horizontalOffset;
			if (top < 0)
				top = 0;
			if (left < 0)
				left = 0;

			// IE6 fix
			if ($.browser.msie && parseInt($.browser.version) <= 6)
				top = top + $(window).scrollTop();

			$("#popup_container").css({
				top : top + 'px',
				left : left + 'px'
			});
			$("#popup_overlay").height($(window.document).height());
		},

		_maintainPosition : function(status) {
			if ($.alerts.repositionOnResize) {
				switch (status) {
					case true :
						$(window).bind('resize', $.alerts._reposition);
						break;
					case false :
						$(window).unbind('resize', $.alerts._reposition);
						break;
				}
			}
		}

	};
	var valToObj = function(message, title, level, callback) {
		if ($.isPlainObject(message)) {
			return message;
		}
		var obj = {};
		obj.message = message;
		if ((title == null && level == null) || $.isFunction(title)) {
			level = 'attention';
			callback = title;
			title = null;
		} else {
			if ($.isFunction(level)) {
				callback = level;
				level = title;
				title = null;
			} else if (level == null) {
				level = title;
				title = null;
			}
		}
		obj.title = title;
		obj.level = level;
		obj.callback = callback;
		return obj;
	};

	var handleTitle = function(obj, defaultLevel) {
		if (obj.level == null) {
			obj.level = defaultLevel;
		}
		if (obj.title == null) {
			switch (obj.level) {
				case 'ok' :
					obj.title = '成功';
					break;
				case 'error' :
					obj.title = '错误';
					break;
				case 'stop' :
					obj.title = '禁止';
					break;
				case 'question' :
					obj.title = '确认';
					break;
				case 'attention' :
					obj.title = '提示';
					break;
				case 'alarm' :
					obj.title = '警告';
				default :
					obj.title = '提示';
					obj.level = 'attention';
					break;
			}
		}

	};
	
	window.jAlert = $.alerts.alert;
	window.jConfirm = $.alerts.confirm;
	window.jPrompt = $.alerts.prompt;
    window.jAutoJump = $.alerts.autoJump;
	
})(jQuery);
 /*! Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 3.0.0
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.bgiframe = function(s) {
        s = $.extend({
            top         : 'auto', // auto == borderTopWidth
            left        : 'auto', // auto == borderLeftWidth
            width       : '100%', // auto == offsetWidth
            height      : '100%', // auto == offsetHeight
            opacity     : true,
            src         : 'javascript:false;',
            conditional : ($.browser.msie) // expresion or function. return false to prevent iframe insertion
        }, s);

        // wrap conditional in a function if it isn't already
        if (!$.isFunction(s.conditional)) {
            var condition = s.conditional;
            s.conditional = function() { return condition; };
        }

        var $iframe = $('<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
            'style="display:block;position:absolute;z-index:-1;"/>');

        return this.each(function() {
            var $this = $(this);
            if ( s.conditional(this) === false ) { return; }
            var existing = $this.children('iframe.bgiframe');
            var $el = existing.length === 0 ? $iframe.clone() : existing;
            $el.css({
                'top': s.top == 'auto' ?
                    ((parseInt($this.css('borderTopWidth'),10)||0)*-1)+'px' : prop(s.top),
                'left': s.left == 'auto' ?
                    ((parseInt($this.css('borderLeftWidth'),10)||0)*-1)+'px' : prop(s.left),
                'width': s.width == 'auto' ? (this.offsetWidth + 'px') : prop(s.width),
                'height': s.height == 'auto' ? (this.offsetHeight + 'px') : prop(s.height),
                'opacity': s.opacity === true ? 0 : undefined
            });

            if ( existing.length === 0 ) {
                $this.prepend($el);
            }
        });
    };

    // old alias
    $.fn.bgIframe = $.fn.bgiframe;

    function prop(n) {
        return n && n.constructor === Number ? n + 'px' : n;
    }

}));
/**
 * droplist插件，原生select的美化
 * @author chenguohui yuzhen
 */

(function($){
    $.fn.droplist = function(setting){
        // 若目标元素不是select，则直接返回，不做处理
        if(this[0].tagName !== 'SELECT') {
            return this;
        }

        var _self = this;

        if(this.data('droplist')) {
            // 若已初始化过，数据变更下就可以了
            var defaultText = '';
            var contentEl = this.closest('.select-wrap').find('.select-content');
            contentEl.empty();
            this.find('option').each(function(i, o){
                if($(o).prop('selected') || _self.val() == $(o).val()){
                    defaultText = $(o).text();
                    contentEl.append('<li class="select-item selected" data-value="'+$(o).val()+'">'+$(o).text()+'</li>');
                } else {
                    contentEl.append('<li class="select-item" data-value="'+$(o).val()+'">'+$(o).text()+'</li>');
                }
            });

            contentEl.find('li:odd').addClass('odd-bg');

            return;
        }

        this.data('droplist', true);

        var w = this.outerWidth() - 2;
        this.wrap('<div class="select-wrap"></div>');
        var wrapEl = this.closest('.select-wrap');
        wrapEl.width(w);
        wrapEl.append('<div class="selected-item"></div>');
        wrapEl.append('<div class="select-dropdown"><i class="icon12-7 i-dropdown"></i></div>');

        wrapEl.find('.selected-item').width(w - 24);

        (function(){
            var defaultText = '';
            //从select中拉取数据
            var ulInner = '<ul class="select-content">';

            _self.find('option').each(function(j,o){
                if($(o).prop('selected') || _self.val() == $(o).val()){
                    defaultText = $(o).text();
                    ulInner += '<li class="select-item selected" data-value="'+$(o).val()+'">'+$(o).text()+'</li>';
                } else {
                    ulInner += '<li class="select-item" data-value="'+$(o).val()+'">'+$(o).text()+'</li>';
                }
            });

            ulInner += '</ul>';
            wrapEl.append(ulInner);
            defaultText = defaultText || '--请选择--';
            wrapEl.find('.selected-item').text(defaultText);
            var contentEl = wrapEl.find('.select-content');
            contentEl.css('top', wrapEl.height() + 1);
            contentEl.css('left', -1);
            contentEl.find('li:odd').addClass('odd-bg');
        })();

        // 对下拉框绑定点击事件
        wrapEl.on('click', function (e) {
            $(document).trigger('click', [wrapEl]);//为了能关闭其它的下拉内容
            wrapEl.toggleClass('active');
            wrapEl.find('.select-content').toggle();
            if(wrapEl.find('.select-content').is(':visible')) {
                // 选中当前值
                wrapEl.find('.select-item').each(function(i, n){
                    if($(n).attr('data-value') == _self.val()) {
                        $(n).addClass('selected');
                    } else {
                        $(n).removeClass('selected');
                    }
                });
            }
            e.stopPropagation();
        });

        // 绑定选择点击事件
        wrapEl.delegate('.select-item', 'click', function (e) {
            _self.val($(this).attr('data-value'));
            _self.trigger('change');
            e.stopPropagation();
        });

        this.on('change', function(){
            wrapEl.find('.selected-item').html(wrapEl.find(".select-item[data-value='" + _self.val() + "']").text());
            wrapEl.find('.select-content').hide();
            wrapEl.removeClass('active');

            if(setting && setting['change']){
                setting['change']($(this).val());
            }
        });

        // 绑定悬浮事件
        wrapEl.on('mouseover','.select-item',function(){
            $(this).addClass('hover-bg');
        });

        wrapEl.on('mouseout','.select-item',function(){
            $(this).removeClass('hover-bg');
        });

        // 点页面其它地方收起下拉框
        $(document).on('click',function(e, el){
            if(wrapEl == el){
                return;
            }
            wrapEl.find('.select-content').hide();
            wrapEl.removeClass('active');
        });

        return this;
    }
})(jQuery);
/**
 * droptree插件，下拉树，需要和zTree配合
 * @author chenguohui
 */
(function($){
    $.fn.droptree = function(treeSetting, treeNodes, valKey){

        // 没有zTree直接返回，不做处理
        if($.fn.zTree === undefined) {
            return this;
        }

        // 若目标元素不是输入框，则直接返回，不做处理
        if(!this.is(':text')) {
            return this;
        }

        var _self = this;

        var _selfId = _self.attr('id')+'ztree';

        valKey = valKey || 'id'; //默认id作为主键

        var w = this.outerWidth() - 2;
        this.wrap('<div class="select-wrap"></div>');
        var wrapEl = this.closest('.select-wrap');
        this.hide();
        wrapEl.width(w);
        wrapEl.append('<div class="selected-item"></div>');
        wrapEl.append('<div class="select-dropdown"><i class="icon12-7 i-dropdown"></i></div>');
        wrapEl.append('<div class="select-content"></div>');

        wrapEl.find('.selected-item').width(w - 24);

        var contentEl = wrapEl.find('.select-content');
        contentEl.css('top', wrapEl.height() + 1);
        contentEl.css('left', -1);

        contentEl.append('<div id='+_selfId+' class="ztree"></div>');

        var _onClick;
        if(treeSetting.callback && treeSetting.callback.onClick) {
            _onClick = treeSetting.callback.onClick;
        }
        var showName = "name";
        if(treeSetting.data && treeSetting.data.key && treeSetting.data.key.name){
            showName = treeSetting.data.key.name;
        }
        treeSetting = $.extend(true,{},treeSetting, {
            callback: {
                onClick: function(event, treeId, treeNode) {
                    _self.val(treeNode[valKey]);
                    _self.attr('text', treeNode[showName]);
                    wrapEl.find('.selected-item').text(treeNode[showName]);
                    wrapEl.find('.select-content').hide();
                    wrapEl.removeClass('active');
                    _onClick && _onClick(event, treeId, treeNode);
                }
            }
        });
        // 树初始化
        var treeObj = $.fn.zTree.init(contentEl.find('#'+_selfId), treeSetting, treeNodes);

        var defaultText = this.attr('data-text') || '--请选择--';
        wrapEl.find('.selected-item').text(defaultText);

        // 对下拉框绑定点击事件
        wrapEl.on('click', function (e) {
            $(document).trigger('click', [wrapEl]);//为了能关闭其它的下拉内容
            wrapEl.toggleClass('active');
            wrapEl.find('.select-content').toggle();
            if(wrapEl.find('.select-content').is(':visible')) {
                // 选中当前值
                var curNode = treeObj.getNodesByParam(valKey, _self.val());
                if(curNode && curNode.length > 0) {
                    treeObj.selectNode(curNode[0]);
                }
            }
            e.stopPropagation();
        });

        contentEl.on('click', function (e) {
            e.stopPropagation();
        });

        //outClick
        $(document).on('click',function(e, el){
            if(wrapEl == el){
                return;
            }
            wrapEl.find('.select-content').hide();
            wrapEl.removeClass('active');
        });

        return this;
    }
})(jQuery);
/**
 * 加载与进度插件
 * @author chenguohui
 */

(function ($) {
    $.fn.loading = function (type, msg) {

        if(msg == undefined){
            msg = type;
            type = 'twin';
        }

        type = type || 'twin';

        var isBig = type.indexOf('-big') > -1;

        if(this.find('.loading-mask').length == 0) {
            var loaingHtmls = [];
            loaingHtmls.push('<div class="loading-layer">');
            loaingHtmls.push('<div class="loading-mask"></div>');
            loaingHtmls.push('<div class="loading-cnt ' + (isBig ? 'loading-cnt-big' : '') + '"><i class="' + type + '"></i>' + msg + '</div>');
            loaingHtmls.push('</div>');
            if(this.css('position') === 'static'){
                this.css('position', 'relative');
            }
            this.append(loaingHtmls.join(''));

            this.find('.loading-layer').width(this.innerWidth());
            this.find('.loading-layer').height(this.innerHeight());

            this.find('.loading-mask').width(this.innerWidth());
            this.find('.loading-mask').height(this.innerHeight());

            var cntEl = this.find('.loading-cnt');
            cntEl.css('margin-left', -cntEl.outerWidth() / 2);
            cntEl.css('margin-top', -cntEl.outerHeight() / 2);
        }

    };

    $.fn.loaded = function () {
        var loadingLayer = this.find('.loading-layer');
        loadingLayer.fadeOut(100, function(){
            loadingLayer.remove();
        });
    };

})(jQuery);
/**
 * 导航栏插件
 * @author lijiajun
 */
;(function($){
    $.fn.pkNav = function(){
        $(this).each(function(){
            var _self = this;
            var $navBody = $(this).find('.nav-body');
            var $navFoot = $(this).find('.nav-foot');
            
            //解决ie中的问题
            (function(){
                if($.browser.msie && $.browser.version == 6){
                    //解决ie6下nav-foot宽度不对 
                    var navFootWidth = 0;
                    $navFoot.find('.func-item').each(function(){
                        navFootWidth += $(this).outerWidth();
                    });
                    $navFoot.width(navFootWidth);
                    
                    //解决ie6下用户下拉的宽度不对
                    var menuWidth = $navFoot.find('.user-operate').outerWidth();
                    $navFoot.find('.user-operate .operate-menu-white').width(menuWidth);
                }
            })();
            //如果导航栏只有1个或者没有项，就不进行处理
            if($navBody.hasClass('nav-operate') && $navBody.children('ul').find('.nav-item').size() > 1){
                initNavBody(this);
                $(window).on('resize', function(){
                    delay(300, 500, function(){
                        refresh(_self);
                    });
                });
            }else{
                $(this).addClass('nav-init');
            }
            
            $navBody.find('.more').on('hover', function(){
                $navBody.find('.more-items').toggle();
            });
            
            $navFoot.find('.user-operate').on('hover', function(){
                $navFoot.find('.operate-menu-white').toggle();
            });
        });
        
        //初始化导航栏
        function initNavBody(nav){
            var $nav = $(nav);
            var $navBody = $nav.find('.nav-body');
            var $navBodyMain = $navBody.children('ul');
            
            var displayItemsNum = getDisplayItemsNum(nav);
            var $transferItems;
            //导航菜单全部显示
            if(displayItemsNum + 1 == $navBodyMain.find('.nav-item').size()){
                $transferItems = $();
            //不显示导航菜单    
            }else if(displayItemsNum == -1){
                $transferItems = $navBodyMain.find('.nav-item').addClass('nav-item-hide');
                $navBody.find('.more').removeClass('nav-item-hide');
            //显示部分导航菜单
            }else{
                $transferItems = $navBodyMain.find('.nav-item:gt('+ displayItemsNum +')').addClass('nav-item-hide');
                $navBody.find('.more').removeClass('nav-item-hide');
            }
            
            if($transferItems.size() > 0){
                transferPos(nav, $transferItems.parent('li').clone(true));
                if($.browser.msie && $.browser.version == 6){
                    //解决ie6下nav-body下拉宽度不对
                    var moreMaxWidth = 0;
                    $navBodyMain.find('.nav-item').each(function(i){
                        moreMaxWidth = moreMaxWidth > $(this).width() ? moreMaxWidth : $(this).width();
                    });
                    $navBody.find('.more-items .nav-item').width(moreMaxWidth);
                }
            }
            $nav.addClass('nav-init');
        }
        
        //获取页面上可以显示几个导航菜单
        function getDisplayItemsNum(nav){
            var $nav = $(nav);
            var navBodyWidth = $nav.parent().width()
                           - $nav.find('.nav-head').width()
                           - $nav.find('.nav-foot').width()
                           - 110; //预留110px的距离
            
            var navItemsWidth = 0;
            var num;
            $nav.find('.nav-body>ul .nav-item').each(function(i){
                num = i;
                navItemsWidth += $(this).innerWidth();
                if(navItemsWidth > navBodyWidth){
                    num--;
                    return false;
                }
            });
            return num;
        };
        
        //刷新菜单
        function refresh(nav){
            var $nav = $(nav);
            var $navBody = $nav.find('.nav-body');
            $nav.removeClass('nav-init');
            $navBody.find('.nav-item').removeClass('nav-item-hide');
            $navBody.find('.more').addClass('nav-item-hide');
            initNavBody(nav);
        }
        
        //将放不下的导航菜单放到更多中去
        function transferPos(nav, $transferItems){
            var $nav = $(nav);
            var $moreContainer = $nav.find('.nav-body .more ul');
            $transferItems.find('a').removeClass('nav-item-hide');
            $moreContainer.empty().append($transferItems);
        }
        
        //延迟执行, t为几毫秒执行一次，minT为在该时间内至少执行一次
        var delay = (function(){
            var timer = null,
                timeRec = null;
            return function(t, minT,fn){
                if(!timeRec){
                    //无论如何第一次都会执行，防止因为延迟导致的样式错误
                    fn && fn();
                    timeRec = new Date();
                }
                clearTimeout(timer);
                timer = null;
                if(new Date() - timeRec > minT){
                    fn && fn(timeRec - new Date());
                    timeRec = null;
                }else{
                    timer = setTimeout(function(){
                        fn && fn();
                    }, t);
                }
            };
        })();  
    };
})(jQuery);

/**
 * searchbox插件
 * @author chenguohui
 */

(function ($) {
    $.fn.searchbox = function (type, callback) {
        // 若目标元素不是输入框，则不做后续处理
        if (!this.is(':text')) {
            return this;
        }

        if (typeof type === 'function') {
            callback = type;
            type = 'default';
        }

        var _self = this;
        var w = this.outerWidth() - 2;
        this.wrap('<div class="search-wrap"></div>');
        var wrapEl = this.closest('.search-wrap');
        wrapEl.width(w);
        wrapEl.append('<div class="icon-wrap"><i></i></div>');

        this.on('focus', function () {
            wrapEl.addClass('focused');
        });

        this.on('blur', function () {
            wrapEl.removeClass('focused');
        });

        this.on('keydown', function (e) {
            if (e.keyCode == 13) {
                callback && callback($.trim(_self.val()));
                return false;
            }
        });

        wrapEl.find('.icon-wrap').on('click', function () {
            callback && callback($.trim(_self.val()));
        });

        switch (type) {
            case 'default':
                this.width(this.width() - 33);
                break;
            case 'blue':
                wrapEl.addClass('blue');
                this.width(this.width() - 33);
                break;
            case 'huge-blue':
                wrapEl.addClass('huge-blue');
                this.width(this.width() - 68);
                this.css('margin-left', 2);
                break;
        }
    }
})(jQuery);
/**
 * simpleScroll component
 * @author lijiajun
 * create on 2016-5-10
 */
(function (factory) {
    if (typeof define === 'function') {
       	define('', [], function () { return factory; } );
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($){
	var namespace = "simpleScroll";
	//初始化DOM
	function initDOM(opts){
		//判断获取的元素是否存在
		if(this.length <= 0){
			return this;
		}
		
		opts = $.extend({
			//属性
			"blank": 10,
			"width": 4,
			"type": "show",
			"color": "#D0D5E0",
			"activeColor": "#BBC1CF",
			"monitor": false
			//事件 
			//"onScrolling": function(){},
			//"onScrollingX": function(){},
			//"onScrollingY": function(){}
		},opts,{
			scrollRangeVertical: 0,
			contRangeVertical: 0,
			scrollScaleVertical: 1,
			scrollRangeHorizontal: 0,
			contRangeHorizontal: 0,
			scrollScaleHorizontal: 1,
			enScrollVertical: false,
			enScrollHorizontal: false
		});
		/*
		 * 添加内容部分的html
		 */
		var $contBox = $('<div class="simpleScrollBox">'+
							'<div class="ssb_container_wrapper">'+
								'<div class="ssb_container"></div>'+
							'</div>'+
					  	'</div>');
		var $cont = $contBox.find(".ssb_container");
		$cont.wrapInner($(this).children());
		$(this).append($contBox)//存放内容的div
		.addClass("simpleScrollBar")
		.css("overflow", "visible");
		
		/*
		 * 添加垂直滚动条
		 */
		var borderRadius = "border-radius:"+ opts.width / 2 +"px;-moz-border-radius:"+ opts.width / 2 +"px;-webkit-border-radius:"+ opts.width / 2 +"px;";
		var $scrollToolVertical = $('<div class="ssb_scrollTool ssb_scrollTool_vertical">'+
							'<div class="ssb_dragger_vertical">'+
								'<div class="ssb_dragger_bar" style="width:'+ opts.width +'px;'+ borderRadius +'">'+
								'</div>'+
							'</div>'+
					    '</div>');
		$contBox.append($scrollToolVertical);//滚动条div
		
		/*
		 * 添加水平滚动条
		 */
		$scrollToolHorizontal = $('<div class="ssb_scrollTool ssb_scrollTool_horizontal">'+
							'<div class="ssb_dragger_horizontal">'+
								'<div class="ssb_dragger_bar" style="height:'+ opts.width +'px;'+ borderRadius +'">'+
								'</div>'+
							'</div>'+
					    '</div>');
		$contBox.append($scrollToolHorizontal);//滚动条div
		
		if($(this).is(":hidden")){
			var This = this;
			var initTimer = setInterval(function(){
				if(!$(This).is(":hidden") && $(This).parents(":hidden").size() <= 0){
					initEvent.call(This, opts);
					clearInterval(initTimer);
					initTimer = null;
				}
			},250);
		}else{
			initEvent.call(this, opts);
		}	
	}
	function initEvent(opts){
		var $contBox = $(this).find(".simpleScrollBox");
		//获取原容器宽高 
		$(this).data("boxW",$contBox.width());
		$(this).data("boxH",$contBox.height());
		
		judgeScroll.call(this,opts);
		dragScroll.call(this,"y",opts);
		dragScroll.call(this,"x",opts);
		mousewheel.call(this,opts);
		if(opts.monitor){
			fit.call(this,opts);
		}
	}
	//判断设置滚动条
	function judgeScroll(opts){
		var $contWrap = $(this).find(".ssb_container_wrapper"),
			$cont = $(this).find(".ssb_container");
		
		var clientH = $contWrap.height(),
			totalH = $cont.height();
		var enScrollVertical = false,
			enScrollHorizontal = false;
		if(totalH > clientH){
			enScrollVertical = true;
			setScrollBlank.call(this,"margin-right",opts.blank);
		}else{
			enScrollVertical = false;
		}
		
		var clientW = $contWrap.width(),
			totalW = $cont.get(0).scrollWidth;
		if(totalW > clientW){
			enScrollHorizontal = true;
			setScrollBlank.call(this,"margin-bottom",opts.blank);
			if(!enScrollVertical){
				clientH = $contWrap.height();
				totalH = $cont.height();
				if(totalH > clientH){
					enScrollVertical = true;
					setScrollBlank.call(this,"margin-right",opts.blank);
				}
			}
		}else{
			enScrollHorizontal = false;
		}
		//记录是否需要滚动条和内容宽高
		opts.enScrollVertical = enScrollVertical;
		opts.enScrollHorizontal = enScrollHorizontal;
		$(this).data("totalW",totalW);
		$(this).data("totalH",totalH);
		//初始化滚动条
		var $scrollToolVertical = $(this).find(".ssb_scrollTool_vertical"),
			$scrollToolHorizontal = $(this).find(".ssb_scrollTool_horizontal");
		if(enScrollVertical && enScrollHorizontal){
			$scrollToolVertical.height($contWrap.height());
			$scrollToolHorizontal.width($contWrap.width());
			initScrollVertical.call(this,opts);
			initScrollHorizontal.call(this,opts);
			//设置显示模式
			setShowModel.call(this,opts.type, enScrollVertical, enScrollHorizontal);
		}else if(enScrollVertical && !enScrollHorizontal){
			resetScrollHorizontal.call(this);
			$scrollToolVertical.height($contWrap.height());
			$scrollToolHorizontal.width($contWrap.width());
			initScrollVertical.call(this,opts);
			//设置显示模式
			setShowModel.call(this,opts.type, enScrollVertical, enScrollHorizontal);
		}else if(!enScrollVertical && enScrollHorizontal){
			resetScrollVertical.call(this);
			$scrollToolVertical.height($contWrap.height());
			$scrollToolHorizontal.width($contWrap.width());
			initScrollHorizontal.call(this,opts);
			//设置显示模式
			setShowModel.call(this,opts.type, enScrollVertical, enScrollHorizontal);
		}else{
			resetScrollVertical.call(this);
			resetScrollHorizontal.call(this);
			$(this).find(".simpleScrollBox").off("mouseenter."+ namespace +" mouseleave."+ namespace);
		}
	}
	
	//初始化内容外层div的margin（ie6下直接设置宽高），因为要给滚动条留出位置blank
	function setScrollBlank(marginRorB,val){
		var $contWrap = $(this).find(".ssb_container_wrapper");
		if($.browser.msie && $.browser.version <= 6){
			if(marginRorB == "margin-right"){
				$contWrap.width($(this).data("boxW") - val);
			}else{
				$contWrap.height($(this).data("boxH") - val);
			}
		}else{
			$contWrap.css(marginRorB,val);
		}
	}
	
	//初始化垂直滚动条
	function initScrollVertical(opts){
		var $contWrap = $(this).find(".ssb_container_wrapper"),
			$cont = $(this).find(".ssb_container"),
			$draggerVertical = $(this).find(".ssb_dragger_vertical"),
			$scrollToolVertical = $(this).find(".ssb_scrollTool_vertical");
		
		var clientH = $contWrap.height(),
			totalH = $cont.height();

		//滚动条比例
		scrollScaleVertical = totalH / clientH;
		$draggerVertical.height(parseInt(clientH / scrollScaleVertical,10));
		//滚动条滚动范围
		scrollRangeVertical = $scrollToolVertical.height() - $draggerVertical.height();
		//内容滚动范围
		contRangeVertical = totalH - clientH;
		//设置颜色
		$draggerVertical.find(".ssb_dragger_bar").css("background", opts.color);
		//如果滚动条或者内容位置超出了滚动范围就纠正
		if(-contRangeVertical > parseInt($cont.css("top"),10)){
			$cont.animate({"top": -contRangeVertical},100);
			$draggerVertical.css("top", scrollRangeVertical);
		}
		
		opts.scrollRangeVertical = scrollRangeVertical;
		opts.contRangeVertical = contRangeVertical;
		opts.scrollScaleVertical = scrollScaleVertical;
	}
	//去掉垂直滚动条占位且将内容置顶
	function resetScrollVertical(){
		var $cont = $(this).find(".ssb_container"),
			$draggerVertical = $(this).find(".ssb_dragger_vertical"),
			$scrollToolVertical = $(this).find(".ssb_scrollTool_vertical");
			
		setScrollBlank.call(this,"margin-right",0);
		$cont.css("top", 0);
		$draggerVertical.css("top", 0);
		$scrollToolVertical.hide();
	}
	//初始化水平滚动条
	function initScrollHorizontal(opts){
		var $contWrap = $(this).find(".ssb_container_wrapper"),
			$cont = $(this).find(".ssb_container"),
			$draggerHorizontal = $(this).find(".ssb_dragger_horizontal"),
			$scrollToolHorizontal = $(this).find(".ssb_scrollTool_horizontal");
		
		var clientW = $contWrap.width(),
			totalW = $cont.get(0).scrollWidth;
		//滚动条比例
		scrollScaleHorizontal = totalW / clientW;
		$draggerHorizontal.width(parseInt(clientW / scrollScaleHorizontal,10));
		//滚动条滚动范围
		scrollRangeHorizontal = $scrollToolHorizontal.width() - $draggerHorizontal.width();
		//内容滚动范围
		contRangeHorizontal = totalW - clientW;
		//设置颜色
		$draggerHorizontal.find(".ssb_dragger_bar").css("background", opts.color);
		//如果滚动条或者内容位置超出了滚动范围就纠正
		if(-contRangeHorizontal > parseInt($cont.css("left"),10)){
			$cont.animate({"left": -contRangeHorizontal},100);
			$draggerHorizontal.css("left", scrollRangeHorizontal);
		}
		
		opts.scrollRangeHorizontal = scrollRangeHorizontal;
		opts.contRangeHorizontal = contRangeHorizontal;
		opts.scrollScaleHorizontal = scrollScaleHorizontal;
	}
	//去掉横向滚动条占位且将内容置左
	function resetScrollHorizontal(){
		var $cont = $(this).find(".ssb_container"),
			$draggerHorizontal = $(this).find(".ssb_dragger_horizontal"),
			$scrollToolHorizontal = $(this).find(".ssb_scrollTool_horizontal");
			
		setScrollBlank.call(this,"margin-bottom",0);
		$cont.css("left", 0);
		$draggerHorizontal.css("left", 0);
		$scrollToolHorizontal.hide();
	}
	
	function setShowModel(type,enScrollVertical,enScrollHorizontal){
		var $scrollToolVertical = $(this).find(".ssb_scrollTool_vertical"),
			$scrollToolHorizontal = $(this).find(".ssb_scrollTool_horizontal"),
			$contBox = $(this).find(".simpleScrollBox");
		if(type == "show"){
			if(enScrollVertical){
				$scrollToolVertical.show();
			}
			if(enScrollHorizontal){
				$scrollToolHorizontal.show();
			}
		}else if(type == "asNeeded"){//按需出现滚动条，即鼠标放到容器上时才出现滚动条
			$contBox.off("mouseenter."+ namespace +" mouseleave."+ namespace).on("mouseenter."+ namespace, function(){
				if(enScrollVertical){
					$scrollToolVertical.stop(true, true).fadeIn(200);
				}
				if(enScrollHorizontal){
					$scrollToolHorizontal.stop(true, true).fadeIn(200);
				}
				$(this).addClass("ssb_onOver");
			}).on("mouseleave."+ namespace, function(){
				//如果不是拖拽滚动条的情况下
				if(!$scrollToolVertical.hasClass("ssb_onDrag") && !$scrollToolHorizontal.hasClass("ssb_onDrag")){
					if(enScrollVertical){
						$scrollToolVertical.stop(true, true).fadeOut(200);
					}
					if(enScrollHorizontal){
						$scrollToolHorizontal.stop(true, true).fadeOut(200);
					}	
				}
				$(this).removeClass("ssb_onOver");
			});
		}
	}
	
	//滚动条拖拽事件
	function dragScroll(xy,opts){
		var dir,
			clientPos,
			callback = null;
		var $dragger = null,
			$scrollToolVertical = $(this).find(".ssb_scrollTool_vertical"),
			$scrollToolHorizontal = $(this).find(".ssb_scrollTool_horizontal"),
			$contBox = $(this).find(".simpleScrollBox"),
			$cont = $(this).find(".ssb_container");
		if(xy == "y"){
			dir = "top";
			clientPos = "clientY";
			callback = opts["onScrollingY"];
			$dragger = $(this).find(".ssb_dragger_vertical");
		}else{
			dir = "left";
			clientPos = "clientX";
			callback = opts["onScrollingX"];
			$dragger = $(this).find(".ssb_dragger_horizontal");
		}
		$dragger.on("mousedown."+ namespace,function(e){
			e.preventDefault();
			//设置为拖拽状态
			$(this).parent()
			.addClass("ssb_onDrag")
			.find(".ssb_dragger_bar")
			.css("background", opts.activeColor);
			
			var mousePos,
				beginScrollPos,
				scrollRange,
				contRange,
				scale;
			if(xy == "y"){
				mousePos = e.clientY;
				scrollRange = opts.scrollRangeVertical;
				contRange = opts.contRangeVertical;
				scale = opts.scrollScaleVertical;
			}else{
				mousePos = e.clientX;
				scrollRange = opts.scrollRangeHorizontal;
				contRange = opts.contRangeHorizontal;
				scale = opts.scrollScaleHorizontal;
			}
			beginScrollPos = parseInt($(this).css(dir),10);
			if(!+[1,]){document.onselectstart=function(){return false;};}
			$(document).on("mousemove."+ namespace, function(e){
				var scrollDiff = e[clientPos] - mousePos,
					currentPos = parseInt($dragger.css(dir),10),
					nextPos = scrollDiff + beginScrollPos;
				if((nextPos >= scrollRange && currentPos >= scrollRange) || (nextPos <= 0 && currentPos <= 0)){
					return;
				}
				//滚动条位置
				var scrollPos = Math.round(scrollDiff + beginScrollPos);
				scrollPos = Math.min(Math.max(0,scrollPos),scrollRange);
				//内容位置
				var contPos = Math.round(scrollPos * scale);
				contPos = Math.min(Math.max(0,contPos),contRange);
				//位置渲染
				$dragger.css(dir,scrollPos);
				$cont.css(dir,-contPos);
				callback && callback();
				opts.onScrolling && opts.onScrolling();
			}).on("mouseup."+ namespace, function(e){
				//移除拖动状态标识
				$dragger.parent()
				.removeClass("ssb_onDrag")
				.find(".ssb_dragger_bar")
				.css("background",opts.color);
				
				$(this).off("mousemove."+ namespace +" mouseup."+ namespace);
				if(!+[1,]){document.onselectstart=null;}
				//如果类型是按需加载滚动条且鼠标没有在目标元素上时
				if(opts.type == "asNeeded" && !$contBox.hasClass("ssb_onOver")){
					$scrollToolVertical.fadeOut(200);
					$scrollToolHorizontal.fadeOut(200);
				}
			});
		});
	}
	
	function mousewheel(opts){
		var $cont = $(this).find(".ssb_container"),
			$draggerVertical = $(this).find(".ssb_dragger_vertical");
		var type = "mousewheel",
			timer = null;
		if(document.mozHidden !== undefined){
			type = "DOMMouseScroll";
		}
		$(this).on(type + "."+ namespace,function(e){
			if(opts.enScrollVertical){
				e.preventDefault();
				var oe = e.originalEvent;
				e.delta = (oe.wheelDelta) ? oe.wheelDelta / 120 : -(oe.detail || 0) / 3;			
				var currentY = parseInt($cont.css("top"),10);
				if((e.delta <= 0 && currentY <= -opts.contRangeVertical) || (e.delta >= 0 && currentY >= 0)){
					return;
				}
				var contDiff = 300 * e.delta;
				//内容位置
				var contY = Math.round(currentY + contDiff);
				contY = Math.min(Math.max(-opts.contRangeVertical,contY),0);
				//滚动条位置
				var scrollY = Math.round(contY / opts.scrollScaleVertical);
				scrollY = Math.min(Math.max(-opts.scrollRangeVertical,scrollY),0);
				//位置渲染
				$draggerVertical.stop().animate({"top":-scrollY},300,"linear");
				$cont.stop().animate({"top":contY},300,"linear",function(){
					//当内容滚动结束清除定时器
					clearInterval(timer);
					timer = null;
				});
				//事件触发
				opts.onScrollingY && opts.onScrollingY();
				opts.onScrolling && opts.onScrolling();
				clearInterval(timer);
				timer = null;
				var count = 0;
				timer = setInterval(function(){
					if(count >= 8){
						clearInterval(timer);
						timer = null;
					}
					opts.onScrollingY && opts.onScrollingY();
					opts.onScrolling && opts.onScrolling();
					count++;
				},30);
			}
		});
	}
	
	//滚动条自适应高度
	function fit(opts){
		var This = this,
			$cont = $(this).find(".ssb_container"),
			$contBox = $(this).find(".simpleScrollBox");
		setInterval(function(){
			if($(This).parents(":hidden").size() > 0){
				return;
			}
			if($cont.height() != $(This).data("totalH") || $cont.get(0).scrollWidth != $(This).data("totalW") || $contBox.height() != $(This).data("boxH") || $contBox.width() != $(This).data("boxW")){
				$(This).data("boxW",$contBox.width());
				$(This).data("boxH",$contBox.height());
				judgeScroll.call(This,opts);
			}
		},250);
	}
	
	//获取存放内容的容器
	function getContainer(){
	    return $(this).find('.ssb_container');
	}
	
	$.fn.simpleScroll = function(opts){
	    //判断是否初始化过了
	    var result,
            args = arguments;
	    if(!this.data(namespace)){
	        this.data(namespace, true);
            initDOM.call(this,opts);
	    }
	    if(typeof opts === 'string'){
	        try{
	            result = eval(opts).apply(this, Array.prototype.slice.call(args, 1));
	        }catch(e){
	           throw 'simpleScroll插件调用方法出错:'+e.message;   
	        }
	    }
	    return result || this;
	};
}));

/**
 * sticky组件
 * @modified by chenguohui 简化参数，去掉了title
 */
(function ($) {
    var valToObj = function (message, level, callback, options) {
        if ($.isPlainObject(message)) {
            return message;
        }
        var obj = {};
        obj.message = message;
        if ($.isPlainObject(level)) {
            options = level;
        } else if ($.isFunction(level)) {
            options = callback;
            callback = level;
        } else if ($.isPlainObject(callback)) {
            options = callback;
            callback = options.afterclose;
        }
        obj.level = ((typeof level == 'string') && level) || (options ? options.level : null);
        obj.afterclose = callback || (options ? (options.callback || options.afterclose) : null);
        obj.afteropen = options ? (options.afteropen || null) : null;
        obj.options = options;
        options && options.type && (obj.type = options.type);

        return obj;
    };

    $.sticky = function (message, level, callback, options) {
        if (typeof(message) == "object") {
            return sticky(message);
        } else {
            var obj = valToObj(message, level, callback, options);
            if (obj.level == null) {
                obj.level = obj.type || 'attention';
            }
            return sticky(obj);
        }
    };

    var types = ['ok', 'error', 'attention', 'question', 'alarm'];

    function sticky(param) {
        param = $.extend({}, defaults, param);
        var message = param.message, result = "", callback = param.afterclose;
        var options = $.extend({}, settings, param.options);

        var display = !0, duplicate = "no", uniqID = options.id || ('_stk' + Math.floor(99999 * Math.random()));
        $(".sticky-note").each(function () {
            var self = $(this);
            self.html() == message && self.is(":visible") && (duplicate = "yes", options.duplicates || (display = !1));
            self.attr("id") == uniqID && (uniqID = options.id || Math.floor(9999999 * Math.random()))
        });
        $("body").find(".sticky-queue." + options.position).html()
            || $("body").append('<div class="sticky-queue noprint ' + options.position + '"></div>');
        if ($.fn.bgiframe) {
            $(".sticky-queue").bgiframe();
        }

        if (types.join(',').indexOf(param.level) > -1) {
            result = '<div class="msg-b-weak msg-b-' + param.level + '"><i></i><div class="msg-cnt">';
            if (message != "" && message != null)
                result += '<p>' + message + '</p>';
            result += '</div></div>';
        } else {
            if (message != "" && message != null)
                result += '<p>' + message + '</p>';
        }

        display
        && ($("#" + uniqID).html()
            || ($(".sticky-queue." + options.position).prepend('<div class="sticky border-' + options.position
                + " " + (param.type ? param.type : "") + '" id="' + uniqID + '"></div>')), $("#" + uniqID).empty()
            .append('<span class="close sticky-close" rel="' + uniqID + '" title="关闭">&times;</span>'), $("#"
            + uniqID).append('<div class="sticky-note" rel="' + uniqID + '">' + result + '</div>'), height = $("#"
            + uniqID).height(), $("#" + uniqID).css("height", height), $("#" + uniqID).slideDown(options.speed,
            function () {
                $(".sticky").ready(function () {
                    function slideUpSticky() {
                        var that = $("#" + uniqID), queue = that.closest(".sticky-queue"), sticky = queue.find(".sticky");
                        that.remove();
                        1 == sticky.length && queue.remove();
                        try {
                            callback && callback();
                        } catch (e) {
                        }
                    }

                    options.autoclose && $("#" + uniqID).delay(options.autoclose).slideUp(options.speed, function () {
                        slideUpSticky();
                    }).on('mouseenter', function () {
                        $(this).dequeue().stop();
                    }).on('mouseleave', function () {
                        $(this).delay(options.autoclose).slideUp(options.speed, function () {
                            slideUpSticky();
                        });
                    });
                });
                $(".sticky-close").click(function () {
                    $("#" + $(this).attr("rel")).dequeue().slideUp(options.speed, function () {
                        var self = $(this);
                        var queue = self.closest(".sticky-queue"), sticky = queue.find(".sticky");
                        self.remove();
                        1 == sticky.length && queue.remove();
                        try {
                            callback && callback();
                        } catch (e) {
                        }
                    })
                });
            }), display = !0);
        if (options.position == 'top-center' || options.position == 'bottom-center') {
            $(".sticky-queue." + options.position).css('margin-left', -$(".sticky-queue." + options.position).width() / 2);
        }
        if (param.afteropen) {
            param.afteropen(options);
        }
        return {
            id: uniqID,
            duplicate: duplicate,
            displayed: display,
            position: options.position,
            level: options.level,
            options: options
        };
    }

    var settings = {
        speed: "fast",
        duplicates: 1,
        autoclose: 2E3,
        position: "top-center",
        html: false,
        id: ""
    };
    var defaults = {
        message: '',
        level: '',
        afteropen: null,
        afterclose: null
    };

    window.jSticky = function (msg, level) {
        $.sticky(msg, level);
    };
})(jQuery);
/*
 * TAB plugin
 * @param options{panelid, eventype, activeIndex, lazytime, callback}
 * @Author YuZhen
 */
jQuery.fn.extend({
	tabs:function(options,callback){
		var element = $(this),
		_panel = $('#' + options.panelid) || undefined,
		_eventype = options.eventype || 'click',
		_activeIndex = options.activeIndex || 0,
		_lazytime = options.lazytime || 0,
		timer;
		
		element.on(_eventype,'li[data-tab]',function(){
			var tabName = $(this).attr('data-tab');
			if(_lazytime!=0){
				clearTimeout(timer);
                timer = setTimeout(function(){
                    element.trigger('change.tabs',tabName);
                },_lazytime);
			}
			else{
				element.trigger('change.tabs',tabName);
			}
		});
		element.on('mouseout','li[data-tab]',function(){
			clearTimeout(timer);
		});
		element.on('change.tabs',function(e,tabName){
			element.find('li[data-tab]').removeClass('active');
			element.find('>[data-tab=' + tabName + ']').addClass('active');
			_panel.find('>[data-tab]').removeClass('active');
			_panel.find('>[data-tab=' + tabName + ']').addClass('active');
            if(callback)callback(tabName);
		});
		var firstName = element.find('li:eq(' + _activeIndex + ')').attr('data-tab');
        element.trigger('change.tabs',firstName);
        this.changeTabs=function(tabName){
            element.trigger('change.tabs',tabName);
        }

		return this;
	}
});

/* 语言工具，这里和验证放在一起，暂时不考虑国际化，主要起到一个文字信息汇总作用，方便修改 */
var language = {
    "validator.required" : "此项为必填项!",
    "validator.ip" : "IP格式错误，请检查您的输入是否有误!",
    "validator.email" : "邮箱地址错误，请检查您的输入是否有误!",
    "validator.mobile" : "手机号码错误，是11位数字!",
    "validator.tel" : "电话（传真）号码错误，请检查您的输入是否有误!",
    "validator.unitLength" : "个字",
    "validator.unitLength.chinese" : "个字符,一个汉字代表$[0]个字符",
    "validator.maxLength" : "输入的项的长度不能超过$[0]",
    "validator.minLength" : "输入的项的长度不能少于$[0]",
    "validator.common" : "不能包含特殊字符：$[0]",
    "validator.fixLength" : '必需是$[0]个字符',
    "validator.noAllowDecimals" : "此项不能使用小数点",
    "validator.noAllowNegative" : "输入的值必须为正数",
    "validator.minValue" : "输入的值不能小于$[0]",
    "validator.maxValue" : "输入的值不能大于$[0]",
    "validator.number" : "请输入正确的数字",
    "validator.lon" : "经度错误，请检查您的输入是否有误！",
    "validator.lat" : "纬度错误，请检查您的输入是否有误！",

    "form.info" : '请输入${labelName}',
    "info.mobile" : '请输入手机号码（11位数字）',
    "info.tel" : '请输入电话号码（区号+电话号码）',
    "info.ip" : '请输入有效的IP地址',
    "info.email" : '请输入有效的邮箱地址',
    "info.lon" : '请输入经度，范围[-180,180]',
    "info.lat" : '请输入纬度，范围[-90,90]',
    "info.maxLength" : '请输入$[0]~$[1]',
    "info.minLength" : '请输入至少$[0]',
    "info.fixLength" : '请输入$[0]',
    "info.min-maxLength" : '请输入$[0]~$[1]',
    "info.common" : '不包含：$[0]',
    "info.number" : '请输入有效数字',
    "info.number.min-max" : '请输入$[0]~$[1]的数字',
    "info.number.min" : '请输入大于等于$[0]的数字',
    "info.number.max" : '请输入小于等于$[0]的数字',
    "info.number.allowDN" : '，允许使用小数点和负数',
    "info.number.allowD" : '，允许使用小数点',
    "info.number.allowN" : '，允许使用负数'
};

Array.prototype.get = function(i) {
    return this[i];
};

language.templateSettings = {
    evaluate : /<%([\s\S]+?)%>/g,
    interpolate : /\$\{(.+?)\}/g,
    interpolate_get : /\$\[(.+?)\]/g,
    interpolate_text : /\$text\{(.+?)\}/g
};

language.template = function(str, data, templateSettings) {
    if (data == null) {
        return str;
    }
    var c = language.templateSettings || templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\''
        + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(c.interpolate, function(match, code) {
            return "'," + code.replace(/\\'/g, "'") + ",'";
        }).replace(c.interpolate_get, function(match, code) {
            return "',get(" + code.replace(/\\'/g, "'") + "),'";
        }).replace(c.evaluate || null, function(match, code) {
            return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
        }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return func(data);
};

language.text = function(message, param) {
    if (param != null && typeof(param) != 'object') {
        param = Array.prototype.slice.call(arguments, 1);
    }
    return language.template(language[message], param);
};


/* 验证逻辑 */
(function($) {
	var ASCII_UN_USE = "\\\/:*?\"<|'%>";
	var VTYPE = {// 验证规则，可以在此处增加验证规则
		number : {
			validator : function(val) {
				if (isNaN(val))
					return false;
				if (this.attr('allowDecimals') != 'true') {
					if (val.indexOf('.') > -1) {
						return language.text('validator.noAllowDecimals');
					}
				}
				val = parseFloat(val);
				if (this.attr('allowNegative') != 'true') {
					if (val < 0) {
						return language.text('validator.noAllowNegative');
					}
				}
				var minValue = this.attr('minValue'), maxValue = this.attr('maxValue');
				if (minValue != null) {
					minValue = parseFloat(minValue);
					if (val < minValue) {
						return language.text('validator.minValue', [ minValue ]);
					}
				}
				if (maxValue != null) {
					maxValue = parseFloat(maxValue);
					if (val > maxValue) {
						return language.text('validator.maxValue', [ maxValue ]);
					}
				}
				return true;
			},
			msg : language.text('validator.number'),
			info : function() {
				var allowDecimals = (this.attr('allowDecimals') == 'true');
				var allowNegative = (this.attr('allowNegative') == 'true');
				var textArray = [];
				var minValue = this.attr('minValue'), maxValue = this.attr('maxValue');
				if (minValue != null && maxValue != null) {
					textArray.push(language.text('info.number.min-max', minValue, maxValue));
				} else if (minValue != null) {
					textArray.push(language.text('info.number.min', minValue));
				} else if (maxValue != null) {
					textArray.push(language.text('info.number.max', maxValue));
				} else {
					textArray.push(language.text('info.number'));
				}

				if (allowDecimals && !allowNegative) {
					textArray.push(language.text('info.number.allowD'));
				} else if (!allowDecimals && allowNegative) {
					textArray.push(language.text('info.number.allowN'));
				} else if (allowDecimals && allowNegative){
					textArray.push(language.text('info.number.allowDN'));
				}
				return textArray.join('');
			}
		},
		email : {
			validator : function(val) {
				return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(val);
			},
			msg : language.text('validator.email'),
			info : language.text('info.email')
		},
		mobile : {
			validator : function(val) {
				return /^[1][1-9][0-9]{9}$/.test(val);
			},
			msg : language.text('validator.mobile'),
			info : language.text('info.mobile')
		},
		tel : {
			validator : function(val) {
				if (val == null) {
					return true;
				}
				val = $.trim(val);
				if (val.length > 9) {
					return /^[0][1-9]{2,3}-[1-9]{1}[0-9]{6,8}$/.test(val);
				} else {
					return /^[1-9]{1}[0-9]{6,8}$/.test(val);
				}
			},
			msg : language.text('validator.tel'),
			info : language.text('info.tel')
		},
		ip : {
			validator : function(val) {
				return /^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}$/.test(val);
			},
			msg : language.text('validator.ip'),
			info : language.text('info.ip')
		},
		mac : {
			validator : function(val) {
				var macs = null;
				if (val.indexOf(':') > 0) {
					macs = val.split(":");
				} else {
					macs = val.split("-");
				}
				if (macs == null || macs.length != 6) {
					return false;
				}
				for ( var s = 0; s < 6; s++) {
					var temp = parseInt(macs[s], 16);
					if (isNaN(temp) || temp < 0 || temp > 255) {
						return false;
					}
				}
				return true;
			},
			msg : '输入的mac地址格式不正确!',
			info : '请输入有效的mac地址!'
		},
		code : {
			validator : function(val) {
				var pattern = new RegExp('[^A-Za-z0-9_]+');
				if(pattern.test($.trim(val))){
					return false;
				}
				return true;
			},
			msg : '编号只允许字母、数字和下划线!',
			info : '请输入有效的编号(字母、数字、下划线的组合)!'
		},
		url : {
			validator : function(val) {
				return new RegExp("((http|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?").test(val);
			},
			msg : '输入的URL格式不正确!',
			info : '请输入有效的URL!'
		},
		lon : {
			validator : function(val) {
				return /^(-|\+)?(180|(180\.0+)|((\d{1,2}|(1([0-7]\d)))\.\d+)|\d{1,2}|(1[0-7]\d))$/.test(val);
			},
			msg : language.text('validator.lon'),
			info : language.text('info.lon')
		},
		lat : {
			validator : function(val) {
				return /^(-|\+)?(90|90\.0+|([1-8]\d\.\d+|\d\.\d+)|([1-8]\d)|\d)$/.test(val);
			},
			msg : language.text('validator.lat'),
			info : language.text('info.lat')
		},
		regex : {
			validator : function(val) {
				var regExp = this.attr('regex');
				return new RegExp(regExp).test(val);
			},
			msg : function() {
				return this.attr('regexError');
			},
			info : function() {
				return this.attr('regexInfo');
			}
		}
	};
	$.vtype = VTYPE;

	function getContainerEl(targetEl) {
        var isOverflown = targetEl.attr('isOverflown') == 'true';
        if(isOverflown && targetEl.closest('.input-wrap').length > 0){
            return targetEl.closest('.input-wrap');
        }
        return targetEl.parent();
	}

	function showInfo(targetEl, msg, type) {
		var containerEl = getContainerEl(targetEl);
		var labelEl = containerEl.find('label[generated="true"]');
        var isOverflown = targetEl.attr('isOverflown') == 'true';
        if (labelEl.length == 0) {
            labelEl = $('<label class="info" generated="true"></label>');
            if(isOverflown) {
                var fieldWidth = targetEl.outerWidth();
                var fieldHeight = targetEl.outerHeight();
                targetEl.attr('wrapped', 'true');
                var wrapEl = $('<div class="input-wrap" style="width:' + fieldWidth + 'px; height: ' + fieldHeight + 'px"></div>').insertBefore(targetEl);
                // 设置冻结标识，事件处理之前会判断
                targetEl.data('frozen', true);
                targetEl.appendTo(wrapEl);
                if($.browser.msie && parseInt($.browser.version) < 8){
                    // 消除IE6/7 field的marginLeft继承
                    targetEl.wrap('<span></span>');
                }
                setTimeout(function(){
                    targetEl.focus();
                    // 取消冻结标识
                    targetEl.removeData('frozen');
                },0);
                labelEl.appendTo(wrapEl);
            } else {
                labelEl.appendTo(containerEl);
            }

        }

        if(isOverflown) {
            labelEl.text(msg).append('<i class="arrow"><b></b></i>').show();
            var promptPosition = targetEl.attr('promptPosition');
            if (type == 'info') {
                targetEl.removeClass('error');
                labelEl.removeClass('tip-info tip-error')
                    .removeClass('tip-info-topLeft tip-info-topRight tip-info-centerRight tip-info-bottomLeft tip-info-bottomRight')
                    .removeClass('tip-error-topLeft tip-error-topRight tip-error-centerRight tip-error-bottomLeft tip-error-bottomRight')
                    .addClass('tip tip-info tip-info-' + promptPosition)
                    .css({
                        "opacity": 0
                    })
                    .animate({
                        "opacity": 1
                    });
            } else {
                targetEl.addClass('error');
                labelEl.removeClass('tip-info tip-error')
                    .removeClass('tip-info-topLeft tip-info-topRight tip-info-centerRight tip-info-bottomLeft tip-info-bottomRight')
                    .removeClass('tip-error-topLeft tip-error-topRight tip-error-centerRight tip-error-bottomLeft tip-error-bottomRight')
                    .addClass('tip tip-error tip-error-' + promptPosition)
                    .css({
                        "opacity": 0
                    })
                    .animate({
                        "opacity": 1
                    });
            }
        } else {
            labelEl.text(msg).show();
            if (type == 'info') {
                targetEl.removeClass('error');
                labelEl.removeClass('error').addClass('info');
            } else {
                targetEl.addClass('error');
                labelEl.removeClass('info').addClass('error');
            }
        }

	}

	$.fn.clearValidate = function() {
		this.removeClass('error');
		var containerEl = getContainerEl(this);
		containerEl.find('label[generated=true]').empty().hide();
	};

	$.fn.showValidate = function(msg) {
        this.clearValidate();
		if (!msg) {
			return;
		}
		showInfo(this, msg, 'error');
		return this;
	};
	$.fn.showInfo = function(msg) {
        this.clearValidate();
		if (!msg)
			return;
		showInfo(this, msg, 'info');
		return this;
	};
	function getLength(target, val) {
		var length = 0;
		var hasChinese = target[0].getAttribute('hasChinese');
		hasChinese = hasChinese == 'true';
		var chineseUnitLength, lengthLastInfo;
		if (hasChinese) {
			chineseUnitLength = target[0].getAttribute('chineseUnitLength');
			lengthLastInfo = language.text("validator.unitLength.chinese", [ chineseUnitLength ]);
		} else {
			lengthLastInfo = language.text("validator.unitLength");
		}
		if (val != null && $.trim(val) != '') {
			if (hasChinese) {
				if ($.isNumeric(chineseUnitLength)) {
					chineseUnitLength = parseInt(chineseUnitLength);
					var replace = [];
					for ( var i = 0; i < chineseUnitLength; i++) {
						replace.push('*');
					}
					length = $.trim(val).replace(/[^\x00-\xff]/g, replace.join('')).length;
				} else {
					chineseUnitLength = 3;
					length = $.trim(val).replace(/[^\x00-\xff]/g, "***").length;
				}
			} else {
				length = $.trim(val).length;
			}
		}
		return {
			length : length,
			lastMag : lengthLastInfo
		};
	}
	function validate(target, msg) {// 验证的处理函数
		if (msg) {
			target.showValidate(msg);
			return false;
		}

		var val = target.val();
		var required = target[0].getAttribute('required');// 为空的验证
		if ((required == "required" || required == "true" || required == true) && $.trim(val) == '') {
			target.showValidate(language.text('validator.required'), target);
			return false;
		}
		var minLength = target.attr('minLength');
		minLength = minLength ? parseInt(minLength) : -1;
		var maxLength = target.attr('maxLength');
		maxLength = maxLength ? parseInt(maxLength) : -1;
		var lengthMap = getLength(target, val);
		var length = lengthMap.length;
		if (minLength == maxLength && minLength > -1 && length != minLength) {
			target.showValidate(language.text('validator.fixLength', [ maxLength ]) + lengthMap.lastMag);
			return false;
		}
		if (length < minLength && minLength > -1) {
			target.showValidate(language.text('validator.minLength', [ minLength ]) + lengthMap.lastMag);
			return false;
		}
		if (length > maxLength && maxLength > -1) {
			target.showValidate(language.text('validator.maxLength', [ maxLength ]) + lengthMap.lastMag);
			return false;
		}
		var unUseChars = getUnUseChars(target[0]);
		if (unUseChars != null) {
			for ( var i = 0; i < val.length; i++) {
				var varCode = val.charAt(i);
				if (unUseChars.indexOf(varCode) > -1) {
					target.showValidate(language.text('validator.common', [ unUseChars ]));
					return false;
				}
			}
		}
		var vtype = target.attr('vtype');
		if (val == '' || val == null || vtype == null) {// vtype的验证
			var config = {};// 用户自定义的验证
			target.trigger('validate', [ val, config ]);
			if (config.error != null) {
				target.showValidate(config.error);
				return false;
			}
			target.clearValidate();
			return true;
		}
		var isAllRight = true;
		$.each(vtype.split(','), function(i, key) {
			if (VTYPE[key] == null)
				return;
			var result = VTYPE[key].validator.call(target, val);
			if (result == true) {
				return;
			}
			var msg;
			if (result == false) {
				msg = VTYPE[key].msg;
				if ($.isFunction(msg))
					msg = msg.call(target, val);
			} else {
				msg = result;
			}
			target.showValidate(msg);
			isAllRight = false;
			return false;
		});
		if (!isAllRight)
			return false;

		var config = {};// 用户自定义的验证
		target.trigger('validate', [ val, config ]);
		if (config.error != null) {
			target.showValidate(config.error);
			return false;
		}
		target.clearValidate();
		return true;
	}
	$.fn.validate = function(msg) {// 验证
		return validate(this, null, msg);
	};

	function getUnUseChars(target) {// 特殊字符处理
		var unUseChars = target.getAttribute('unUseChars');
		if (unUseChars != null)
			return unUseChars;
		if (target.getAttribute('vtype') == null || target.getAttribute('vtype').indexOf('common') < 0)
			return null;
		var excludeChars = target.getAttribute('excludeChars'), includeChars = target.getAttribute('includeChars');
		unUseChars = ASCII_UN_USE;
		if (includeChars != null) {
			for ( var index = 0; index < includeChars.length; index++) {
				var includeChar = includeChars.charAt(index);
				unUseChars = unUseChars.indexOf(includeChar) > -1 ? unUseChars : unUseChars + includeChar;
			}
		}
		if (excludeChars != null) {
			for ( var index = 0; index < excludeChars.length; index++) {
				unUseChars = unUseChars.replace(excludeChars.charAt(index), '');
			}
		}
		target.setAttribute('unUseChars', unUseChars);
		return unUseChars;
	}
	$('textarea[maxLength]').live({
		keydown : function(event) {
			if (event.which == 8 || (36 < event.which && event.which < 41)) {
				return;
			}
			var length = this.value.length;
			var maxLength = this.getAttribute('maxLength');
			if (!$.isNumeric(maxLength)) {
				return;
			}
			maxLength = parseInt(maxLength);
			if (length >= maxLength) {
				return false;
			}
		}
	});

	$('[vtype*=number]').live({// 数字验证
		keypress : function(event) {
			if (this.getAttribute('allowNegative') == 'true') {
				if (event.which == 45)
					if(/^-/.test($(this).val()))
						return false;
					else
						return true;
			}
			if (this.getAttribute('allowDecimals') == 'true') {
				if (event.which == 46)
					if(/\./.test($(this).val()))
						return false;
					else
						return true;
			}
			if (event.which < 48 || event.which > 57)
				return false;
			else
				return true;
		},
		paste: function(event){
			if($.browser.msie){
				var regexp = /^\d+$/;
				if (this.getAttribute('allowNegative') == 'true' && this.getAttribute('allowDecimals') == 'true') {
					regexp = /^-?\d+(\.\d+)?$/;
				} else if (this.getAttribute('allowNegative') == 'true') {
					regexp = /^-?\d+$/;
				} else if (this.getAttribute('allowDecimals') == 'true') {
					regexp = /^\d+\.\d+$/;
				}
				var str = window.clipboardData.getData("text");
				if(regexp.test($.trim(str))){
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},
		change: function(event) {
			var regexp = /^\d+$/;
			if (this.getAttribute('allowNegative') == 'true' && this.getAttribute('allowDecimals') == 'true') {
				regexp = /^-?\d+(\.\d+)?$/;
			} else if (this.getAttribute('allowNegative') == 'true') {
				regexp = /^-?\d+$/;
			} else if (this.getAttribute('allowDecimals') == 'true') {
				regexp = /^\d+\.?\d+$/;
			}
			// 不满足规则的统一清空
			if(!regexp.test($(this).val()) && $(this).val() !== ''){
				$(this).val('');
			}
		}
	});
	$('[vtype*=common]').live({// 特殊字符处理
		keydown : function() {
			getUnUseChars(this);
		},
		keypress : function(event) {// excludeChars includeChars
			// unUseChars
			if (this.getAttribute('unUseChars').indexOf(String.fromCharCode(event.which)) > -1) {
				return false;
			}
			return true;
		}
	});
	$('[vtype*=code]').live({
		keypress : function(event) {
			var pattern = new RegExp('[^A-Za-z0-9_]+');
			if(pattern.test(String.fromCharCode(event.which))){
				return false;
			}
			return true;
		},
		change : function() {
			var pattern = new RegExp('[^A-Za-z0-9_]+');
			$(this).val($(this).val().replace(pattern, ''));
		}
	});
	$(function() {
		$('body').bind('paste', function(e) {
			var target = e.target;
			if (target.getAttribute('hikui') == 'calendar') {
				return false;
			}
			var vtype = target.getAttribute('vtype');
			var type = target.getAttribute('type');
			var nvp = target.getAttribute('not-validator-paste');
			if ((type != 'text' && target.tagName != 'TEXTAREA') || !vtype || vtype.indexOf('common') < 0 || nvp == true) {
				return;
			}
			getUnUseChars(target);
			var clipboardData = getClipboardData();
			var unUseChars = target.getAttribute('unUseChars');
			for ( var i = 0; i < clipboardData.length; i++) {
				var tempChar = clipboardData.charAt(i);
				if (unUseChars.indexOf(tempChar) > -1) {
					$.sticky("粘贴内容不能包含以下特殊字符:" + unUseChars + " 此次操作无效！", {
						type : 'attention'
					});
					return false;
				}
			}
			return true;

		});
		// 目前只考虑了IE
		function getClipboardData() {
			if (window.clipboardData) {
				return window.clipboardData.getData("Text");
			} else {
				return "";
			}
		}
	})
	$(function() {
		$('form[history="true"]').delegate('input[type="text"][not-use-char-code!=true]', {
			'keypress' : function(event) {
				if (ASCII_UN_USE.indexOf(String.fromCharCode(event.which)) > -1) {
					return false;
				}
				return true;
			}
		});
	});

	$('.auto-input').live('focusin', function(e) {
		var targetEl = $(e.target);
        targetEl.addClass('info');

        if(targetEl.data('frozen') == true) {
            return;
        }

		var titleArray = [];
		if (targetEl.attr('self-focus-info')) {
			targetEl.showInfo(targetEl.attr('self-focus-info'));
			return;
		}
		var required = targetEl[0].getAttribute('required');// 为空的验证
		var minLength = targetEl.attr('minLength');
		if (minLength) {
			minLength = parseInt(minLength);
		}
		var maxLength = targetEl.attr('maxLength');
		if (maxLength) {
			maxLength = parseInt(maxLength);
		}
		var lengthLastInfo = null;
		if (maxLength > -1 || minLength > 0) {
			var hasChinese = targetEl[0].getAttribute('hasChinese');
			hasChinese = hasChinese == 'true' ? true : false;
			if (hasChinese) {
				var chineseUnitLength = targetEl[0].getAttribute('chineseUnitLength');
				if ($.isNumeric(chineseUnitLength)) {
					chineseUnitLength = parseInt(chineseUnitLength);
				} else {
					chineseUnitLength = 3;
				}
				lengthLastInfo = language.text("validator.unitLength.chinese", [ chineseUnitLength ]);
			} else {
				lengthLastInfo = language.text("validator.unitLength");
			}
		}
		if (maxLength > -1 && minLength > 0) {
			if (maxLength == minLength) {
				titleArray.push(language.text("info.fixLength", [ maxLength ]) + lengthLastInfo);
			} else {
				titleArray.push(language.text("info.min-maxLength", [ minLength, maxLength ]) + lengthLastInfo);
			}
		} else if (maxLength > -1) {
			titleArray.push(language.text("info.maxLength", [ (required == "required" || required == "true" || required == true) ? 1 : 0, maxLength ]) + lengthLastInfo);
		} else if (minLength > 0) {
			titleArray.push(language.text("info.minLength", [ minLength ]) + lengthLastInfo);
		}

		var vtype = targetEl.attr('vtype');
		if (vtype != null) {
			$.each(vtype.split(','), function(i, key) {
				if (VTYPE[key] == null)
					return true;
				if (VTYPE[key].info == null) {
					return true;
				}
				if ($.isFunction(VTYPE[key].info)) {
					titleArray.push(VTYPE[key].info.call(targetEl));
				} else {
					titleArray.push(VTYPE[key].info);
				}
			});
		}
		var unUseChars = getUnUseChars(targetEl[0]);
		if (unUseChars != null) {
			titleArray.push(language.text("info.common", [ unUseChars ]));
		}
		if (targetEl.attr('focus-info')) {
			titleArray.push(targetEl.attr('focus-info'));
		}
		targetEl.showInfo(titleArray.join('! '));
	}).live('focusout', function(e) {
		var targetEl = $(e.target);
        targetEl.removeClass('info');

        if(targetEl.data('frozen') == true) {
            return;
        }
		if(targetEl.attr('auto-trim')!=='false'){
			targetEl.val($.trim(targetEl.val()));
		}

		var required = targetEl.attr('required');// 为空的验证
		var val = targetEl.val();
		if ((required == "required" || required == "true" || required == true) && $.trim(val) == '') {
			targetEl.showValidate(language.text('validator.required'));
		} else {
            targetEl.validate();
        }

	});

})(jQuery);

/**
 * @package Xslider - A slider plugin for jQuery
 * @version 0.5
 * @author xhowhy <http://x1989.com>
 * @author chenguohui 优化了一些效果,可以实现连续滚动
 */
;
(function($) {
    $.fn.Xslider = function(options) {
        var settings = {
            affect : 'scrollx', // 效果 有scrollx|scrolly|fade|none
            speed : 1200, // 动画速度
            space : 6000, // 时间间隔
            auto : true, // 自动滚动
            trigger : 'mouseover', // 触发事件 注意用mouseover代替hover
            conbox : '.conbox', // 内容容器id或class
            ctag : 'a', // 内容标签 默认为<a>
            switcher : '.switcher', // 切换触发器id或class
            stag : 'a', // 切换器标签 默认为a
            current : 'cur', // 当前切换器样式名称
            rand : false // 是否随机指定默认幻灯图片
        };
        settings = $.extend({}, settings, options);
        var index = 1;
        var last_index = 0;
        var $conbox = $(this).find(settings.conbox), $contents = $conbox.find(settings.ctag);
        // 少于2个的情况下不做效果
        if ($contents.length < 2) {
            return;
        }
        $contents.each(function(i, n) {
            $(n).attr('data-index', i); // 标记序号
        });
        var $switcher = $(this).find(settings.switcher);
        if ($switcher.length == 0) {
            $switcher = $(settings.switcher);
        }
        var $stag = $switcher.find(settings.stag);
        if (settings.rand) {
            index = Math.floor(Math.random() * $contents.length);
            slide();
        }
        if (settings.affect == 'fade') {
            $.each($contents, function(k, v) {
                (k === 0) ? $(this).css({
                    'position' : 'absolute',
                    'z-index' : 9
                }) : $(this).css({
                    'position' : 'absolute',
                    'z-index' : 1,
                    'opacity' : 0
                });
            });
        }

        function slide(action) {
            action = action || 'next';
            if (index >= $contents.length)
                index = 0;
            if (index < 0)
                index = $contents.length - 1;
            switch (settings.affect) {
                case 'scrollx' :
                    $conbox.width($contents.length * $contents.width());
                    var curPos = parseInt($conbox.find(settings.ctag + ':first').attr('data-index'));

                    var offset;
                    if(action == 'prev'){
                        offset = -1;
                    } else if(action == 'next'){
                        offset = 1;
                    } else if(action == 'trigger') {
                        var curPos = parseInt($conbox.find(settings.ctag + ':first').attr('data-index'));
                        offset = index - curPos;
                    }

                    if (offset > 0) {
                        $conbox.stop().animate({
                            left : -$contents.width() * offset
                        }, settings.speed, 'swing', function() {
                            var toMove = $conbox.find(settings.ctag + ':lt(' + offset + ')');
                            $conbox.append(toMove);
                            $conbox.css('left', '0');
                            var _index = $conbox.find(settings.ctag + ':first').attr('data-index');
                            $stag.removeClass(settings.current).eq(_index).addClass(settings.current);
                        });
                    } else if(offset < 0) {
                        var toMove = $conbox.find(settings.ctag + ':gt(' + ($contents.length - 1 + offset) + ')');
                        $conbox.prepend(toMove);
                        $conbox.css('left', $contents.width() * offset);
                        $conbox.stop().animate({
                            left : 0
                        }, settings.speed, 'swing', function(){
                            var _index = $conbox.find(settings.ctag + ':first').attr('data-index');
                            $stag.removeClass(settings.current).eq(_index).addClass(settings.current);
                        });
                    }
                    break;
                case 'scrolly' :
                    $contents.css({
                        display : 'block'
                    });

                    var offset;
                    if(action == 'prev'){
                        offset = -1;
                    } else if(action == 'next'){
                        offset = 1;
                    } else if(action == 'trigger') {
                        var curPos = parseInt($conbox.find(settings.ctag + ':first').attr('data-index'));
                        offset = index - curPos;
                    }

                    if (offset >= 0) {
                        $conbox.stop().animate({
                            top : -$contents.height() * offset
                        }, settings.speed, 'swing', function() {
                            var toMove = $conbox.find(settings.ctag + ':lt(' + offset + ')');
                            $conbox.append(toMove);
                            $conbox.css('top', '0');
                            var _index = $conbox.find(settings.ctag + ':first').attr('data-index');
                            $stag.removeClass(settings.current).eq(_index).addClass(settings.current);
                        });
                    } else if(offset < 0) {
                        var toMove = $conbox.find(settings.ctag + ':gt(' + ($contents.length - 1 + offset) + ')');
                        $conbox.prepend(toMove);
                        $conbox.css('top', $contents.height() * offset);
                        $conbox.stop().animate({
                            top : 0
                        }, settings.speed, 'swing', function(){
                            var _index = $conbox.find(settings.ctag + ':first').attr('data-index');
                            $stag.removeClass(settings.current).eq(_index).addClass(settings.current);
                        });
                    }

                    break;
                case 'fade' :
                    $contents.eq(last_index).stop().animate({
                        'opacity' : 0
                    }, settings.speed / 2).css('z-index', 1).end().eq(index).css('z-index', 9).stop().animate({
                        'opacity' : 1
                    }, settings.speed / 2);
                    $stag.removeClass(settings.current).eq(index).addClass(settings.current);
                    break;
                case 'none' :
                    $contents.hide().eq(index).show();
                    $stag.removeClass(settings.current).eq(index).addClass(settings.current);
                    break;
            }

            last_index = index;
            index++;
        };
        if (settings.auto){
            var Timer = setInterval(slide, settings.space);
        }
        $stag.bind(settings.trigger, function() {
            _pause();
            index = $(this).prevAll(settings.stag).length;
            slide('trigger');
            _continue();
        });
        $switcher.find('.prev').bind('click', function() {
            _pause();
            index = index - 2;
            slide('prev');
            _continue();
        });
        $switcher.find('.next').bind('click', function() {
            _pause();
            slide('next');
            _continue();
        });
        $conbox.hover(_pause, _continue);
        function _pause() {
            clearInterval(Timer);
        }
        function _continue() {
            if (settings.auto)
                Timer = setInterval(slide, settings.space);
        }
    }
})(jQuery);

/*
 * JQuery zTree core v3.5.19.2
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-11-15
 */
(function($){
	var settings = {}, roots = {}, caches = {},
	//default consts of core
	_consts = {
		className: {
			BUTTON: "button",
			LEVEL: "level",
			ICO_LOADING: "ico_loading",
			SWITCH: "switch",
			NAME: 'node_name'
		},
		event: {
			NODECREATED: "ztree_nodeCreated",
			CLICK: "ztree_click",
			EXPAND: "ztree_expand",
			COLLAPSE: "ztree_collapse",
			ASYNC_SUCCESS: "ztree_async_success",
			ASYNC_ERROR: "ztree_async_error",
			REMOVE: "ztree_remove",
			SELECTED: "ztree_selected",
			UNSELECTED: "ztree_unselected"
		},
		id: {
			A: "_a",
			ICON: "_ico",
			SPAN: "_span",
			SWITCH: "_switch",
			UL: "_ul"
		},
		line: {
			ROOT: "root",
			ROOTS: "roots",
			CENTER: "center",
			BOTTOM: "bottom",
			NOLINE: "noline",
			LINE: "line"
		},
		folder: {
			OPEN: "open",
			CLOSE: "close",
			DOCU: "docu"
		},
		node: {
			CURSELECTED: "curSelectedNode"
		}
	},
	//default setting of core
	_setting = {
		treeId: "",
		treeObj: null,
		view: {
			addDiyDom: null,
			autoCancelSelected: true,
			dblClickExpand: true,
			expandSpeed: "fast",
			fontCss: {},
			nameIsHTML: false,
			selectedMulti: true,
			showIcon: true,
			showLine: true,
			showTitle: true,
			txtSelectedEnable: false
		},
		data: {
			key: {
				children: "children",
				name: "name",
				title: "",
				url: "url",
				icon: "icon"
			},
			simpleData: {
				enable: false,
				idKey: "id",
				pIdKey: "pId",
				rootPId: null
			},
			keep: {
				parent: false,
				leaf: false
			}
		},
		async: {
			enable: false,
			contentType: "application/x-www-form-urlencoded",
			type: "post",
			dataType: "text",
			url: "",
			autoParam: [],
			otherParam: [],
			dataFilter: null
		},
		callback: {
			beforeAsync:null,
			beforeClick:null,
			beforeDblClick:null,
			beforeRightClick:null,
			beforeMouseDown:null,
			beforeMouseUp:null,
			beforeExpand:null,
			beforeCollapse:null,
			beforeRemove:null,

			onAsyncError:null,
			onAsyncSuccess:null,
			onNodeCreated:null,
			onClick:null,
			onDblClick:null,
			onRightClick:null,
			onMouseDown:null,
			onMouseUp:null,
			onExpand:null,
			onCollapse:null,
			onRemove:null
		}
	},
	//default root of core
	//zTree use root to save full data
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		if (!r) {
			r = {};
			data.setRoot(setting, r);
		}
		r[setting.data.key.children] = [];
		r.expandTriggerFlag = false;
		r.curSelectedList = [];
		r.noSelection = true;
		r.createdNodes = [];
		r.zId = 0;
		r._ver = (new Date()).getTime();
	},
	//default cache of core
	_initCache = function(setting) {
		var c = data.getCache(setting);
		if (!c) {
			c = {};
			data.setCache(setting, c);
		}
		c.nodes = [];
		c.doms = [];
	},
	//default bindEvent of core
	_bindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.bind(c.NODECREATED, function (event, treeId, node) {
			tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
		});

		o.bind(c.CLICK, function (event, srcEvent, treeId, node, clickFlag) {
			tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag]);
		});

		o.bind(c.EXPAND, function (event, treeId, node) {
			tools.apply(setting.callback.onExpand, [event, treeId, node]);
		});

		o.bind(c.COLLAPSE, function (event, treeId, node) {
			tools.apply(setting.callback.onCollapse, [event, treeId, node]);
		});

		o.bind(c.ASYNC_SUCCESS, function (event, treeId, node, msg) {
			tools.apply(setting.callback.onAsyncSuccess, [event, treeId, node, msg]);
		});

		o.bind(c.ASYNC_ERROR, function (event, treeId, node, XMLHttpRequest, textStatus, errorThrown) {
			tools.apply(setting.callback.onAsyncError, [event, treeId, node, XMLHttpRequest, textStatus, errorThrown]);
		});

		o.bind(c.REMOVE, function (event, treeId, treeNode) {
			tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
		});

		o.bind(c.SELECTED, function (event, treeId, node) {
			tools.apply(setting.callback.onSelected, [treeId, node]);
		});
		o.bind(c.UNSELECTED, function (event, treeId, node) {
			tools.apply(setting.callback.onUnSelected, [treeId, node]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.unbind(c.NODECREATED)
		.unbind(c.CLICK)
		.unbind(c.EXPAND)
		.unbind(c.COLLAPSE)
		.unbind(c.ASYNC_SUCCESS)
		.unbind(c.ASYNC_ERROR)
		.unbind(c.REMOVE)
		.unbind(c.SELECTED)
		.unbind(c.UNSELECTED);
	},
	//default event proxy of core
	_eventProxy = function(event) {
		var target = event.target,
		setting = data.getSetting(event.data.treeId),
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null,
		tmp = null;

		if (tools.eqs(event.type, "mousedown")) {
			treeEventType = "mousedown";
		} else if (tools.eqs(event.type, "mouseup")) {
			treeEventType = "mouseup";
		} else if (tools.eqs(event.type, "contextmenu")) {
			treeEventType = "contextmenu";
		} else if (tools.eqs(event.type, "click")) {
			if (tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.SWITCH) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "switchNode";
			} else {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {
					tId = tools.getNodeMainDom(tmp).id;
					nodeEventType = "clickNode";
				}
			}
		} else if (tools.eqs(event.type, "dblclick")) {
			treeEventType = "dblclick";
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tools.getNodeMainDom(tmp).id;
				nodeEventType = "switchNode";
			}
		}
		if (treeEventType.length > 0 && tId.length == 0) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {tId = tools.getNodeMainDom(tmp).id;}
		}
		// event to node
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "switchNode" :
					if (!node.isParent) {
						nodeEventType = "";
					} else if (tools.eqs(event.type, "click")
						|| (tools.eqs(event.type, "dblclick") && tools.apply(setting.view.dblClickExpand, [setting.treeId, node], setting.view.dblClickExpand))) {
						nodeEventCallback = handler.onSwitchNode;
					} else {
						nodeEventType = "";
					}
					break;
				case "clickNode" :
					nodeEventCallback = handler.onClickNode;
					break;
			}
		}
		// event to zTree
		switch (treeEventType) {
			case "mousedown" :
				treeEventCallback = handler.onZTreeMousedown;
				break;
			case "mouseup" :
				treeEventCallback = handler.onZTreeMouseup;
				break;
			case "dblclick" :
				treeEventCallback = handler.onZTreeDblclick;
				break;
			case "contextmenu" :
				treeEventCallback = handler.onZTreeContextmenu;
				break;
		}
		var proxyResult = {
			stop: false,
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of core
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		var r = data.getRoot(setting),
		childKey = setting.data.key.children;
		n.level = level;
		n.tId = setting.treeId + "_" + (++r.zId);
		n.parentTId = parentNode ? parentNode.tId : null;
		n.open = (typeof n.open == "string") ? tools.eqs(n.open, "true") : !!n.open;
		if (n[childKey] && n[childKey].length > 0) {
			n.isParent = true;
			n.zAsync = true;
		} else {
			n.isParent = (typeof n.isParent == "string") ? tools.eqs(n.isParent, "true") : !!n.isParent;
			n.open = (n.isParent && !setting.async.enable) ? n.open : false;
			n.zAsync = !n.isParent;
		}
		n.isFirstNode = isFirstNode;
		n.isLastNode = isLastNode;
		n.getParentNode = function() {return data.getNodeCache(setting, n.parentTId);};
		n.getPreNode = function() {return data.getPreNode(setting, n);};
		n.getNextNode = function() {return data.getNextNode(setting, n);};
		n.getIndex = function() {return data.getNodeIndex(setting, n);};
		n.getPath = function() {return data.getNodePath(setting, n);};
		n.isAjaxing = false;
		data.fixPIdKeyValue(setting, n);
	},
	_init = {
		bind: [_bindEvent],
		unbind: [_unbindEvent],
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [_eventProxy],
		roots: [_initRoot],
		beforeA: [],
		afterA: [],
		innerBeforeA: [],
		innerAfterA: [],
		zTreeTools: []
	},
	//method of operate data
	data = {
		addNodeCache: function(setting, node) {
			data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = node;
		},
		getNodeCacheId: function(tId) {
			return tId.substring(tId.lastIndexOf("_")+1);
		},
		addAfterA: function(afterA) {
			_init.afterA.push(afterA);
		},
		addBeforeA: function(beforeA) {
			_init.beforeA.push(beforeA);
		},
		addInnerAfterA: function(innerAfterA) {
			_init.innerAfterA.push(innerAfterA);
		},
		addInnerBeforeA: function(innerBeforeA) {
			_init.innerBeforeA.push(innerBeforeA);
		},
		addInitBind: function(bindEvent) {
			_init.bind.push(bindEvent);
		},
		addInitUnBind: function(unbindEvent) {
			_init.unbind.push(unbindEvent);
		},
		addInitCache: function(initCache) {
			_init.caches.push(initCache);
		},
		addInitNode: function(initNode) {
			_init.nodes.push(initNode);
		},
		addInitProxy: function(initProxy, isFirst) {
			if (!!isFirst) {
				_init.proxys.splice(0,0,initProxy);
			} else {
				_init.proxys.push(initProxy);
			}
		},
		addInitRoot: function(initRoot) {
			_init.roots.push(initRoot);
		},
		addNodesData: function(setting, parentNode, index, nodes) {
			var childKey = setting.data.key.children, params;
			if (!parentNode[childKey]) {
				parentNode[childKey] = [];
				index = -1;
			} else if (index >= parentNode[childKey].length) {
				index = -1;
			}

			if (parentNode[childKey].length > 0 && index === 0) {
				parentNode[childKey][0].isFirstNode = false;
				view.setNodeLineIcos(setting, parentNode[childKey][0]);
			} else if (parentNode[childKey].length > 0 && index < 0) {
				parentNode[childKey][parentNode[childKey].length - 1].isLastNode = false;
				view.setNodeLineIcos(setting, parentNode[childKey][parentNode[childKey].length - 1]);
			}
			parentNode.isParent = true;

			if (index<0) {
				parentNode[childKey] = parentNode[childKey].concat(nodes);
			} else {
				params = [index, 0].concat(nodes);
				parentNode[childKey].splice.apply(parentNode[childKey], params);
			}
		},
		addSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			if (!data.isSelectedNode(setting, node)) {
				root.curSelectedList.push(node);
			}
		},
		addCreatedNode: function(setting, node) {
			if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
				var root = data.getRoot(setting);
				root.createdNodes.push(node);
			}
		},
		addZTreeTools: function(zTreeTools) {
			_init.zTreeTools.push(zTreeTools);
		},
		exSetting: function(s) {
			$.extend(true, _setting, s);
		},
		fixPIdKeyValue: function(setting, node) {
			if (setting.data.simpleData.enable) {
				node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPId;
			}
		},
		getAfterA: function(setting, node, array) {
			for (var i=0, j=_init.afterA.length; i<j; i++) {
				_init.afterA[i].apply(this, arguments);
			}
		},
		getBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.beforeA.length; i<j; i++) {
				_init.beforeA[i].apply(this, arguments);
			}
		},
		getInnerAfterA: function(setting, node, array) {
			for (var i=0, j=_init.innerAfterA.length; i<j; i++) {
				_init.innerAfterA[i].apply(this, arguments);
			}
		},
		getInnerBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.innerBeforeA.length; i<j; i++) {
				_init.innerBeforeA[i].apply(this, arguments);
			}
		},
		getCache: function(setting) {
			return caches[setting.treeId];
		},
		getNodeIndex: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length-1; i<=l; i++) {
				if (p[childKey][i] === node) {
					return i;
				}
			}
			return -1;
		},
		getNextNode: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length-1; i<=l; i++) {
				if (p[childKey][i] === node) {
					return (i==l ? null : p[childKey][i+1]);
				}
			}
			return null;
		},
		getNodeByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return null;
			var childKey = setting.data.key.children;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					return nodes[i];
				}
				var tmp = data.getNodeByParam(setting, nodes[i][childKey], key, value);
				if (tmp) return tmp;
			}
			return null;
		},
		getNodeCache: function(setting, tId) {
			if (!tId) return null;
			var n = caches[setting.treeId].nodes[data.getNodeCacheId(tId)];
			return n ? n : null;
		},
		getNodeName: function(setting, node) {
			var nameKey = setting.data.key.name;
			return "" + node[nameKey];
		},
		getNodePath: function(setting, node) {
			if (!node) return null;

			var path;
			if(node.parentTId) {
				path = node.getParentNode().getPath();
			} else {
				path = [];
			}

			if (path) {
				path.push(node);
			}

			return path;
		},
		getNodeTitle: function(setting, node) {
			var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
			return "" + node[t];
		},
		getNodes: function(setting) {
			return data.getRoot(setting)[setting.data.key.children];
		},
		getNodesByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childKey = setting.data.key.children,
			result = [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParam(setting, nodes[i][childKey], key, value));
			}
			return result;
		},
		getNodesByParamFuzzy: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childKey = setting.data.key.children,
			result = [];
			value = value.toLowerCase();
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (typeof nodes[i][key] == "string" && nodes[i][key].toLowerCase().indexOf(value)>-1) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParamFuzzy(setting, nodes[i][childKey], key, value));
			}
			return result;
		},
		getNodesByFilter: function(setting, nodes, filter, isSingle, invokeParam) {
			if (!nodes) return (isSingle ? null : []);
			var childKey = setting.data.key.children,
			result = isSingle ? null : [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (tools.apply(filter, [nodes[i], invokeParam], false)) {
					if (isSingle) {return nodes[i];}
					result.push(nodes[i]);
				}
				var tmpResult = data.getNodesByFilter(setting, nodes[i][childKey], filter, isSingle, invokeParam);
				if (isSingle && !!tmpResult) {return tmpResult;}
				result = isSingle ? tmpResult : result.concat(tmpResult);
			}
			return result;
		},
		getPreNode: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length; i<l; i++) {
				if (p[childKey][i] === node) {
					return (i==0 ? null : p[childKey][i-1]);
				}
			}
			return null;
		},
		getRoot: function(setting) {
			return setting ? roots[setting.treeId] : null;
		},
		getRoots: function() {
			return roots;
		},
		getSetting: function(treeId) {
			return settings[treeId];
		},
		getSettings: function() {
			return settings;
		},
		getZTreeTools: function(treeId) {
			var r = this.getRoot(this.getSetting(treeId));
			return r ? r.treeTools : null;
		},
		initCache: function(setting) {
			for (var i=0, j=_init.caches.length; i<j; i++) {
				_init.caches[i].apply(this, arguments);
			}
		},
		initNode: function(setting, level, node, parentNode, preNode, nextNode) {
			for (var i=0, j=_init.nodes.length; i<j; i++) {
				_init.nodes[i].apply(this, arguments);
			}
		},
		initRoot: function(setting) {
			for (var i=0, j=_init.roots.length; i<j; i++) {
				_init.roots[i].apply(this, arguments);
			}
		},
		isSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i]) return true;
			}
			return false;
		},
		removeNodeCache: function(setting, node) {
			var childKey = setting.data.key.children;
			if (node[childKey]) {
				for (var i=0, l=node[childKey].length; i<l; i++) {
					arguments.callee(setting, node[childKey][i]);
				}
			}
			data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = null;
		},
		removeSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i] || !data.getNodeCache(setting, root.curSelectedList[i].tId)) {
					root.curSelectedList.splice(i, 1);
					setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, node]);
					i--;j--;
				}
			}
		},
		setCache: function(setting, cache) {
			caches[setting.treeId] = cache;
		},
		setRoot: function(setting, root) {
			roots[setting.treeId] = root;
		},
		setZTreeTools: function(setting, zTreeTools) {
			for (var i=0, j=_init.zTreeTools.length; i<j; i++) {
				_init.zTreeTools[i].apply(this, arguments);
			}
		},
		transformToArrayFormat: function (setting, nodes) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			r = [];
			if (tools.isArray(nodes)) {
				for (var i=0, l=nodes.length; i<l; i++) {
					r.push(nodes[i]);
					if (nodes[i][childKey])
						r = r.concat(data.transformToArrayFormat(setting, nodes[i][childKey]));
				}
			} else {
				r.push(nodes);
				if (nodes[childKey])
					r = r.concat(data.transformToArrayFormat(setting, nodes[childKey]));
			}
			return r;
		},
		transformTozTreeFormat: function(setting, sNodes) {
			var i,l,
			key = setting.data.simpleData.idKey,
			parentKey = setting.data.simpleData.pIdKey,
			childKey = setting.data.key.children;
			if (!key || key=="" || !sNodes) return [];

			if (tools.isArray(sNodes)) {
				var r = [];
				var tmpMap = [];
				for (i=0, l=sNodes.length; i<l; i++) {
					tmpMap[sNodes[i][key]] = sNodes[i];
				}
				for (i=0, l=sNodes.length; i<l; i++) {
					if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
						if (!tmpMap[sNodes[i][parentKey]][childKey])
							tmpMap[sNodes[i][parentKey]][childKey] = [];
						tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
					} else {
						r.push(sNodes[i]);
					}
				}
				return r;
			}else {
				return [sNodes];
			}
		}
	},
	//method of event proxy
	event = {
		bindEvent: function(setting) {
			for (var i=0, j=_init.bind.length; i<j; i++) {
				_init.bind[i].apply(this, arguments);
			}
		},
		unbindEvent: function(setting) {
			for (var i=0, j=_init.unbind.length; i<j; i++) {
				_init.unbind[i].apply(this, arguments);
			}
		},
		bindTree: function(setting) {
			var eventParam = {
				treeId: setting.treeId
			},
			o = setting.treeObj;
			if (!setting.view.txtSelectedEnable) {
				// for can't select text
				o.bind('selectstart', handler.onSelectStart).css({
					"-moz-user-select":"-moz-none"
				});
			}
			o.bind('click', eventParam, event.proxy);
			o.bind('dblclick', eventParam, event.proxy);
			o.bind('mouseover', eventParam, event.proxy);
			o.bind('mouseout', eventParam, event.proxy);
			o.bind('mousedown', eventParam, event.proxy);
			o.bind('mouseup', eventParam, event.proxy);
			o.bind('contextmenu', eventParam, event.proxy);
		},
		unbindTree: function(setting) {
			var o = setting.treeObj;
			o.unbind('selectstart', handler.onSelectStart)
				.unbind('click', event.proxy)
				.unbind('dblclick', event.proxy)
				.unbind('mouseover', event.proxy)
				.unbind('mouseout', event.proxy)
				.unbind('mousedown', event.proxy)
				.unbind('mouseup', event.proxy)
				.unbind('contextmenu', event.proxy);
		},
		doProxy: function(e) {
			var results = [];
			for (var i=0, j=_init.proxys.length; i<j; i++) {
				var proxyResult = _init.proxys[i].apply(this, arguments);
				results.push(proxyResult);
				if (proxyResult.stop) {
					break;
				}
			}
			return results;
		},
		proxy: function(e) {
			var setting = data.getSetting(e.data.treeId);
			if (!tools.uCanDo(setting, e)) return true;
			var results = event.doProxy(e),
			r = true, x = false;
			for (var i=0, l=results.length; i<l; i++) {
				var proxyResult = results[i];
				if (proxyResult.nodeEventCallback) {
					x = true;
					r = proxyResult.nodeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
				if (proxyResult.treeEventCallback) {
					x = true;
					r = proxyResult.treeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
			}
			return r;
		}
	},
	//method of event handler
	handler = {
		onSwitchNode: function (event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (node.open) {
				if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			} else {
				if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			}
			return true;
		},
		onClickNode: function (event, node) {
			var setting = data.getSetting(event.data.treeId),
			clickFlag = ( (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey)) && data.isSelectedNode(setting, node)) ? 0 : (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey) && setting.view.selectedMulti) ? 2 : 1;
			if (tools.apply(setting.callback.beforeClick, [setting.treeId, node, clickFlag], true) == false) return true;
			if (clickFlag === 0) {
				view.cancelPreSelectedNode(setting, node);
			} else {
				view.selectNode(setting, node, clickFlag === 2);
			}
			setting.treeObj.trigger(consts.event.CLICK, [event, setting.treeId, node, clickFlag]);
			return true;
		},
		onZTreeMousedown: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeMouseup: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeDblclick: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeDblClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onDblClick, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeContextmenu: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onRightClick, [event, setting.treeId, node]);
			}
			return (typeof setting.callback.onRightClick) != "function";
		},
		onSelectStart: function(e){
			var n = e.originalEvent.srcElement.nodeName.toLowerCase();
			return (n === "input" || n === "textarea" );
		}
	},
	//method of tools for zTree
	tools = {
		apply: function(fun, param, defaultValue) {
			if ((typeof fun) == "function") {
				return fun.apply(zt, param?param:[]);
			}
			return defaultValue;
		},
		canAsync: function(setting, node) {
			var childKey = setting.data.key.children;
			return (setting.async.enable && node && node.isParent && !(node.zAsync || (node[childKey] && node[childKey].length > 0)));
		},
		clone: function (obj){
			if (obj === null) return null;
			var o = tools.isArray(obj) ? [] : {};
			for(var i in obj){
				o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? arguments.callee(obj[i]) : obj[i]);
			}
			return o;
		},
		eqs: function(str1, str2) {
			return str1.toLowerCase() === str2.toLowerCase();
		},
		isArray: function(arr) {
			return Object.prototype.toString.apply(arr) === "[object Array]";
		},
		$: function(node, exp, setting) {
			if (!!exp && typeof exp != "string") {
				setting = exp;
				exp = "";
			}
			if (typeof node == "string") {
				return $(node, setting ? setting.treeObj.get(0).ownerDocument : null);
			} else {
				return $("#" + node.tId + exp, setting ? setting.treeObj : null);
			}
		},
		getMDom: function (setting, curDom, targetExpr) {
			if (!curDom) return null;
			while (curDom && curDom.id !== setting.treeId) {
				for (var i=0, l=targetExpr.length; curDom.tagName && i<l; i++) {
					if (tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
						return curDom;
					}
				}
				curDom = curDom.parentNode;
			}
			return null;
		},
		getNodeMainDom:function(target) {
			return ($(target).parent("li").get(0) || $(target).parentsUntil("li").parent().get(0));
		},
		isChildOrSelf: function(dom, parentId) {
			return ( $(dom).closest("#" + parentId).length> 0 );
		},
		uCanDo: function(setting, e) {
			return true;
		}
	},
	//method of operate ztree dom
	view = {
		addNodes: function(setting, parentNode, index, newNodes, isSilent) {
			if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
				return;
			}
			if (!tools.isArray(newNodes)) {
				newNodes = [newNodes];
			}
			if (setting.data.simpleData.enable) {
				newNodes = data.transformTozTreeFormat(setting, newNodes);
			}
			if (parentNode) {
				var target_switchObj = $$(parentNode, consts.id.SWITCH, setting),
				target_icoObj = $$(parentNode, consts.id.ICON, setting),
				target_ulObj = $$(parentNode, consts.id.UL, setting);

				if (!parentNode.open) {
					view.replaceSwitchClass(parentNode, target_switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(parentNode, target_icoObj, consts.folder.CLOSE);
					parentNode.open = false;
					target_ulObj.css({
						"display": "none"
					});
				}

				data.addNodesData(setting, parentNode, index, newNodes);
				view.createNodes(setting, parentNode.level + 1, newNodes, parentNode, index);
				if (!isSilent) {
					view.expandCollapseParentNode(setting, parentNode, true);
				}
			} else {
				data.addNodesData(setting, data.getRoot(setting), index, newNodes);
				view.createNodes(setting, 0, newNodes, null, index);
			}
		},
		appendNodes: function(setting, level, nodes, parentNode, index, initFlag, openFlag) {
			if (!nodes) return [];
			var html = [],
			childKey = setting.data.key.children;

			var tmpPNode = (parentNode) ? parentNode: data.getRoot(setting),
				tmpPChild = tmpPNode[childKey],
				isFirstNode, isLastNode;

			if (!tmpPChild || index >= tmpPChild.length) {
				index = -1;
			}

			for (var i = 0, l = nodes.length; i < l; i++) {
				var node = nodes[i];
				if (initFlag) {
					isFirstNode = ((index===0 || tmpPChild.length == nodes.length) && (i == 0));
					isLastNode = (index < 0 && i == (nodes.length - 1));
					data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
					data.addNodeCache(setting, node);
				}

				var childHtml = [];
				if (node[childKey] && node[childKey].length > 0) {
					//make child html first, because checkType
					childHtml = view.appendNodes(setting, level + 1, node[childKey], node, -1, initFlag, openFlag && node.open);
				}
				if (openFlag) {

					view.makeDOMNodeMainBefore(html, setting, node);
					view.makeDOMNodeLine(html, setting, node);
					data.getBeforeA(setting, node, html);
					view.makeDOMNodeNameBefore(html, setting, node);
					data.getInnerBeforeA(setting, node, html);
					view.makeDOMNodeIcon(html, setting, node);
					data.getInnerAfterA(setting, node, html);
					view.makeDOMNodeNameAfter(html, setting, node);
					data.getAfterA(setting, node, html);
					if (node.isParent && node.open) {
						view.makeUlHtml(setting, node, html, childHtml.join(''));
					}
					view.makeDOMNodeMainAfter(html, setting, node);
					data.addCreatedNode(setting, node);
				}
			}
			return html;
		},
		appendParentULDom: function(setting, node) {
			var html = [],
			nObj = $$(node, setting);
			if (!nObj.get(0) && !!node.parentTId) {
				view.appendParentULDom(setting, node.getParentNode());
				nObj = $$(node, setting);
			}
			var ulObj = $$(node, consts.id.UL, setting);
			if (ulObj.get(0)) {
				ulObj.remove();
			}
			var childKey = setting.data.key.children,
			childHtml = view.appendNodes(setting, node.level+1, node[childKey], node, -1, false, true);
			view.makeUlHtml(setting, node, html, childHtml.join(''));
			nObj.append(html.join(''));
		},
		asyncNode: function(setting, node, isSilent, callback) {
			var i, l;
			if (node && !node.isParent) {
				tools.apply(callback);
				return false;
			} else if (node && node.isAjaxing) {
				return false;
			} else if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) == false) {
				tools.apply(callback);
				return false;
			}
			if (node) {
				node.isAjaxing = true;
				var icoObj = $$(node, consts.id.ICON, setting);
				icoObj.attr({"style":"", "class":consts.className.BUTTON + " " + consts.className.ICO_LOADING});
			}

			var tmpParam = {};
			for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
				var pKey = setting.async.autoParam[i].split("="), spKey = pKey;
				if (pKey.length>1) {
					spKey = pKey[1];
					pKey = pKey[0];
				}
				tmpParam[spKey] = node[pKey];
			}
			if (tools.isArray(setting.async.otherParam)) {
				for (i = 0, l = setting.async.otherParam.length; i < l; i += 2) {
					tmpParam[setting.async.otherParam[i]] = setting.async.otherParam[i + 1];
				}
			} else {
				for (var p in setting.async.otherParam) {
					tmpParam[p] = setting.async.otherParam[p];
				}
			}

			var _tmpV = data.getRoot(setting)._ver;
			$.ajax({
				contentType: setting.async.contentType,
                cache: false,
				type: setting.async.type,
				url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
				data: tmpParam,
				dataType: setting.async.dataType,
				success: function(msg) {
					if (_tmpV != data.getRoot(setting)._ver) {
						return;
					}
					var newNodes = [];
					try {
						if (!msg || msg.length == 0) {
							newNodes = [];
						} else if (typeof msg == "string") {
							newNodes = eval("(" + msg + ")");
						} else {
							newNodes = msg;
						}
					} catch(err) {
						newNodes = msg;
					}

					if (node) {
						node.isAjaxing = null;
						node.zAsync = true;
					}
					view.setNodeLineIcos(setting, node);
					if (newNodes && newNodes !== "") {
						newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
						view.addNodes(setting, node, -1, !!newNodes ? tools.clone(newNodes) : [], !!isSilent);
					} else {
						view.addNodes(setting, node, -1, [], !!isSilent);
					}
					setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
					tools.apply(callback);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (_tmpV != data.getRoot(setting)._ver) {
						return;
					}
					if (node) node.isAjaxing = null;
					view.setNodeLineIcos(setting, node);
					setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
				}
			});
			return true;
		},
		cancelPreSelectedNode: function (setting, node, excludeNode) {
			var list = data.getRoot(setting).curSelectedList,
				i, n;
			for (i=list.length-1; i>=0; i--) {
				n = list[i];
				if (node === n || (!node && (!excludeNode || excludeNode !== n))) {
					$$(n, consts.id.A, setting).removeClass(consts.node.CURSELECTED);
					if (node) {
						data.removeSelectedNode(setting, node);
						break;
					} else {
						list.splice(i, 1);
						setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, n]);
					}
				}
			}
		},
		createNodeCallback: function(setting) {
			if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
				var root = data.getRoot(setting);
				while (root.createdNodes.length>0) {
					var node = root.createdNodes.shift();
					tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
					if (!!setting.callback.onNodeCreated) {
						setting.treeObj.trigger(consts.event.NODECREATED, [setting.treeId, node]);
					}
				}
			}
		},
		createNodes: function(setting, level, nodes, parentNode, index) {
			if (!nodes || nodes.length == 0) return;
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			openFlag = !parentNode || parentNode.open || !!$$(parentNode[childKey][0], setting).get(0);
			root.createdNodes = [];
			var zTreeHtml = view.appendNodes(setting, level, nodes, parentNode, index, true, openFlag),
				parentObj, nextObj;

			if (!parentNode) {
				parentObj = setting.treeObj;
				//setting.treeObj.append(zTreeHtml.join(''));
			} else {
				var ulObj = $$(parentNode, consts.id.UL, setting);
				if (ulObj.get(0)) {
					parentObj = ulObj;
					//ulObj.append(zTreeHtml.join(''));
				}
			}
			if (parentObj) {
				if (index >= 0) {
					nextObj = parentObj.children()[index];
				}
				if (index >=0 && nextObj) {
					$(nextObj).before(zTreeHtml.join(''));
				} else {
					parentObj.append(zTreeHtml.join(''));
				}
			}

			view.createNodeCallback(setting);
		},
		destroy: function(setting) {
			if (!setting) return;
			data.initCache(setting);
			data.initRoot(setting);
			event.unbindTree(setting);
			event.unbindEvent(setting);
			setting.treeObj.empty();
			delete settings[setting.treeId];
		},
		expandCollapseNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			if (!node) {
				tools.apply(callback, []);
				return;
			}
			if (root.expandTriggerFlag) {
				var _callback = callback;
				callback = function(){
					if (_callback) _callback();
					if (node.open) {
						setting.treeObj.trigger(consts.event.EXPAND, [setting.treeId, node]);
					} else {
						setting.treeObj.trigger(consts.event.COLLAPSE, [setting.treeId, node]);
					}
				};
				root.expandTriggerFlag = false;
			}
			if (!node.open && node.isParent && ((!$$(node, consts.id.UL, setting).get(0)) || (node[childKey] && node[childKey].length>0 && !$$(node[childKey][0], setting).get(0)))) {
				view.appendParentULDom(setting, node);
				view.createNodeCallback(setting);
			}
			if (node.open == expandFlag) {
				tools.apply(callback, []);
				return;
			}
			var ulObj = $$(node, consts.id.UL, setting),
			switchObj = $$(node, consts.id.SWITCH, setting),
			icoObj = $$(node, consts.id.ICON, setting);

			if (node.isParent) {
				node.open = !node.open;
				if (node.iconOpen && node.iconClose) {
					icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
				}

				if (node.open) {
					view.replaceSwitchClass(node, switchObj, consts.folder.OPEN);
					view.replaceIcoClass(node, icoObj, consts.folder.OPEN);
					if (animateFlag == false || setting.view.expandSpeed == "") {
						ulObj.show();
						tools.apply(callback, []);
					} else {
						if (node[childKey] && node[childKey].length > 0) {
							ulObj.slideDown(setting.view.expandSpeed, callback);
						} else {
							ulObj.show();
							tools.apply(callback, []);
						}
					}
				} else {
					view.replaceSwitchClass(node, switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(node, icoObj, consts.folder.CLOSE);
					if (animateFlag == false || setting.view.expandSpeed == "" || !(node[childKey] && node[childKey].length > 0)) {
						ulObj.hide();
						tools.apply(callback, []);
					} else {
						ulObj.slideUp(setting.view.expandSpeed, callback);
					}
				}
			} else {
				tools.apply(callback, []);
			}
		},
		expandCollapseParentNode: function(setting, node, expandFlag, animateFlag, callback) {
			if (!node) return;
			if (!node.parentTId) {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
				return;
			} else {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag);
			}
			if (node.parentTId) {
				view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback);
			}
		},
		expandCollapseSonNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			treeNodes = (node) ? node[childKey]: root[childKey],
			selfAnimateSign = (node) ? false : animateFlag,
			expandTriggerFlag = data.getRoot(setting).expandTriggerFlag;
			data.getRoot(setting).expandTriggerFlag = false;
			if (treeNodes) {
				for (var i = 0, l = treeNodes.length; i < l; i++) {
					if (treeNodes[i]) view.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign);
				}
			}
			data.getRoot(setting).expandTriggerFlag = expandTriggerFlag;
			view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback );
		},
		isSelectedNode: function (setting, node) {
			if (!node) {
				return false;
			}
			var list = data.getRoot(setting).curSelectedList,
				i;
			for (i=list.length-1; i>=0; i--) {
				if (node === list[i]) {
					return true;
				}
			}
			return false;
		},
		makeDOMNodeIcon: function(html, setting, node) {
			var nameStr = data.getNodeName(setting, node),
			name = setting.view.nameIsHTML ? nameStr : nameStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			html.push("<span id='", node.tId, consts.id.ICON,
				"' title='' treeNode", consts.id.ICON," class='", view.makeNodeIcoClass(setting, node),
				"' style='", view.makeNodeIcoStyle(setting, node), "'></span><span id='", node.tId, consts.id.SPAN,
				"' class='", consts.className.NAME,
				"'>",name,"</span>");
		},
		makeDOMNodeLine: function(html, setting, node) {
			html.push("<span id='", node.tId, consts.id.SWITCH,	"' title='' class='", view.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH,"></span>");
		},
		makeDOMNodeMainAfter: function(html, setting, node) {
			html.push("</li>");
		},
		makeDOMNodeMainBefore: function(html, setting, node) {
			html.push("<li id='", node.tId, "' class='", consts.className.LEVEL, node.level,"' tabindex='0' hidefocus='true' treenode>");
		},
		makeDOMNodeNameAfter: function(html, setting, node) {
			html.push("</a>");
		},
		makeDOMNodeNameBefore: function(html, setting, node) {
			var title = data.getNodeTitle(setting, node),
			url = view.makeNodeUrl(setting, node),
			fontcss = view.makeNodeFontCss(setting, node),
			fontStyle = [];
			for (var f in fontcss) {
				fontStyle.push(f, ":", fontcss[f], ";");
			}
			html.push("<a id='", node.tId, consts.id.A, "' class='", consts.className.LEVEL, node.level,"' treeNode", consts.id.A," onclick=\"", (node.click || ''),
				"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''),
				"'");
			if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && title) {html.push("title='", title.replace(/'/g,"&#39;").replace(/</g,'&lt;').replace(/>/g,'&gt;'),"'");}
			html.push(">");
		},
		makeNodeFontCss: function(setting, node) {
			var fontCss = tools.apply(setting.view.fontCss, [setting.treeId, node], setting.view.fontCss);
			return (fontCss && ((typeof fontCss) != "function")) ? fontCss : {};
		},
		makeNodeIcoClass: function(setting, node) {
			var icoCss = ["ico"];
			if (!node.isAjaxing) {
				icoCss[0] = (node.iconSkin ? node.iconSkin + "_" : "") + icoCss[0];
				if (node.isParent) {
					icoCss.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
				} else {
					icoCss.push(consts.folder.DOCU);
				}
			}
			return consts.className.BUTTON + " " + icoCss.join('_');
		},
		makeNodeIcoStyle: function(setting, node) {
			var icoStyle = [];
			if (!node.isAjaxing) {
				var icon = (node.isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node[setting.data.key.icon];
				if (icon) icoStyle.push("background:url(", icon, ") 0 0 no-repeat;");
				if (setting.view.showIcon == false || !tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
					icoStyle.push("width:0px;height:0px;");
				}
			}
			return icoStyle.join('');
		},
		makeNodeLineClass: function(setting, node) {
			var lineClass = [];
			if (setting.view.showLine) {
				if (node.level == 0 && node.isFirstNode && node.isLastNode) {
					lineClass.push(consts.line.ROOT);
				} else if (node.level == 0 && node.isFirstNode) {
					lineClass.push(consts.line.ROOTS);
				} else if (node.isLastNode) {
					lineClass.push(consts.line.BOTTOM);
				} else {
					lineClass.push(consts.line.CENTER);
				}
			} else {
				lineClass.push(consts.line.NOLINE);
			}
			if (node.isParent) {
				lineClass.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
			} else {
				lineClass.push(consts.folder.DOCU);
			}
			return view.makeNodeLineClassEx(node) + lineClass.join('_');
		},
		makeNodeLineClassEx: function(node) {
			return consts.className.BUTTON + " " + consts.className.LEVEL + node.level + " " + consts.className.SWITCH + " ";
		},
		makeNodeTarget: function(node) {
			return (node.target || "_blank");
		},
		makeNodeUrl: function(setting, node) {
			var urlKey = setting.data.key.url;
			return node[urlKey] ? node[urlKey] : null;
		},
		makeUlHtml: function(setting, node, html, content) {
			html.push("<ul id='", node.tId, consts.id.UL, "' class='", consts.className.LEVEL, node.level, " ", view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
			html.push(content);
			html.push("</ul>");
		},
		makeUlLineClass: function(setting, node) {
			return ((setting.view.showLine && !node.isLastNode) ? consts.line.LINE : "");
		},
		removeChildNodes: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children,
			nodes = node[childKey];
			if (!nodes) return;

			for (var i = 0, l = nodes.length; i < l; i++) {
				data.removeNodeCache(setting, nodes[i]);
			}
			data.removeSelectedNode(setting);
			delete node[childKey];

			if (!setting.data.keep.parent) {
				node.isParent = false;
				node.open = false;
				var tmp_switchObj = $$(node, consts.id.SWITCH, setting),
				tmp_icoObj = $$(node, consts.id.ICON, setting);
				view.replaceSwitchClass(node, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(node, tmp_icoObj, consts.folder.DOCU);
				$$(node, consts.id.UL, setting).remove();
			} else {
				$$(node, consts.id.UL, setting).empty();
			}
		},
		setFirstNode: function(setting, parentNode) {
			var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
			if ( childLength > 0) {
				parentNode[childKey][0].isFirstNode = true;
			}
		},
		setLastNode: function(setting, parentNode) {
			var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
			if ( childLength > 0) {
				parentNode[childKey][childLength - 1].isLastNode = true;
			}
		},
		removeNode: function(setting, node) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			parentNode = (node.parentTId) ? node.getParentNode() : root;

			node.isFirstNode = false;
			node.isLastNode = false;
			node.getPreNode = function() {return null;};
			node.getNextNode = function() {return null;};

			if (!data.getNodeCache(setting, node.tId)) {
				return;
			}

			$$(node, setting).remove();
			data.removeNodeCache(setting, node);
			data.removeSelectedNode(setting, node);

			for (var i = 0, l = parentNode[childKey].length; i < l; i++) {
				if (parentNode[childKey][i].tId == node.tId) {
					parentNode[childKey].splice(i, 1);
					break;
				}
			}
			view.setFirstNode(setting, parentNode);
			view.setLastNode(setting, parentNode);

			var tmp_ulObj,tmp_switchObj,tmp_icoObj,
			childLength = parentNode[childKey].length;

			//repair nodes old parent
			if (!setting.data.keep.parent && childLength == 0) {
				//old parentNode has no child nodes
				parentNode.isParent = false;
				parentNode.open = false;
				tmp_ulObj = $$(parentNode, consts.id.UL, setting);
				tmp_switchObj = $$(parentNode, consts.id.SWITCH, setting);
				tmp_icoObj = $$(parentNode, consts.id.ICON, setting);
				view.replaceSwitchClass(parentNode, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(parentNode, tmp_icoObj, consts.folder.DOCU);
				tmp_ulObj.css("display", "none");

			} else if (setting.view.showLine && childLength > 0) {
				//old parentNode has child nodes
				var newLast = parentNode[childKey][childLength - 1];
				tmp_ulObj = $$(newLast, consts.id.UL, setting);
				tmp_switchObj = $$(newLast, consts.id.SWITCH, setting);
				tmp_icoObj = $$(newLast, consts.id.ICON, setting);
				if (parentNode == root) {
					if (parentNode[childKey].length == 1) {
						//node was root, and ztree has only one root after move node
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.ROOT);
					} else {
						var tmp_first_switchObj = $$(parentNode[childKey][0], consts.id.SWITCH, setting);
						view.replaceSwitchClass(parentNode[childKey][0], tmp_first_switchObj, consts.line.ROOTS);
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
					}
				} else {
					view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
				}
				tmp_ulObj.removeClass(consts.line.LINE);
			}
		},
		replaceIcoClass: function(node, obj, newName) {
			if (!obj || node.isAjaxing) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[tmpList.length-1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
		},
		replaceSwitchClass: function(node, obj, newName) {
			if (!obj) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.line.ROOT:
				case consts.line.ROOTS:
				case consts.line.CENTER:
				case consts.line.BOTTOM:
				case consts.line.NOLINE:
					tmpList[0] = view.makeNodeLineClassEx(node) + newName;
					break;
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
			if (newName !== consts.folder.DOCU) {
				obj.removeAttr("disabled");
			} else {
				obj.attr("disabled", "disabled");
			}
		},
		selectNode: function(setting, node, addFlag) {
			if (!addFlag) {
				view.cancelPreSelectedNode(setting, null, node);
			}
			$$(node, consts.id.A, setting).addClass(consts.node.CURSELECTED);
			data.addSelectedNode(setting, node);
			setting.treeObj.trigger(consts.event.SELECTED, [setting.treeId, node]);
		},
		setNodeFontCss: function(setting, treeNode) {
			var aObj = $$(treeNode, consts.id.A, setting),
			fontCss = view.makeNodeFontCss(setting, treeNode);
			if (fontCss) {
				aObj.css(fontCss);
			}
		},
		setNodeLineIcos: function(setting, node) {
			if (!node) return;
			var switchObj = $$(node, consts.id.SWITCH, setting),
			ulObj = $$(node, consts.id.UL, setting),
			icoObj = $$(node, consts.id.ICON, setting),
			ulLine = view.makeUlLineClass(setting, node);
			if (ulLine.length==0) {
				ulObj.removeClass(consts.line.LINE);
			} else {
				ulObj.addClass(ulLine);
			}
			switchObj.attr("class", view.makeNodeLineClass(setting, node));
			if (node.isParent) {
				switchObj.removeAttr("disabled");
			} else {
				switchObj.attr("disabled", "disabled");
			}
			icoObj.removeAttr("style");
			icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
			icoObj.attr("class", view.makeNodeIcoClass(setting, node));
		},
		setNodeName: function(setting, node) {
			var title = data.getNodeTitle(setting, node),
			nObj = $$(node, consts.id.SPAN, setting);
			nObj.empty();
			if (setting.view.nameIsHTML) {
				nObj.html(data.getNodeName(setting, node));
			} else {
				nObj.text(data.getNodeName(setting, node));
			}
			if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle)) {
				var aObj = $$(node, consts.id.A, setting);
				aObj.attr("title", !title ? "" : title);
			}
		},
		setNodeTarget: function(setting, node) {
			var aObj = $$(node, consts.id.A, setting);
			aObj.attr("target", view.makeNodeTarget(node));
		},
		setNodeUrl: function(setting, node) {
			var aObj = $$(node, consts.id.A, setting),
			url = view.makeNodeUrl(setting, node);
			if (url == null || url.length == 0) {
				aObj.removeAttr("href");
			} else {
				aObj.attr("href", url);
			}
		},
		switchNode: function(setting, node) {
			if (node.open || !tools.canAsync(setting, node)) {
				view.expandCollapseNode(setting, node, !node.open);
			} else if (setting.async.enable) {
				if (!view.asyncNode(setting, node)) {
					view.expandCollapseNode(setting, node, !node.open);
					return;
				}
			} else if (node) {
				view.expandCollapseNode(setting, node, !node.open);
			}
		}
	};
	// zTree defind
	$.fn.zTree = {
		consts : _consts,
		_z : {
			tools: tools,
			view: view,
			event: event,
			data: data
		},
		getZTreeObj: function(treeId) {
			var o = data.getZTreeTools(treeId);
			return o ? o : null;
		},
		destroy: function(treeId) {
			if (!!treeId && treeId.length > 0) {
				view.destroy(data.getSetting(treeId));
			} else {
				for(var s in settings) {
					view.destroy(settings[s]);
				}
			}
		},
		init: function(obj, zSetting, zNodes) {
			var setting = tools.clone(_setting);
			$.extend(true, setting, zSetting);
			setting.treeId = obj.attr("id");
			setting.treeObj = obj;
			setting.treeObj.empty();
			settings[setting.treeId] = setting;
			//For some older browser,(e.g., ie6)
			if(typeof document.body.style.maxHeight === "undefined") {
				setting.view.expandSpeed = "";
			}
			data.initRoot(setting);
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			zNodes = zNodes ? tools.clone(tools.isArray(zNodes)? zNodes : [zNodes]) : [];
			if (setting.data.simpleData.enable) {
				root[childKey] = data.transformTozTreeFormat(setting, zNodes);
			} else {
				root[childKey] = zNodes;
			}

			data.initCache(setting);
			event.unbindTree(setting);
			event.bindTree(setting);
			event.unbindEvent(setting);
			event.bindEvent(setting);

			var zTreeTools = {
				setting : setting,
				addNodes : function(parentNode, index, newNodes, isSilent) {
					if (!parentNode) parentNode = null;
					if (parentNode && !parentNode.isParent && setting.data.keep.leaf) return null;

					var i = parseInt(index, 10);
					if (isNaN(i)) {
						isSilent = !!newNodes;
						newNodes = index;
						index = -1;
					} else {
						index = i;
					}
					if (!newNodes) return null;


					var xNewNodes = tools.clone(tools.isArray(newNodes)? newNodes: [newNodes]);
					function addCallback() {
						view.addNodes(setting, parentNode, index, xNewNodes, (isSilent==true));
					}

					if (tools.canAsync(setting, parentNode)) {
						view.asyncNode(setting, parentNode, isSilent, addCallback);
					} else {
						addCallback();
					}
					return xNewNodes;
				},
				cancelSelectedNode : function(node) {
					view.cancelPreSelectedNode(setting, node);
				},
				destroy : function() {
					view.destroy(setting);
				},
				expandAll : function(expandFlag) {
					expandFlag = !!expandFlag;
					view.expandCollapseSonNode(setting, null, expandFlag, true);
					return expandFlag;
				},
				expandNode : function(node, expandFlag, sonSign, focus, callbackFlag) {
					if (!node || !node.isParent) return null;
					if (expandFlag !== true && expandFlag !== false) {
						expandFlag = !node.open;
					}
					callbackFlag = !!callbackFlag;

					if (callbackFlag && expandFlag && (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false)) {
						return null;
					} else if (callbackFlag && !expandFlag && (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false)) {
						return null;
					}
					if (expandFlag && node.parentTId) {
						view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, false);
					}
					if (expandFlag === node.open && !sonSign) {
						return null;
					}

					data.getRoot(setting).expandTriggerFlag = callbackFlag;
					if (!tools.canAsync(setting, node) && sonSign) {
						view.expandCollapseSonNode(setting, node, expandFlag, true, function() {
							if (focus !== false) {try{$$(node, setting).focus().blur();}catch(e){}}
						});
					} else {
						node.open = !expandFlag;
						view.switchNode(this.setting, node);
						if (focus !== false) {try{$$(node, setting).focus().blur();}catch(e){}}
					}
					return expandFlag;
				},
				getNodes : function() {
					return data.getNodes(setting);
				},
				getNodeByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodeByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodeByTId : function(tId) {
					return data.getNodeCache(setting, tId);
				},
				getNodesByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodesByParamFuzzy : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParamFuzzy(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodesByFilter: function(filter, isSingle, parentNode, invokeParam) {
					isSingle = !!isSingle;
					if (!filter || (typeof filter != "function")) return (isSingle ? null : []);
					return data.getNodesByFilter(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), filter, isSingle, invokeParam);
				},
				getNodeIndex : function(node) {
					if (!node) return null;
					var childKey = setting.data.key.children,
					parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
					for (var i=0, l = parentNode[childKey].length; i < l; i++) {
						if (parentNode[childKey][i] == node) return i;
					}
					return -1;
				},
				getSelectedNodes : function() {
					var r = [], list = data.getRoot(setting).curSelectedList;
					for (var i=0, l=list.length; i<l; i++) {
						r.push(list[i]);
					}
					return r;
				},
				isSelectedNode : function(node) {
					return data.isSelectedNode(setting, node);
				},
				reAsyncChildNodes : function(parentNode, reloadType, isSilent) {
					if (!this.setting.async.enable) return;
					var isRoot = !parentNode;
					if (isRoot) {
						parentNode = data.getRoot(setting);
					}
					if (reloadType=="refresh") {
						var childKey = this.setting.data.key.children;
						for (var i = 0, l = parentNode[childKey] ? parentNode[childKey].length : 0; i < l; i++) {
							data.removeNodeCache(setting, parentNode[childKey][i]);
						}
						data.removeSelectedNode(setting);
						parentNode[childKey] = [];
						if (isRoot) {
							this.setting.treeObj.empty();
						} else {
							var ulObj = $$(parentNode, consts.id.UL, setting);
							ulObj.empty();
						}
					}
					view.asyncNode(this.setting, isRoot? null:parentNode, !!isSilent);
				},
				refresh : function() {
					this.setting.treeObj.empty();
					var root = data.getRoot(setting),
					nodes = root[setting.data.key.children]
					data.initRoot(setting);
					root[setting.data.key.children] = nodes
					data.initCache(setting);
					view.createNodes(setting, 0, root[setting.data.key.children], null, -1);
				},
				removeChildNodes : function(node) {
					if (!node) return null;
					var childKey = setting.data.key.children,
					nodes = node[childKey];
					view.removeChildNodes(setting, node);
					return nodes ? nodes : null;
				},
				removeNode : function(node, callbackFlag) {
					if (!node) return;
					callbackFlag = !!callbackFlag;
					if (callbackFlag && tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return;
					view.removeNode(setting, node);
					if (callbackFlag) {
						this.setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
					}
				},
				selectNode : function(node, addFlag) {
					if (!node) return;
					if (tools.uCanDo(setting)) {
						addFlag = setting.view.selectedMulti && addFlag;
						if (node.parentTId) {
							view.expandCollapseParentNode(setting, node.getParentNode(), true, false, function() {
								try{$$(node, setting).focus().blur();}catch(e){}
							});
						} else {
							try{$$(node, setting).focus().blur();}catch(e){}
						}
						view.selectNode(setting, node, addFlag);
					}
				},
				transformTozTreeNodes : function(simpleNodes) {
					return data.transformTozTreeFormat(setting, simpleNodes);
				},
				transformToArray : function(nodes) {
					return data.transformToArrayFormat(setting, nodes);
				},
				updateNode : function(node, checkTypeFlag) {
					if (!node) return;
					var nObj = $$(node, setting);
					if (nObj.get(0) && tools.uCanDo(setting)) {
						view.setNodeName(setting, node);
						view.setNodeTarget(setting, node);
						view.setNodeUrl(setting, node);
						view.setNodeLineIcos(setting, node);
						view.setNodeFontCss(setting, node);
					}
				}
			}
			root.treeTools = zTreeTools;
			data.setZTreeTools(setting, zTreeTools);

			if (root[childKey] && root[childKey].length > 0) {
				view.createNodes(setting, 0, root[childKey], null, -1);
			} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
				view.asyncNode(setting);
			}
			return zTreeTools;
		}
	};

	var zt = $.fn.zTree,
	$$ = tools.$,
	consts = zt.consts;
})(jQuery);
/*
 * JQuery zTree excheck v3.5.19.2
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-11-15
 */
(function($){
	//default consts of excheck
	var _consts = {
		event: {
			CHECK: "ztree_check"
		},
		id: {
			CHECK: "_check"
		},
		checkbox: {
			STYLE: "checkbox",
			DEFAULT: "chk",
			DISABLED: "disable",
			FALSE: "false",
			TRUE: "true",
			FULL: "full",
			PART: "part",
			FOCUS: "focus"
		},
		radio: {
			STYLE: "radio",
			TYPE_ALL: "all",
			TYPE_LEVEL: "level"
		}
	},
	//default setting of excheck
	_setting = {
		check: {
			enable: false,
			autoCheckTrigger: false,
			chkStyle: _consts.checkbox.STYLE,
			nocheckInherit: false,
			chkDisabledInherit: false,
			radioType: _consts.radio.TYPE_LEVEL,
			chkboxType: {
				"Y": "ps",
				"N": "ps"
			}
		},
		data: {
			key: {
				checked: "checked"
			}
		},
		callback: {
			beforeCheck:null,
			onCheck:null
		}
	},
	//default root of excheck
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		r.radioCheckedList = [];
	},
	//default cache of excheck
	_initCache = function(treeId) {},
	//default bind event of excheck
	_bindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.bind(c.CHECK, function (event, srcEvent, treeId, node) {
			event.srcEvent = srcEvent;
			tools.apply(setting.callback.onCheck, [event, treeId, node]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.unbind(c.CHECK);
	},
	//default event proxy of excheck
	_eventProxy = function(e) {
		var target = e.target,
		setting = data.getSetting(e.data.treeId),
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null;

		if (tools.eqs(e.type, "mouseover")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "mouseoverCheck";
			}
		} else if (tools.eqs(e.type, "mouseout")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "mouseoutCheck";
			}
		} else if (tools.eqs(e.type, "click")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "checkNode";
			}
		}
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "checkNode" :
					nodeEventCallback = _handler.onCheckNode;
					break;
				case "mouseoverCheck" :
					nodeEventCallback = _handler.onMouseoverCheck;
					break;
				case "mouseoutCheck" :
					nodeEventCallback = _handler.onMouseoutCheck;
					break;
			}
		}
		var proxyResult = {
			stop: nodeEventType === "checkNode",
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of excheck
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		var checkedKey = setting.data.key.checked;
		if (typeof n[checkedKey] == "string") n[checkedKey] = tools.eqs(n[checkedKey], "true");
		n[checkedKey] = !!n[checkedKey];
		n.checkedOld = n[checkedKey];
		if (typeof n.nocheck == "string") n.nocheck = tools.eqs(n.nocheck, "true");
		n.nocheck = !!n.nocheck || (setting.check.nocheckInherit && parentNode && !!parentNode.nocheck);
		if (typeof n.chkDisabled == "string") n.chkDisabled = tools.eqs(n.chkDisabled, "true");
		n.chkDisabled = !!n.chkDisabled || (setting.check.chkDisabledInherit && parentNode && !!parentNode.chkDisabled);
		if (typeof n.halfCheck == "string") n.halfCheck = tools.eqs(n.halfCheck, "true");
		n.halfCheck = !!n.halfCheck;
		n.check_Child_State = -1;
		n.check_Focus = false;
		n.getCheckStatus = function() {return data.getCheckStatus(setting, n);};

		if (setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL && n[checkedKey] ) {
			var r = data.getRoot(setting);
			r.radioCheckedList.push(n);
		}
	},
	//add dom for check
	_beforeA = function(setting, node, html) {
		var checkedKey = setting.data.key.checked;
		if (setting.check.enable) {
			data.makeChkFlag(setting, node);
			html.push("<span ID='", node.tId, consts.id.CHECK, "' class='", view.makeChkClass(setting, node), "' treeNode", consts.id.CHECK, (node.nocheck === true?" style='display:none;'":""),"></span>");
		}
	},
	//update zTreeObj, add method of check
	_zTreeTools = function(setting, zTreeTools) {
		zTreeTools.checkNode = function(node, checked, checkTypeFlag, callbackFlag) {
			var checkedKey = this.setting.data.key.checked;
			if (node.chkDisabled === true) return;
			if (checked !== true && checked !== false) {
				checked = !node[checkedKey];
			}
			callbackFlag = !!callbackFlag;

			if (node[checkedKey] === checked && !checkTypeFlag) {
				return;
			} else if (callbackFlag && tools.apply(this.setting.callback.beforeCheck, [this.setting.treeId, node], true) == false) {
				return;
			}
			if (tools.uCanDo(this.setting) && this.setting.check.enable && node.nocheck !== true) {
				node[checkedKey] = checked;
				var checkObj = $$(node, consts.id.CHECK, this.setting);
				if (checkTypeFlag || this.setting.check.chkStyle === consts.radio.STYLE) view.checkNodeRelation(this.setting, node);
				view.setChkClass(this.setting, checkObj, node);
				view.repairParentChkClassWithSelf(this.setting, node);
				if (callbackFlag) {
					this.setting.treeObj.trigger(consts.event.CHECK, [null, this.setting.treeId, node]);
				}
			}
		}

		zTreeTools.checkAllNodes = function(checked) {
			view.repairAllChk(this.setting, !!checked);
		}

		zTreeTools.getCheckedNodes = function(checked) {
			var childKey = this.setting.data.key.children;
			checked = (checked !== false);
			return data.getTreeCheckedNodes(this.setting, data.getRoot(this.setting)[childKey], checked);
		}

		zTreeTools.getChangeCheckedNodes = function() {
			var childKey = this.setting.data.key.children;
			return data.getTreeChangeCheckedNodes(this.setting, data.getRoot(this.setting)[childKey]);
		}

		zTreeTools.setChkDisabled = function(node, disabled, inheritParent, inheritChildren) {
			disabled = !!disabled;
			inheritParent = !!inheritParent;
			inheritChildren = !!inheritChildren;
			view.repairSonChkDisabled(this.setting, node, disabled, inheritChildren);
			view.repairParentChkDisabled(this.setting, node.getParentNode(), disabled, inheritParent);
		}

		var _updateNode = zTreeTools.updateNode;
		zTreeTools.updateNode = function(node, checkTypeFlag) {
			if (_updateNode) _updateNode.apply(zTreeTools, arguments);
			if (!node || !this.setting.check.enable) return;
			var nObj = $$(node, this.setting);
			if (nObj.get(0) && tools.uCanDo(this.setting)) {
				var checkObj = $$(node, consts.id.CHECK, this.setting);
				if (checkTypeFlag == true || this.setting.check.chkStyle === consts.radio.STYLE) view.checkNodeRelation(this.setting, node);
				view.setChkClass(this.setting, checkObj, node);
				view.repairParentChkClassWithSelf(this.setting, node);
			}
		}
	},
	//method of operate data
	_data = {
		getRadioCheckedList: function(setting) {
			var checkedList = data.getRoot(setting).radioCheckedList;
			for (var i=0, j=checkedList.length; i<j; i++) {
				if(!data.getNodeCache(setting, checkedList[i].tId)) {
					checkedList.splice(i, 1);
					i--; j--;
				}
			}
			return checkedList;
		},
		getCheckStatus: function(setting, node) {
			if (!setting.check.enable || node.nocheck || node.chkDisabled) return null;
			var checkedKey = setting.data.key.checked,
			r = {
				checked: node[checkedKey],
				half: node.halfCheck ? node.halfCheck : (setting.check.chkStyle == consts.radio.STYLE ? (node.check_Child_State === 2) : (node[checkedKey] ? (node.check_Child_State > -1 && node.check_Child_State < 2) : (node.check_Child_State > 0)))
			};
			return r;
		},
		getTreeCheckedNodes: function(setting, nodes, checked, results) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			onlyOne = (checked && setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL);
			results = !results ? [] : results;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i].nocheck !== true && nodes[i].chkDisabled !== true && nodes[i][checkedKey] == checked) {
					results.push(nodes[i]);
					if(onlyOne) {
						break;
					}
				}
				data.getTreeCheckedNodes(setting, nodes[i][childKey], checked, results);
				if(onlyOne && results.length > 0) {
					break;
				}
			}
			return results;
		},
		getTreeChangeCheckedNodes: function(setting, nodes, results) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked;
			results = !results ? [] : results;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i].nocheck !== true && nodes[i].chkDisabled !== true && nodes[i][checkedKey] != nodes[i].checkedOld) {
					results.push(nodes[i]);
				}
				data.getTreeChangeCheckedNodes(setting, nodes[i][childKey], results);
			}
			return results;
		},
		makeChkFlag: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			chkFlag = -1;
			if (node[childKey]) {
				for (var i = 0, l = node[childKey].length; i < l; i++) {
					var cNode = node[childKey][i];
					var tmp = -1;
					if (setting.check.chkStyle == consts.radio.STYLE) {
						if (cNode.nocheck === true || cNode.chkDisabled === true) {
							tmp = cNode.check_Child_State;
						} else if (cNode.halfCheck === true) {
							tmp = 2;
						} else if (cNode[checkedKey]) {
							tmp = 2;
						} else {
							tmp = cNode.check_Child_State > 0 ? 2:0;
						}
						if (tmp == 2) {
							chkFlag = 2; break;
						} else if (tmp == 0){
							chkFlag = 0;
						}
					} else if (setting.check.chkStyle == consts.checkbox.STYLE) {
						if (cNode.nocheck === true || cNode.chkDisabled === true) {
							tmp = cNode.check_Child_State;
						} else if (cNode.halfCheck === true) {
							tmp = 1;
						} else if (cNode[checkedKey] ) {
							tmp = (cNode.check_Child_State === -1 || cNode.check_Child_State === 2) ? 2 : 1;
						} else {
							tmp = (cNode.check_Child_State > 0) ? 1 : 0;
						}
						if (tmp === 1) {
							chkFlag = 1; break;
						} else if (tmp === 2 && chkFlag > -1 && i > 0 && tmp !== chkFlag) {
							chkFlag = 1; break;
						} else if (chkFlag === 2 && tmp > -1 && tmp < 2) {
							chkFlag = 1; break;
						} else if (tmp > -1) {
							chkFlag = tmp;
						}
					}
				}
			}
			node.check_Child_State = chkFlag;
		}
	},
	//method of event proxy
	_event = {

	},
	//method of event handler
	_handler = {
		onCheckNode: function (event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkedKey = setting.data.key.checked;
			if (tools.apply(setting.callback.beforeCheck, [setting.treeId, node], true) == false) return true;
			node[checkedKey] = !node[checkedKey];
			view.checkNodeRelation(setting, node);
			var checkObj = $$(node, consts.id.CHECK, setting);
			view.setChkClass(setting, checkObj, node);
			view.repairParentChkClassWithSelf(setting, node);
			setting.treeObj.trigger(consts.event.CHECK, [event, setting.treeId, node]);
			return true;
		},
		onMouseoverCheck: function(event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkObj = $$(node, consts.id.CHECK, setting);
			node.check_Focus = true;
			view.setChkClass(setting, checkObj, node);
			return true;
		},
		onMouseoutCheck: function(event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkObj = $$(node, consts.id.CHECK, setting);
			node.check_Focus = false;
			view.setChkClass(setting, checkObj, node);
			return true;
		}
	},
	//method of tools for zTree
	_tools = {

	},
	//method of operate ztree dom
	_view = {
		checkNodeRelation: function(setting, node) {
			var pNode, i, l,
			childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			r = consts.radio;
			if (setting.check.chkStyle == r.STYLE) {
				var checkedList = data.getRadioCheckedList(setting);
				if (node[checkedKey]) {
					if (setting.check.radioType == r.TYPE_ALL) {
						for (i = checkedList.length-1; i >= 0; i--) {
							pNode = checkedList[i];
							if (pNode[checkedKey] && pNode != node) {
								pNode[checkedKey] = false;
								checkedList.splice(i, 1);

								view.setChkClass(setting, $$(pNode, consts.id.CHECK, setting), pNode);
								if (pNode.parentTId != node.parentTId) {
									view.repairParentChkClassWithSelf(setting, pNode);
								}
							}
						}
						checkedList.push(node);
					} else {
						var parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
						for (i = 0, l = parentNode[childKey].length; i < l; i++) {
							pNode = parentNode[childKey][i];
							if (pNode[checkedKey] && pNode != node) {
								pNode[checkedKey] = false;
								view.setChkClass(setting, $$(pNode, consts.id.CHECK, setting), pNode);
							}
						}
					}
				} else if (setting.check.radioType == r.TYPE_ALL) {
					for (i = 0, l = checkedList.length; i < l; i++) {
						if (node == checkedList[i]) {
							checkedList.splice(i, 1);
							break;
						}
					}
				}

			} else {
				if (node[checkedKey] && (!node[childKey] || node[childKey].length==0 || setting.check.chkboxType.Y.indexOf("s") > -1)) {
					view.setSonNodeCheckBox(setting, node, true);
				}
				if (!node[checkedKey] && (!node[childKey] || node[childKey].length==0 || setting.check.chkboxType.N.indexOf("s") > -1)) {
					view.setSonNodeCheckBox(setting, node, false);
				}
				if (node[checkedKey] && setting.check.chkboxType.Y.indexOf("p") > -1) {
					view.setParentNodeCheckBox(setting, node, true);
				}
				if (!node[checkedKey] && setting.check.chkboxType.N.indexOf("p") > -1) {
					view.setParentNodeCheckBox(setting, node, false);
				}
			}
		},
		makeChkClass: function(setting, node) {
			var checkedKey = setting.data.key.checked,
			c = consts.checkbox, r = consts.radio,
			fullStyle = "";
			if (node.chkDisabled === true) {
				fullStyle = c.DISABLED;
			} else if (node.halfCheck) {
				fullStyle = c.PART;
			} else if (setting.check.chkStyle == r.STYLE) {
				fullStyle = (node.check_Child_State < 1)? c.FULL:c.PART;
			} else {
				fullStyle = node[checkedKey] ? ((node.check_Child_State === 2 || node.check_Child_State === -1) ? c.FULL:c.PART) : ((node.check_Child_State < 1)? c.FULL:c.PART);
			}
			var chkName = setting.check.chkStyle + "_" + (node[checkedKey] ? c.TRUE : c.FALSE) + "_" + fullStyle;
			chkName = (node.check_Focus && node.chkDisabled !== true) ? chkName + "_" + c.FOCUS : chkName;
			return consts.className.BUTTON + " " + c.DEFAULT + " " + chkName;
		},
		repairAllChk: function(setting, checked) {
			if (setting.check.enable && setting.check.chkStyle === consts.checkbox.STYLE) {
				var checkedKey = setting.data.key.checked,
				childKey = setting.data.key.children,
				root = data.getRoot(setting);
				for (var i = 0, l = root[childKey].length; i<l ; i++) {
					var node = root[childKey][i];
					if (node.nocheck !== true && node.chkDisabled !== true) {
						node[checkedKey] = checked;
					}
					view.setSonNodeCheckBox(setting, node, checked);
				}
			}
		},
		repairChkClass: function(setting, node) {
			if (!node) return;
			data.makeChkFlag(setting, node);
			if (node.nocheck !== true) {
				var checkObj = $$(node, consts.id.CHECK, setting);
				view.setChkClass(setting, checkObj, node);
			}
		},
		repairParentChkClass: function(setting, node) {
			if (!node || !node.parentTId) return;
			var pNode = node.getParentNode();
			view.repairChkClass(setting, pNode);
			view.repairParentChkClass(setting, pNode);
		},
		repairParentChkClassWithSelf: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children;
			if (node[childKey] && node[childKey].length > 0) {
				view.repairParentChkClass(setting, node[childKey][0]);
			} else {
				view.repairParentChkClass(setting, node);
			}
		},
		repairSonChkDisabled: function(setting, node, chkDisabled, inherit) {
			if (!node) return;
			var childKey = setting.data.key.children;
			if (node.chkDisabled != chkDisabled) {
				node.chkDisabled = chkDisabled;
			}
			view.repairChkClass(setting, node);
			if (node[childKey] && inherit) {
				for (var i = 0, l = node[childKey].length; i < l; i++) {
					var sNode = node[childKey][i];
					view.repairSonChkDisabled(setting, sNode, chkDisabled, inherit);
				}
			}
		},
		repairParentChkDisabled: function(setting, node, chkDisabled, inherit) {
			if (!node) return;
			if (node.chkDisabled != chkDisabled && inherit) {
				node.chkDisabled = chkDisabled;
			}
			view.repairChkClass(setting, node);
			view.repairParentChkDisabled(setting, node.getParentNode(), chkDisabled, inherit);
		},
		setChkClass: function(setting, obj, node) {
			if (!obj) return;
			if (node.nocheck === true) {
				obj.hide();
			} else {
				obj.show();
			}
            obj.attr('class', view.makeChkClass(setting, node));
		},
		setParentNodeCheckBox: function(setting, node, value, srcNode) {
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			checkObj = $$(node, consts.id.CHECK, setting);
			if (!srcNode) srcNode = node;
			data.makeChkFlag(setting, node);
			if (node.nocheck !== true && node.chkDisabled !== true) {
				node[checkedKey] = value;
				view.setChkClass(setting, checkObj, node);
				if (setting.check.autoCheckTrigger && node != srcNode) {
					setting.treeObj.trigger(consts.event.CHECK, [null, setting.treeId, node]);
				}
			}
			if (node.parentTId) {
				var pSign = true;
				if (!value) {
					var pNodes = node.getParentNode()[childKey];
					for (var i = 0, l = pNodes.length; i < l; i++) {
						if ((pNodes[i].nocheck !== true && pNodes[i].chkDisabled !== true && pNodes[i][checkedKey])
						|| ((pNodes[i].nocheck === true || pNodes[i].chkDisabled === true) && pNodes[i].check_Child_State > 0)) {
							pSign = false;
							break;
						}
					}
				}
				if (pSign) {
					view.setParentNodeCheckBox(setting, node.getParentNode(), value, srcNode);
				}
			}
		},
		setSonNodeCheckBox: function(setting, node, value, srcNode) {
			if (!node) return;
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			checkObj = $$(node, consts.id.CHECK, setting);
			if (!srcNode) srcNode = node;

			var hasDisable = false;
			if (node[childKey]) {
				for (var i = 0, l = node[childKey].length; i < l && node.chkDisabled !== true; i++) {
					var sNode = node[childKey][i];
					view.setSonNodeCheckBox(setting, sNode, value, srcNode);
					if (sNode.chkDisabled === true) hasDisable = true;
				}
			}

			if (node != data.getRoot(setting) && node.chkDisabled !== true) {
				if (hasDisable && node.nocheck !== true) {
					data.makeChkFlag(setting, node);
				}
				if (node.nocheck !== true && node.chkDisabled !== true) {
					node[checkedKey] = value;
					if (!hasDisable) node.check_Child_State = (node[childKey] && node[childKey].length > 0) ? (value ? 2 : 0) : -1;
				} else {
					node.check_Child_State = -1;
				}
				view.setChkClass(setting, checkObj, node);
				if (setting.check.autoCheckTrigger && node != srcNode && node.nocheck !== true && node.chkDisabled !== true) {
					setting.treeObj.trigger(consts.event.CHECK, [null, setting.treeId, node]);
				}
			}

		}
	},

	_z = {
		tools: _tools,
		view: _view,
		event: _event,
		data: _data
	};
	$.extend(true, $.fn.zTree.consts, _consts);
	$.extend(true, $.fn.zTree._z, _z);

	var zt = $.fn.zTree,
	tools = zt._z.tools,
	consts = zt.consts,
	view = zt._z.view,
	data = zt._z.data,
	event = zt._z.event,
	$$ = tools.$;

	data.exSetting(_setting);
	data.addInitBind(_bindEvent);
	data.addInitUnBind(_unbindEvent);
	data.addInitCache(_initCache);
	data.addInitNode(_initNode);
	data.addInitProxy(_eventProxy, true);
	data.addInitRoot(_initRoot);
	data.addBeforeA(_beforeA);
	data.addZTreeTools(_zTreeTools);

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode, index) {
		if (_createNodes) _createNodes.apply(view, arguments);
		if (!nodes) return;
		view.repairParentChkClassWithSelf(setting, parentNode);
	}
	var _removeNode = view.removeNode;
	view.removeNode = function(setting, node) {
		var parentNode = node.getParentNode();
		if (_removeNode) _removeNode.apply(view, arguments);
		if (!node || !parentNode) return;
		view.repairChkClass(setting, parentNode);
		view.repairParentChkClass(setting, parentNode);
	}

	var _appendNodes = view.appendNodes;
	view.appendNodes = function(setting, level, nodes, parentNode, index, initFlag, openFlag) {
		var html = "";
		if (_appendNodes) {
			html = _appendNodes.apply(view, arguments);
		}
		if (parentNode) {
			data.makeChkFlag(setting, parentNode);
		}
		return html;
	}
})(jQuery);
/*
 * JQuery zTree exedit v3.5.19.2
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-11-15
 */
(function($){
	//default consts of exedit
	var _consts = {
		event: {
			DRAG: "ztree_drag",
			DROP: "ztree_drop",
			RENAME: "ztree_rename",
			DRAGMOVE:"ztree_dragmove"
		},
		id: {
			EDIT: "_edit",
			INPUT: "_input",
			REMOVE: "_remove"
		},
		move: {
			TYPE_INNER: "inner",
			TYPE_PREV: "prev",
			TYPE_NEXT: "next"
		},
		node: {
			CURSELECTED_EDIT: "curSelectedNode_Edit",
			TMPTARGET_TREE: "tmpTargetzTree",
			TMPTARGET_NODE: "tmpTargetNode"
		}
	},
	//default setting of exedit
	_setting = {
		edit: {
			enable: false,
			editNameSelectAll: false,
			showRemoveBtn: true,
			showRenameBtn: true,
			removeTitle: "remove",
			renameTitle: "rename",
			drag: {
				autoExpandTrigger: false,
				isCopy: true,
				isMove: true,
				prev: true,
				next: true,
				inner: true,
				minMoveSize: 5,
				borderMax: 10,
				borderMin: -5,
				maxShowNodeNum: 5,
				autoOpenTime: 500
			}
		},
		view: {
			addHoverDom: null,
			removeHoverDom: null
		},
		callback: {
			beforeDrag:null,
			beforeDragOpen:null,
			beforeDrop:null,
			beforeEditName:null,
			beforeRename:null,
			onDrag:null,
			onDragMove:null,
			onDrop:null,
			onRename:null
		}
	},
	//default root of exedit
	_initRoot = function (setting) {
		var r = data.getRoot(setting), rs = data.getRoots();
		r.curEditNode = null;
		r.curEditInput = null;
		r.curHoverNode = null;
		r.dragFlag = 0;
		r.dragNodeShowBefore = [];
		r.dragMaskList = new Array();
		rs.showHoverDom = true;
	},
	//default cache of exedit
	_initCache = function(treeId) {},
	//default bind event of exedit
	_bindEvent = function(setting) {
		var o = setting.treeObj;
		var c = consts.event;
		o.bind(c.RENAME, function (event, treeId, treeNode, isCancel) {
			tools.apply(setting.callback.onRename, [event, treeId, treeNode, isCancel]);
		});

		o.bind(c.DRAG, function (event, srcEvent, treeId, treeNodes) {
			tools.apply(setting.callback.onDrag, [srcEvent, treeId, treeNodes]);
		});

		o.bind(c.DRAGMOVE,function(event, srcEvent, treeId, treeNodes){
			tools.apply(setting.callback.onDragMove,[srcEvent, treeId, treeNodes]);
		});

		o.bind(c.DROP, function (event, srcEvent, treeId, treeNodes, targetNode, moveType, isCopy) {
			tools.apply(setting.callback.onDrop, [srcEvent, treeId, treeNodes, targetNode, moveType, isCopy]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj;
		var c = consts.event;
		o.unbind(c.RENAME);
		o.unbind(c.DRAG);
		o.unbind(c.DRAGMOVE);
		o.unbind(c.DROP);
	},
	//default event proxy of exedit
	_eventProxy = function(e) {
		var target = e.target,
		setting = data.getSetting(e.data.treeId),
		relatedTarget = e.relatedTarget,
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null,
		tmp = null;

		if (tools.eqs(e.type, "mouseover")) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tools.getNodeMainDom(tmp).id;
				nodeEventType = "hoverOverNode";
			}
		} else if (tools.eqs(e.type, "mouseout")) {
			tmp = tools.getMDom(setting, relatedTarget, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (!tmp) {
				tId = "remove";
				nodeEventType = "hoverOutNode";
			}
		} else if (tools.eqs(e.type, "mousedown")) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tools.getNodeMainDom(tmp).id;
				nodeEventType = "mousedownNode";
			}
		}
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "mousedownNode" :
					nodeEventCallback = _handler.onMousedownNode;
					break;
				case "hoverOverNode" :
					nodeEventCallback = _handler.onHoverOverNode;
					break;
				case "hoverOutNode" :
					nodeEventCallback = _handler.onHoverOutNode;
					break;
			}
		}
		var proxyResult = {
			stop: false,
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of exedit
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		n.isHover = false;
		n.editNameFlag = false;
	},
	//update zTreeObj, add method of edit
	_zTreeTools = function(setting, zTreeTools) {
		zTreeTools.cancelEditName = function(newName) {
			var root = data.getRoot(this.setting);
			if (!root.curEditNode) return;
			view.cancelCurEditNode(this.setting, newName?newName:null, true);
		}
		zTreeTools.copyNode = function(targetNode, node, moveType, isSilent) {
			if (!node) return null;
			if (targetNode && !targetNode.isParent && this.setting.data.keep.leaf && moveType === consts.move.TYPE_INNER) return null;
			var _this = this,
				newNode = tools.clone(node);
			if (!targetNode) {
				targetNode = null;
				moveType = consts.move.TYPE_INNER;
			}
			if (moveType == consts.move.TYPE_INNER) {
				function copyCallback() {
					view.addNodes(_this.setting, targetNode, -1, [newNode], isSilent);
				}

				if (tools.canAsync(this.setting, targetNode)) {
					view.asyncNode(this.setting, targetNode, isSilent, copyCallback);
				} else {
					copyCallback();
				}
			} else {
				view.addNodes(this.setting, targetNode.parentNode, -1, [newNode], isSilent);
				view.moveNode(this.setting, targetNode, newNode, moveType, false, isSilent);
			}
			return newNode;
		}
		zTreeTools.editName = function(node) {
			if (!node || !node.tId || node !== data.getNodeCache(this.setting, node.tId)) return;
			if (node.parentTId) view.expandCollapseParentNode(this.setting, node.getParentNode(), true);
			view.editNode(this.setting, node)
		}
		zTreeTools.moveNode = function(targetNode, node, moveType, isSilent) {
			if (!node) return node;
			if (targetNode && !targetNode.isParent && this.setting.data.keep.leaf && moveType === consts.move.TYPE_INNER) {
				return null;
			} else if (targetNode && ((node.parentTId == targetNode.tId && moveType == consts.move.TYPE_INNER) || $$(node, this.setting).find("#" + targetNode.tId).length > 0)) {
				return null;
			} else if (!targetNode) {
				targetNode = null;
			}
			var _this = this;
			function moveCallback() {
				view.moveNode(_this.setting, targetNode, node, moveType, false, isSilent);
			}
			if (tools.canAsync(this.setting, targetNode) && moveType === consts.move.TYPE_INNER) {
				view.asyncNode(this.setting, targetNode, isSilent, moveCallback);
			} else {
				moveCallback();
			}
			return node;
		}
		zTreeTools.setEditable = function(editable) {
			this.setting.edit.enable = editable;
			return this.refresh();
		}
	},
	//method of operate data
	_data = {
		setSonNodeLevel: function(setting, parentNode, node) {
			if (!node) return;
			var childKey = setting.data.key.children;
			node.level = (parentNode)? parentNode.level + 1 : 0;
			if (!node[childKey]) return;
			for (var i = 0, l = node[childKey].length; i < l; i++) {
				if (node[childKey][i]) data.setSonNodeLevel(setting, node, node[childKey][i]);
			}
		}
	},
	//method of event proxy
	_event = {

	},
	//method of event handler
	_handler = {
		onHoverOverNode: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			root = data.getRoot(setting);
			if (root.curHoverNode != node) {
				_handler.onHoverOutNode(event);
			}
			root.curHoverNode = node;
			view.addHoverDom(setting, node);
		},
		onHoverOutNode: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			root = data.getRoot(setting);
			if (root.curHoverNode && !data.isSelectedNode(setting, root.curHoverNode)) {
				view.removeTreeDom(setting, root.curHoverNode);
				root.curHoverNode = null;
			}
		},
		onMousedownNode: function(eventMouseDown, _node) {
			var i,l,
			setting = data.getSetting(eventMouseDown.data.treeId),
			root = data.getRoot(setting), roots = data.getRoots();
			//right click can't drag & drop
			if (eventMouseDown.button == 2 || !setting.edit.enable || (!setting.edit.drag.isCopy && !setting.edit.drag.isMove)) return true;

			//input of edit node name can't drag & drop
			var target = eventMouseDown.target,
			_nodes = data.getRoot(setting).curSelectedList,
			nodes = [];
			if (!data.isSelectedNode(setting, _node)) {
				nodes = [_node];
			} else {
				for (i=0, l=_nodes.length; i<l; i++) {
					if (_nodes[i].editNameFlag && tools.eqs(target.tagName, "input") && target.getAttribute("treeNode"+consts.id.INPUT) !== null) {
						return true;
					}
					nodes.push(_nodes[i]);
					if (nodes[0].parentTId !== _nodes[i].parentTId) {
						nodes = [_node];
						break;
					}
				}
			}

			view.editNodeBlur = true;
			view.cancelCurEditNode(setting);

			var doc = $(setting.treeObj.get(0).ownerDocument),
			body = $(setting.treeObj.get(0).ownerDocument.body), curNode, tmpArrow, tmpTarget,
			isOtherTree = false,
			targetSetting = setting,
			sourceSetting = setting,
			preNode, nextNode,
			preTmpTargetNodeId = null,
			preTmpMoveType = null,
			tmpTargetNodeId = null,
			moveType = consts.move.TYPE_INNER,
			mouseDownX = eventMouseDown.clientX,
			mouseDownY = eventMouseDown.clientY,
			startTime = (new Date()).getTime();

			if (tools.uCanDo(setting)) {
				doc.bind("mousemove", _docMouseMove);
			}
			function _docMouseMove(event) {
				//avoid start drag after click node
				if (root.dragFlag == 0 && Math.abs(mouseDownX - event.clientX) < setting.edit.drag.minMoveSize
					&& Math.abs(mouseDownY - event.clientY) < setting.edit.drag.minMoveSize) {
					return true;
				}
				var i, l, tmpNode, tmpDom, tmpNodes,
				childKey = setting.data.key.children;
				body.css("cursor", "pointer");

				if (root.dragFlag == 0) {
					if (tools.apply(setting.callback.beforeDrag, [setting.treeId, nodes], true) == false) {
						_docMouseUp(event);
						return true;
					}

					for (i=0, l=nodes.length; i<l; i++) {
						if (i==0) {
							root.dragNodeShowBefore = [];
						}
						tmpNode = nodes[i];
						if (tmpNode.isParent && tmpNode.open) {
							view.expandCollapseNode(setting, tmpNode, !tmpNode.open);
							root.dragNodeShowBefore[tmpNode.tId] = true;
						} else {
							root.dragNodeShowBefore[tmpNode.tId] = false;
						}
					}

					root.dragFlag = 1;
					roots.showHoverDom = false;
					tools.showIfameMask(setting, true);

					//sort
					var isOrder = true, lastIndex = -1;
					if (nodes.length>1) {
						var pNodes = nodes[0].parentTId ? nodes[0].getParentNode()[childKey] : data.getNodes(setting);
						tmpNodes = [];
						for (i=0, l=pNodes.length; i<l; i++) {
							if (root.dragNodeShowBefore[pNodes[i].tId] !== undefined) {
								if (isOrder && lastIndex > -1 && (lastIndex+1) !== i) {
									isOrder = false;
								}
								tmpNodes.push(pNodes[i]);
								lastIndex = i;
							}
							if (nodes.length === tmpNodes.length) {
								nodes = tmpNodes;
								break;
							}
						}
					}
					if (isOrder) {
						preNode = nodes[0].getPreNode();
						nextNode = nodes[nodes.length-1].getNextNode();
					}

					//set node in selected
					curNode = $$("<ul class='zTreeDragUL'></ul>", setting);
					for (i=0, l=nodes.length; i<l; i++) {
						tmpNode = nodes[i];
						tmpNode.editNameFlag = false;
						view.selectNode(setting, tmpNode, i>0);
						view.removeTreeDom(setting, tmpNode);

						if (i > setting.edit.drag.maxShowNodeNum-1) {
							continue;
						}

						tmpDom = $$("<li id='"+ tmpNode.tId +"_tmp'></li>", setting);
						tmpDom.append($$(tmpNode, consts.id.A, setting).clone());
						tmpDom.css("padding", "0");
						tmpDom.children("#" + tmpNode.tId + consts.id.A).removeClass(consts.node.CURSELECTED);
						curNode.append(tmpDom);
						if (i == setting.edit.drag.maxShowNodeNum-1) {
							tmpDom = $$("<li id='"+ tmpNode.tId +"_moretmp'><a>  ...  </a></li>", setting);
							curNode.append(tmpDom);
						}
					}
					curNode.attr("id", nodes[0].tId + consts.id.UL + "_tmp");
					curNode.addClass(setting.treeObj.attr("class"));
					curNode.appendTo(body);

					tmpArrow = $$("<span class='tmpzTreeMove_arrow'></span>", setting);
					tmpArrow.attr("id", "zTreeMove_arrow_tmp");
					tmpArrow.appendTo(body);

					setting.treeObj.trigger(consts.event.DRAG, [event, setting.treeId, nodes]);
				}

				if (root.dragFlag == 1) {
					if (tmpTarget && tmpArrow.attr("id") == event.target.id && tmpTargetNodeId && (event.clientX + doc.scrollLeft()+2) > ($("#" + tmpTargetNodeId + consts.id.A, tmpTarget).offset().left)) {
						var xT = $("#" + tmpTargetNodeId + consts.id.A, tmpTarget);
						event.target = (xT.length > 0) ? xT.get(0) : event.target;
					} else if (tmpTarget) {
						tmpTarget.removeClass(consts.node.TMPTARGET_TREE);
						if (tmpTargetNodeId) $("#" + tmpTargetNodeId + consts.id.A, tmpTarget).removeClass(consts.node.TMPTARGET_NODE + "_" + consts.move.TYPE_PREV)
							.removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_NEXT).removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_INNER);
					}
					tmpTarget = null;
					tmpTargetNodeId = null;

					//judge drag & drop in multi ztree
					isOtherTree = false;
					targetSetting = setting;
					var settings = data.getSettings();
					for (var s in settings) {
						if (settings[s].treeId && settings[s].edit.enable && settings[s].treeId != setting.treeId
							&& (event.target.id == settings[s].treeId || $(event.target).parents("#" + settings[s].treeId).length>0)) {
							isOtherTree = true;
							targetSetting = settings[s];
						}
					}

					var docScrollTop = doc.scrollTop(),
					docScrollLeft = doc.scrollLeft(),
					treeOffset = targetSetting.treeObj.offset(),
					scrollHeight = targetSetting.treeObj.get(0).scrollHeight,
					scrollWidth = targetSetting.treeObj.get(0).scrollWidth,
					dTop = (event.clientY + docScrollTop - treeOffset.top),
					dBottom = (targetSetting.treeObj.height() + treeOffset.top - event.clientY - docScrollTop),
					dLeft = (event.clientX + docScrollLeft - treeOffset.left),
					dRight = (targetSetting.treeObj.width() + treeOffset.left - event.clientX - docScrollLeft),
					isTop = (dTop < setting.edit.drag.borderMax && dTop > setting.edit.drag.borderMin),
					isBottom = (dBottom < setting.edit.drag.borderMax && dBottom > setting.edit.drag.borderMin),
					isLeft = (dLeft < setting.edit.drag.borderMax && dLeft > setting.edit.drag.borderMin),
					isRight = (dRight < setting.edit.drag.borderMax && dRight > setting.edit.drag.borderMin),
					isTreeInner = dTop > setting.edit.drag.borderMin && dBottom > setting.edit.drag.borderMin && dLeft > setting.edit.drag.borderMin && dRight > setting.edit.drag.borderMin,
					isTreeTop = (isTop && targetSetting.treeObj.scrollTop() <= 0),
					isTreeBottom = (isBottom && (targetSetting.treeObj.scrollTop() + targetSetting.treeObj.height()+10) >= scrollHeight),
					isTreeLeft = (isLeft && targetSetting.treeObj.scrollLeft() <= 0),
					isTreeRight = (isRight && (targetSetting.treeObj.scrollLeft() + targetSetting.treeObj.width()+10) >= scrollWidth);

					if (event.target && tools.isChildOrSelf(event.target, targetSetting.treeId)) {
						//get node <li> dom
						var targetObj = event.target;
						while (targetObj && targetObj.tagName && !tools.eqs(targetObj.tagName, "li") && targetObj.id != targetSetting.treeId) {
							targetObj = targetObj.parentNode;
						}

						var canMove = true;
						//don't move to self or children of self
						for (i=0, l=nodes.length; i<l; i++) {
							tmpNode = nodes[i];
							if (targetObj.id === tmpNode.tId) {
								canMove = false;
								break;
							} else if ($$(tmpNode, setting).find("#" + targetObj.id).length > 0) {
								canMove = false;
								break;
							}
						}
						if (canMove && event.target && tools.isChildOrSelf(event.target, targetObj.id + consts.id.A)) {
							tmpTarget = $(targetObj);
							tmpTargetNodeId = targetObj.id;
						}
					}

					//the mouse must be in zTree
					tmpNode = nodes[0];
					if (isTreeInner && tools.isChildOrSelf(event.target, targetSetting.treeId)) {
						//judge mouse move in root of ztree
						if (!tmpTarget && (event.target.id == targetSetting.treeId || isTreeTop || isTreeBottom || isTreeLeft || isTreeRight) && (isOtherTree || (!isOtherTree && tmpNode.parentTId))) {
							tmpTarget = targetSetting.treeObj;
						}
						//auto scroll top
						if (isTop) {
							targetSetting.treeObj.scrollTop(targetSetting.treeObj.scrollTop()-10);
						} else if (isBottom)  {
							targetSetting.treeObj.scrollTop(targetSetting.treeObj.scrollTop()+10);
						}
						if (isLeft) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()-10);
						} else if (isRight) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()+10);
						}
						//auto scroll left
						if (tmpTarget && tmpTarget != targetSetting.treeObj && tmpTarget.offset().left < targetSetting.treeObj.offset().left) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()+ tmpTarget.offset().left - targetSetting.treeObj.offset().left);
						}
					}

					curNode.css({
						"top": (event.clientY + docScrollTop + 3) + "px",
						"left": (event.clientX + docScrollLeft + 3) + "px"
					});

					var dX = 0;
					var dY = 0;
					if (tmpTarget && tmpTarget.attr("id")!=targetSetting.treeId) {
						var tmpTargetNode = tmpTargetNodeId == null ? null: data.getNodeCache(targetSetting, tmpTargetNodeId),
						isCopy = ((event.ctrlKey || event.metaKey) && setting.edit.drag.isMove && setting.edit.drag.isCopy) || (!setting.edit.drag.isMove && setting.edit.drag.isCopy),
						isPrev = !!(preNode && tmpTargetNodeId === preNode.tId),
						isNext = !!(nextNode && tmpTargetNodeId === nextNode.tId),
						isInner = (tmpNode.parentTId && tmpNode.parentTId == tmpTargetNodeId),
						canPrev = (isCopy || !isNext) && tools.apply(targetSetting.edit.drag.prev, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.prev),
						canNext = (isCopy || !isPrev) && tools.apply(targetSetting.edit.drag.next, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.next),
						canInner = (isCopy || !isInner) && !(targetSetting.data.keep.leaf && !tmpTargetNode.isParent) && tools.apply(targetSetting.edit.drag.inner, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.inner);
						if (!canPrev && !canNext && !canInner) {
							tmpTarget = null;
							tmpTargetNodeId = "";
							moveType = consts.move.TYPE_INNER;
							tmpArrow.css({
								"display":"none"
							});
							if (window.zTreeMoveTimer) {
								clearTimeout(window.zTreeMoveTimer);
								window.zTreeMoveTargetNodeTId = null
							}
						} else {
							var tmpTargetA = $("#" + tmpTargetNodeId + consts.id.A, tmpTarget),
							tmpNextA = tmpTargetNode.isLastNode ? null : $("#" + tmpTargetNode.getNextNode().tId + consts.id.A, tmpTarget.next()),
							tmpTop = tmpTargetA.offset().top,
							tmpLeft = tmpTargetA.offset().left,
							prevPercent = canPrev ? (canInner ? 0.25 : (canNext ? 0.5 : 1) ) : -1,
							nextPercent = canNext ? (canInner ? 0.75 : (canPrev ? 0.5 : 0) ) : -1,
							dY_percent = (event.clientY + docScrollTop - tmpTop)/tmpTargetA.height();
							if ((prevPercent==1 ||dY_percent<=prevPercent && dY_percent>=-.2) && canPrev) {
								dX = 1 - tmpArrow.width();
								dY = tmpTop - tmpArrow.height()/2;
								moveType = consts.move.TYPE_PREV;
							} else if ((nextPercent==0 || dY_percent>=nextPercent && dY_percent<=1.2) && canNext) {
								dX = 1 - tmpArrow.width();
								dY = (tmpNextA == null || (tmpTargetNode.isParent && tmpTargetNode.open)) ? (tmpTop + tmpTargetA.height() - tmpArrow.height()/2) : (tmpNextA.offset().top - tmpArrow.height()/2);
								moveType = consts.move.TYPE_NEXT;
							}else {
								dX = 5 - tmpArrow.width();
								dY = tmpTop;
								moveType = consts.move.TYPE_INNER;
							}
							tmpArrow.css({
								"display":"block",
								"top": dY + "px",
								"left": (tmpLeft + dX) + "px"
							});
							tmpTargetA.addClass(consts.node.TMPTARGET_NODE + "_" + moveType);

							if (preTmpTargetNodeId != tmpTargetNodeId || preTmpMoveType != moveType) {
								startTime = (new Date()).getTime();
							}
							if (tmpTargetNode && tmpTargetNode.isParent && moveType == consts.move.TYPE_INNER) {
								var startTimer = true;
								if (window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId !== tmpTargetNode.tId) {
									clearTimeout(window.zTreeMoveTimer);
									window.zTreeMoveTargetNodeTId = null;
								}else if (window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId === tmpTargetNode.tId) {
									startTimer = false;
								}
								if (startTimer) {
									window.zTreeMoveTimer = setTimeout(function() {
										if (moveType != consts.move.TYPE_INNER) return;
										if (tmpTargetNode && tmpTargetNode.isParent && !tmpTargetNode.open && (new Date()).getTime() - startTime > targetSetting.edit.drag.autoOpenTime
											&& tools.apply(targetSetting.callback.beforeDragOpen, [targetSetting.treeId, tmpTargetNode], true)) {
											view.switchNode(targetSetting, tmpTargetNode);
											if (targetSetting.edit.drag.autoExpandTrigger) {
												targetSetting.treeObj.trigger(consts.event.EXPAND, [targetSetting.treeId, tmpTargetNode]);
											}
										}
									}, targetSetting.edit.drag.autoOpenTime+50);
									window.zTreeMoveTargetNodeTId = tmpTargetNode.tId;
								}
							}
						}
					} else {
						moveType = consts.move.TYPE_INNER;
						if (tmpTarget && tools.apply(targetSetting.edit.drag.inner, [targetSetting.treeId, nodes, null], !!targetSetting.edit.drag.inner)) {
							tmpTarget.addClass(consts.node.TMPTARGET_TREE);
						} else {
							tmpTarget = null;
						}
						tmpArrow.css({
							"display":"none"
						});
						if (window.zTreeMoveTimer) {
							clearTimeout(window.zTreeMoveTimer);
							window.zTreeMoveTargetNodeTId = null;
						}
					}
					preTmpTargetNodeId = tmpTargetNodeId;
					preTmpMoveType = moveType;

					setting.treeObj.trigger(consts.event.DRAGMOVE, [event, setting.treeId, nodes]);
				}
				return false;
			}

			doc.bind("mouseup", _docMouseUp);
			function _docMouseUp(event) {
				if (window.zTreeMoveTimer) {
					clearTimeout(window.zTreeMoveTimer);
					window.zTreeMoveTargetNodeTId = null;
				}
				preTmpTargetNodeId = null;
				preTmpMoveType = null;
				doc.unbind("mousemove", _docMouseMove);
				doc.unbind("mouseup", _docMouseUp);
				doc.unbind("selectstart", _docSelect);
				body.css("cursor", "auto");
				if (tmpTarget) {
					tmpTarget.removeClass(consts.node.TMPTARGET_TREE);
					if (tmpTargetNodeId) $("#" + tmpTargetNodeId + consts.id.A, tmpTarget).removeClass(consts.node.TMPTARGET_NODE + "_" + consts.move.TYPE_PREV)
							.removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_NEXT).removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_INNER);
				}
				tools.showIfameMask(setting, false);

				roots.showHoverDom = true;
				if (root.dragFlag == 0) return;
				root.dragFlag = 0;

				var i, l, tmpNode;
				for (i=0, l=nodes.length; i<l; i++) {
					tmpNode = nodes[i];
					if (tmpNode.isParent && root.dragNodeShowBefore[tmpNode.tId] && !tmpNode.open) {
						view.expandCollapseNode(setting, tmpNode, !tmpNode.open);
						delete root.dragNodeShowBefore[tmpNode.tId];
					}
				}

				if (curNode) curNode.remove();
				if (tmpArrow) tmpArrow.remove();

				var isCopy = ((event.ctrlKey || event.metaKey) && setting.edit.drag.isMove && setting.edit.drag.isCopy) || (!setting.edit.drag.isMove && setting.edit.drag.isCopy);
				if (!isCopy && tmpTarget && tmpTargetNodeId && nodes[0].parentTId && tmpTargetNodeId==nodes[0].parentTId && moveType == consts.move.TYPE_INNER) {
					tmpTarget = null;
				}
				if (tmpTarget) {
					var dragTargetNode = tmpTargetNodeId == null ? null: data.getNodeCache(targetSetting, tmpTargetNodeId);
					if (tools.apply(setting.callback.beforeDrop, [targetSetting.treeId, nodes, dragTargetNode, moveType, isCopy], true) == false) {
						view.selectNodes(sourceSetting, nodes);
						return;
					}
					var newNodes = isCopy ? tools.clone(nodes) : nodes;

					function dropCallback() {
						if (isOtherTree) {
							if (!isCopy) {
								for(var i=0, l=nodes.length; i<l; i++) {
									view.removeNode(setting, nodes[i]);
								}
							}
							if (moveType == consts.move.TYPE_INNER) {
								view.addNodes(targetSetting, dragTargetNode, -1, newNodes);
							} else {
								view.addNodes(targetSetting, dragTargetNode.getParentNode(), moveType == consts.move.TYPE_PREV ? dragTargetNode.getIndex() : dragTargetNode.getIndex()+1, newNodes);
							}
						} else {
							if (isCopy && moveType == consts.move.TYPE_INNER) {
								view.addNodes(targetSetting, dragTargetNode, -1, newNodes);
							} else if (isCopy) {
								view.addNodes(targetSetting, dragTargetNode.getParentNode(), moveType == consts.move.TYPE_PREV ? dragTargetNode.getIndex() : dragTargetNode.getIndex()+1, newNodes);
							} else {
								if (moveType != consts.move.TYPE_NEXT) {
									for (i=0, l=newNodes.length; i<l; i++) {
										view.moveNode(targetSetting, dragTargetNode, newNodes[i], moveType, false);
									}
								} else {
									for (i=-1, l=newNodes.length-1; i<l; l--) {
										view.moveNode(targetSetting, dragTargetNode, newNodes[l], moveType, false);
									}
								}
							}
						}
						view.selectNodes(targetSetting, newNodes);
						$$(newNodes[0], setting).focus().blur();

						setting.treeObj.trigger(consts.event.DROP, [event, targetSetting.treeId, newNodes, dragTargetNode, moveType, isCopy]);
					}

					if (moveType == consts.move.TYPE_INNER && tools.canAsync(targetSetting, dragTargetNode)) {
						view.asyncNode(targetSetting, dragTargetNode, false, dropCallback);
					} else {
						dropCallback();
					}

				} else {
					view.selectNodes(sourceSetting, nodes);
					setting.treeObj.trigger(consts.event.DROP, [event, setting.treeId, nodes, null, null, null]);
				}
			}

			doc.bind("selectstart", _docSelect);
			function _docSelect() {
				return false;
			}

			//Avoid FireFox's Bug
			//If zTree Div CSS set 'overflow', so drag node outside of zTree, and event.target is error.
			if(eventMouseDown.preventDefault) {
				eventMouseDown.preventDefault();
			}
			return true;
		}
	},
	//method of tools for zTree
	_tools = {
		getAbs: function (obj) {
			var oRect = obj.getBoundingClientRect(),
			scrollTop = document.body.scrollTop+document.documentElement.scrollTop,
			scrollLeft = document.body.scrollLeft+document.documentElement.scrollLeft;
			return [oRect.left+scrollLeft,oRect.top+scrollTop];
		},
		inputFocus: function(inputObj) {
			if (inputObj.get(0)) {
				inputObj.focus();
				tools.setCursorPosition(inputObj.get(0), inputObj.val().length);
			}
		},
		inputSelect: function(inputObj) {
			if (inputObj.get(0)) {
				inputObj.focus();
				inputObj.select();
			}
		},
		setCursorPosition: function(obj, pos){
			if(obj.setSelectionRange) {
				obj.focus();
				obj.setSelectionRange(pos,pos);
			} else if (obj.createTextRange) {
				var range = obj.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		},
		showIfameMask: function(setting, showSign) {
			var root = data.getRoot(setting);
			//clear full mask
			while (root.dragMaskList.length > 0) {
				root.dragMaskList[0].remove();
				root.dragMaskList.shift();
			}
			if (showSign) {
				//show mask
				var iframeList = $$("iframe", setting);
				for (var i = 0, l = iframeList.length; i < l; i++) {
					var obj = iframeList.get(i),
					r = tools.getAbs(obj),
					dragMask = $$("<div id='zTreeMask_" + i + "' class='zTreeMask' style='top:" + r[1] + "px; left:" + r[0] + "px; width:" + obj.offsetWidth + "px; height:" + obj.offsetHeight + "px;'></div>", setting);
					dragMask.appendTo($$("body", setting));
					root.dragMaskList.push(dragMask);
				}
			}
		}
	},
	//method of operate ztree dom
	_view = {
		addEditBtn: function(setting, node) {
			if (node.editNameFlag || $$(node, consts.id.EDIT, setting).length > 0) {
				return;
			}
			if (!tools.apply(setting.edit.showRenameBtn, [setting.treeId, node], setting.edit.showRenameBtn)) {
				return;
			}
			var aObj = $$(node, consts.id.A, setting),
			editStr = "<span class='" + consts.className.BUTTON + " edit' id='" + node.tId + consts.id.EDIT + "' title='"+tools.apply(setting.edit.renameTitle, [setting.treeId, node], setting.edit.renameTitle)+"' treeNode"+consts.id.EDIT+" style='display:none;'></span>";
			aObj.append(editStr);

			$$(node, consts.id.EDIT, setting).bind('click',
				function() {
					if (!tools.uCanDo(setting) || tools.apply(setting.callback.beforeEditName, [setting.treeId, node], true) == false) return false;
					view.editNode(setting, node);
					return false;
				}
				).show();
		},
		addRemoveBtn: function(setting, node) {
			if (node.editNameFlag || $$(node, consts.id.REMOVE, setting).length > 0) {
				return;
			}
			if (!tools.apply(setting.edit.showRemoveBtn, [setting.treeId, node], setting.edit.showRemoveBtn)) {
				return;
			}
			var aObj = $$(node, consts.id.A, setting),
			removeStr = "<span class='" + consts.className.BUTTON + " remove' id='" + node.tId + consts.id.REMOVE + "' title='"+tools.apply(setting.edit.removeTitle, [setting.treeId, node], setting.edit.removeTitle)+"' treeNode"+consts.id.REMOVE+" style='display:none;'></span>";
			aObj.append(removeStr);

			$$(node, consts.id.REMOVE, setting).bind('click',
				function() {
					if (!tools.uCanDo(setting) || tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return false;
					view.removeNode(setting, node);
					setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
					return false;
				}
				).bind('mousedown',
				function(eventMouseDown) {
					return true;
				}
				).show();
		},
		addHoverDom: function(setting, node) {
			if (data.getRoots().showHoverDom) {
				node.isHover = true;
				if (setting.edit.enable) {
					view.addEditBtn(setting, node);
					view.addRemoveBtn(setting, node);
				}
				tools.apply(setting.view.addHoverDom, [setting.treeId, node]);
			}
		},
		cancelCurEditNode: function (setting, forceName, isCancel) {
			var root = data.getRoot(setting),
			nameKey = setting.data.key.name,
			node = root.curEditNode;

			if (node) {
				var inputObj = root.curEditInput,
				newName = forceName ? forceName:(isCancel ? node[nameKey]: inputObj.val());
				if (tools.apply(setting.callback.beforeRename, [setting.treeId, node, newName, isCancel], true) === false) {
					return false;
				}
                node[nameKey] = newName;
                var aObj = $$(node, consts.id.A, setting);
				aObj.removeClass(consts.node.CURSELECTED_EDIT);
				inputObj.unbind();
				view.setNodeName(setting, node);
				node.editNameFlag = false;
				root.curEditNode = null;
				root.curEditInput = null;
				view.selectNode(setting, node, false);
                setting.treeObj.trigger(consts.event.RENAME, [setting.treeId, node, isCancel]);
			}
			root.noSelection = true;
			return true;
		},
		editNode: function(setting, node) {
			var root = data.getRoot(setting);
			view.editNodeBlur = false;
			if (data.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameFlag) {
				setTimeout(function() {tools.inputFocus(root.curEditInput);}, 0);
				return;
			}
			var nameKey = setting.data.key.name;
			node.editNameFlag = true;
			view.removeTreeDom(setting, node);
			view.cancelCurEditNode(setting);
			view.selectNode(setting, node, false);
			$$(node, consts.id.SPAN, setting).html("<input type=text class='rename' id='" + node.tId + consts.id.INPUT + "' treeNode" + consts.id.INPUT + " >");
			var inputObj = $$(node, consts.id.INPUT, setting);
			inputObj.attr("value", node[nameKey]);
			if (setting.edit.editNameSelectAll) {
				tools.inputSelect(inputObj);
			} else {
				tools.inputFocus(inputObj);
			}

			inputObj.bind('blur', function(event) {
				if (!view.editNodeBlur) {
					view.cancelCurEditNode(setting);
				}
			}).bind('keydown', function(event) {
				if (event.keyCode=="13") {
					view.editNodeBlur = true;
					view.cancelCurEditNode(setting);
				} else if (event.keyCode=="27") {
					view.cancelCurEditNode(setting, null, true);
				}
			}).bind('click', function(event) {
				return false;
			}).bind('dblclick', function(event) {
				return false;
			});

			$$(node, consts.id.A, setting).addClass(consts.node.CURSELECTED_EDIT);
			root.curEditInput = inputObj;
			root.noSelection = false;
			root.curEditNode = node;
		},
		moveNode: function(setting, targetNode, node, moveType, animateFlag, isSilent) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			if (targetNode == node) return;
			if (setting.data.keep.leaf && targetNode && !targetNode.isParent && moveType == consts.move.TYPE_INNER) return;
			var oldParentNode = (node.parentTId ? node.getParentNode(): root),
			targetNodeIsRoot = (targetNode === null || targetNode == root);
			if (targetNodeIsRoot && targetNode === null) targetNode = root;
			if (targetNodeIsRoot) moveType = consts.move.TYPE_INNER;
			var targetParentNode = (targetNode.parentTId ? targetNode.getParentNode() : root);

			if (moveType != consts.move.TYPE_PREV && moveType != consts.move.TYPE_NEXT) {
				moveType = consts.move.TYPE_INNER;
			}

			if (moveType == consts.move.TYPE_INNER) {
				if (targetNodeIsRoot) {
					//parentTId of root node is null
					node.parentTId = null;
				} else {
					if (!targetNode.isParent) {
						targetNode.isParent = true;
						targetNode.open = !!targetNode.open;
						view.setNodeLineIcos(setting, targetNode);
					}
					node.parentTId = targetNode.tId;
				}
			}

			//move node Dom
			var targetObj, target_ulObj;
			if (targetNodeIsRoot) {
				targetObj = setting.treeObj;
				target_ulObj = targetObj;
			} else {
				if (!isSilent && moveType == consts.move.TYPE_INNER) {
					view.expandCollapseNode(setting, targetNode, true, false);
				} else if (!isSilent) {
					view.expandCollapseNode(setting, targetNode.getParentNode(), true, false);
				}
				targetObj = $$(targetNode, setting);
				target_ulObj = $$(targetNode, consts.id.UL, setting);
				if (!!targetObj.get(0) && !target_ulObj.get(0)) {
					var ulstr = [];
					view.makeUlHtml(setting, targetNode, ulstr, '');
					targetObj.append(ulstr.join(''));
				}
				target_ulObj = $$(targetNode, consts.id.UL, setting);
			}
			var nodeDom = $$(node, setting);
			if (!nodeDom.get(0)) {
				nodeDom = view.appendNodes(setting, node.level, [node], null, -1, false, true).join('');
			} else if (!targetObj.get(0)) {
				nodeDom.remove();
			}
			if (target_ulObj.get(0) && moveType == consts.move.TYPE_INNER) {
				target_ulObj.append(nodeDom);
			} else if (targetObj.get(0) && moveType == consts.move.TYPE_PREV) {
				targetObj.before(nodeDom);
			} else if (targetObj.get(0) && moveType == consts.move.TYPE_NEXT) {
				targetObj.after(nodeDom);
			}

			//repair the data after move
			var i,l,
			tmpSrcIndex = -1,
			tmpTargetIndex = 0,
			oldNeighbor = null,
			newNeighbor = null,
			oldLevel = node.level;
			if (node.isFirstNode) {
				tmpSrcIndex = 0;
				if (oldParentNode[childKey].length > 1 ) {
					oldNeighbor = oldParentNode[childKey][1];
					oldNeighbor.isFirstNode = true;
				}
			} else if (node.isLastNode) {
				tmpSrcIndex = oldParentNode[childKey].length -1;
				oldNeighbor = oldParentNode[childKey][tmpSrcIndex - 1];
				oldNeighbor.isLastNode = true;
			} else {
				for (i = 0, l = oldParentNode[childKey].length; i < l; i++) {
					if (oldParentNode[childKey][i].tId == node.tId) {
						tmpSrcIndex = i;
						break;
					}
				}
			}
			if (tmpSrcIndex >= 0) {
				oldParentNode[childKey].splice(tmpSrcIndex, 1);
			}
			if (moveType != consts.move.TYPE_INNER) {
				for (i = 0, l = targetParentNode[childKey].length; i < l; i++) {
					if (targetParentNode[childKey][i].tId == targetNode.tId) tmpTargetIndex = i;
				}
			}
			if (moveType == consts.move.TYPE_INNER) {
				if (!targetNode[childKey]) targetNode[childKey] = new Array();
				if (targetNode[childKey].length > 0) {
					newNeighbor = targetNode[childKey][targetNode[childKey].length - 1];
					newNeighbor.isLastNode = false;
				}
				targetNode[childKey].splice(targetNode[childKey].length, 0, node);
				node.isLastNode = true;
				node.isFirstNode = (targetNode[childKey].length == 1);
			} else if (targetNode.isFirstNode && moveType == consts.move.TYPE_PREV) {
				targetParentNode[childKey].splice(tmpTargetIndex, 0, node);
				newNeighbor = targetNode;
				newNeighbor.isFirstNode = false;
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = true;
				node.isLastNode = false;

			} else if (targetNode.isLastNode && moveType == consts.move.TYPE_NEXT) {
				targetParentNode[childKey].splice(tmpTargetIndex + 1, 0, node);
				newNeighbor = targetNode;
				newNeighbor.isLastNode = false;
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = false;
				node.isLastNode = true;

			} else {
				if (moveType == consts.move.TYPE_PREV) {
					targetParentNode[childKey].splice(tmpTargetIndex, 0, node);
				} else {
					targetParentNode[childKey].splice(tmpTargetIndex + 1, 0, node);
				}
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = false;
				node.isLastNode = false;
			}
			data.fixPIdKeyValue(setting, node);
			data.setSonNodeLevel(setting, node.getParentNode(), node);

			//repair node what been moved
			view.setNodeLineIcos(setting, node);
			view.repairNodeLevelClass(setting, node, oldLevel)

			//repair node's old parentNode dom
			if (!setting.data.keep.parent && oldParentNode[childKey].length < 1) {
				//old parentNode has no child nodes
				oldParentNode.isParent = false;
				oldParentNode.open = false;
				var tmp_ulObj = $$(oldParentNode, consts.id.UL, setting),
				tmp_switchObj = $$(oldParentNode, consts.id.SWITCH, setting),
				tmp_icoObj = $$(oldParentNode, consts.id.ICON, setting);
				view.replaceSwitchClass(oldParentNode, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(oldParentNode, tmp_icoObj, consts.folder.DOCU);
				tmp_ulObj.css("display", "none");

			} else if (oldNeighbor) {
				//old neigbor node
				view.setNodeLineIcos(setting, oldNeighbor);
			}

			//new neigbor node
			if (newNeighbor) {
				view.setNodeLineIcos(setting, newNeighbor);
			}

			//repair checkbox / radio
			if (!!setting.check && setting.check.enable && view.repairChkClass) {
				view.repairChkClass(setting, oldParentNode);
				view.repairParentChkClassWithSelf(setting, oldParentNode);
				if (oldParentNode != node.parent)
					view.repairParentChkClassWithSelf(setting, node);
			}

			//expand parents after move
			if (!isSilent) {
				view.expandCollapseParentNode(setting, node.getParentNode(), true, animateFlag);
			}
		},
		removeEditBtn: function(setting, node) {
			$$(node, consts.id.EDIT, setting).unbind().remove();
		},
		removeRemoveBtn: function(setting, node) {
			$$(node, consts.id.REMOVE, setting).unbind().remove();
		},
		removeTreeDom: function(setting, node) {
			node.isHover = false;
			view.removeEditBtn(setting, node);
			view.removeRemoveBtn(setting, node);
			tools.apply(setting.view.removeHoverDom, [setting.treeId, node]);
		},
		repairNodeLevelClass: function(setting, node, oldLevel) {
			if (oldLevel === node.level) return;
			var liObj = $$(node, setting),
			aObj = $$(node, consts.id.A, setting),
			ulObj = $$(node, consts.id.UL, setting),
			oldClass = consts.className.LEVEL + oldLevel,
			newClass = consts.className.LEVEL + node.level;
			liObj.removeClass(oldClass);
			liObj.addClass(newClass);
			aObj.removeClass(oldClass);
			aObj.addClass(newClass);
			ulObj.removeClass(oldClass);
			ulObj.addClass(newClass);
		},
		selectNodes : function(setting, nodes) {
			for (var i=0, l=nodes.length; i<l; i++) {
				view.selectNode(setting, nodes[i], i>0);
			}
		}
	},

	_z = {
		tools: _tools,
		view: _view,
		event: _event,
		data: _data
	};
	$.extend(true, $.fn.zTree.consts, _consts);
	$.extend(true, $.fn.zTree._z, _z);

	var zt = $.fn.zTree,
	tools = zt._z.tools,
	consts = zt.consts,
	view = zt._z.view,
	data = zt._z.data,
	event = zt._z.event,
	$$ = tools.$;

	data.exSetting(_setting);
	data.addInitBind(_bindEvent);
	data.addInitUnBind(_unbindEvent);
	data.addInitCache(_initCache);
	data.addInitNode(_initNode);
	data.addInitProxy(_eventProxy);
	data.addInitRoot(_initRoot);
	data.addZTreeTools(_zTreeTools);

	var _cancelPreSelectedNode = view.cancelPreSelectedNode;
	view.cancelPreSelectedNode = function (setting, node) {
		var list = data.getRoot(setting).curSelectedList;
		for (var i=0, j=list.length; i<j; i++) {
			if (!node || node === list[i]) {
				view.removeTreeDom(setting, list[i]);
				if (node) break;
			}
		}
		if (_cancelPreSelectedNode) _cancelPreSelectedNode.apply(view, arguments);
	}

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode, index) {
		if (_createNodes) {
			_createNodes.apply(view, arguments);
		}
		if (!nodes) return;
		if (view.repairParentChkClassWithSelf) {
			view.repairParentChkClassWithSelf(setting, parentNode);
		}
	}

	var _makeNodeUrl = view.makeNodeUrl;
	view.makeNodeUrl = function(setting, node) {
		return setting.edit.enable ? null : (_makeNodeUrl.apply(view, arguments));
	}

	var _removeNode = view.removeNode;
	view.removeNode = function(setting, node) {
		var root = data.getRoot(setting);
		if (root.curEditNode === node) root.curEditNode = null;
		if (_removeNode) {
			_removeNode.apply(view, arguments);
		}
	}

	var _selectNode = view.selectNode;
	view.selectNode = function(setting, node, addFlag) {
		var root = data.getRoot(setting);
		if (data.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameFlag) {
			return false;
		}
		if (_selectNode) _selectNode.apply(view, arguments);
		view.addHoverDom(setting, node);
		return true;
	}

	var _uCanDo = tools.uCanDo;
	tools.uCanDo = function(setting, e) {
		var root = data.getRoot(setting);
		if (e && (tools.eqs(e.type, "mouseover") || tools.eqs(e.type, "mouseout") || tools.eqs(e.type, "mousedown") || tools.eqs(e.type, "mouseup"))) {
			return true;
		}
		if (root.curEditNode) {
			view.editNodeBlur = false;
			root.curEditInput.focus();
		}
		return (!root.curEditNode) && (_uCanDo ? _uCanDo.apply(view, arguments) : true);
	}
})(jQuery);

/**
 * ajaxgrid component
 * @author chenguohui
 * create on 2014-11-26
 */

var pk = pk || {}; // namespace

(function () {
    var checkColWidth = 24, //全选列宽
        serialColWidth = 28, //序号列宽
        hd_height = 33, // head高度
        pg_height = 37, // 分页栏高度
        tdPadding = 20, //两边各留10px，要和样式中的同步
        handlerOffset = -2; //handler偏移

    function initDom() {
        this.el.css('overflow', 'hidden');
        var initHtmls = [];
        initHtmls.push('<div class="datagrid-inner-wrap">');
        initHtmls.push('<div class="grid-hd">');
        initHtmls.push('</div>');
        initHtmls.push('<div class="grid-bd">');
        initHtmls.push('<table cellspacing="0" cellpadding="0" class="tLight">');
        initHtmls.push('<tbody>');
        initHtmls.push('</tbody>');
        initHtmls.push('</table>');
        initHtmls.push('</div>');
        initHtmls.push('</div>');

        this.el.empty().append(initHtmls.join('')).append('<div class="resize-reference"></div>');

        // 根据内容生成title
        this.el.find('.grid-hd thead th').each(function(i, n){
            if($(n).attr('field') != '_check' && $(n).text()) {
                $(n).attr('title', $(n).text());
            }
        });

        var _self = this;

        initGridHead.call(_self);

        initColumnSelector.call(_self);

        this.width = this.el.width();
        this.height = this.el.height();
        if(this.opts.fitable) {
            setInterval(function(){
                var width = _self.el.width();
                var height = _self.el.height();
                if((width != _self.width || height != _self.height) && _self.el.is(":visible")) {
                    _self.width = width;
                    _self.height = height;
                    _self.resize();
                }
            },this.opts.checkInterval);
        }

        if(!($.browser.msie && parseInt($.browser.version) <= 6)) {
            this.el.find('table').css('width', '100%');
        }

        this.opts.height = this.opts.height || this.el.height();
        var gridBd = this.el.find('.grid-bd');
        if (!this.opts.autoHeight) {
            if (this.opts.pagination) {
                gridBd.height(this.opts.height - hd_height - pg_height - 1);
            } else {
                gridBd.height(this.opts.height - hd_height - 1);
            }
        } else {
            this.el.css('height', 'auto');
        }
        gridBd.css('overflow', 'auto');
        gridBd.css('position', 'relative');

        var table = this.el.find('table'), thead = table.find('thead'), tbody = table.find('tbody');
        if (!table.hasClass(this.opts.cls)) {
            table.addClass(this.opts.cls);
        }

    }

    function initGridHead() {
        var headHtmls = [];
        headHtmls.push('<table cellspacing="0" cellpadding="0" class="tLight">');
        headHtmls.push('<thead><tr>');

        // field预处理，算fields总权重
        var totalFieldWeight = 0, noPercentWidth = 28, _len;
        for (var i = 0; i < this.opts.fields.length; i++) {
            var field = this.opts.fields[i];
            if(field.hidden) {
                continue;
            }
            _len = i;
            if(field.mapping === undefined || field.mapping === null){
                field.mapping = field.field;
            }
            if (field.field == '_check') {
                noPercentWidth += (checkColWidth + tdPadding);
            } else if (field.field == '_serial') {
                noPercentWidth += (serialColWidth + tdPadding);
            } else {
                totalFieldWeight += field.weight;
            }
        }

        this.noPercentWidth = noPercentWidth;

        this.headWidth = this.el.width();
        for (var i = 0; i <= _len; i++) {
            var field = this.opts.fields[i];
            var tdStyle;
            if(field.hidden) {
                continue;
            }
            if (field.field == '_check') {
                headHtmls.push('<th field="_check" class="th_check ' + (i == 0 ? 'first' : '') + '" idField="' + this.opts.idField + '" style="text-align:center;width:' + checkColWidth + 'px"><div class="th-inner-wrap"><input type="checkbox" class="checkAll" /></div></th>');
            } else if (field.field == '_serial') {
                headHtmls.push('<th field="_serial" class="' + (i == 0 ? 'first' : '') + '" style="text-align:center;width:' + serialColWidth + 'px"><div class="th-inner-wrap">序号</div></th>');
            } else {
                var width = field.weight / totalFieldWeight * (this.headWidth - noPercentWidth) - tdPadding;
                width = Math.round(width);
                //设置头部对齐方式
                field.headAlign = field.headAlign || 'left';
                if (field.headAlign == 'left') {
                    tdStyle = 'style="text-align:left;' + (i < _len ?'width:' + width + 'px;' : '') + '"';
                } else if (field.headAlign == 'center') {
                    tdStyle = 'style="text-align:center;' + (i < _len ?'width:' + width + 'px;' : '') + '"';
                } else {
                    tdStyle = 'style="text-align:right;' + (i < _len ?'width:' + width + 'px;' : '') + '"';
                }
                headHtmls.push('<th class="' + (field.sortable ? 'sortable' : '') + (i == 0 ? ' first' : (i == _len ? ' last' : '')) + '" field="' + field.field + '" mapping="' + field.mapping + '" sortable="' + (field.sortable?'true':'false') + '" ' + tdStyle + '><div class="th-inner-wrap">' + field.text + (field.sortable ? '<span class="sort-icon"></span>' : '') + '</div></th>');
            }
        }

        headHtmls.push('</tr></thead>');
        headHtmls.push('</table>');

        this.el.find('.grid-hd').empty().html(headHtmls.join(''));

        // 根据数据生成title
        this.el.find('.grid-hd thead th').each(function(i, n){
            if($(n).attr('field') != '_check' && $(n).text()) {
                $(n).attr('title', $(n).text());
            }
        });

        var _self = this;
        setTimeout(function(){
            generateResizeHandlers.call(_self);
        },0);
    }

    // 生成ResizeHandler
    function generateResizeHandlers() {
        var grid_hd = this.el.find('.grid-hd'),
            thead = grid_hd.find('thead'),
            _self = this;
        // 清除老的resize-handler，因为列可能会更新
        grid_hd.find('.resize-handler').remove();

        thead.find('th').each(function(i,n){
            var field = $(n).attr('field');
            if(field != '_check' && field != '_serial' && $(n)[0] != thead.find('th:last')[0]){
                var innerWrapEl = $(n).find('.th-inner-wrap');
                var left = (innerWrapEl.offset().left - _self.el.offset().left) + innerWrapEl.width() + 10 - 1 + handlerOffset;
                $('<div class="resize-handler" col-index="' + i + '" style="left:' + left + 'px"></div>').appendTo(grid_hd);
            }
        });

        refreshColWidth.call(this);

        // 列宽拖动事件处理
        dealResizeHandlerEvent.call(this);
    }

    // 初始化列选择器
    function initColumnSelector(){
        this.el.append('<div class="column-selector"><div class="column-selector-head">表头项设置</div><ul class="all-columns"></ul></div><div class="column-trigger"></div>');
        var columnsEl = this.el.find('.all-columns'),
            columnSelector = this.el.find('.column-selector'),
            columnTrigger = this.el.find('.column-trigger'),
            _self = this;
        for(var i=0; i<this.opts.fields.length; i++) {
            var field = this.opts.fields[i];
            if(field.field != '_check' && field.field != '_serial'){
                columnsEl.append('<li>' + '<input type="checkbox" data-field="' + this.opts.fields[i].field + '" ' + (field.hidden?'':'checked="checked"') + ' />' + (this.opts.fields[i].text ? this.opts.fields[i].text : this.opts.fields[i].field) + '</li>');
            }
        }

        columnSelector.on('click', function(e){
            e.stopPropagation();
        });

        columnTrigger.on('click', function(e){
            e.stopPropagation();
            if(columnSelector.data('expand')){
                hideColumnSelector();
            } else {
                var allColumns = _self.el.find('.all-columns');
                allColumns.height(_self.el.height() - hd_height - pg_height - 1);
                columnTrigger.hide();
                columnSelector.animate({
                    right: 0
                }, 200, function(){
                    columnSelector.data('expand', true);
                    columnTrigger.show();
                    columnTrigger.addClass('trigger-expand');
                });
            }

        });

        $(document).click(function(){
            if(columnSelector.data('expand')){
                hideColumnSelector();
            }
        });

        function hideColumnSelector() {
            columnTrigger.hide();
            columnSelector.animate({
                right: -182
            }, 200, function(){
                columnSelector.data('expand', false);
                columnTrigger.show();
                columnTrigger.removeClass('trigger-expand');
            });
        }

        columnsEl.find('li').on('click', function(){
            $(this).find(':checkbox')[0].click();
        });

        columnsEl.find('li :checkbox').on('click', function(e){
            e.stopPropagation();

            var targetField = $(this).attr('data-field'), field;
            for(var i=0; i<_self.opts.fields.length; i++){
                field = _self.opts.fields[i];
                if(field.field == targetField) {
                    field.hidden = !$(this).prop('checked');
                }
            }

            initGridHead.call(_self);
            initEvent.call(_self);
            setTimeout(function(){
                showData.call(_self, _self.data);
            }, 0);

        });
    }

    function dealResizeHandlerEvent() {
        var grid_hd = this.el.find('.grid-hd'),
            thead = grid_hd.find('thead'),
            tbody = this.el.find('.grid-bd tbody'),
            _self = this;

        _self.el.find('.resize-handler').on('mousedown', function(e){
            var reference_ui = _self.el.find('.resize-reference'),
                curHandler = $(this),
                prevPos = Math.round(curHandler.offset().left),//拖动前的位置
                colIndex = parseInt(curHandler.attr('col-index')),//当前拖拽块的index
                lastHandlerIndex = _self.el.find('.resize-handler:last').attr('col-index'),//最后一个拖拽块的index
                curTh = thead.find('th:eq(' + colIndex + ')'),
                nextTh = thead.find('th:eq(' + (colIndex + 1) + ')');
            var rightDis = lastHandlerIndex == colIndex ? 55 : 25;
            // 点击时需要调整参考线及拖动条的位置到鼠标中心
            reference_ui.show();
            reference_ui.css('left', e.pageX - _self.el.offset().left - 1);
            curHandler.css('left', e.pageX - _self.el.offset().left - 1 + handlerOffset);
            // 设置参考线的高度，和组件高度匹配
            if(_self.opts.pagination) {
                reference_ui.height(_self.el.height() - pg_height);
            } else {
                reference_ui.height(_self.el.height());
            }

            $(document).on({
                'mousemove.resize': function(e){
                    // 至少留20像素
                    if(curTh.offset().left + 25 <= e.pageX && e.pageX <= nextTh.offset().left + nextTh.outerWidth() - rightDis) {
                        var left = e.pageX - _self.el.offset().left - 1;
                        reference_ui.css('left', left);
                        curHandler.css('left', left + handlerOffset);
                    }

                    e.preventDefault();
                },
                'mouseup.resize': function(){
                    var colIndex = parseInt(curHandler.attr('col-index')),
                        curTh = thead.find('th:eq(' + colIndex + ')'),
                        curThW = curTh.width(),
                        curField = curTh.attr('field'),
                        curTd = tbody.find('tr:first td:eq(' + colIndex + ')'),
                        curTdW = curTd.width(),
                        nextTh = thead.find('th:eq(' + (colIndex + 1) + ')'),
                        nextThW = nextTh.width(),
                        nextField = nextTh.attr('field'),
                        nextTd = tbody.find('tr:first td:eq(' + (colIndex + 1) + ')'),
                        nextTdW = nextTd.width(),
                        offsetX = prevPos - Math.round(curHandler.offset().left);

                    nextTh.width(nextThW + offsetX);
                    curTh.width(curThW - offsetX);

                    //调整下列权重
                    changeColumnWeight(curField, nextField, curTh.width() + tdPadding, nextTh.width() + tdPadding);

                    nextTd.width(nextTdW + offsetX);
                    curTd.width(curTdW - offsetX);

                    handlerReposition.call(_self);

                    reference_ui.hide();
                    $(document).off("mousemove.resize mouseup.resize");
                }
            });

        });

        function changeColumnWeight(field1, field2, field1_width, field2_width) {
            var field1_option, field2_option;
            for(var i=0; i< _self.opts.fields.length; i++) {
                var field = _self.opts.fields[i];
                if(field.field == field1) {
                    field1_option = field;
                }

                if(field.field == field2) {
                    field2_option = field;
                }
            }

            var totalWeight = field1_option.weight + field2_option.weight;

            field1_option.weight = Math.floor(field1_width*totalWeight/(field1_width + field2_width));
            field2_option.weight = totalWeight - field1_option.weight;
        }
    }

    function handlerReposition() {
        var _self = this;
        this.el.find('.resize-handler').each(function(i, n){
            var colIndex = parseInt($(n).attr('col-index'));
            var targetTh = _self.el.find('.grid-hd thead th:eq(' + colIndex + ')');
            var innerWrapEl = targetTh.find('.th-inner-wrap');
            var left = (innerWrapEl.offset().left - _self.el.offset().left) + innerWrapEl.width() + 10 - 1 + handlerOffset;
            $(n).css('left', left);
        });

        refreshColWidth.call(this);
    }

    function refreshColWidth() {
        if(this.el.is(":visible")){
            var _self = this;
            this.el.find('.grid-hd thead th').each(function(i,n){
                var field = $(n).attr('field');
                _self.colWidth[field] = $(n).width();
            });
        }
    }

    function resetPageInfo(total) {
        this.total = total;
        if(!this.opts.params.limit){
            this.opts.params.limit = this.opts.pageSizeList[0];
        }

        if(!this.opts.hasTotal) {
            return true;
        }

        if(total > 0){
            this.totalPage = total % this.opts.params.limit != 0 ? Math.floor(total / this.opts.params.limit) + 1 : total / this.opts.params.limit;
        } else {
            // 若没有数据，也算做一页
            this.totalPage = 1;
        }

        if (this.opts.params.start > this.totalPage) {
            return false;
        }

        return true;
    }

    function initEvent() {
        var table = this.el.find('table'),
            thead = table.find('thead'),
            tbody = table.find('tbody');
        var _self = this;

        thead.find('th.sortable').off();
        thead.find('th.sortable').on('click', function () {
            var thEl = this,
                sortCls = '',
                field = $(this).attr('mapping') ? $(this).attr('mapping') : $(this).attr('field');

            if (!$(thEl).hasClass('asc') && !$(thEl).hasClass('desc')) {
                sortCls = 'asc';
                _self.sortColIndex = thead.find('th').index(thEl);
                $.extend(_self.opts.params, {
                    sortStr: field + ':asc'
                });
            } else if ($(thEl).hasClass('asc')) {
                sortCls = 'desc';
                _self.sortColIndex = thead.find('th').index(thEl);
                $.extend(_self.opts.params, {
                    sortStr: field + ':desc'
                });
            } else {
                _self.sortColIndex = undefined;
                delete _self.opts.params.sortStr;
            }

            loadPage.call(_self, function () {
                thead.find('th.sortable').removeClass('asc').removeClass('desc');
                $(thEl).addClass(sortCls);
            });
        });

        if (thead.find('[field=_check]').length > 0) {
            var ckaE = $('thead tr th.th_check :checkbox', table);
            if(!_self.opts.multiSelect) {
                ckaE.prop('disabled', true);
            }
            $('thead', table).undelegate();
            // 全选
            $('thead', table).delegate('tr th.th_check :checkbox', 'change', function () {
                var ckE = $('tbody tr td.td_check :checkbox', table).not(':disabled');
                $(this).prop('checked') == true ? ckE.prop('checked', true).parents('tr').addClass('thisRow') : ckE.prop('checked', false).parents('tr').removeClass('thisRow');
            });
            // 选择一行
            $('tbody', table).delegate('tr td.td_check :checkbox', 'change', function () {
                var trE = $(this).parents('tr'), ckE = $('tbody tr td.td_check :checkbox', table), ckdE = $('tbody tr td.td_check :checkbox:checked', table);
                if(!_self.opts.multiSelect) {
                    ckdE.not(this).each(function(i, n){
                        $(n).prop('checked', false).parents('tr').removeClass('thisRow');
                    });
                }
                $(this).prop('checked') == true ? trE.addClass('thisRow') : trE.removeClass('thisRow');
                if (ckE.length == ckdE.length) {
                    ckaE.prop('checked', true);
                } else {
                    ckaE.prop('checked', false);
                }
            });
        }

        if (this.opts.pagination) {
            this.el.undelegate(); //防止重复初始化导致的事件多次绑定
            this.el.delegate('.pagination .pages li[page-type]', 'click', function () {
                if($(this).hasClass('disabled')) {
                    return;
                }
                var type = $(this).attr('page-type');
                var
                    totalPage = parseInt(_self.el.find('.pagination').attr('totalPage'));
                switch (type) {
                    case "prev":
                        _self.opts.params.start--;
                        break;
                    case "next":
                        _self.opts.params.start++;
                        break;
                    default:
                        _self.opts.params.start = 1;
                }
                loadPage.call(_self);
            });

            this.el.delegate('.pagination .pages li[page-num]', 'click', function () {
                var start = parseInt($(this).attr('page-num'));
                $.extend(_self.opts.params, {
                    start: start
                });
                loadPage.call(_self);
            });

            this.el.delegate('.pagination .pages .jumpToBtn', 'click', function () {
                var start = parseInt($(this).parent().find('.jumpTo').val(), 10);
                start = isNaN(start) ? _self.opts.params.start : start;
                $.extend(_self.opts.params, {
                    start: start
                });
                loadPage.call(_self);
            });

            this.el.delegate('.pagination .pages .jumpTo', 'blur', function () {
                if (!$(this).val()) {
                    $(this).val(1);
                }
                var val = parseInt($(this).val());
                if (val > _self.totalPage) {
                    $(this).val(_self.totalPage);
                } else if (val <= 0) {
                    $(this).val(1);
                }
            }).delegate('.pagination .pages .jumpTo', 'keypress', function (event) {
                if ((event.which >= 48 && event.which <= 57) || event.which == 8)
                    return true;
                else
                    return false;
            });

            this.el.delegate('.pagination .page-info select', 'change', function () {
                var pageSize = parseInt($(this).val());
                if(!_self.opts.hasTotal) {
                    // 没总数，切换条数时需展现第一页数据
                    $.extend(_self.opts.params, {
                        start: 1,
                        limit: pageSize
                    });
                } else {
                    $.extend(_self.opts.params, {
                        limit: pageSize
                    });
                }
                loadPage.call(_self);
            });
        }
    }

    function loadPage(callback) {
        var _self = this;

        _self.opts.onBeforeLoad();

        if($.fn.loading) {
            _self.el.loading('circle', '正在加载，请稍后...');
        }

        $.ajax({
            url: this.opts.url,
            type: 'post',
            data: this.opts.params,
            dataType: 'text',
            cache: false,
            success: function (response) {
                // var obj = eval('(' + response + ')'),//这里用了eval不用$.parseJSON()的原因是为了DEMO演示需要，从文件中取的JSON数据会带上回车换行符，会导致parseJSON报错
                var obj = typeof response == "string" ? eval('(' + response + ')') : response,
                    total = obj.total || 0,
                    gridData = obj.data || [];
                // 无总数时，若返回空数据，则下一页按钮设置为灰色，当前页不刷新
                if(!_self.opts.hasTotal && (!$.isArray(gridData) || gridData.length == 0)) {
                    _self.el.find('.pagination .pages li[page-type=next]').addClass('disabled').prop('disabled', true);
                    // 页码需要减一
                    if(_self.opts.params.start > 1) {
                        _self.opts.params.start--;
                    }
                    return;
                }
                var result = resetPageInfo.call(_self, total);
                if(result == false) {
                    // 页码出问题了，切换到第一页去，数据再加载一遍
                    _self.opts.params.start = 1;
                    loadPage.call(_self, callback);
                    return;
                }
                $('.checkAll', _self.el).removeAttr('checked');
                showData.call(_self, gridData);
                if(_self.opts.pagination){
                    genPagination.call(_self);
                }

                callback && callback();
                //成功加载后触发
                //gridData为每行的数据， obj为原始后台返回的数据
				_self.opts.onLoadSuccess(gridData, obj);
            },
            error: function () {
                alert('数据加载失败，请重试');
            },
            complete: function(){
                if($.fn.loaded) {
                    _self.el.loaded();
                }
            }
        });

    }

    function showData(data) {
        this.data = data;
        var rowData, tBodyHtml = [], trHtml, _len, i, f;
        for (i = 0, len = this.opts.fields.length; i < len; i++) {
            f = this.opts.fields[i];
            if (f.hidden) {
                continue;
            }
            _len = i;
        }
        for (i = 0; i < data.length; i++) {
            trHtml = [];
            trHtml.push('<tr ' + (i % 2 == 1 ? 'class="even"' : '') + '>');
            rowData = data[i];
            for (var j = 0; j <= _len; j++) {
                f = this.opts.fields[j];
                if(f.hidden) {
                    continue;
                }

                var tdStyle;
                var width = this.colWidth[f.field];
                var widthStyle = 'width:' + width + 'px;';
                if(j == _len){
                    if($.browser.msie && $.browser.version == 8) {
                        widthStyle = 'width:' + (width - 1 + 28) + 'px;';
                    } else {
                        widthStyle = '';
                    }
                }
                f.align = f.align || 'left';
                if (f.align == 'left') {
                    tdStyle = 'style="text-align:left;' + (i==0 ? widthStyle : '') + '"';
                } else if (f.align == 'center') {
                    tdStyle = 'style="text-align:center;' + (i==0 ? widthStyle : '') + '"';
                } else {
                    tdStyle = 'style="text-align:right;' + (i==0 ? widthStyle : '') + '"';
                }

                if (f.field == '_serial') {
                    trHtml.push('<td field="' + f.field + '" style="text-align:center;' + (i==0 ? 'width:' + width + 'px' : '') + '">' + ((this.opts.params.start - 1) * this.opts.params.limit + i + 1) + '</td>');
                } else if (f.field == '_check') {
                    trHtml.push('<td class="td_check" field="' + f.field + '" style="text-align:center;' + (i==0 ? 'width:' + width + 'px' : '') + '"><input type="checkbox" data-id="' + rowData[this.opts.idField] + '" /></td>');
                } else {
                    var renderer = f.renderer;
                    var title = f.title;
                    var tdContent, tdTitle;
                    if (renderer) {
                        tdContent = renderer(rowData);
                    } else {
                        tdContent = rowData[f.mapping] != undefined || rowData[f.mapping] != null ? rowData[f.mapping] : '';
                    }
                    if(typeof title != 'undefined'){
                        if(typeof title == 'function'){
                            tdTitle = 'title="' + title(rowData) + '"';
                        }else if(typeof title == 'string'){
                            tdTitle = 'title="' + title + '"';
                        }else{
                            tdTitle = '';
                        }
                    }else{
                        if(/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/.test(tdContent)){
                            tdTitle = 'title="' + $(tdContent).text() + '"';
                        }else{
                            tdTitle = 'title="' + tdContent + '"';
                        }
                        
                    }
                    trHtml.push('<td field="' + f.field + '" ' + tdStyle + ' '+ tdTitle +'>' + tdContent + '</td>');
                }
            }
            trHtml.push('</tr>');
            tBodyHtml.push(trHtml.join(''));
        }
        /*if (data.length < this.opts.params.limit) {
            for (var i = data.length; i < this.opts.params.limit; i++) {
                trHtml = [];
                trHtml.push('<tr ' + (i % 2 == 1 ? 'class="even"' : '') + '>');
                for (var j = 0; j < this.opts.fields.length; j++) {
                    trHtml.push('<td>&nbsp;</td>');
                }
                trHtml.push('</tr>');
                tBodyHtml.push(trHtml.join(''));
            }
        }*/

        this.el.find('.grid-bd tbody').html(tBodyHtml.join(''));

        // 若有列排序，数据列加上排序样式
        if(this.sortColIndex) {
            this.el.find('.grid-bd tbody td:nth-child(' + (this.sortColIndex + 1) + '):lt(' + ($.isArray(this.data) ? this.data.length : 0) + ')').addClass('sortCol');
        }
    }

    function genPagination() {
        var pageNo = this.opts.params.start;
        var pHtml = [];
        pHtml.push('<div class="pagination">');
        if(this.opts.hasTotal){
            pHtml.push('<div class="page-info"><span class="amount">共' + this.total + '条</span><span class="pageNo">' + this.opts.params.start + '/' + this.totalPage + '页</span><span class="pageSize">每页显示');
        } else {
            pHtml.push('<div class="page-info"><span class="pageNo">第' + this.opts.params.start + '页</span><span class="pageSize">每页显示');
        }
        pHtml.push('<select>');
        for(var i=0,len=this.opts.pageSizeList.length; i<len; i++){
            pHtml.push('<option value="' + this.opts.pageSizeList[i] + '" ' + (this.opts.params.limit == this.opts.pageSizeList[i] ? 'selected="selected"' : '') + '>' + this.opts.pageSizeList[i] + '</option>');
        }
        pHtml.push('</select>');
        pHtml.push('条</span></div>');
        pHtml.push('<ul class="pages">');
        pHtml.push('<li page-type="prev" ' + (pageNo == 1 ? 'class="disabled" disabled="disabled"' : '') + '><a href="javascript:void(0);" >上一页</a></li>');

        if(this.opts.hasTotal){
            if (this.totalPage <= this.opts.pageNoLen) {
                for (var i = 1; i <= this.totalPage; i++) {
                    pHtml.push('<li ' + (i == pageNo ? 'class="sel"' : '') + 'page-num="' + i + '"><a href="javascript:void(0);">' + i + '</a></li>');
                }
            } else {
                var offset = Math.floor(this.opts.pageNoLen / 2);
                if (this.opts.params.start - 1 < offset) {
                    for (var i = 1; i <= this.opts.pageNoLen; i++) {
                        pHtml.push('<li ' + (i == pageNo ? 'class="sel"' : '') + 'page-num="' + i + '"><a href="javascript:void(0);">' + i + '</a></li>');
                    }
                } else if (this.totalPage - this.opts.params.start < offset) {
                    for (var i = this.totalPage - this.opts.pageNoLen + 1; i <= this.totalPage; i++) {
                        pHtml.push('<li ' + (i == pageNo ? 'class="sel"' : '') + 'page-num="' + i + '"><a href="javascript:void(0);">' + i + '</a></li>');
                    }
                } else {
                    for (var i = this.opts.params.start - offset; i <= this.opts.params.start + offset; i++) {
                        pHtml.push('<li ' + (i == pageNo ? 'class="sel"' : '') + 'page-num="' + i + '"><a href="javascript:void(0);">' + i + '</a></li>');
                    }
                }
            }
        }
        pHtml.push('<li page-type="next" ' + ((this.opts.hasTotal?pageNo == this.totalPage:this.data.length==0) ? 'class="disabled" disabled="disabled"' : '') + '><a href="javascript:void(0);" >下一页</a></li>');
        if(this.opts.hasTotal){
            pHtml.push('<li><div class="jump">到第<input type="text" page-type="jump" maxlength="8" value="' + pageNo + '" class="jumpTo">页<span class="jumpToBtn active">跳转</span></div></li>');
        }
        pHtml.push('</ul>');
        pHtml.push('</div>');

        this.el.find('.pagination').remove();
        this.el.find('.datagrid-inner-wrap').append(pHtml.join(''));
    }

    pk.Ajaxgrid = Component.extend({
        /**
         * 组件默认选项，可被用户参数覆盖
         */
        _defaultOpts: {
            url: '',
            fields: [],
            idField: 'id',
            autoHeight: true,
            pagination: true,
            hasTotal: true,
            params: {
                start: 1,
                limit: 20
            },
            pageSizeList: [10,20,30,40], //可选每页条数
            pageNoLen: 5,//页码数目,推荐是奇数个
            fitable: true, //默认开启自适应，组件会自适应容器的大小
            checkInterval: 100, //检测间隔
            multiSelect: true, //默认是多选的
            //事件
            onBeforeLoad: function(){},//加载前的事件通知
            onLoadSuccess: function(){}//加载成功后的事件通知
        },
        total: 0,
        totalPage: 0,
        totalFieldWeight: 0,
        noPercentWidth: 0,
        sortColIndex: undefined, //用以记录排序的列
        constructor: function (opts) {
            this.colWidth = {};
            this.data = [];
            this.base(opts);
            // pageSizeList参数采用简单的复制，不进行深拷贝了
            if(opts.pageSizeList){
                this.opts.pageSizeList = opts.pageSizeList;
            }
            initDom.call(this);
            initEvent.call(this);
            var _self = this;
            // initDom里面用了setTimeout来延迟执行，这里也要，保证那个先执行
            if(_self.opts.url){
                setTimeout(function(){
                    loadPage.call(_self);
                },0);
            }

        },
        /**
         * 获取选择行的ids数组
         * @returns {Array}
         */
        getSelectedIds: function () {
            var ids = [];
            this.el.find('tbody :checkbox:checked').each(function (i, n) {
                ids.push($(n).attr('data-id'));
            });
            return ids;
        },
        /**
         * 获取选择行的数据，是个数组
         * @returns {Array}
         */
        getSelected: function() {
            var arr = [];
            var ids = this.getSelectedIds();
            for(var i=0; i<this.data.length; i++){
                if($.inArray(this.data[i][this.opts.idField], ids) > -1) {
                    arr.push(this.data[i]);
                }
            }
            return arr;
        },
        /**
         * 加载数据
         * @param params
         */
        load: function (params) {
            $.extend(this.opts.params, {
                start: 1 //显示第一页
            }, params);
            loadPage.call(this);
        },
        /**
         * 重新加载数据
         */
        reload: function () {
            loadPage.call(this);
        },
        /**
         * 获取数据
         */
        getData: function() {
            return this.data;
        },
        /**
         * 工具id获取数据
         */
        getDataById: function(id) {
            for(var i=0; i<this.data.length; i++){
                if(this.data[i][this.opts.idField] == id) {
                    return this.data[i];
                }
            }
            return null;
        },
        /**
         * 加载数据
         */
        loadData: function(data) {
            showData.call(this, data);
        },
        /**
         * 调整大小
         */
        resize: function(){
            // 调整头部列宽
            var _self = this;
            var headWidth = this.el.width();

            // 重新计算列宽
            var ratio = (headWidth - this.noPercentWidth)/(this.headWidth - this.noPercentWidth); //缩放比率
            for(var field in _self.colWidth) {
                if(field != '_check' && field != '_serial'){
                    _self.colWidth[field] = Math.round(((_self.colWidth[field] + tdPadding + 1) * ratio - tdPadding - 1));
                }
            }

            this.headWidth = headWidth;

            var thead = this.el.find('.grid-hd thead');
            thead.find('th').each(function(i,n){
                var field = $(n).attr('field');
                if(field != '_check' && field != '_serial' && $(n)[0] != thead.find('th:last')[0]){
                    $(n).width(_self.colWidth[field]);
                }
            });

            handlerReposition.call(this);

            // 调整数据区域高度
            this.opts.height = this.el.height();
            var gridBd = this.el.find('.grid-bd');
            var allColumns = this.el.find('.all-columns');
            if (!this.opts.autoHeight) {
                if (this.opts.pagination) {
                    gridBd.height(this.opts.height - hd_height - pg_height - 1);
                    allColumns.height(this.opts.height - hd_height - pg_height - 1);
                } else {
                    gridBd.height(this.opts.height - hd_height - 1);
                    allColumns.height(this.opts.height - hd_height - 1);
                }
            } else {
                this.el.css('height', 'auto');
            }

            // 重新显示下数据，会重新计算列宽
            showData.call(this, this.data);

        }
    });
})();

/**
 * gridtree component
 * @author lijiajun
 * create on 2015-3-20
 */

var pk = pk || {}; // namespace

(function () {
	var serialColWidth = 25,//序号列宽
		checkColWidth = 24,//全选列宽
		tdPadding = 20,//两边各留10px，要和样式中的同步
		handlerOffset = -2, //handler偏移
		minWidth = 4;//最小宽度
	function init(){
		var tableStr =	'<div class="grid-hd">'+
							'<table cellpadding="0" cellspacing="0" style="width:100%;">'+
								'<thead>'+
									'<tr></tr>'+
								'</thead>'+
							'</table>'+
						'</div>'+
						'<div class="grid-bd">'+
						'</div>'+
						'<div class="resize-reference">'+
						'</div>';
		this.el.append(tableStr);
		render.call(this);
	}
	function render(){
		initDom.call(this);
		loadData.call(this);
		addEvent.call(this);
	}
	//添加事件
	function addEvent(){
		dragHeader.call(this);
		nodeHover.call(this);
		nodeClick.call(this);
		rowHover.call(this);
		trClick.call(this);
	}
	//设置表格头部
	function initDom(){
		var fields = this.opts.fields;
		var $headTr = this.el.find('.grid-hd tr'),
			headHtml = [];
		for(var i = 0; i < fields.length; i++){
			var firstClass = '',cont = '',halign = 'text-align:left;';
			//判断是否是第一个
			if(i == 0){
				firstClass = ' class="first"';
			}
			headHtml.push('<th'+ firstClass +' field="'+ fields[i].field +'">');
			//判断是否是checkbox和序号
			if(fields[i].field == '_serial'){
				halign = 'text-align:center;';
				cont = '序号';
			}else if(fields[i].field == '_check'){
				halign = 'text-align:center;';
				cont = '<input type="checkbox" class="checkAll"/>';
			}else{
				if(fields[i].halign){
					halign = 'text-align:'+ fields[i].halign +';';
				}
				cont = fields[i].text;
			}
			headHtml.push('<div style="'+ halign +'" class="th-inner-wrap">');
			headHtml.push(cont);
			headHtml.push('</div>');
			headHtml.push('</th>');
		}
		$headTr.append(headHtml.join(''));
		//初始化权重
		initWeight.call(this);
		//设置头部宽度
		setHeadWidth.call(this);
		//是否随浏览器宽度适配表格宽度
		if(this.opts.fit||this.opts.fitable){
			var _self = this;
			setInterval(function(){
				fit.call(_self);
			},250);
		}
		//初始化表格外层容器的宽高
		this.el.css({
			'width': this.opts.width,
			'height': this.opts.height,
			'overflow': 'hidden'
		}).find('.grid-bd').css({
			'height': this.opts.height - $headTr.height(),
			'overflow': 'auto'
		});
		this.containerSize = {
			w: this.el.width(),
			h: this.el.height()
		};
		//判断是否有checkbox
		if($headTr.find('.checkAll').size() > 0){
			if(!this.opts.singleSelect){
				checkBoxClick.call(this);
			}else{
				$headTr.find('.checkAll').attr('disabled',true);
			}
		}
	}
	function initWeight(){
		var fields = this.opts.fields;
		var curNoPercentWidth = 0,
			curTotalWeight = 0;
		for(var i = 0; i < fields.length; i++){
			if(fields[i].field == '_serial'){
				curNoPercentWidth += serialColWidth;
			}else if(fields[i].field == '_check'){
				curNoPercentWidth += checkColWidth;
			}else{
				curTotalWeight += fields[i].weight;
			}
		}
		//不被计算在权重中的包括:
		//1.checkbox和序号的宽度。2.每个格子padding的宽度。3.边框线的宽度（除了第一个格子，所以fields.length - 1）
		this.noPercentWidth = curNoPercentWidth + fields.length * tdPadding + (fields.length - 1);
		this.totalWeight = curTotalWeight;
	}
	function setHeadWidth(){
		this.columnsWidthArray = [];
		var fields = this.opts.fields,
			$el = this.el,
			$head = $el.find('.grid-hd'),
			$ths =$head.find('th');
		var elWidth = $el.innerWidth(),
			totalLeft = 0;
		for(var i = 0; i < fields.length; i++){
			var currWidth,currWeight;
			//根据权重设置宽度
			if(fields[i].field == '_serial'){
				currWidth = serialColWidth;
				totalLeft += currWidth;
			}else if(fields[i].field == '_check'){
				currWidth = checkColWidth;
				totalLeft += currWidth;
			}else{
				currWeight = fields[i].weight;
				currWidth = Math.round(currWeight / this.totalWeight * (elWidth - this.noPercentWidth));
				currWidth = currWidth >= minWidth ?  currWidth : minWidth;
				totalLeft += currWidth;
				if(i != fields.length - 1){
					var resizeHandler = $head.find(".resize-handler[col-index="+ i +"]");
					var left = totalLeft + tdPadding * (i + 1) + i + handlerOffset;
					if(resizeHandler.length > 0){
						resizeHandler.css("left", left);
					}else{
						$head.append('<div class="resize-handler" col-index="' + i + '" style="left:' + left + 'px"></div>');
					}
				}
			}
			//记录每列的宽度
			this.columnsWidthArray.push(currWidth);
			if(i != fields.length - 1){
				$ths.eq(i).width(currWidth);
			}
		}
	}
	function setTdWidth($trs){
		var _self = this;
		$trs.each(function(){
			$(this).find('td').each(function(i){
				if(i != _self.columnsWidthArray.length - 1){
					$(this).width(_self.columnsWidthArray[i]);
				}
			});
		});
	}
	//表格宽度拖拽事件
	function dragHeader(){
		var _self = this;
		this.el.find('.grid-hd').delegate(".resize-handler","mousedown",function(e){
			e.preventDefault();
			_self.el.addClass("onDrag");
			var $this = $(this),
				$resizeLine = _self.el.find(".resize-reference");
			var mouseX = e.clientX,
				orginX = parseInt($this.css("left"),10) - handlerOffset;
				beginX = e.pageX - _self.el.offset().left - 1,//滑块开始拖拽的位置
				index = $this.attr("col-index"),
				min = -(_self.columnsWidthArray[index] - minWidth) + beginX,
				max = _self.columnsWidthArray[index*1+1] - minWidth + beginX,
				nextX = 0;
			$this.css("left",beginX + handlerOffset);
			$resizeLine.show().css("left", beginX);
			$(document).on({
				"mousemove.resize": function(e){
					e.preventDefault();
					nextX = e.clientX - mouseX + beginX;
					nextX = Math.min(Math.max(min,nextX),max);
					$this.css("left",nextX + handlerOffset);
					$resizeLine.css("left",nextX);
				},"mouseup.resize": function(){
					_self.el.removeClass("onDrag");
					$resizeLine.hide();
					if(nextX != 0){
						setWeightByWidth.call(_self,index,nextX - orginX);
					}
					$(this).off("mousemove.resize mouseup.resize");
				}
			});
		});
	}
	//根据宽度来计算权重
	function setWeightByWidth(index,offset){
		offset = Math.floor(offset);
		var indexPrev = index,
			indexNext = index * 1 + 1;
		var fields = this.opts.fields;
		var isLast = indexNext == this.columnsWidthArray.length - 1 ? true : false;
		//总权重
		var totalWeight = fields[indexPrev].weight + fields[indexNext].weight;
		//旧的宽度
		var	prevWidth = this.columnsWidthArray[indexPrev];
			nextWidth = this.columnsWidthArray[indexNext];
			totalWidth = prevWidth + nextWidth;
		//新的宽度
		var	newNextWidth = nextWidth - offset,
			newPrevWidth = totalWidth - newNextWidth;
		//新的权重
		var newPrevWeight = Math.round(newPrevWidth / totalWidth * totalWeight),
			newNextWeight = totalWeight - newPrevWeight;
		//重新设置比重和宽度
		fields[indexPrev].weight = newPrevWeight;
		fields[indexNext].weight = newNextWeight;
		this.columnsWidthArray[indexPrev] = newPrevWidth;
		this.columnsWidthArray[indexNext] = newNextWidth;
		//重新设置宽度
		var $ths = this.el.find(".grid-hd th");
		$ths.eq(indexPrev).width(newPrevWidth);
		if(!isLast){
			$ths.eq(indexNext).width(newNextWidth);
		}
		this.el.find(".gridtree-tr").each(function(){
			$(this).find("td:eq("+ indexPrev +")").width(newPrevWidth);
			if(!isLast){
				$(this).find("td:eq("+ indexNext +")").width(newNextWidth);
			}
		});
		
	}
	//处理checkbox选择事件
	function checkBoxClick(){
		var $el = this.el;
		//全选按钮
		$el.find('.grid-hd .checkAll').on('change',function(){
			var checked = $(this).prop('checked');
			if(checked){
				$el.find('.gridtree-tr').not('.tr-disabled').addClass('thisRow').find('.gridtree-check input').prop('checked',true);
			}else{
				$el.find('.gridtree-tr').not('.tr-disabled').removeClass('thisRow').find('.gridtree-check input').prop('checked',false);
			}
		});
		//子按钮
		$el.delegate('.gridtree-check input','change',function(){
			var checked = $(this).prop('checked'),
				allLength = $el.find('.gridtree-check input').length;//所有的checkbox数量
				checkedLenght = $el.find('.gridtree-check :checked').length;//所有的被选的checkbox数量
			if(allLength == checkedLenght){
				$el.find('.grid-hd .checkAll').prop('checked',true);
			}else{
				$el.find('.grid-hd .checkAll').prop('checked',false);
			}
		});
	}
	//是否随浏览器宽度适配表格宽度
	function fit(){
		var tempSize = {
			w: this.el.width(),
			h: this.el.height()
		};
		if(this.containerSize.w != tempSize.w){
			//宽度自适应
			setHeadWidth.call(this);
			setTdWidth.call(this,this.el.find('.gridtree-tr'));
			this.containerSize.w = tempSize.w;
		}
		if(this.containerSize.h != tempSize.h){
			//高度自适应
			this.el.find('.grid-bd').height(this.el.height() - this.el.find('.grid-hd').height());
			this.containerSize.h = tempSize.h;
		}
	}
	//ajax动态加载数据
	function loadData(){
		var _self = this,
			$el = this.el;
	    if($.fn.loading) {
	        $el.loading('circle', '正在加载，请稍后...');
	    }
		$.ajax({
			type: 'POST',
			url: this.opts.url,
			data: this.opts.params,
			dataType: 'text',
			cache: false,
			success: function(data){
				if(typeof data == 'string'){
					data = $.parseJSON(data);
				}
				$('.checkAll', _self.el).prop('checked',false);
				var $table = showData.call(_self,data);
				$el.find('.grid-bd').html($table);
				setTdWidth.call(_self,$el.find('.gridtree-tr'));
				setSerial.call(_self);
				//成功加载后触发
				_self.opts.onLoadSuccess();
			},error: function(){
				alert('数据加载失败，请重试');
			},complete: function(){
				if($.fn.loaded) {
		            $el.loaded();
		        }
			}
		});
	}
	//显示动态返回的数据
	function showData(data){
		var $table,$tbody,$tr,$td;
		var fields = this.opts.fields,
			treeField = this.opts.treeField;
		if($.browser.msie && parseInt($.browser.version) <= 6) {
	        $table = $('<table cellpadding="0" cellspacing="0">');
	    }else{
	    	$table = $('<table cellpadding="0" cellspacing="0" style="width:100%;">');
	    }
	    $tbody = $('<tbody>');
		for(var i = 0; i < data.length; i++){
			var rowData = data[i];
			var fields = this.opts.fields;
			var trDisabled = rowData.chkDisabled !== false ? 'tr-disabled' : '';
			if(typeof this.opts.idField != 'undefined'){
				$tr = $('<tr class="gridtree-tr '+trDisabled+'" idField="'+ rowData[this.opts.idField] +'" level="'+ this.level +'">');
			}else{
				$tr = $('<tr class="gridtree-tr '+trDisabled+'" level="'+ this.level +'">');	
			}
			$tr.data('rowData',rowData);
			for(var j = 0; j < fields.length; j++){
				var f = fields[j];
				//align为文字位置字段（左中右）,tdClass为field是_serial或_check时添加，cont为td的内容
				var align = 'text-align:left;',
					tdClass = '',
					tdHtml = '',
					cont = '',
					icon = '';
				//判断是否是树节点字段
				if(f.field == treeField){
					for(var k = 0; k < this.level; k++){
						cont += '<span class="tree-indent"></span>';
					}
					//如果有子节点，那么图标是文件夹，否则就是文件
					if(rowData.isParent !== false && typeof rowData.children != "undefined"){
						if(rowData['state'] == 'close'){
							cont += '<span class="tree-hit tree-collapsed"></span><span class="tree-icon tree-folder';
						}else{
							cont += '<span class="tree-hit tree-expanded"></span><span class="tree-icon tree-folder tree-folder-open';
						}
					}else{
						cont += '<span class="tree-indent"></span><span class="tree-icon tree-file';
					}
					
					if(typeof rowData['iconSkin'] != 'undefined'){
						icon = ' ' + rowData['iconSkin'] + '"></span>';
					}else if(typeof rowData['icon'] != 'undefined'){
						icon = '" style="background:url('+ rowData['icon'] +') no-repeat;"></span>';
					}else{
						icon = '"></span>';
					}
					cont += icon;
				}
				//判断每列的内容
				if(f.field == '_serial'){
					tdClass = 'class="gridtree-serial"';
					align = 'text-align:center;';
				}else if(f.field == '_check'){
					tdClass = 'class="gridtree-check"';
					if(rowData.chkDisabled !== false) {
						cont += '<input type="checkbox" disabled/>';
					}else {
						cont += '<input type="checkbox"/>';
					}
					align = 'text-align:center;';
				}else{
					if(f.renderer){
						cont += f.renderer(rowData);
					}else{
						cont += typeof rowData[f.field] != 'undefined' ?  rowData[f.field] : '';
					}
					if(f.align){
						align = 'text-align:'+ f.align +';';
					}
					if(f.tdClass){
						tdClass = 'class="'+ f.tdClass +'"';
					}
				}
				tdHtml = '<td style="'+ align +'"><div '+ tdClass +'>'+ cont +'</div></td>';
				$tr.append(tdHtml);
			}
			$tbody.append($tr);
			//判断是否有子集元素
			
			if(rowData.isParent !== false && typeof rowData.children != "undefined" && rowData.children.length > 0){
				var display = '';
				if(rowData['state'] == 'close'){
					display = 'display:none;';
				}
				this.level++;
				var $childTable = showData.call(this,rowData.children);
				$tr = $('<tr style="'+ display +'">');
				$td = $('<td style="border:0px" class="grid-child" colspan="'+ this.columnsWidthArray.length +'">');
				$td.append($childTable);
				$tr.append($td);
				$tbody.append($tr);
				this.level--;
			}
		}
		$table.append($tbody);
		return $table;
	}
	//设置序号（同时区分奇数和偶数行的颜色）
	function setSerial(){
		$el = this.el;
		$el.find('.gridtree-tr').each(function(i){
			//设置序号
			$(this).find('.gridtree-serial').text(i+1);
			//区分奇数和偶数行的颜色
			//i % 2 == 0 ? $(this).removeClass('even') : $(this).addClass('even');
		});
	}
	function rowHover(){
		var _self = this;
		this.el.delegate('.gridtree-tr','mouseenter',function(e){
			if(!_self.el.hasClass("onDrag")){
				$(this).removeClass('datagrid-row-over');
				$(this).addClass('gridtree-row-over');
				//cas+简易门户IE6下。gridtree-row-over .tree-row-op-layer{display:block};不生效
				if($('.tree-row-op-layer',$(this)).length > 0){
					$('.tree-row-op-layer',$(this)).css('display','block');
				}
			}
		}).delegate('.gridtree-tr','mouseleave',function(e){
			if(!_self.el.hasClass("onDrag")){
				$(this).removeClass('gridtree-row-over');
				if($('.tree-row-op-layer',$(this)).length > 0){
					$('.tree-row-op-layer',$(this)).css('display','none');
				}
			}
		});
	}
	function nodeHover(){
		function dealHover(isEnter){
			var reg = /tree-expanded|tree-collapsed/;
			var strArr = $(this).attr('class').match(reg);
			if(isEnter && strArr){
				$(this).addClass(strArr[0] + '-hover');
			}
			if(!isEnter && strArr){
				$(this).removeClass(strArr[0] + '-hover');
			}
		}
		this.el.delegate('.tree-hit','mouseenter',function(){
			dealHover.call(this,true);
		}).delegate('.tree-hit','mouseleave',function(){
			dealHover.call(this,false);
		});
	}
	function nodeClick(){
		var _self = this;
		this.el.delegate('.tree-hit','click',function(e){
			e.stopPropagation();
			//展开合拢
			if($(this).hasClass('tree-expanded')){
				var $childTr = $(this).attr('class','tree-hit tree-collapsed')
				.next('.tree-icon').removeClass('tree-folder-open')
				.parents('tr:eq(0)').next('tr:not(.gridtree-tr)');		
				var $parentTr = $(this).parents('.gridtree-tr').eq(0);
				$childTr.hide();
				if($parentTr.data('rowData').state){
					$parentTr.data('rowData').state = 'close';
				}
			}else{
				//展开之前触发onBeforeExpand事件
				_self.opts.onBeforeExpand($(this).parents('tr:eq(0)').data('rowData'));
				var $childTr = $(this).attr('class','tree-hit tree-expanded')
				.next('.tree-icon').addClass('tree-folder-open')
				.parents('tr:eq(0)').next('tr:not(.gridtree-tr)');
				var $parentTr = $(this).parents('.gridtree-tr').eq(0);
				$childTr.show();
				if($parentTr.data('rowData').state){
					$parentTr.data('rowData').state = 'open';
				}
			}
		});
	}
	function trClick(){
		var _self = this,
			$el = this.el;
		$el.delegate('.gridtree-tr:not(.tr-disabled)','click',function(){
			if(_self.opts.singleSelect){
				$el.find('.gridtree-tr').not(this).removeClass('thisRow').find('.gridtree-check input').prop('checked',false);
				if($(this).data('rowData').state){
					$(this).data('rowData').state = 'close';
				}
			}
			if(!$(this).hasClass('thisRow')){
				$(this).addClass('thisRow').find('.gridtree-check input').prop('checked',true);
				if($(this).data('rowData').state){
					$(this).data('rowData').state = 'open';
				}
				if($(this).data('rowData').children && $(this).data('rowData').children.length > 0){
					$(this).next('tr:not(.gridtree-tr)').find('.gridtree-tr:not(.tr-disabled)').addClass('thisRow').find('.gridtree-check input').prop('checked',true);
				}
			}else{
				$(this).removeClass('thisRow').find('.gridtree-check input').prop('checked',false);
				if($(this).data('rowData').state){
					$(this).data('rowData').state = 'close';
				}
				if($(this).data('rowData').children && $(this).data('rowData').children.length > 0){
					$(this).next('tr:not(.gridtree-tr)').find('.gridtree-tr:not(.tr-disabled)').removeClass('thisRow').find('.gridtree-check input').prop('checked',false);
				}
			}
		});
	}
	//得到类为gridtree-tr并且idField为传入参数的jquery数组
	function getTrsByIdField(idField){
		var $el = this.el;
		if(idField instanceof Array){
			var $trs = $();
			for(var i = 0; i < idField.length; i++){
				$trs = $trs.add(getTrsByIdField.call(this,idField[i]));
			}
			return recordArray;
		}else{
			return $el.find('.gridtree-tr[idField='+ idField +']');
		}
	}
	pk.GridTree = Component.extend({
        /**
         * 组件默认选项，可被用户参数覆盖
         */
        _defaultOpts: {
            url: '',
            params: {},
           	idField: '',
			treeField: '',
			fit: false,
			fitable: false,//fit和fitable功能完全一样，用于兼容老版本
			height: 'auto',
			width: 'auto',
			singleSelect: true,
			//事件
			onBeforeExpand: function(){},
			onLoadSuccess: function(){}
        },
        level: 0,//层级
        noPercentWidth: 0,//不计算在百分比的宽度
		columnsWidthArray: [],//存放每列的宽度
		totalWeight: 0,//宽度总的比重
		containerSize: {},//容器的宽度
        constructor: function (opts) {
            this.base(opts);
            init.call(this);
        },
        load: function (params) {
            $.extend(this.opts.params, params, {
                start: 1 //显示第一页
            });
            loadData.call(this);
        },
        //重载
		reload: function(){
			this.level = 0;
			loadData.call(this);
		},
		//动态添加数据
		append: function(collection){
			if(collection instanceof Array){
				for(var i = 0; i < collection.length; i++){
					this.append(collection[i]);
				}
			}else{
				var $table = null,
					$el = this.el,
					$parentTr = null;
				if(typeof collection.parent != 'undefined' && ($parentTr = $el.find('.gridtree-tr[idField='+ collection.parent +']')).size() > 0){
					//先设置level确定层级
					this.level = parseInt($parentTr.attr('level')) + 1;
					$table = showData.call(this, collection.data);
					//如果有子元素，那么和子元素（table）放一起，否则新建一个子元素（table）
					$childTr = $parentTr.next('tr:not(.gridtree-tr)');
					if($childTr.size() > 0){
						var trsStr = $table.children('tbody').html();
						$childTr.find('tbody').append(trsStr);
					}else{
						var $tr = $('<tr><td style="border:0px" class="grid-child" colspan="'+ this.columnsWidthArray.length +'">'); 
						$tr.find('td').append($table);
						$parentTr.after($tr);
						//判读父节点原本是否是叶子（最后一个节点）,如果是，那么把图标换成文件夹
						var $treeIcon = $parentTr.find('.tree-icon');
						if($treeIcon.hasClass('tree-file')){
							$treeIcon.attr('class','tree-icon tree-folder tree-folder-open ' + this.opts.iconClass)
							.prev('.tree-indent').replaceWith('<span class="tree-hit tree-expanded"></span>');
						}
					}
				}else{
					this.level = 0;
					$table = showData.call(this, collection.data);
					$el.find('.grid-bd>table>tbody').append($table.children('tbody').html());
				}
				setTdWidth.call(this,$table.find('.gridtree-tr'));
				setSerial.call(this);
				$('.checkAll', $el).removeAttr('checked');
			}
		},
		//获取选中的数据
		getSelected: function(){
			var dataArray = [];
			var $el = this.el;
			$el.find('.thisRow').each(function(){
				dataArray.push($(this).data('rowData'));
			});
			return dataArray;
		},
		//选中方法，传入相应的idField值后，选中相应的行
		select: function(idField){
			var $trs = getTrsByIdField.call(this,idField);
			$trs.addClass('thisRow').find('.gridtree-check input').prop('checked',true);
		},
		getNext: function(idField){
			var $trs = getTrsByIdField.call(this,idField),
				$nextTr = $($trs.nextAll('.gridtree-tr')[0]);
			if($nextTr.size() > 0){
				return $nextTr.data('rowData');
			}else{
				return null;
			}
		},
		getPrev: function(idField){
			var $trs = getTrsByIdField.call(this,idField),
				$prevTr = $($trs.prevAll('.gridtree-tr')[0]);
			if($prevTr.size() > 0){
				return $prevTr.data('rowData');
			}else{
				return null;
			}
		},
		//展开全部节点
		expandAll: function(){
			var $el = $('.grid-bd',this.el);
			$el.find('tr:not(.gridtree-tr)').show();
			$el.find('.tree-hit').attr('class','tree-hit tree-expanded');
			$el.find('.gridtree-tr').each(function(i,n){
				if(!$(n).find('.tree-icon').hasClass('tree-folder-open')){
					$(n).find('.tree-icon').addClass('tree-folder-open');
					//改变state的值
					if($(n).data('rowData').state){
						$(n).data('rowData').state = 'open';
					}
				}
			});
		},
		//收起全部节点
		collapseAll: function(idField){
			var $el = $('.grid-bd',this.el);
			$el.find('tr:not(.gridtree-tr)').hide();
			$el.find('.tree-hit').attr('class','tree-hit tree-collapsed');
			$el.find('.gridtree-tr').each(function(i,n){
				if($(n).find('.tree-icon').hasClass('tree-folder-open')){
					$(n).find('.tree-icon').removeClass('tree-folder-open');
					if($(n).data('rowData').state){
						$(n).data('rowData').state = 'close';
					}
				}
			});
		},
		//获取行对象
		getRowData: function(idField){
			var $row = getTrsByIdField.call(this,idField);
			return $row.data('rowData');
		},
		//获取所有行对象
		getAllTrsData: function(){
			var $el = $('.grid-bd',this.el);
			var trsData = [];
			$el.find('.gridtree-tr').each(function(i,n){
				trsData.push($(n).data('rowData'));
			});
			return trsData;
		}
    });
})();
/*
 * PAGINATION plugin
 * @param options
 * @Author YuZhen
 */
var pk = pk || {}; // namespace

(function(){

    function init(){

        var base = this;
        base.$element = $(this.el);

        // 对文本框绑定获得焦点事件
        base.$element.delegate('.pagination-text', 'focus.pagination', function () {
            $(this).css('border-color', '#217ef2');
        });
        // 对文本框绑定失去焦点事件
        base.$element.delegate('.pagination-text', 'blur.pagination', function () {
            $(this).css('border-color', '');
        });

        // 对页码绑定点击事件
        base.$element.delegate('.pagination-spec', 'click', function () {

            var $self = $(this),
                toPage = parseInt($self.attr('data-page'));
            switchToPage.call(base, toPage);

            // 自动触发回调函数
            base.opts.paged(base.opts.currentPage);

        });

        base.$element.delegate('a.pagination-prev,a.pagination-prev-simple,a.pagination-prev-imgX,a.pagination-prev-imgY', 'click', function () {

            var toPage = base.opts.currentPage - 1;
            switchToPage.call(base, toPage);

            // 自动触发回调函数
            base.opts.paged(base.opts.currentPage);

        });

        base.$element.delegate('a.pagination-next,a.pagination-next-simple,a.pagination-next-imgX,a.pagination-next-imgY', 'click', function () {

            var toPage = base.opts.currentPage + 1;
            switchToPage.call(base, toPage);

            // 自动触发回调函数
            base.opts.paged(base.opts.currentPage);

        });

        base.$element.delegate('.pagination-jump', 'click', function () {

            var toPage = parseInt($.trim(base.$element.find('.pagination-text').val()), 10);

            // 处理任何无效跳转的页面请求
            if (isNaN(toPage) || toPage < 1 || toPage > base.opts.maxPage) {
                switchToPage.call(base, base.opts.currentPage);

                return false;
            }
            switchToPage.call(base, toPage);

            // 自动触发回调函数
            base.opts.paged(base.opts.currentPage);

        });
        
        //禁止上下页拖动事件，防止文字被选中
        base.$element.delegate('[class^=pagination-next], [class^=pagination-prev]', 'selectstart drag', function () {
            return false;
        });

        resetPagination.call(this);
    }

    function resetPagination(){

        var base = this;
        base.$element = $(this.el);

        var  paginationInner = '',
            type = base.opts.styleType;

        switch (type) {

            case 'default_css':
                paginationInner = commonCss.call(base,base,paginationInner);
                paginationInner += '<span class="pagination-wrap">'
                    +'<span class="pagination-totalPages">'
                    +'共'
                    +base.opts.maxPage
                    +'页'
                    +'</span>向第'
                    +' </span>'
                    +'<input class="pagination-text" type="text" />'
                    +'<span class="pagination-wrap">页</span>'
                    +'<a class="pagination-jump">跳转</a>'
                    +'<div class="clear"></div>';

                base.$element.html(paginationInner);
                break;

            case 'bigData_css':
                paginationInner = bigDataCss.call(base,base,paginationInner);

                base.$element.html(paginationInner);
                break;

            case 'timer_css':
                paginationInner = commonCss.call(base,base,paginationInner);
                paginationInner += '<div class="pagination-right">'
                    +'<span class="pagination-searchInfo">'
                    +'为您找到相关结果0条，用时0毫秒'
                    +'</span>'
                    +'</div>'
                    +'<div class="clear"></div>';

                base.$element.html(paginationInner);
                break;

            case 'grid_css':
                paginationInner = '<span class="pagination-wrap pagination-totalNum">共'+base.opts.paginationTotalNum+'条</span>'
                +'<span class="pagination-wrap pagination-currentPageOfMaxPage">'+base.opts.currentPage+'/'+base.opts.maxPage+'页</span>'
                +'<span class="pagination-wrap pagination-EachPageShows">每页显示20条</span>'
                +'<div class="pagination-right">'+commonCss.call(base,base,paginationInner);

                paginationInner += '<span class="pagination-wrap">'
                    +'<span class="pagination-wrap">'
                    +'&nbsp;向第'
                    +' </span>'
                    +'<input class="pagination-text" type="text" />'
                    +'<span class="pagination-wrap">页</span>'
                    +'<a class="pagination-jump">跳转</a>'
                    +'</div><div class="clear"></div>';

                base.$element.html(paginationInner);
                break;

            case 'simple_css':
                paginationInner = commonCss.call(base,base,paginationInner,true);

                base.$element.html(paginationInner);
                break;

            case 'noPage_css':
                paginationInner = noPageCss.call(base,base,paginationInner);

                base.$element.html(paginationInner);

                break;

            case 'imgX_css':
                paginationInner = imgXCss.call(base,base,paginationInner);

                base.$element.html(paginationInner);

                break;

            case 'imgY_css':
                paginationInner = imgYCss.call(base,base,paginationInner);

                base.$element.html(paginationInner);

                break;

        }
    }

    function commonCss(base,paginationInner,isSimple){
        if(!isSimple){
            paginationInner += base.opts.currentPage === 1 ? '<span class="pagination-prev">上一页</span>' : '<a class="pagination-prev">上一页</a>';
        }
        else{
            paginationInner += base.opts.currentPage === 1 ? '<span class="pagination-prev-simple"><i class="icon5-10 i-prev-simple"></i></span>' : '<a class="pagination-prev-simple"><i class="icon5-10 i-prev-simple"></i></a>';
        }

        if (base.opts.currentPage <= base.opts.firstPagesCount + base.opts.preposePagesCount + 1) {
            for(var i=1; i<base.opts.currentPage; i++) {
                paginationInner += renderActivePage(i);
            }
        }
        else {
            for(var i=1; i<=base.opts.firstPagesCount; i++) {
                paginationInner += renderActivePage(i);
            }
            paginationInner += '<span class="pagination-break">...</span>';
            for(var i=base.opts.currentPage - base.opts.preposePagesCount; i<=base.opts.currentPage-1; i++) {
                paginationInner += renderActivePage(i);
            }
        }

        // currPage的页码展示
        paginationInner += '<span class="pagination-current">' + base.opts.currentPage + '</span>';

        // currPage后的页码展示
        if (base.opts.currentPage >= base.opts.maxPage - base.opts.lastPagesCount - base.opts.postposePagesCount) {

            for(var i=base.opts.currentPage+1; i<=base.opts.maxPage; i++) {
                paginationInner += renderActivePage(i);
            }

        } else {
            for(var i=base.opts.currentPage+1; i<=base.opts.currentPage+base.opts.postposePagesCount; i++) {
                paginationInner += renderActivePage(i);
            }
            paginationInner += '<span class="pagination-break">...</span>';
            for(var i=base.opts.maxPage-base.opts.lastPagesCount+1; i<=base.opts.maxPage; i++) {
                paginationInner += renderActivePage(i);
            }
        }

        if(!isSimple){
            paginationInner += base.opts.currentPage === base.opts.maxPage ? '<span class="pagination-next">下一页</span>' : '<a class="pagination-next">下一页</a>';
        }
        else{
            paginationInner += base.opts.currentPage === base.opts.maxPage ? '<span class="pagination-next-simple"><i class="icon5-10 i-next-simple"></i></span>' : '<a class="pagination-next-simple"><i class="icon5-10 i-next-simple"></i></a>';
            paginationInner += '<div class="clear"></div>';
        }

        return paginationInner;
    }

    function bigDataCss(base,paginationInner){

        paginationInner = '<div class="pagination-right">'
            +'<span class="pagination-wrap pagination-currentPageOfMaxPage">'+base.opts.currentPage+'/'+base.opts.maxPage+'页</span>';

        paginationInner += base.opts.currentPage === 1 ? '<span class="pagination-prev">上一页</span>' : '<a class="pagination-prev">上一页</a>';
        paginationInner += base.opts.currentPage === base.opts.maxPage ? '<span class="pagination-next">下一页</span>' : '<a class="pagination-next">下一页</a>';

        paginationInner += '<span class="pagination-wrap">'
            +'<span class="pagination-wrap">'
            +'&nbsp;向第'
            +' </span>'
            +'<input class="pagination-text" type="text" />'
            +'<span class="pagination-wrap">页</span>'
            +'<a class="pagination-jump">跳转</a>'
            +'</div><div class="clear"></div>';

        return paginationInner;
    }

    function noPageCss(base,paginationInner){

        paginationInner = '<span class="pagination-wrap pagination-totalNum">共'+base.opts.paginationTotalNum+'条</span>'
            +'<div class="pagination-right">';

        paginationInner += base.opts.currentPage === 1 ? '<span class="pagination-prev-simple"><i class="icon5-10 i-prev-simple"></i></span>' : '<a class="pagination-prev-simple"><i class="icon5-10 i-prev-simple"></i></a>';

        paginationInner += base.opts.currentPage === base.opts.maxPage ? '<span class="pagination-next-simple"><i class="icon5-10 i-next-simple"></i></span>' : '<a class="pagination-next-simple"><i class="icon5-10 i-next-simple"></i></a>';

        paginationInner += '</div><div class="clear"></div>';

        return paginationInner;
    }

    function imgXCss(base,paginationInner){

        paginationInner = base.opts.currentPage === 1 ? '<span class="pagination-prev-imgX"><i class="icon8-17 i-prev-imgX"></i></span>' : '<a class="pagination-prev-imgX"><i class="icon8-17 i-prev-imgX"></i></a>';

        paginationInner += base.opts.currentPage === base.opts.maxPage ? '<span class="pagination-next-imgX"><i class="icon8-17 i-next-imgX"></i></span>' : '<a class="pagination-next-imgX"><i class="icon8-17 i-next-imgX"></i></a>';

        paginationInner += '</div><div class="clear"></div>';

        return paginationInner;
    }

    function imgYCss(base,paginationInner){

        paginationInner = base.opts.currentPage === 1 ? '<span class="pagination-prev-imgY"><i class="icon17-8 i-prev-imgY"></i></span>' : '<a class="pagination-prev-imgY"><i class="icon17-8 i-prev-imgY"></i></a>';

        paginationInner += base.opts.currentPage === base.opts.maxPage ? '<span class="pagination-next-imgY clear"><i class="icon17-8 i-next-imgY"></i></span>' : '<a class="pagination-next-imgY clear"><i class="icon17-8 i-next-imgY"></i></a>';

        paginationInner += '</div><div class="clear"></div>';

        return paginationInner;
    }

    function renderActivePage(index) {
        return '<a class="pagination-spec" data-page="' + index + '">' + index + '</a>';
    }

    function switchToPage(page) {
        this.opts.currentPage = page;
        resetPagination.call(this);
    }


    pk.Pagination = Component.extend({
        /**
         * 组件默认选项，可被用户参数覆盖
         */
        _defaultOpts: {
            currentPage : 1,

            // 最大页数
            maxPage : null,

            // 总条数
            paginationTotalNum : null,

            // 当前页的最大紧邻前置页数（不包括最前面的显示页数）
            preposePagesCount : 2,

            // 当前页的最大紧邻后置页数
            postposePagesCount : 1,

            // 第一个"..."前显示的页数
            firstPagesCount : 2,

            // 第二个"..."后显示的页数
            lastPagesCount : 1,

            // 分页样式
            styleType : 'default_css',

            paged: function () {}
        },
        constructor: function (opts) {
            this.base(opts);
            init.call(this);
        },

        /**
         * 设置可变参数
         * @param params
         */
        setPageParam: function(opts){
            var base = this;
            base.$element = $(this.el);

            if(opts['paginationTotalNum'] != undefined){
                base.opts.paginationTotalNum = opts['paginationTotalNum'];
                resetPagination.call(this);
            }
            if(opts['maxPage'] != undefined){
                base.opts.maxPage = opts['maxPage'];
                resetPagination.call(this);
            }
            if(opts['currentPage'] != undefined){
                base.opts.currentPage = opts['currentPage'];
                resetPagination.call(this);
            }
            else{
                base.opts.currentPage = 1;
                resetPagination.call(this);
            }

        },
        
        /*
         * 获取当前页码
         * */
        getCurrentPage: function(){
            return this.opts.currentPage;
        }
    });
})();
/**
 * progress 进度条组件
 * @author chenguohui
 */

var pk = pk || {}; // namespace

(function ($) {
    pk.Progress = Component.extend({
        constructor : function(opts) {
            this.base(opts);
            var htmls = [];
            htmls.push('<div class="progress">');
            htmls.push('<div class="progressbar"><div class="bar"></div></div>');
            htmls.push('<div class="elapsed">等待中...</div>');
            htmls.push('<div class="percent"><b>0%</b></div>');
            htmls.push('</div>');
            this.el.append(htmls.join(''));
            this.el.find('.bar').width(0);
        },
        // 更新进度，由外界控制
        update : function(percent, elapsed) {
            this.el.find('.progressbar .bar').animate({width: percent + '%'}, 100);
            this.el.find('.percent b').html(percent + '%');
            this.el.find('.elapsed').html(elapsed);
            this.el.find('.progress').removeClass('success failure');
        },

        // 成功
        success : function(elapsed) {
            this.el.find('.progressbar .bar').animate({width: '100%'}, 100);
            this.el.find('.percent b').html('100%');
            this.el.find('.elapsed').html(elapsed);
            this.el.find('.progress').addClass('success');
        },

        // 失败
        fail : function(elapsed) {
            this.el.find('.progressbar .bar').animate({width: '100%'}, 100);
            this.el.find('.percent b').html('&nbsp;');
            this.el.find('.elapsed').html(elapsed);
            this.el.find('.progress').addClass('failure');
        }

    });
})(jQuery);
