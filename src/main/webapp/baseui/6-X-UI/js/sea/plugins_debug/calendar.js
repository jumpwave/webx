define('./calendar', [ './component', './calendar/wdatepicker' ], function(require, exports) {
	var Component = require('./component');
	var WdatePicker = require('./calendar/wdatepicker');
	$dp.$N = function(n, _) {
		var el = this.el;
		if (el == null)
			return null;
		var nEl = $(el).closest('form').find('[name="' + n + '"]');
		return this.$DV(nEl.val(), _);
	};
	var PARAMS_ARRAY = [ 'minDate', 'maxDate', 'dateFmt', 'opposite', 'disabledDates', 'specialDays', 'disabledDays', 'isShowWeek', 'onpicked', 'isShowClear', 'startDate', 'alwaysUseStartDate',
			'qsEnabled', 'quickSel' ,'Mchanging','ychanging'];
	return Component.extend({
		minDate : null,
		maxDate : null,
		dateFmt : 'yyyy-MM-dd',// HH:mm:ss',
		constructor : function(opt) {
			this.base(opt, [ 'hikui-calendar', 'Wdate' ], [ {
				name : 'showTime',
				type : 'boolean'
			}, {
				name : 'isShowClear',
				type : 'boolean'
			}, 'dateFmt', 'minDate', 'maxDate', 'startDate','specialDates','Mchanging','ychanging' ]);
		},
		render : function() {
			var self = this;
			var opt = {
				readOnly : true,
				firstDayOfWeek : 1
			// ,
			// startDate : '1985-10-12',
			// minDate:'#F{$dp.$D(\'d4311\')}'
			};
			if (this.showTime) {
				this.el.addClass('datetimepicker');
				this.dateFmt = 'yyyy-MM-dd HH:mm:ss';
			} else {
				this.el.addClass('datepicker');
			}
			for ( var index = 0; index < PARAMS_ARRAY.length; index++) {
				if (this[PARAMS_ARRAY[index]] != null) {
					opt[PARAMS_ARRAY[index]] = this[PARAMS_ARRAY[index]];
				}
			}
			opt.onchange = function() {
				self.el.trigger('change');
			}
			this.el.attr('readOnly','readOnly');
			this.el.bind('click', function(e) {
				if (this.getAttribute('pickerInvalid') == 'true') {
					return;
				}
				WdatePicker(opt);
			});
		},
		destroy : function() {
            //此方法待改进，单独用top和window都会报错，如果对话框不在本层，也不在顶层打开，则还是没有销毁
            var ctx = window;
            if(!ctx.$('#_my97DP').length){
                ctx = top;
            }
            var $iframes = ctx.$('#_my97DP').find(' iframe');
            $iframes.each(function() {
    			var $target = $(this);
    			if($target.length>0) {
     				$target[0].src = "about:blank";
      				$target[0].contentWindow.document.write('');
      				$target[0].contentWindow.close();
      				$target.remove();
      				if( typeof CollectGarbage == "function") {
        				CollectGarbage();
      				}
    			}
  			});

            ctx.$('#_my97DP').remove();
            ctx.$dp = null;
			this.base();
		}
	});
});
