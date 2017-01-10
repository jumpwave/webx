(function(c, b, d) {
    var a = function(f, e) {
        this.initialize("popbox", f, e)
    };
    a.prototype = {
        constructor: a,
        initialize: function(i, g, e) {
            this.type = i;
            this.$element = c(g);
            this.options = this.options || this.getOptions(e);
            this.$popbox = this.$popbox || this._popObj();
            var h = this.$popbox;
            var f = this.options;
            this.$popLayer = this.$popLayer || h.find(".pop_layer");
            this.$popWarp = this.$popWarp || h.find(".pop_warp");
            this.$popContent = this.$popContent || h.find(".pop_content");
            this.delaytimer = null;
            if (f.closeAble) {
                this.$closeBtn = this.$closeBtn || c('<a title="关闭" class="pop_close" href="#">关闭</a>');
                this.$popWarp.css("padding-right", f.closePRight).append(this.$closeBtn);
                this.closePopBox()
            }
            if (f.iconClass) {
                this.$popIcon = this.$popIcon || c('<span class="pop_icon"></span>').addClass(f.iconClass);
                this.$popWarp.css("padding-left", f.iconPLeft).prepend(this.$popIcon)
            }
            this.setNormalAngle();
            if (f.width) {
                this.setWidth(f.width)
            }
            if (f.height) {
                this.setHeight(f.height)
            }
            if (f.zIndex) {
                this.setZindex(f.zIndex)
            }
            if (typeof f.content === "function") {
                f.content.call(this)
            } else {
                this.$popContent.append(f.content)
            }
            if (typeof f.callBack === "function") {
                f.callBack.call(this)
            }
            h.appendTo(f.appendToTarget).hide().css({
                opacity: f.opacity ? 0 : 1
            });
            this.position = this.position || this.getPosition();
            f.show && this.setPos(this.position)
        },
        setPos: function(f) {
            this.position = f;
            var e = this.$popbox || this._popObj();
            e.css({
                top: f.popBoxOffsetT,
                left: f.popBoxOffsetL
            });
            if ((f.popBoxOffsetT != f.popBoxT || f.popBoxOffsetL != f.popBoxL) && this.options.offsetTimer.show !== 0) {
                e.stop(true, true).animate({
                    top: f.popBoxT,
                    left: f.popBoxL,
                    opacity: 1
                },
                this.options.offsetTimer.show).show()
            } else {
                if (!this.options.opacity || this.options.offsetTimer.show === 0) {
                    e.show().css({
                        opacity: 1
                    }).show()
                } else {
                    e.stop(true, true).animate({
                        top: f.popBoxT,
                        left: f.popBoxL,
                        opacity: 1
                    },
                    this.options.offsetTimer.show).show()
                }
            }
            if (this.delaytimer) {
                b.clearTimeout(this.delaytimer);
                this.delaytimer = null
            }
            if (this.options.closeDelay > 0) {
                this.delayClose()
            }
            if (this.options.mouseOverDelay > 0) {
                this.mousedelayClose()
            }
        },
        getOptions: function(e) {
            e = c.extend({},
            c.fn[this.type].defaults, this.$element.data(), (this.options || {}), e);
            if (typeof e.offsetTimer == "number") {
                e.offsetTimer = {
                    show: e.offsetTimer,
                    hide: e.offsetTimer
                }
            } else {
                e.offsetTimer = c.extend({
                    show: 200,
                    hide: 200
                },
                e.offsetTimer)
            }
            if (typeof e.iconClass == "string" && !e.iconPLeft) {
                if (e.iconClass.indexOf("M") == -1 && e.iconClass.indexOf("B") == -1) {
                    e.iconPLeft = 25
                } else {
                    if (e.iconClass.indexOf("M") !== -1) {
                        e.iconPLeft = 36
                    } else {
                        e.iconPLeft = 50
                    }
                }
            }
            return e
        },
        _popObj: function() {
            var e = this;
            return c("<div></div>", {
                "class": e.options.boxClass,
                id: e.options.id ? e.options.id: "",
                html: e.options.template || ['<div class="pop_layer">', '<div class="pop_warp">', '<div class="pop_content">', "</div>", "</div>", "</div>"].join("")
            })
        },
        setContent: function(e) {
            if (typeof e === "function") {
                this.options.content.call(this)
            } else {
                this.$popContent.empty().append(e)
            }
        },
        setWidth: function(e) {
            this.$popWarp.css("width", e)
        },
        setHeight: function(e) {
            this.$popWarp.css("height", e)
        },
        setOptions: function(e) {
            this.options = c.extend({},
            this.options, e)
        },
        setNormalAngle: function() {
            var e = this.options.directing;
            var f = this.options.direction;
            if (e /*&& typeof f == "string"*/) {
                this.$popAngle = this.$popAngle || c('<span class="angle"><span class="diamond"></span></span>');
                this.$popWarp.addClass("angle_" + f).prepend(this.$popAngle);
                this.$popLayer.addClass("layer_" + f);
                typeof e == "object" && this.$popAngle.css(e)
            }
        },
        setZindex: function(e) {
            this.$popbox.css("zIndex", e)
        },
        getPosition: function() {
            var f = null;
            var h = this;
            var e = function(i) {
                switch (i) {
                case "topL":
                    f = h._setPosTopL();
                    break;
                case "topC":
                    f = h._setPosTopC();
                    break;
                case "topR":
                    f = h._setPosTopR();
                    break;
                case "bottomL":
                    f = h._setPosBottomL();
                    break;
                case "bottomC":
                    f = h._setPosBottomC();
                    break;
                case "bottomR":
                    f = h._setPosBottomR();
                    break;
                case "leftT":
                    f = h._setPosLeftT();
                    break;
                case "leftC":
                    f = h._setPosLeftC();
                    break;
                case "leftB":
                    f = h._setPosLeftB();
                    break;
                case "rightT":
                    f = h._setPosRightT();
                    break;
                case "rightC":
                    f = h._setPosRightC();
                    break;
                case "rightB":
                    f = h._setPosRightB();
                    break;
                default:
                    f = h._setPosTopL();
                    break
                }
                return f
            };
            if (typeof this.options.direction == "string") {
                f = e(this.options.direction)
            } else {
                var g = {
                    popBoxOffsetT: 0,
                    popBoxOffsetL: 0,
                    popBoxT: 0,
                    popBoxL: 0
                };
                f = c.extend({},
                g, this.options.direction)
            }
            return f
        },
        getPosInfo: function() {
            var h = this.$element;
            var j = this.$popbox || this._popObj();
            var i = parseInt(h.offset().top);
            var g = parseInt(h.offset().left);
            var f = h.outerWidth();
            var l = h.outerHeight();
            var e = j.outerWidth(true);
            var k = j.outerHeight(true);
            return {
                popBoxTargetT: i,
                popBoxTargetL: g,
                popBoxTargetW: f,
                popBoxTargetH: l,
                popBoxOutW: e,
                popBoxOutH: k
            }
        },
        getWindowInfo: function() {
            var e = c(b);
            return {
                winW: e.width(),
                winH: e.height(),
                winST: e.scrollTop(),
                winSL: e.scrollLeft()
            }
        },
        _setPosTopL: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT - e.popBoxOutH;
            var f = e.popBoxTargetL;
            var i = h - this.options.offset;
            var g = f;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosTopC: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT - e.popBoxOutH;
            var f = e.popBoxTargetL - parseInt(e.popBoxOutW / 2, 10) + parseInt(e.popBoxTargetW / 2, 10);
            var i = h - this.options.offset;
            var g = f;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosTopR: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT - e.popBoxOutH;
            var f = e.popBoxTargetL - e.popBoxOutW + e.popBoxTargetW;
            var i = h - this.options.offset;
            var g = f;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosBottomL: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT + e.popBoxTargetH;
            var f = e.popBoxTargetL;
            var i = h + this.options.offset;
            var g = f;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosBottomC: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT + e.popBoxTargetH;
            var f = e.popBoxTargetL - parseInt(e.popBoxOutW / 2, 10) + parseInt(e.popBoxTargetW / 2, 10);
            var i = h + this.options.offset;
            var g = f;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosBottomR: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT + e.popBoxTargetH;
            var f = e.popBoxTargetL - e.popBoxOutW + e.popBoxTargetW;
            var i = h + this.options.offset;
            var g = f;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosLeftT: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT;
            var f = e.popBoxTargetL - e.popBoxOutW;
            var i = h;
            var g = f - this.options.offset;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosLeftC: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT - parseInt(e.popBoxOutH / 2, 10) + parseInt(e.popBoxTargetH / 2, 10);
            var f = e.popBoxTargetL - e.popBoxOutW;
            var i = h;
            var g = f - this.options.offset;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosLeftB: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT - e.popBoxOutH + e.popBoxTargetH;
            var f = e.popBoxTargetL - e.popBoxOutW;
            var i = h;
            var g = f - this.options.offset;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosRightT: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT;
            var f = e.popBoxTargetL + e.popBoxTargetW;
            var i = h;
            var g = f + this.options.offset;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosRightC: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT - parseInt(e.popBoxOutH / 2, 10) + parseInt(e.popBoxTargetH / 2, 10);
            var f = e.popBoxTargetL + e.popBoxTargetW;
            var i = h;
            var g = f + this.options.offset;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        _setPosRightB: function() {
            var e = this.getPosInfo();
            var h = e.popBoxTargetT - e.popBoxOutH + e.popBoxTargetH;
            var f = e.popBoxTargetL + e.popBoxTargetW;
            var i = h;
            var g = f + this.options.offset;
            return {
                popBoxOffsetT: i,
                popBoxOffsetL: g,
                popBoxT: h,
                popBoxL: f
            }
        },
        mousedelayClose: function() {
            var f = this;
            var e = this.$popbox || this._popObj();
            e.on("mouseenter.popbox",
            function() {
                b.clearTimeout(f.delaytimer);
                f.delaytimer = null
            });
            e.on("mouseleave.popbox",
            function() {
                f.delaytimer = b.setTimeout(function() {
                    f.closeFun()
                },
                f.options.mouseOverDelay)
            });
            this.$element.on("mouseenter.popbox",
            function() {
                b.clearTimeout(f.delaytimer);
                f.delaytimer = null
            });
            this.$element.on("mouseleave.popbox",
            function() {
                f.delaytimer = b.setTimeout(function() {
                    f.closeFun()
                },
                f.options.mouseOverDelay)
            })
        },
        delayClose: function() {
            var f = this;
            var e = this.$popbox || this._popObj();
            this.delaytimer = b.setTimeout(function() {
                f.closeFun()
            },
            this.options.closeDelay);
            e.mouseover(function() {
                b.clearTimeout(f.delaytimer);
                f.delaytimer = null
            }).mouseout(function() {
                f.delaytimer = b.setTimeout(function() {
                    f.closeFun()
                },
                500)
            })
        },
        closeFun: function() {
            var h = this;
            var f = this.$popbox || this._popObj();
            var e = this.position || this.getPosInfo();
            if (this.options.mouseOverDelay > 0) {
                f.off(".popbox");
                this.$element.off(".popbox")
            }
            function g() {
                f.hide();
                if (!h.options.isCreate) {
                    f.remove();
                    h.$element.removeData(h.type)
                }
            }
            if ((e.popBoxOffsetT != e.popBoxT || e.popBoxOffsetL != e.popBoxL) && this.options.offsetTimer.hide !== 0) {
                f.animate({
                    top: e.popBoxOffsetT,
                    left: e.popBoxOffsetL,
                    opacity: this.options.opacity ? 0 : 1
                },
                h.options.offsetTimer.hide,
                function() {
                    g()
                })
            } else {
                if (!this.options.opacity || this.options.offsetTimer.hide === 0) {
                    g()
                } else {
                    f.animate({
                        opacity: 0
                    },
                    h.options.offsetTimer.hide,
                    function() {
                        g()
                    })
                }
            }
        },
        closePopBox: function() {
            var e = this;
            this.$closeBtn.bind("click",
            function(f) {
                if (typeof e.options.closeCallBack === "function") {
                    e.options.closeCallBack.call(e)
                }
                e.closeFun();
                f.preventDefault()
            })
        },
        close:function(){
        	var e = this;
        	e.closeFun();        	
        }
    };
    c.fn.popbox = function(g) {
        var h = [];
        for (var f = 0,
        e = arguments.length; f < e; f++) {
            h.push(arguments[f])
        }
        var j = h.slice(1);
        return this.each(function() {
            var l = c(this),
            k = l.data("popbox"),
            i = typeof g == "object" && g;
            if (!k) {
                k = new a(this, i);
                l.data("popbox", k)
            } else {
                if (typeof g == "object") {
                    l.popbox("setPos", k.position)
                }
            }
            if (typeof h[0] == "string") {
                k[h[0]].apply(k, j)
            }
        })
    };
    c.fn.popbox.Constructor = a;
    c.fn.popbox.defaults = {
        isCreate: false,
        id: "",
        content: "<p style='margin: 0; padding: 5px'>欢迎使用popbox，css88.com 愚人码头 出品。</p>",
        width: null,
        height: null,
        boxClass: "sd_popbox",
        appendToTarget: "body",
        zIndex: null,
        direction: "topL",
        offset: 0,
        offsetTimer: 200,
        opacity: false,
        closeAble: false,
        closePRight: 25,
        iconClass: null,
        iconPLeft: null,
        directing: null,
        eventObj: null,
        closeDelay: 0,
        mouseOverDelay: 0,
        show: true,
        template: ""
    }
})(window.jQuery, window);