(function (jQuery) {
    jQuery.iTextClear = function (obj, options) {
        var self = this, stat = false, clearBtn = jQuery('<a class="iTextClearButton"></a>');
        self.$el = jQuery(obj);
        self.el = obj;
        self.$el.data("iTextClear", self);
        self.init = function () {
            self.options = jQuery.extend({}, jQuery.iTextClear.defaultOptions, options);
            self.$el.wrap('<span class="iTextClearButtonContainer"></span>').after(clearBtn.hide()).bind("focus.itextclear",function () {
                clearBtn.show()
            }).bind("focusout.itextclear", function () {
                stat ? stat = false : clearBtn.hide()
            });
            clearBtn.bind("mousedown.itextclear", function () {
                stat = true;
                self.$el.val("");
                clearBtn.hide();
//                setTimeout(function () {
//                    self.$el.focus()
//                }, 0)
            })
        };
        if(/rv:11\./i.test(navigator.userAgent)){
            self.init();
            clearBtn.remove();
            self.$el.css({'margin-right':'0','width':parseInt(self.$el.css('width')) + 25+'px'})
        }else{
            self.init();
        }
    };
    jQuery.iTextClear.defaultOptions = {};
    jQuery.fn.iTextClear = function (options) {
        return this.each(function () {
            new jQuery.iTextClear(this, options)
        })
    }
})(jQuery);