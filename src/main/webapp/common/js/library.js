/**
 * 数据字典对象
 * @author 丁杰
 */
var Library = {
	
	prefix :'kms_', //当数据字典编码没有在map里，code默认加前缀。
	loaded : false, //是否已经加载
	// 数据字典编码关系映射，key：前端使用的字典编码，value：对应数据库存储中字典编码
	map: {
		// 性别
		sex: 'kms_xbdm',
		// 体型
		bodyStyle: 'kms_tx',
		// 发型
		hairStyle: 'kms_fx',
		// 发色
		hairColor: 'kms_fs02',
		// 肤色
		skinColor: 'kms_fs01',
		// 上衣款式
		clothesStyle: 'kms_syks',
		// 上衣颜色
		clothesColor: 'kms_syys',
		// 上衣长度
		clothesLength: 'kms_sycd',
		// 裤子款式
		pantsStyle: 'kms_kzks',
		// 裤子颜色
		pantsColor: 'kms_kzys02',
		// 裤子长度
		pantsLength: 'kms_kzcd',
		// 鞋子款式
		shoeStyle: 'kms_xzks',
		// 鞋子颜色
		shoeColor: 'kms_xzys',
		// 包款式
		bagStyle: 'kms_bks',
		// 包颜色
		bagColor: 'kms_bys',
		// 行为
		behaviourFrature: 'kms_xw',
		// 有无车牌
		vehicleHasLicense: 'kms_ywcp',
		// 车牌颜色
		vehicleLicenseColor: 'kms_cpys',
		// 车辆品牌
		vehicleBrand: 'kms_clpp',
		// 物品颜色
		goodsColor: 'kms_wpys',
		// 涉案物品类型
		kms_sawpdm: 'kms_sawpdm',
		// 案件类型
		caseType: 'kms_ajlx',
		// 案件类别
		caseCategory: 'kms_B_ASJ_XSAB',
		// 案件状态
		caseStatus: 'kms_56',
		// 作案手段
		modusMethod: 'kms_zasd',
		// 选择处所代码
		kms_xzcsdm : 'kms_xzcsdm',
		// 天气情况分类
		kms_TQQKFL : 'kms_TQQKFL',
		// 道路类型代码
		kms_dllxdm : 'kms_dllxdm',
		// 现场光线
		kms_xcgx : 'kms_xcgx',
		// 现场条件
		kms_xctj : 'kms_xctj',
		// 现场湿度
		kms_xcsd : 'kms_xcsd',
		// 人群集聚程度
		kms_rqjjcd : 'kms_rqjjcd',
		// 物品密度
		kms_wpmd : 'kms_wpmd',
		
		/************沿用图帧字典***************/
		// 作案工具
		modusTool: 'kms_6500',
//		// 衣领
//		collar: 'kms_5016',
//		// 人员照射部位
//		peopleIrradiatePos: 'kms_6605',
//		// 交通工具
//		transportation: 'kms_6600',
		// 车牌类型
		vehicleLicenseType: 'kms_7',
//		// 车牌状态
//		vehicleLicenseStatus: 'kms_6602',
		// 车辆类型
		vehicleType: 'kms_9',
//		// 车辆厂商
//		vehicleManufacturer: 'kms_5028',
		// 车身颜色
		vehicleColor: 'kms_5033',
//		// 车辆照射部位
//		vehicleIrradiatePos: 'kms_6601',
//		// 车体特征
//		vehicleBodyFeature: 'kms_6604',
//		// 物品类型
//		goodsType: 'kms_5023',
//		// 案发场所
//		happenPlace: 'kms_5002',
		
		// 案发场所
		kms_cyzjdm: 'kms_cyzjdm',
		
		/************沿用图帧字典***************/
		
		
		/************智能分析字典***************/
		// 资源描述类型
		resourceDescType: 'kms_68',
		// 目标大小
		targetSize: 'kms_69',
		// 目标类型
		targetType: 'kms_70',
		// 目标方向
		targetDirection: 'kms_71',
		// 车辆类型
		anaVehicleType: 'kms_72',
		// 违章类型
		vehicleIllegalType: 'kms_73',
		// 车辆品牌
		anaVehicleBrand: 'kms_74',
		// 分析颜色（目标、车牌、车身）
		analysisColor: 'kms_75',
		// 通用状态（是否）
		commonStatus: 'kms_76',
		// 智能人员性别
		analysisSex: 'kms_xbdm',
		// 智能分析车牌类型
		analysisVehLicType: 'kms_77',
		// 智能目标颜色
		analysisTargetColor: 'kms_78',
		// 智能车牌颜色
		analysisVehPlateColor: 'kms_79',
		/************智能分析字典***************/
		
		
		subscribe_category_type : 'subscribe_category_type',
		
		
		
		subscribe_detail_type : 'subscribe_detail_type',
		
		tollgate_status : 'tollgate_status',
		
		tollgate_type : 'tollgate_type',
		
		lane_direction : 'lane_direction',
		
		city_pass : 'city_pass',
		
		system_internal_type : 'system_internal_type'
		
	},
	
	// 缓存字典
	cache: {},
	
	/**
	 * 根据数据字典编码获得对应字典项信息
	 * @param {} code			字典编码
	 * @param {} onSuccess		获取成功回调函数
	 * @param {} onFault		获取失败回调函数
	 * @param {} onComplete		获取完成回调函数
	 */
	get: function(code, onSuccess, onFault, onComplete) {
		var This = this;
		// 判断字典编码是否存在
		if (Tool.isEmpty(code)) {
			if ($.isFunction(onFault)) {
				onFault();
			}
			return;
		}
		// 判断是否在映射关系中存在
		if (This.map.hasOwnProperty(code)) {
			code = This.map[code];
		}else{
			code = This.prefix + code;
		}
		// 判断是否缓存字典信息
		if (This.cache.hasOwnProperty(code) && Tool.isNotEmpty(This.cache[code])) {
			var datas = This.cache[code];
			if ($.isFunction(onSuccess)) {
				onSuccess(datas);
			}
			if ($.isFunction(onComplete)) {
				onComplete();
			}
		} else {
			$.ajax({
				type: 'POST',
				url: 'dataDictAction!findByType.action',
				data: {typeCode: code},
				dataType: 'json',
				complete: function() {
					if ($.isFunction(onComplete)) {
						onComplete();
					}
				},
				success: function(data) {
					if (Tool.isEmpty(data) || !$.isArray(data)) {
						data = [];
					}
					// 缓存字典
					This.cache[code] = data;
					if ($.isFunction(onSuccess)) {
						onSuccess(data);
					}
				},
				error: function() {
					if ($.isFunction(onFault)) {
						onFault();
					}
				}
			});
		}
	},
	
	/**
	 * 获得字典对应字典项文本
	 * @param {} code	字典编码
	 * @param {} value	字典项编码
	 */
	text: function(code, value) {
		var This = this;
		// 字典项文本
		var libarayText = '';
		// 判断字典编码是否存在
		if (Tool.isEmpty(code) || Tool.isEmpty(value)) return libarayText;
		// 过滤字典项中的HTML标签
		value = Tool.filterHTML(value);
		// 判断是否在映射关系中存在
		if (This.map.hasOwnProperty(code)) {
			code = This.map[code];
		}else{
			code = This.prefix + code;
		}
		// 判断是否缓存字典信息
		if (This.cache.hasOwnProperty(code) && Tool.isNotEmpty(This.cache[code])) {
			var datas = This.cache[code];
			for (var i=0; i<datas.length; i++) {
				var data = datas[i];
				// 判断是否为字典项
				if (data.value == value) {
					return data.name;
				}
			}
		} else {
			$.ajax({
				url: 'dataDictAction!getDictByValue.action',
				data: {typeCode: code, key: value},
				dataType: 'json',
				async: false,
				success: function(data) {
					data = Tool.empty2def(data, {});
					libarayText = Tool.empty2def(data.name, libarayText);
				}
			});
		}
		return libarayText;
	},
	
	/**
	 * 加载字典到下拉框对象中
	 * @param {} $libaraySelect	字典下拉框jQuery对象
	 * 				library/key/default 默认配置，分别表示字典编码、项值对应键、初始化默认项值
	 * @param {} complete		全部加载完成执行
	 */
	load: function($libaraySelect, complete) {
		var This = this;
		// 判断需加载字典个数
		var surplusLoads = $libaraySelect.length;
		// 判断是否已经全部加载
		if (surplusLoads == 0 && $.isFunction(complete)) {
			complete();
			return;
		}
		
		/**
		 * 加载字典项
		 */
		var loadOptions = function(el) {
			// 获得jQuery对象
			var $this = $(el);
			// 获得字典编码
			var code = Tool.empty2def($this.attr('library'), $this.attr('name'));
			// 项值对应键，编码：0，文本：1，默认使用0
			var key = $this.attr("key");
			// 获得初始默认值
			var defaultValue = $this.attr("default");
			
			/**
			 * 获得字典项成功回调函数
			 * @param {Array} datas 字典项信息
			 */
			var onSuccess = function(datas) {
				if ($.isArray(datas) && datas.length > 0) {
					// 加入请选择选项
					$this.empty().append($('<option/>').val('').html(''));
					for (var i=0; i<datas.length; i++) {
						var data = datas[i];
						// 字典id
						var id = Tool.empty2def(data.value, '');
						// 字典文本
						var text = Tool.empty2def(data.name, '');
						// 创建项
						var $option = $('<option/>').val(id).html(text);
						// 判断是否使用文本做为值
						if (key == '1') {
							$option.val(text);
						}
						$this.append($option);
					}
					// 判断是否默认选中项
					if (Tool.isNotEmpty(id)) {
						$this.children('option[value=' + defaultValue + ']').attr(
										'selected', true).siblings('option')
										.removeAttr('selected');
					}
				}
			};
			
			/**
			 * 加载完成执行
			 */
			var onComplete = function() {
				surplusLoads--;
				// 判断是否已经全部加载
				if (surplusLoads == 0 && $.isFunction(complete)) {
					complete();
				}
			};
			
			This.get(code, onSuccess, null, onComplete);
		};
		
		// 加载所有字典项
		$libaraySelect.each(function(){
			loadOptions(this);
		});
	},
	
	/**
	 * 初始化所有字段数据并缓存
	 * @return {}
	 */
	initAllDict: function() {
		if(!Library.loaded)
		{
			var This = this;
			$.ajax({
				url: 'dataDictAction!findAll.action',
				dataType: 'json',
				async: true,
				success: function(data) {
					for (var key in data) {
						This.cache[key] = data[key];
					}
					Library.loaded = true;
				}
			});
		}
	}
};