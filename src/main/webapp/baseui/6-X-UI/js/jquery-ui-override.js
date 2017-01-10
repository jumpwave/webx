(function() {
	$.extend($.ui.dialog._proto, {
		_createButtons : function() {
			var _createButtons = $.ui.dialog._proto._createButtons;
			return function(buttons) {
				// if (!this.options.maybeRefresh) {
				// return _createButtons.apply(this, arguments);
				// }
				var that = this, hasButtons = false, maybeRefresh = this.options.maybeRefresh;
				// if we already have a button pane, remove it
				this.uiDialogButtonPane.remove();
				this.uiButtonSet.empty();
				if (typeof buttons === "object" && buttons !== null) {
					$.each(buttons, function() {
						return !(hasButtons = true);
					});
				}
				if (hasButtons) {
					$.each(buttons, function(name, props) {
						var button, click;
						props = $.isFunction(props) ? {
							click : props,
							text : name
						} : props;
						// Default to a non-submitting button
						props = $.extend({
							type : "button"
						}, props);
						// Change the context for the click callback to be the
						// main element
							click = maybeRefresh ? props.click.toString() : props.click;
						props.click = function() {
							var callback = that.options.id == null ? window : window.frames[that.options.id];
							callback = callback || window;
							if (callback.$) {
								callback = callback.$;
								if (callback.callback) {
									callback = callback.callback;
								}
							}
							if (typeof (click) === 'string') {
								var frames = that.options.frames;
								var frame = window;
								if (frames != null) {
									for ( var i = frames.length; i > 0; i--) {
										frame = frame.frames[frames[i - 1]];
									}
								}
								(function(frame, callback) {
									var f = new frame.Function('var t = ' + click + ';return t.apply(this,arguments);');
									try{f.call(that, that, callback, that.element[0]);
									}catch (e) {}
								})(frame, callback);
							} else {
								try{
									click.call(that, that, callback, that.element[0]);
								}catch(e){}
								
							}
						};
						button = $("<button></button>", props).appendTo(that.uiButtonSet);
						if ($.fn.button) {
							button.button();
						}
					});
					this.uiDialog.addClass("ui-dialog-buttons");
					this.uiDialogButtonPane.appendTo(this.uiDialog);
				} else {
					this.uiDialog.removeClass("ui-dialog-buttons");
				}

			};
		}()
	});

 /*   $.widget("ui.tabs", $.ui.tabs, {

            tabPositionCss:function(obj){
                this.position=obj.options.tabPosition.split("-");
                if(this.position[0]=="bottom"){
                    obj.tablist.addClass("borderTop");
                    obj.tabs.addClass("hiddenBorderTop ui-corner-bottom").removeClass("ui-corner-top");
                    obj.tablist.insertAfter(obj.element.find(".tab-content"))
                }
                if(this.position[0]=="left"){
                    obj.element.addClass("tabs-left clearfix");
                    obj.tabs.removeClass("ui-corner-top").addClass("ui-corner-left");
                    obj.element.find(".tab-content").css({"width":obj.element.innerWidth()-obj.tablist.outerWidth()-23,"float":"right"})
                    this.position[1]=null;
                }
                if(this.position[0]=="right"){
                    obj.element.addClass("tabs-right clearfix");

                    obj.tabs.removeClass("ui-corner-top").addClass("ui-corner-right");
                    obj.element.find(".tab-content").css({"width":obj.element.innerWidth()-obj.tablist.outerWidth()-23,"float":"left"})
                    this.position[1]=null;
                }
                if(this.position[1]=="right"){
                    var list=obj.tablist.children();
                    for(var i= 0,len=list.length,num=Math.floor(len/2);i<num;i++){
                        var temp;
                        temp=list[i];
                        list[i]=list[len-1-i];
                        list[len-1-i]=temp;
                    }
                    obj.tablist.append(list)  ;
                    list.css("float","right") ;
                }
            },
        _toggle : function(event, eventData) {
           this._superApply(arguments) ;
            if(this.position[0]=="left"||this.position[0]=="right"){
                var heightList=eventData.newPanel.outerHeight();
                eventData.newTab.parent().css({"height":heightList});
            }
        },
        _refresh : function() {
            this._super() ;
            if(this.position[0]=="left"||this.position[0]=="right"){
                var heightList= this.element.outerHeight();
                var heightLi= this.tabs.parent().outerHeight();
                this.tablist.css({"height":heightList,"min-height":heightLi});
            }
        }


    });    */

	$.widget("ui.autocomplete", $.ui.autocomplete, {

		_initSource : function() {
           if(this.options.isAddHiddenInput){
               this.element.after("<input type='hidden' name='"+this.options.hiddenInputName+"' id='"+this.options.hiddenInputId+"' value=''>")
           }
			var array, url, that = this;
			this.maxSourceLength = this.options.maxSourceLength || 800;
			if ($.isArray(this.options.source)) {
				array = this.options.source;
				this.source = function(request, response) {
                    if(typeof that.filter == 'function'){
                        response(that.filter(array, request.term));
                    }else{
                        response($.ui.autocomplete.filter(array, request.term));
                    }

				};
			} else if (typeof this.options.source === "string") {
				url = this.options.source;
				this.source = function(request, response) {
					if (that.xhr) {
						that.xhr.abort();
					}
					that.xhr = $.ajax({
						url : url,
						data : request,
						dataType : "json",
						success : function(data) {
                            this.data=data;
							response(data);
						},
						error : function() {
							response([]);
						}
					});
				};

			} else if ($.isPlainObject(this.options.source)) {
				if (that.xhr) {
					that.xhr.abort();
				}
				that.xhr = $.ajax(this.options.source);
				that.xhr.done(function(data){
					if (!that.cacheData)
							that.cacheData = that.handleData(data);
					that._trigger('ajaxBack');
				});
				this.source = function(request, response) {
					that.xhr.done(function(data) {
						if (!that.cacheData)
							that.cacheData = that.handleData(data);
						var array = that.filter(that.cacheData, request.term);
						response(array);
					});
				}
             
			} else {
				this.source = this.options.source;
			}
		},
		_create: function() {
			this._superApply(arguments);
            this._on(this.element,{
                'click' : function(event){
                	this.options.showNoMatch=false;
					var text = this.element.val();
                    this.search(text);
                    
                    
                }
            });
            this._off(this.menu.element, 'menuselect');
            this._on(this.menu.element, {
						'menuselect': function (event, ui) {

					// back compat for _renderItem using item.autocomplete, via #7810
					// TODO remove the fallback, see #8156
					var item = ui.item.data("ui-autocomplete-item") || ui.item.data("item.autocomplete"), previous = this.previous;
					
					if(!item){// 解决IE下再调试状态按回车会进入改逻辑
						return;
						}

					// only trigger when focus was lost (click on menu)
					if (this.element[0] !== this.document[0].activeElement) {
						this.element.focus();
						this.previous = previous;
						// #6109 - IE triggers two focus events and the second
						// is asynchronous, so we need to reset the previous
						// term synchronously and asynchronously :-(
						this._delay(function() {
							this.previous = previous;
							this.selectedItem = item;
						});
					}
					
					if(item.value == 'loadMore'){
						this.loadMore(item.tValue);
						return;
					}
					if (false !== this._trigger("select", event, {
						item : item
					})) {
							this._value(item.label || item.value);
					}
					
					
					// reset the term after the select event
					// this allows custom select handling to work properly
					this.term = this._value();
                    if(this.options.isAddHiddenInput&&(item.id!==undefined)){
                         $('#'+this.options.hiddenInputId).val(item.id);
                    }

                    this.close(event);
					this.selectedItem = item;

				}
			}) ;
            this._off(this.element, 'blur');
            this._on(this.element,{
                'blur' : function(event){
                    if (this.cancelBlur) {
                        delete this.cancelBlur;
                        return;
                    }
                     this.searchID();


                    clearTimeout(this.searching);
                    this._change(event);
                    this.close(event);

                }
            });
		},
		 getDatas:function(){
            var datas=null;
            if (typeof this.options.source === "string") {
                datas=this.data;
            } else if ($.isPlainObject(this.options.source) || Object.prototype.toString.call(this.options.source) == '[object Function]') {
                if(this.cacheData!==undefined)
                    datas =this.cacheData;
            } else {
                datas = this.options.source;
            }
            return datas;
        },
        searchID:function(){
			if(this.selectedItem!==null)
                return;
             var datas=this.getDatas();
			 this.term=this.element.val();//防止itextClear清空后值仍然为之前的，导致清空的值被还原
			if(datas!==null){
				var data=this.filter(datas,this.term);


	            if(!data.length){
                    this.element.val("");
                    if(this.options.isAddHiddenInput)
	            	$('#'+this.options.hiddenInputId).val("");
	            	
	            }else{
                    if(this.options.isAddHiddenInput)
	            	$('#'+this.options.hiddenInputId).val("");
	            	for(var i=0,len=data.length;i<len;i++){
						if(data[i].label==this.term){
                            if(this.options.isAddHiddenInput)
							$('#'+this.options.hiddenInputId).val(data[i].id);
							this.element.val(this.term);
							break;
						}else{
							this.element.val("");
						}
					}

				}
        	return data;
			}else{
				return;
			}
            

        },





		_search : function(value) {
			this.term = value;
			return this._superApply(arguments);
		},
		filter : function(cacheData, term) {
			return $.ui.autocomplete.filter(cacheData, term);
		},
		loadMore : function(array){
			var that = this;
				var removed = array.splice(that.maxSourceLength, array.length - that.maxSourceLength);
				that.removedValue = removed;
				array = that._normalize(array);
				var ul = that.menu.element;
                //防止在IE中remove加载更多后，滚动条直接滚回头部
				//ul[0].removeChild(ul.get(0).lastChild);
                var $last = ul.eq(0).find('li').last();
                that.menu.active = $last.prev();
                $last.remove();


				$.each(array, function(index, item) {
					that._renderItemData(ul, item);
				});
				if(that.removedValue.length > 0){
					var moreItem = {label:language.text('ui.loadMore'),value:'loadMore',tValue:this.removedValue};
					that._renderItemData(ul, moreItem);
				}
				that.menu.refresh();
				that.cancelBlur = true;
				that._delay(function() {
					delete that.cancelBlur;
				});
				var menuElement = that.menu.element[0];
					if (!$(event.target).closest(".ui-menu-item").length) {
						that._delay(function() {
							var thaz = that;
							that.document.one("mousedown", function(event) {
								if (event.target !== thaz.element[0] && event.target !== menuElement
										&& !$.contains(menuElement, event.target)) {
									thaz.close();
								}
							});
						});
					}
				
		},
		__response : function(array) {

            if(array.length==0&&this.term!=='')
                this.options.showNoMatch=true;
            else
                this.options.showNoMatch=false;
			if (this.maxSourceLength !== true) {
				if (array.length > this.maxSourceLength) {
					var removed =  array.splice(this.maxSourceLength, array.length - this.maxSourceLength);
					 this.removedValue = removed;
				}else{
					this.removedValue = [];
				}
			}
			this._superApply(arguments);
			if (this.options.showNoMatch === true && !this.options.disabled && !array.length && !this.cancelSearch) {
                this._suggest(array);
                this._trigger("open");
			}
		},
		handleData : function(data) {
			var result = [];
			
			if (this.options.sourceDataType === 'tree'){
				if(!!this.options.onlyLeaf){
					var newData = this.treeHandleData(data);
					return this.filterData(newData);
				}
				return this.treeHandleData(data);
			}
			return data;
		},
		_renderMenu : function(ul, items) {
			var that = this;
			if (items && items.length) {
				$.each(items, function(index, item) {
					that._renderItemData(ul, item);
				});
				if(this.removedValue && this.removedValue.length > 0){
					var moreItem = {label:language.text('ui.loadMore'),value:'loadMore',parentLabel:'[]',tValue:this.removedValue};
					that._renderItemData(ul, moreItem);
				}
			} else {
				if (this.options.showNoMatch === true) {
					$([ "<li><span>" + language.text('ui.mismatching')+":<em>", this.term, "</em></span></li>" ].join('')).appendTo(ul);
				}
			}
		},
		_renderItem : function(ul, item) {
            if (this.options.sourceDataType === 'tree' && item.value != 'loadMore') {
                var parentLabel = item.parentLabel.join('>');
                return $("<li>").append($("<a>").attr('title',item.label+"\n" + parentLabel).text(item.label).append($('<em>').text(parentLabel))).appendTo(ul);
            }
            return $("<li>").append($("<a>").attr('title',item.label).text(item.label)).appendTo(ul);
		},
		doTreeHandleData : function(result, data) {
			if (!data.children) {
				return;
			}
			var parentLabel = data.parentLabel;
			var newLabel = parentLabel.concat([ data.label ]);
			for ( var i = 0; i < data.children.length; i++) {
				var d = data.children[i];
				d.parentLabel = newLabel;
				result.push(d);
				this.doTreeHandleData(result, d);
			}
		},
		treeHandleData : function(data) {
			var result = [];
			if (data) {
				data.parentLabel = [];
				result.push(data);
				this.doTreeHandleData(result, data);
			}
			return result;
		},
		filterData : function(data){
			var result = [];
			for(var i = 0; i < data.length; i++){
				if(!data[i].children)
					result.push(data[i]);
			}
			return result;
		}

	});


    (function( $ ) {
        $.widget( "custom.combobox", {
            options : {
            },
            _create: function() {
                this.wrapper = $( "<span>" )
                    .addClass( "custom-combobox" )
                    .insertAfter( this.element );

                this.element.hide();
                this._createAutocomplete();
                this._createShowAllButton();
            },

            _createAutocomplete: function() {
                var selected = this.element.children( ":selected" ),
                    value = selected.val() ? selected.text() : "",that = this;

                this.input = $( "<input>" )
                    .appendTo( this.wrapper )
                    .val( value )
                    //.attr( "title", "" )
                    .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
                    .autocomplete($.extend({
                        delay: 0,
                        minLength: 0,
                        source: $.proxy( this, "_source" )
                    },this.options))
                    .tooltip({
                        tooltipClass: "ui-state-highlight"
                    });
					this.input.attr("name",this.element.attr("name")+"_1");
				if(this.element.attr("vtype")!==""||this.element.attr("vtype")!==undefined){
					 this.input.attr("vtype",this.element.attr("vtype"));
				}
                var data = [],itemData;
                this.input.data('autocomplete').source({
                    term : ''
                },function(content){
                   data = content;
                });
                if(typeof this.options.autocompleteFilter == 'function'){
                    this.input.data('ui-autocomplete').filter = function(){
                        return this.options.autocompleteFilter.apply(null,arguments);
                    }
                }
                itemData =   this.input.data('autocomplete')._normalize(data);
                if(!this.element.children('option').length)
                    this._renderOption(itemData);

                this._on( this.input, {
                    autocompleteselect: function( event, ui ) {
                        if(ui.item.option){
                            ui.item.option.selected = true;
                            this._trigger( "select", event, {
                                item: ui.item.option
                            });
                        }else{
                            that.element.children( "option" ).each(function() {
                                if ( $( this ).text().toLowerCase() === ui.item.label.toLowerCase() ) {
                                    this.selected = valid = true;
                                    that._trigger( "select", event, {
                                        item: this
                                    });
                                    return false;
                                }
                            });

                        }
                        if(this.input.val() != ui.item.label){
                            this.element.trigger('change');
                        }
                    },

                    autocompletechange: "_removeIfInvalid"
                });
            },

            _createShowAllButton: function() {
                var input = this.input,
                    wasOpen = false;

                $( "<a>" )
                    .attr( "tabIndex", -1 )
                    //.attr( "title", "Show All Items" )
                    //.tooltip()
                    .appendTo( this.wrapper )
                    .button({
                        icons: {
                            primary: "ui-icon-triangle-1-s"
                        },
                        text: false
                    })
                    .removeClass( "ui-corner-all" )
                    .addClass( "custom-combobox-toggle ui-corner-right" )
                    .mousedown(function() {
                        wasOpen = input.autocomplete( "widget" ).is( ":visible" );
                    })
                    .click(function() {
                        input.focus();

                        // Close if already visible
                        if ( wasOpen ) {
                            return;
                        }

                        // Pass empty string as value to search for, displaying all results
                        input.autocomplete( "search", "" );
                    });
            },

            _renderOption : function(data){
                var html = [];
                $.each(data, function(index, item) {
                   html.push('<option value="'+ item.value || item.label +'"');
                    html.push('">' + item.label);
                    html.push('</option>');
                });
                this.element.html(html.join(''));
            },

            _source: function( request, response ) {
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
                response( this.element.children( "option" ).map(function() {
                    var text = $( this ).text(),value = $(this).val();
                    if ( this.value && ( !request.term || matcher.test(text) ) )
                        return {
                            label: text,
                            value: value,
                            option: this
                        };
                }) );
            },

            _removeIfInvalid: function( event, ui ) {

                // Selected an item, nothing to do
                if ( ui.item ) {
                    return;
                }

                // Search for a match (case-insensitive)
                var value = this.input.val(),
                    valueLowerCase = value.toLowerCase(),
                    valid = false;
                this.element.children( "option" ).each(function() {
                    if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                        this.selected = valid = true;
                        return false;
                    }
                });

                // Found a match, nothing to do
                if ( valid ) {
                    return;
                }

                // Remove invalid value
                this.input
                    .val( "" ) ;
                    //.attr( "title", value + " 没有匹配项！" );
                this.element.val( "" );
                if(this.options.toolTipTime){
                    this.input.tooltip( "open" );
                    this._delay(function() {
                        this.input.tooltip( "close" ).attr( "title", "" );
                    }, this.options.toolTipTime);
                }
                //this.input.autocomplete( "instance" ).term = "";
            },

            _destroy: function() {
                this.wrapper.remove();
                this.element.show();
            }
        });
    })( jQuery );

})();


/*(function () {

	var _dialog = function (options, _href) {
        var options = options || {},
            base = $('base').attr('href') || '',
            el, src, iSrc, ajax, suc;

        !options.id && (options.id = Math.round(Math.random() * 100000));

        // opionts有iframeSrc参数时, 弹出层生成iframe
        if (iSrc = options.iframeSrc) {
            src = (/^\/|^https?:\/\//i.test(iSrc) ? '' : base) + iSrc;
            options.iframeSrc = src;
            el = $(_dialog.parseStr(_dialog.defalut.ifrHTML, {
                id: options.id,
                href: _href,
                src: src
            })).appendTo('body');

            el.find('iframe').bind('load', function () {
                el.find('.loading-overlay').hide();
                options.load && options.load();
            });

        // options有ajax时, 通过load调用弹出层内容
        } else if (ajax = options.ajax){
            src = (/^\/|^https?:\/\//i.test(ajax.url) ? '' : base) + ajax.url;
            el = $(_dialog.parseStr(_dialog.defalut.ifrHTML, {
                id: options.id
            })).appendTo('body');

            suc = ajax.success;
            el.load($.extend(true, ajax, {
                url: src,
                success: function () {
                    suc && suc.apply(this, Array.prototype.slice(arguments));
                    options.load && options.load();
                }
            }));

        // options有el时，clone元素
        } else if (options.el) {
            el = $(options.el).appendTo('body');
        } else {
            return
        }
        options.el = el;
        _dialog.run(options)
    };

   
    _dialog.run = function (options) {
    	
        var close = options.close, el = options.el;

        options = $.extend(true, {
            autoOpen : true,
            modal : true,
            resizable : false,
            width : 500,
            height : 500
        }, options, {
            close: function () {
                top.iframeOn_El = null;
                close && close.apply(this, arguments);
                el.remove();
            }
        });

        top.iframeOn_El = el;
        return el._dialog(options);
    };

   _dialog.parseStr = function (str, obj) {
        return str.replace(/{([^}]*)}/g, function (a, b) {
            return obj[b] || '';
        })
    };

   _dialog.defalut = {
        'ifrHTML': '<div class="dialog" name="{id}" parentSrc="{href}" style="padding:0;overflow:hidden;">' +
                             '<div class="loading-overlay">' +
                                '<div class="loading-m"><i></i><span>\u6b63\u5728\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e</span>' +
                                '</div><div class="shadow"></div>' +
                             '</div>' +
                             '<iframe src="{src}" dialogIframe="true" id="{id}" name = "{id}" frameborder="0" scrolling="auto" class="autoIframe dialog-frame"></iframe>' +
                        '</div>',
       'ajaxHTMl': '<div class="dialog" id="{id}"></div>'
    };

	// 当$.dialog(opt)调用时，调用根页面的_dialog
    $.dialog = function (opt) {
        opt = opt || {};
        top.dialog(opt, location.href);
    };
	
	// 当$(el).dialog(opt)调用时，调用根页面的_dialog在opt中加入el属性
    $.fn.dialog = function (opt) {
        opt = opt || {};
        opt.el = this.get(0).outerHTML;

        top.dialog(opt);
    };
	
    window.dialog = _dialog;
})()*/