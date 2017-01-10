(function(){
	/**
	 * 步骤工具栏
	 * 
	 * @param {} steps 步骤信息，步骤至少存在两步
	 * 			[{
	 * 				text: '', // 步骤名称
	 * 				listener: function() {
	 * 					
	 * 				}
	 * 			}]
	 */
	$.fn.stepBar = function(steps) {
		// 判断是否存在步骤信息
		if ($.isArray(steps) && steps.length > 1) {
			var $this = $(this);
			$this.empty().addClass('hikui_stepbar');
	
			// 创建步骤对象
			var $steps = $('<ul/>').addClass('clearfix').appendTo($this);
			// 循环创建步骤信息
			for (var i = 0; i < steps.length; i++) {
				// 步骤对象
				var step = steps[i];
				// 步骤序号
				var stepNo = i + 1;
				// 步骤文本
				var stepText = step.text || '';
				// 创建步骤
				var $step = $('<li/>').attr('index', i).html(stepNo + '.' + stepText).appendTo($steps);
				// 判断是否需要绑定点击事件
				if ($.isFunction(step.listener)) {
					$step.addClass('pointer');
				}
			}
			
			// 设置起始步骤标志
			$steps.children('LI:first').addClass('first');
			$steps.children('LI:last').addClass('last');
			
			// 所有步骤总宽度
			var stepWidth = 0;
			// 判断并绑定事件
			$steps.children('LI').each(function(index) {
				var $step = $(this);
				stepWidth += parseInt($step.outerWidth(true));
				if ($step.hasClass('pointer')) {
					$step.bind('click', function() {
						var stepNo = parseInt($(this).attr('index'));
						var step = steps[stepNo];
						// 判断是否需要绑定点击事件
						if ($.isFunction(step.listener)) {
							step.listener.call(this, stepNo, step);
						}
					});
				}
			});
			
			// 计算最大宽度
			var stepNumbers = steps.length;
			var maxWidth = stepNumbers * 125 - (stepNumbers - 1) * 10;
			
			// 设置容器宽度
			$steps.width(Math.min(stepWidth, maxWidth));
		}
		return this;
	};
	
	/**
	 * 设置步骤
	 * @param {} stepNo 步骤序号
	 */
	$.fn.setStep = function(stepNo) {
		var $this = $(this);
		if ($this.hasClass('hikui_stepbar')) {
			$this.find('UL LI:eq(' + stepNo + ')').addClass('selected')
						.siblings('LI').removeClass('selected');
		}
	};
	
})(jQuery);