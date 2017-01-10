/**
 * @fileOverview 弹出框控件
 * @description
 * 弹出框控件，基于jquery-ui的核心
 */
(function($, undefined) {
    var sizeRelatedOptions = {
        buttons : true,
        height : true,
        maxHeight : true,
        maxWidth : true,
        minHeight : true,
        minWidth : true,
        width : true
    }, resizableRelatedOptions = {
        maxHeight : true,
        maxWidth : true,
        minHeight : true,
        minWidth : true
    };
    $._fixIframe = function (elem) {
        var iframe = $("<iframe id='blankIframe' name='blankIframe' style='position:absolute;z-index:-1;filter:alpha(opacity=0);' frameborder='no' border='0' "
            + (/msie 8/i.test(navigator.userAgent) ? "src='javascript:false;'" : "" ) +"></iframe>");
        iframe.css({
            width: /msie 6/i.test(navigator.userAgent) ? elem.css('width'):'100%',
            height:  /msie 6/i.test(navigator.userAgent) ? elem.css('height'):'100%',
            top: 0,
            left: 0
        }).appendTo(elem);
    };

    $.widget("hk.pop", {
        options: {
            popClass: 'pop',
            // 遮罩层设置
            modal: true,
            overlayTrans: .5,
            overlayClass: 'pop_overlay',
            // 内容层设置
            wrap: null,
            content: null,
            leaveClose: false,
            position: {
                my : "center",
                at : "center",
                of : window,
                collision : "fit",
                // ensure that the titlebar is never outside the document
                using : function(pos) {
                    var topOffset = $(this).css(pos).offset().top;
                    if (topOffset < 0) {
                        $(this).css("top", pos.top - topOffset);
                    }
                }
            },
            closeDestroy: false,
            leaveclose: false,
            leavecloseTM: 200,
            reserve: true,
            width: 500,
            height: 'auto',
            minHeight : 150,
            iframeFix: true,
            show: 'fade', // 显示效果兼容ui effects API
            stack : true,
            zIndex: 1000,
            autoOpen: true,
            draggable: false,
            dragHandle: '.popTitle'
        },
        _create: function () {
            this.initPopup();
        },

        initPopup: function () {
            var opts = this.options,
                that = this,
                elem = this.element,
                wrap, content;

            this.oldPosition = {
                parent : this.element.parent(),
                index : this.element.parent().children().index(this.element)
            };
            this.wrap = wrap = (this.wrap || $('<div>'))       //tabIndex是保证对话框能滚到中间的关键属性
                .attr("tabIndex", -1)
                .appendTo('body')
                .addClass(opts.popClass)
                .addClass(opts.type)
                .css({ //这里的CSS注释掉了position:absolute的样式，这样会影响dialog的position的计算，导致对话框不居中。
                    'display': 'none',
                    'zIndex': opts.zIndex,
                    'box-sizing':'border-box'
                });
            this.content = content = (this.content || wrap).append(elem.show());

            // TODU: width设在最外层, height设在内层是否合理
            this.wrap.css({width: opts.width,height: opts.height});

            if (opts.draggable && $.fn.draggable) {
                this.drag();
            }

            if (opts.iframeFix  && !opts.modal ) {
                $._fixIframe(this.wrap);
            }
            this.bindEvent();
            this._isOpen = false;
            if (!this.element.data('pop')) {
                this.element.data('pop', this.element.data(this.widgetName));
            }
        },
        widget : function() {
            return this.wrap;
        },
        _init : function(){
            if (this.options.autoOpen) {
               this.open();
            }
        },
        drag: function () {
            var that = this, options = this.options,containt;

            //这句话导致无法拖动
           /* if($.isPlainObject(options.position)){
                containt =  options.position.of;
            }*/

            function filteredUi(ui) {
                return {
                    position : ui.position,
                    offset : ui.offset
                };
            }

            this.wrap.draggable({
                handle : this.options.dragHandle,
                iframeFix: this.options.iframeFix,
                containment : containt ? containt : 'document',
                start : function(event, ui) {
                    $(this).addClass("pop-dragging");
                    that._trigger("dragStart", event, filteredUi(ui));
                },
                drag : function(event, ui) {
                    that._trigger("drag", event, filteredUi(ui));
                },
                stop : function(event, ui) {
                    options.position = [ui.position.left - that.document.scrollLeft(),
                        ui.position.top - that.document.scrollTop()];
                    $(this).removeClass("pop-dragging");
                    that._trigger("dragStop", event, filteredUi(ui));
                }
            });

        },

        _position : function (position) {
            var obj = {
                of : window,
                collision : this.options.positionCollision
            };

            if ($.isPlainObject(position)) {
                position = $.extend(obj, position);
            } else if ($.isArray(position)) {
                if (typeof(position[0]) == 'string' && typeof(position[1]) == 'string') {
                    position = position.join(' ');
                    position = $.extend(obj, {
                        my : position,
                        at : position
                    });
                } else if (position[0].constructor == Number && position[1].constructor == Number) {
                    position = $.extend(obj, {
                        of : document,
                        my : 'left top',
                        at : 'left top',
                        offset : position[0] + ' ' + position[1]
                    });
                } else {
                    position = ['center', 'center'];
                }
            }else if(typeof position === 'string'){
                if(/-/.test(position)){
                    var pos = position.split('-');
                    if(/top|bottom/.test(pos[0]) || /left|right/.test(pos[1]))
                        position = $.extend(obj,{my:pos[1] + ' ' + pos[0] ,at :pos[1] + ' ' + pos[0]});
                    else
                        position = $.extend(obj,{my:pos[0] + ' ' + pos[1] ,at :pos[0] + ' ' + pos[1]});
                }
            } else {
                position = ['center', 'center'];
            }

            if ($.isPlainObject(position)) {
                var isVisible = this.wrap.is(':visible');
                if (!isVisible) {
                    this.wrap.show();
                }
                this.wrap.css({
                    top : 0,
                    left : 0
                }).position(position);
                if (!isVisible) {
                    this.wrap.hide();
                }
            } else {
                //this._position(position);
            }
        },
        _close: function (event) {
            var maxZ,that = this,thisZ;
            if (!this._isOpen) {
                return;
            }
            var opts = this.options, callback;
            if (this._trigger('beforeClose', event, this.wrap) === false) {
                return false;
            }
            if (this.modal) {
                $.overlay.destroy(this.modal);
            }

            maxZ = 0;
            $(".popWrap").each(function() {
                if (this !== that.wrap[0]) {
                    thisZ = $(this).css("z-index");
                    if (!isNaN(thisZ)) {
                        maxZ = Math.max(maxZ, thisZ);
                    }
                }
            });
            $.hk.pop.maxZ = maxZ;
            callback = $.isFunction(event) ? event : function () {};

            /*if ($.effects && ((isObj=$.isPlainObject(opts.show)) || typeof opts.show === 'string')) {
                if (isObj) {
                    this.wrap.hide(opts.show.effect||'fade', opts.show, opts.show.duration||500, callback)
                } else {
                    this.wrap.hide(opts.show, {}, 500, callback)
                }
            } else {
                this.wrap.hide();
                callback();
            } */
            this.wrap.hide();
            callback();
            try{
                opts.afterclose &&  opts.afterclose();
            }catch(e){}
            this._isOpen = false;
            this._trigger('close');
        },
        close: function () {
            this.clearCloseTM();
            if(window == top && $.isOcx && $.isOcx.needModal() && document.getElementById("mainFrame")){
                document.getElementById("mainFrame")&&$.isOcx.removeModal(document.getElementById("mainFrame").contentWindow);
            }
            if (this.options.closeDestroy) {
                return this.destroy();
            }
            this._close();
        },
        destroy: function () {
            var that = this, opts = this.options;
            //关闭时清除openPopWinOptList
           for(var i= 0,len=openPopWinOptList.length;i<len;i++){
               if(opts.msg==openPopWinOptList[i].msg && opts.level==openPopWinOptList[i].level && opts.title==openPopWinOptList[i].title){
                   openPopWinOptList.splice(i,1);
               }
           }

            this._close(function () {
                $.Widget.prototype.destroy.apply(that, arguments);
                if (opts.reserve) {
                    //FIXME 这样做会带来一个问题，iframe或者ajax每生成一次都会往body上append一层元素
                    //that.element.hide().appendTo('body');
                }
                if(/msie 8/i.test(navigator.userAgent))
                	that.wrap.find('iframe').not('#blankIframe').attr('src','about:_blank');

                that.wrap.remove();
            })
        },
        _destroy : function(){
            var next, oldPosition = this.oldPosition;

            if (this.originalTitle) {
                this.element.attr("title", this.originalTitle);
            }
            
            if(this.options.iframeSrc || this.options.ajax || this.options.closeDestroy )
            	return;
            	   this.element.hide().appendTo("body");

            next = oldPosition.parent.children().eq(oldPosition.index);
            // Don't try to place the dialog next to itself (#8613)
            if (next.length && next[0] !== this.element[0]) {
                next.before(this.element);
            } else {
                oldPosition.parent.append(this.element);
            }
        },
        clearCloseTM: function () {
            clearTimeout(this.leaveTM);
            this.leaveTM = null;
        },
        open: function () {
            var opts = this.options,
                elem = this.element,
                that = this,
                isObj,hasFocus;
            if (this._isOpen) {
                return;
            }
            
            //this.modal&& this.modal.show();
            // 当鼠标移除后自动消失
            if (opts.autoclose) {
                this.wrap.one('mousemove.pop', function () {
                    that.clearCloseTM();
                    that.wrap.one('mouseleave.pop', function () {
                        that.leaveTM = setTimeout(function () {
                            that.close();
                        }, opts.autoclose);
                    })
                })
            }
            this._size();
            this._position(opts.position);
            this.show();
			//防止出现多个弹出框后，蒙版叠加变黑
            this.modal = (opts.modal&&(openPopWinOptList.length==0)) ? $.overlay.create(opts) : null;
            this.moveToTop(true);
            // set focus to the first tabbable element in the content area or the first button
            // if there are no tabbable elements, set focus on the dialog itself
            hasFocus = this.element.find(":tabbable");
            if (!hasFocus.length) {
                hasFocus = this.element.find(":tabbable");
                if (!hasFocus.length) {
                    hasFocus = this.wrap;
                }
            }
            hasFocus.eq(0).focus();


        },
        _size : function(){
           var opts = this.options,
                that = this,
                nonContentHeight,minContentHeight,autoHeight;

            this.element.show().css({
                width : "auto",
                minHeight : 0,
                height : 0
            });

            nonContentHeight = this.wrap.css({
                height : "auto",
                width : opts.width
            }).outerHeight();

            minContentHeight = Math.max(0, opts.minHeight - nonContentHeight);

            if (opts.height === "auto") {
                // only needed for IE6 support
                if ($.support.minHeight) {
                    this.element.css({
                        minHeight : minContentHeight,
                        height : "auto"
                    });
                } else {
                    this.wrap.show();
                    autoHeight = this.element.css("height", "auto").height();
                    //if (!isVisible) {
                    //    this.uiDialog.hide();
                    // }
                    this.element.height(Math.max(autoHeight, minContentHeight));
                }
            } else {
                this.element.height(Math.max(opts.height - nonContentHeight, 0));
            } 
        },
        show : function(){
            var opts = this.options,
                that = this,
                callback,nonContentHeight,minContentHeight,autoHeight;
            callback = function () {
                that._isOpen = true;
                that._trigger('open', that.wrap, that);
            };
            if(window == top && $.isOcx && $.isOcx.needModal() && document.getElementById("mainFrame")){
                document.getElementById("mainFrame")&&$.isOcx.createModal(document.getElementById("mainFrame").contentWindow);
            }
			if(/msie 8|7|6/i.test(navigator.userAgent)){
				this.wrap.show();
				callback();
			}else{
				//先加入ui的effects
			   if ($.effects && ((isObj=$.isPlainObject(opts.show)) || typeof opts.show === 'string')) {
					if (isObj) {
						this.wrap.show(opts.show.effect||'fade', opts.show, opts.show.duration||500, callback)
					} else {
						this.wrap.show(opts.show, {}, 500, callback)
					}
				} else {
					this.wrap.show();
					callback();
				}
			}
            
		   
		  
        },
        // the force parameter allows us to move modal dialogs to their correct
        // position on open
        moveToTop : function(force, event) {
            var options = this.options, saveScroll;

            if ((options.modal && !force) || (!options.stack && !options.modal)) {
                return this._trigger("focus", event);
            }

            if (options.zIndex > $.hk.pop.maxZ) {
                $.hk.pop.maxZ = options.zIndex;
            }
            if (this.modal) {
                $.hk.pop.maxZ += 1;
               // $.hk.pop.overlay.maxZ = $.hk.pop.maxZ;
                this.modal.css("z-index", $.hk.pop.maxZ);
            }

            // Save and then restore scroll
            // Opera 9.5+ resets when parent z-index is changed.
            // http://bugs.jqueryui.com/ticket/3193
            saveScroll = {
                scrollTop : this.element.scrollTop(),
                scrollLeft : this.element.scrollLeft()
            };
            $.hk.pop.maxZ += 1;
            this.wrap.css("z-index", $.hk.pop.maxZ);
            this.element.attr(saveScroll);
            this._trigger("focus", event);

            return this;
        },
        bindEvent: function () {
            var that = this, opts = this.options;
            this.wrap.on('click', '[close],[data-close]', function () {
                that.close();
                return false;
            });
        }
    });

    $.overlay = {
        instances : [],
        create : function (opts) {
            var that = this, elem;
            if (this.instances.length === 0) {
                $(window).bind('resize.overlay', function () {
                    that.resize()
                });
            }
            elem = $('<div></div>').appendTo('body').addClass(opts.overlayClass).css({
                width : that.width(),
                height : that.height(),
                zIndex: opts.zIndex - 1
            });
            // FIXME: 修改ie8 opacity 存在缺陷的问题
            this.fixOverlayTrans(elem, opts)
            if (opts.iframeFix) {
                $._fixIframe(elem);
            }
            this.instances.push(elem);
            return elem;
        },
        fixOverlayTrans: function (elem, opts) {
            if (opts.overlayTrans !==1 && (/msie 8/i).test(navigator.userAgent)) {
                elem.css('filter','alpha(opacity='+ opts.overlayTrans * 100+')');
            } else {
                elem.css('opacity', opts.overlayTrans);
            }
        },
        destroy : function (elem) {
            this.instances.splice($.inArray(this.instances, elem), 1);
            if (this.instances.length === 0) {
                $(window).unbind('.overlay');
            }
            elem.remove();
        },
        height : function () {
            var d = document, b = d.body, e = d.documentElement;
            return Math.max( Math.max( b.scrollHeight, e.scrollHeight ), Math.max( b.clientHeight, e.clientHeight) )
        },
        width : function () {
            var d = document, b = d.body, e = d.documentElement;
            return Math.max( Math.max( b.scrollWidth, e.scrollWidth ), Math.max( b.clientWidth, e.clientWidth) )
        },
        resize : function () {
            var that = this;
            $.each(this.instances, function () {
                $(this).css({
                    width: 0,
                    height: 0
                }).css({
                        width : that.width(),
                        height : that.height()
                    });
            })
        }
    };

    $.extend($.hk.pop, {
        uuid : 0,
        maxZ : 0
    });


    $.widget("hk.popWin", $.hk.pop, {
        options : {
            popClass : 'popWin',
            modal: true,
            overlayTrans : .25,
            closeText : 'close',
            closeButton: true,
            title : '',
            draggable : false,
            // FIX: 这里的class要做修改
            buttonDefaultClass: 'buttonM bDefault',
            buttons: []
        },
        _create : function () {
            var opts = this.options,
                that = this,
                poptitle, popclose;

            if (!this.wrap) {
                this.createHTML();
            }
            
            this._createButtons(opts.buttons);
            poptitle = this.wrap.find('.popTitle h3');
            popclose = this.wrap.find('.popClose');
            // 初始化title
            poptitle.html(opts.title || this.element.attr("title"));

            // 初始化close
            if (opts.closeButton) {
                popclose.html(opts.closeText)
            } else {
                popclose.hide();
            }

            if (!opts.title && !opts.closeButton) {
                poptitle.parent().hide();
            }
            this._super();
        },
        _createButtons : function(buttons){
            var that = this;
            this.button.empty();
            // 创建button
            if (($.isArray(buttons) && buttons.length>0) || (typeof buttons === "object" && buttons !== null)) {
                $.each(buttons, function (name, props) {
                    var clickfn = props.click,
                        isfn = typeof clickfn === 'function',
                        maybeRefresh = that.options.maybeRefresh,
                        button,click;

                    props = $.isFunction(props) ? {
                        click : props,
                        text : name
                    } : props;

                    props = $.extend({
                        type : "button"
                    }, props);

                    click = maybeRefresh ? props.click.toString() : props.click;
                    var callback = that.options.id == null ? window : window.frames[that.options.id];
                    callback = callback || window;
                    if (callback.$) {
                        callback = callback.$;
                        if (callback.callback) {
                            callback = callback.callback;
                        }
                    }
                    if (typeof click === 'string') {
                        props.click = function() {
                            var fn = new that.options.originalPage.Function('return (' +click+ ').apply(this, arguments)')
                            try {
                                fn.call(that, that,callback,that.element[0]);
                            } catch(e) {}
                        };
                    } else {
                        props.click = function () {
                            click.call(that, that,callback,that.element[0]);
                        }
                    }
                    button = $("<button></button>", props).appendTo(that.button);
                })
            } else {
                this.button.hide();
            }
        },
        _setOptions : function(options) {
            var that = this, resizableOptions = {}, resize = false;

            $.each(options, function(key, value) {
                that._setOption(key, value);

                if (key in sizeRelatedOptions) {
                    resize = true;
                }
                if (key in resizableRelatedOptions) {
                    resizableOptions[key] = value;
                }
            });

            if (resize) {
                this._size();
            }
            if (this.wrap.is(":data(resizable)")) {
                //this.wrap.resizable("option", resizableOptions);
            }
        },

        _setOption : function(key, value) {
            var isDraggable, isResizable, uiDialog = this.wrap;

            switch (key) {
                case "buttons" :
                    this._createButtons(value);
                    break;
                case "closeText" :
                    // ensure that we always pass a string
                   // this.uiDialogTitlebarCloseText.text("" + value);
                    break;
                case "dialogClass" :
                    //uiDialog.removeClass(this.options.dialogClass).addClass(uiDialogClasses + value);
                    break;
                case "disabled" :
                    if (value) {
                        uiDialog.addClass("ui-dialog-disabled");
                    } else {
                        uiDialog.removeClass("ui-dialog-disabled");
                    }
                    break;
                case "draggable" :
                    //isDraggable = uiDialog.is(":data(draggable)");
                    //if (isDraggable && !value) {
                    //    uiDialog.draggable("destroy");
                    //}

                    //if (!isDraggable && value) {
                   //     this._makeDraggable();
                    //}
                    break;
                case "position" :
                    this._position(value);
                    break;
                case "resizable" :
                    // currently resizable, becoming non-resizable
                   // isResizable = uiDialog.is(":data(resizable)");
                    //if (isResizable && !value) {
                     //   uiDialog.resizable("destroy");
                    //}

                    // currently resizable, changing handles
                    //if (isResizable && typeof value === "string") {
                    //    uiDialog.resizable("option", "handles", value);
                    //}

                    // currently non-resizable, becoming resizable
                    //if (!isResizable && value !== false) {
                     //   this._makeResizable(value);
                    //}
                    break;
                case "title" :
                    // convert whatever was passed in o a string, for html() to not throw up
                    this.wrap.find('.popTitle h3').html("" + (value || "&#160;"));
                    break;
            }

            this._super(key, value);
        },
        createHTML: function () {
            var that = this,
                opts = this.options;

            this.wrap = $(this.popWinTeml());
            this.content = this.wrap.find('.popContent');
            this.button = this.wrap.find('.popButton')
        },
        popWinTeml: function(){
            var dialogClass=this.options.dialogClass!==undefined? this.options.dialogClass:"";
			var borderStyle=/msie 8/i.test(navigator.userAgent)&&this.options.modal?'':'style="border: 1px solid #e4e4e4; -moz-border-radius: 3px; -webkit-border-radius: 3px; border-radius: 3px;"'
            return '<div class="popWrap '+dialogClass+'" '+borderStyle+'><div class="popInner">'+
                '<div class="popTitle"><a class="popClose" href="javascript:void(0)" close></a><h3></h3></div>'+
                '<div class="popContent"><div class="popContentbg"></div></div>'+
                '<div class="popButton" ></div>'+
                '</div></div>'
        }
    });

    $.widget("hk.popTips", $.hk.popWin, {
        options : {
            popClass : 'popTips',
            tipsType : 'top',
            tipsTarget: null,
            offset: 5,
            show: false,
            modal: false,
            isBindLeave: true,
            isUpdataMsg: true,
            isarrow: true,
            draggable: false,
            arrow : 'left',
            width : 'auto',
            autoOpen: false,
            closeButton: false,
            showTipsClose : false,
            positionCollision : 'none'
        },
        _create: function () {
            var opts = this.options,
                that = this;
            this.target = this.element;
            this.element = $('<span>');

            this.updataMsg();
            this.createHTML();

            if (opts.isarrow) {
                $('<i><b></b></i>')
                    .addClass('tips')
                    .prependTo(this.wrap);
            }

            if(opts.isBindLeave) {
                this.target
                    .bind('mouseenter', function () {
                        that.open();
                    })
                    .bind('mouseleave', function () {
                        that.close();
                    })
            }

            $.hk.popWin.prototype._create.apply(this);
        },

        updataMsg: function () {
            var target = this.target,
                msg = target.data('msg');

            this.element.html(msg);
        },
        updataTipsType: function () {
            var opts = this.options,
                pos = this.target.data('position') || opts.tipsType;

            this.wrap
                .removeClass('popTips-' + opts.tipsType)
                .addClass('popTips-' + pos);

            opts.tipsType = pos;
            return pos;
        },
        open: function () {
            if (this.options.isUpdataMsg) {
                this.updataMsg()
            }
            $.hk.popWin.prototype.open.call(this)
        },
        _position: function () {
            var opts = this.options,
                pos = opts.position,
                type = this.updataTipsType(),
                ofs = opts.offset,
                mypos;
            // 当potions.position为对象时按传进来的参数操作
            if (!$.isPlainObject(pos)) {
                switch(type) {
                    case 'top':
                        mypos = 'bottom';
                        break;
                    case 'bottom':
                        mypos = 'top';
                        break;
                    case 'right':
                        mypos = 'top';
                        break;
                    case 'left':
                        mypos = 'top';
                        break;
                    default:
                        type='top'
                        mypos = 'bottom'
                }

                opts.position = {
                    of: this.target,
                    my: (type == 'left' ? 'right' : 'left') + ' ' + mypos,
                    at: (type== 'right' ? 'right' : 'left') + ' ' + (type == 'bottom' ? 'bottom' : 'top'),
                    offset: (type=='top'||type=='bottom'?'0':type== 'left'?(-ofs):ofs) + ' ' + (type=='left'||type=='right'?'0':type== 'top'?(-ofs):ofs)
                }
            }

            $.hk.popWin.prototype._position.call(this, opts.position);
        }

    });
}(jQuery));


(function( $ ) {
    $.widget("hk.popover",{
        options : {
            placement: "right",
            title:"",
            content:"",
            width:280,
            classTitle:"",
            classContent:""

        },
        //生成HTML，事件绑定
        _create:function(){
            var that = this;
            this.element.on("click", function(){
                if(!that.tip){
                    that.createHTML();
                    that.position();
                    that.tip.delegate('.popover1-close','click',function(){that.tip.remove();that.tip=null;return false;});
                }else{
                    that.tip.remove();
                    that.tip=null;
                }
            });
        },

        position:function(){
            var tp,$tip,posTop,posLeft,elementPos,posWidth,posHeight,actualWidth,actualHeight,placement1;
            $tip = this.tip;
            $tip.css({ "top": 0, "left": 0, "display": "block" });
            elementPos=this.getElementPos(this.element);
            posTop= elementPos.top;
            posLeft= elementPos.left;
            posWidth=this.element.outerWidth();    //this.element[0].offsetWidth;
            posHeight=this.element.outerHeight();//this.element[0].offsetHeight;
            actualWidth= $tip.outerWidth();
            actualHeight=$tip.outerHeight();
            placement1=this.options.placement;
            switch (placement1) {
                case 'bottom':
                    tp = {top: posTop + posHeight, left:posLeft + posWidth / 2 - actualWidth / 2};
                    break;
                case 'top':
                    tp = {top:posTop - actualHeight, left: posLeft + posWidth / 2 - actualWidth / 2};
                    break;
                case 'left':
                    tp = {top:posTop + posHeight / 2 - actualHeight / 2, left:posLeft - actualWidth};
                    break;
                case 'right':
                    tp = {top:posTop + posHeight / 2 - actualHeight / 2, left:posLeft + posWidth};
                    break
            }
            if(tp.top<=0){
                    tp.top=1;
                }
                if(tp.left<=0){
                    tp.left=1;
                }
                if(tp.left>=($(document).width()-actualWidth)){
                    tp.left=$(document).width()-actualWidth-1;
                }
           $tip.offset(tp);
        },
        createHTML: function () {
            var html=[],title;
            title=this.getTitle();
            html.push('<div class="popover1 '+this.options.placement+'" style="z-index:201"><div class="arrow"></div>');
            html.push( '<div class="popover1-inner" style="width:'+this.options.width+'px"><a href="#" class="popover1-close" role="button"><span>close</span></a>');
            html.push( '<h3 class="popover1-title '+this.options.classTitle+'">'+title+ '</h3><div class="popover1-content '+this.options.classContent+'">'+this.getContent()+'</div></div></div>');
            this.tip=$(html.join('')).appendTo('body') ;
           if(!title){
               this.tip.find(".popover1-title").css("display","none");
           }
        },
        getTitle:function(){
            var title, $e = this.element, o = this.options;
                title= o.title||$e.attr("data-original-title");
            return title;
        },
        getContent:function(){
            var content, $e = this.element, o = this.options;
            content= o.content||$e.attr("data-content")||"";
            return content;
        } ,
        getElementPos:function(ele){
            var pos={top:0,left:0};
            var x=ele.offset();
            pos.top +=x.top;
            pos.left +=x.left;
            return pos;
        }
    });
})( jQuery );




(function (context,$) {
    var popSet = {
            popClass: 'popPrompt',
            autoOpen: true,
            closeDestroy: true,
            reserve: false,
            show: false,
            width: 360,
            height: 'auto',
            closeButton: false,
            type : ['ok', 'error', 'stop', 'question', 'notice', 'attention', 'tips', 'alarm']
        },
        popOpts = {
            defaultTitle: language.text('dialog.info'),
            defaultLevel: 'attention',
            okbutton: language.text('dialog.ok'),
            okclass: 'buttonM bBlue',
            cancelclass: 'buttonM bDefault',
            cancelbutton: language.text('dialog.cancel'),
            defaultTempl: '<div class="popMsg"><i class="pop_icon"></i><div class="popMsgContent"></div></div>',
            defaultPromptTempl: '<div class="popPromptMsg"><span></span><br/><input type="text" id="popup_prompt" class="auto-input"  /></div>',
            defaultPromptValue:language.text('dialog.input')
        },
        stickySet = {
            popClass: 'popSticky',
            autoOpen: true,
            closeDestroy: true,
            reserve: false,
            show: 'slide',
            speed : 'fast',
            width: 360,
            modal: false,
            height: 'auto',
            minHeight : 93,
            autoclose: 2E3,
            closeButton: true,
            type : ['ok', 'error', 'stop', 'question', 'notice', 'attention', 'tips', 'alarm'],
            html: false
        },
        stickyOpts =  {
            defaultTempl: '<div class="popMsg"><i class="pop_icon"></i><div class="popMsgContent"><h5></h5><p></p></div></div>'
        },
        handelParam= function (opts) {
            var opts = $.isPlainObject(opts) ? opts : {};
            !$.isFunction(opts.callback) && (opts.callback=function () {});
            opts.title == null && (opts.title = popOpts.defaultTitle);
            opts.level == null && (opts.level = popOpts.defaultLevel);

            opts = $.extend(true, {}, popSet, opts);
            return opts;
        },

        factory = function (opts) {
            var html,prompt =  opts.html ?  opts.html.find('#popup_prompt') : {};
            opts.buttons = [{
                text: popOpts.okbutton,
   'class': popOpts.okclass,
                click: function (event) {
                    this.close();
                    if(prompt.length) {
                        opts.callback.call(this, prompt.val());
                    }else{
                        opts.callback.call(this, true);
                    }
                }
            }];

            if (opts.isCancelButton) {
                opts.buttons.push({
                    text: popOpts.cancelbutton,
                    'class': popOpts.cancelclass,
                    click: function (event) {
                        this.close();
                        if(prompt.length){
                            opts.callback.call(this, false);
                        }else{
                            opts.callback.call(this,null);
                        }

                    }
                })
            }
            if (!opts.html) {
                html = $(popOpts.defaultTempl);
                html.find('.pop_icon').addClass(opts.level);
                html.find('.popMsgContent').html(opts.msg);
            } else {
                html = opts.html;
            }
            html.popWin(opts);
        },
        valToObj = function(message, title, level, callback,options) {
            if ($.isPlainObject(message)) {
                return message;
            }
            var obj = {};
            obj.msg = message;
            if ($.isPlainObject(title)) {
                options = title;
            } else if ($.isPlainObject(level)) {
                options = level;
                if ($.isFunction(title)) {
                    callback = title;
                } else {
                    level = title;
                }
                title = null;
            } else if ($.isFunction(title)) {
                callback = title;
                title = null;
            } else if ($.isFunction(level)) {
                options = callback;
                callback = level;
                level = title;
                title = null;
            } else if (level == null && typeof title == 'string') {
                level = title;
                title = null;
            } else if ($.isPlainObject(callback)) {
                options = callback;
                callback = options.callback;
            }
            obj.title = ((typeof title == 'string') && title) || (options ? options.title : null);
            obj.level = ((typeof level == 'string') && level) || (options ? options.level : null);
            obj.callback = options ? (options.callback || null) : callback;
            obj.afterclose = options ? (options.afterclose || null) : null;
            obj.afteropen = options ? (options.afteropen || null) : null;
            obj.options = options;

            (options && options.type) && (obj.type = options.type);
            return obj;
        },
        //判断弹出框内容是否相同
        isExistContent=function(message, title, level){
            var len=openPopWinOptList.length;
            for(var i= 0;i<len;i++){
                if(message==openPopWinOptList[i].msg&&title==openPopWinOptList[i].title&&level==openPopWinOptList[i].level){
                    return true;
                }
            }
            return false ;

        },

        obj = {
            /**@global*/
            jAlert : function (message, title, level, callback) {
                var opts = handelParam(valToObj(message, title, level, callback));
                //判断弹出框的内容是否与上次未关闭的弹出框相同，
                if(isExistContent(message, title, level)){
                    return;
                }
                factory(opts);
                 openPopWinOptList&& (openPopWinOptList.push({msg:opts.msg,title:opts.title,level:opts.level}));
            },
            /**@global*/
            jConfirm  : function (message, title, callback) {
                var opts = handelParam(valToObj(message, title, 'question', callback));
                opts.level = 'question';
                opts.isCancelButton = true;
                factory(opts);
            },
            /**@global*/
            jPrompt : function (message, value, title, callback) {
                var opts = handelParam(valToObj(message, title, 'attention', callback));
                opts.isCancelButton = true;
                opts.html = $(popOpts.defaultPromptTempl);
                opts.value = value||opts.value;
                opts.html.find('span').html(opts.msg);
                opts.html.find('input').val(opts.value || popOpts.defaultPromptValue);
                factory(opts);
            },
            jSticky : function(message, title, level, callback,options){
                var html = $(stickyOpts.defaultTempl),
                    opts = valToObj(message, title, level, callback,options) || {},
                    opts = $.extend({},opts,opts.options),
                    title = opts.title,
                    level = opts.level ? opts.level : opts.type || 'attention',
                    icon = html.find('i'),
                    ht = html.find('h5'),
                    pt = html.find('p');
                   opts.afterclose =  opts.afterclose || opts.callback;

                if(opts.html) {
                    html = $(opts.message);
                }else{
                    delete opts.title;

                    
                    if (!Array.prototype.indexOf)
                    {
                        Array.prototype.indexOf = function(elt /*, from*/)
                        {
                            var len = this.length >>> 0;
                            var from = Number(arguments[1]) || 0;
                            from = (from < 0)
                                ? Math.ceil(from)
                                : Math.floor(from);
                            if (from < 0)
                                from += len;
                            for (; from < len; from++)
                            {
                                if (from in this &&
                                    this[from] === elt)
                                    return from;
                            }
                            return -1;
                        };
                    }







                    if (level && stickySet.type.indexOf(level) > -1) {
                        icon.addClass(level);
                        html.addClass('popSticky-icon');
                    } else {
                        icon.hide();
                    }
                    if (title) {
                        ht.html(title);
                    } else {
                        ht.hide()
                    }
                    pt.html(opts.msg || opts.message);
                }
                html.popWin($.extend(true, {}, stickySet, opts, {
                    open: function (wrap, obj) {
                        var option = obj.options;
                        if (option.autoclose) {
                            obj.leaveTM = setTimeout(function () {
                                obj.close();
                            }, option.autoclose);
                        }
                        opts.open && opts.open.call(this, wrap, obj)
                        try{
                          option.afteropen && option.afteropen.call(this,option);
                        }catch(e){

                        }
                    }
                }))
            }
        };
    $.alerts  = $.alerts || {};
    $.extend(context,obj);
    $.extend($.alerts,{
        alert :  obj.jAlert,
        confirm : obj.jConfirm,
        prompt : obj.jPrompt
    });

    $.sticky = obj.jSticky;
    //TODO  这里使用$(function).apply(window)这样不能把对象添加到window层
})(window,jQuery);
var openPopWinOptList=[];        //用于保存当前页面已弹出的jAlert对象
(function (context,$) {

    var popProperties  = {
        ifrHTML: '<div class="dialog" name="{id}" parentSrc="{href}" style="padding:0;overflow:hidden;">' +
            '<div class="loading-overlay">' +
            '<div class="loading-m"><i></i><span>\u6b63\u5728\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e</span>' +
            '</div><div class="shadow"></div>' +
            '</div>' +
            '<iframe src="{src}" dialogIframe="true" id="{id}" name = "{id}" target="_self" frameborder="0" scrolling="auto" class="autoIframe dialog-frame"></iframe>' +
            '</div>',
        ajaxHTML: '<div class="dialog" id="{id}"></div>',
        treeResHTML : '<div class="dialog" id="{id}"><div class="dualBoxes clearfix"> '+
            '<div class="leftBox"><h6>'+language.text('dialog.alternateRes')+'</h6><div class=""><ul id="{treeId}" class="ztree"></ul></div>'+
        '</div>' +
    '<div class="dualControl"> '+
       ' <p><a id="btn-camera-sel" class="buttonS bDefault" href="javascript:void(0);">'+language.text('add')+' &gt;</a></p> '+
        '<p><a id="btn-camera-unsel" class="buttonS bDefault" href="javascript:void(0);">&lt; '+language.text('delete')+'</a></p> '+
    '</div>'+
    '<div class="rightBox">'+
        '<h6>'+language.text('dialog.selectedRes')+'</h6>'+
        '<div class="datatable"> '+
        '<table id="{listId}" cellspacing="0" cellpadding="0" width="100%" class="tLight checkAll"> '+
            '<thead>'+
                '<tr>' +
                    '<td> <span class="check"> <input id="checkAll" type="checkbox"></span></td> '+
                        '<td>'+language.text('dialog.resourceName')+'</td> '+
                    '</tr>'+
                '</thead>'+
                '<tbody></tbody>'+
            '</table>'+
        '</div></div></div></div>',
        parseStr : function(str, obj){
            return str.replace(/{([^}]*)}/g, function (a, b) {
                return obj[b] || '';
            })
        },
        run :  function(options){
            var close = options.close, el = options.el;
            options = $.extend(true, {
                autoOpen : true,
                modal : true,
                resizable : false,
                targetPage: window,
                width : 500
            }, options, {
                close: function () {
                    close && close.call(this, options);
                    el.remove();
                }
            });
            return el.popWin(options);
        }
    }

    var _popWin = function(options){
        var options = options || {},base = $('base').attr('href') || '',iframeSrc,ajaxSrc,src,el,res;
        if(iframeSrc = options.iframeSrc){
            src = ( /^\/|^https?\:\/\//i.test(iframeSrc) ? '' : base) + iframeSrc;
            src = /\?/gi.test(src) ? src + '&isDialog=true' : src + '?isDialog=true&time=' + new Date();
            options.iframeSrc = src;
            el =   $(popProperties.parseStr(popProperties.ifrHTML, {
                id: options.id,
                href: iframeSrc,
                src : ''
            })).appendTo('body');
            el.find('iframe').on('load', function() {
                el.find('.loading-overlay').hide();
            });
        }else if(options.ajax && options.ajax.url){
            ajaxSrc = options.ajax.url;
            src = ( /^\/|^https?\:\/\//i.test(ajaxSrc) ? '' : base) + ajaxSrc;
            el = $(popProperties.parseStr(popProperties.ajaxHTML,{id:options.id}));
            var success = options.ajax.success;
            options.ajax.success = function() {
                var result = success && success.apply(this, arguments);
                if ( typeof result === "string" ){
                    //返回dom元素，则做替换
                    if( result.charAt(0) === "<" && result.charAt( result.length - 1 ) === ">" && result.length >= 3){
                        el.empty().append(result);
                    }
                }
                return result;
            };

            el.load(options.ajax.url,options.ajax.data || {},options.ajax.success);
			el.ajaxSuccess(function(html, request, response) {
				if (request.status == 200) {
					var inFefresh = request.getResponseHeader('is-refresh');
					var inLogin = request.getResponseHeader('in-login');
					var refreshUrl = request.getResponseHeader('refresh-url');
					if (inFefresh == '1' || inFefresh == 1 || inLogin == '1' || inLogin == 1) {
						if (refreshUrl == null || refreshUrl == '') {
							window.location.reload();
						} else {
							try {
								refreshUrl = decodeURI(refreshUrl);
								top.location.href = refreshUrl;
							} catch (e) {
								window.location.reload();
							}

						}
					}
					return;
				}
            });
        }else if(options.el){
            el = options.el[0] ? $(options.el[0].outerHTML) : $([]);
            //el = options.el.appendTo('body')
            el.appendTo('body');
        } else if(options.buildInType == 'treeResHTML'){
            el = $(popProperties.parseStr(popProperties[options.buildInType],{id:options.id,treeId : options.treeId,listId : options.listId})).appendTo('body');
        } else {
            return;
        }

        options.el = el;
        res = popProperties.run(options);
        if(iframeSrc){
        		el.find('iframe').attr('src',src);
        	}
        return res;
    }

    /**@memberof! window*/
    context.popWin = _popWin;

    context.dialog = function(option){
		option= $.extend(option,{dialogClass:"pop-dialog"});
        if(typeof context.popWin ===  'function'){
            context.popWin($.extend(option, {
                originalPage: context,
                originalHref: location.href
            }));
        } else {
            context.popWin(option);
        }
    }

    /*这段代码放出来放在子页面start*/
    $.fn.dialog = function(opt) {
		if(typeof opt !== "string"){
			opt= $.extend(opt,{dialogClass:"pop-dialog"});
		}
       return this.popWin.apply(this, arguments);
    };

    $.extend({
        dialog :  function(option){
            option= $.extend(option,{dialogClass:"pop-dialog"});
            if(option.id && $('#'+option.id).length)
                return;
            $.extend(option || {},{closeDestroy:true});
            if(option.displayCtx && typeof option.displayCtx.popWin === 'function'){   //用户自己定义显示在哪一层
                return option.displayCtx.popWin($.extend(option, {
                    originalPage: option.displayCtx,
                    originalHref: option.displayCtx.location.href
                }));
            }else{
                if(typeof top.popWin ===  'function'){
                    return top.popWin($.extend(option, {
                        originalPage: window,
                        originalHref: location.href
                    }));
                }else {
                    return window.popWin(option);
                }
            }
        },
        buildInDialog : function(option){
            $.extend(option || {},{height:550,width:600});
            var obj = $.dialog(option);
            var treed = $('#' + option.treeId).tree(option.treeSettings),selNodes;
            $('#btn-camera-sel').on('click',function(){
                treed = $('#' + option.treeId).tree();
                selNodes = treed.getCheckedNodes(true);
                if(selNodes.length){
                   for(var i = 0,len = selNodes.length;i < len; i++){
                       if(selNodes[i].extra && selNodes[i].extra.type == 'res'){
                           treed.hideNode(selNodes[i]);
                           $('#' + option.listId).find('tbody').append('<tr><td><span class="check"><input data-id="' + selNodes[i].id + '" type="checkbox"></span></td><td>' + selNodes[i].label + '</td></tr>');
                       }
                   }
                }
               return false;
            });
            $('#btn-camera-sel').on('click',function(){
                treed = $('#' + option.treeId).tree();
                selNodes = treed.getCheckedNodes(true);
                if(selNodes.length){
                    for(var i = 0,len = selNodes.length;i < len; i++){
                        if(selNodes[i].extra && selNodes[i].extra.type == 'res'){
                            treed.hideNode(selNodes[i]);
                            $('#' + option.listId).find('tbody').append('<tr><td><span class="check"><input data-id="' + selNodes[i].id + '" type="checkbox"></span></td><td>' + selNodes[i].label + '</td></tr>');
                        }
                    }
                }
                return false;
            });

            $('#btn-camera-unsel').on('click',function(){
                if (!$('#' + option.listId).find("tbody input:checked").each(function(i){
                    var id = 'extra-' + $(this).attr('data-id');
                    treed = $('#' + option.treeId).tree();
                       $(this).closest('tr').remove();
                    var node = treed.getNodeById($(this).attr('data-id'));
                    treed.showNode(node);
                    treed.checkNode(node, false, false);
                }).length) {
                    jAlert(language.text('dialog.deleteMessage'),language.text('dialog.info'), 'attention');
                };
            });
            return obj;
        },
        sticky : function(message, title, level, callback,options){
            jSticky(message, title, level, callback,options);
        }
    });
    /*这段代码放出来放在子页面end*/

})(window,jQuery);

