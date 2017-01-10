(function($) {
	var myflow = $.myflow;
	var rootPath = appPath + "/baseui/myflow/";

	$.extend(true, myflow.config.rect, {
		attr : {
			r : 8,
			fill : '#F6F7FF',
			stroke : '#03689A',
			"stroke-width" : 2
		}
	});

	$.extend(true, myflow.config.props.props, {

	});

	$.extend(true, myflow.config.tools.states, {
		//表输入
		TableInput : {
			showType : 'image',
			type : 'TableInput',
			name : {
				text : '表输入'
			},
			text : {
				text : '表输入'
			},
			img : {
				src : rootPath + 'images/ico_data_input.png',
				width : 104,
				height : 86
			},
			props : {
				// 默认参数，作用暂时未知
				draw : 'Y',
            	distribute: 'Y',
            	partitioning: 'eyJtZXRob2QiOiJub25lIiwic2NoZW1hX25hbWUiOiIifQ==',
            	copies: '1',
            	supports_error_handing: 'N',
            	limit: '0',
                execute_each_row: 'N',
                variables_active: 'N',
                lazy_conversion_active: 'N',
            	// 有效参数
				ctype : 'TableInput',
				label : '表输入' ,
				connection : '' ,
				tableName : '' ,
				tableComment : '' ,
				fields : '' 
			}
		},
		//合并连接
		MergeJoin : {
			showType : 'image',
			type : 'MergeJoin',
			name : {
				text : '合并连接'
			},
			text : {
				text : '合并连接'
			},
			img : {
				src : rootPath + 'images/ico_data_merger.png',
				width : 104,
				height : 86
			},
			props : {
				// 默认参数，作用暂时未知
				draw : 'Y',
            	distribute: 'Y',
            	partitioning: 'eyJtZXRob2QiOiJub25lIiwic2NoZW1hX25hbWUiOiIifQ==',
            	copies: '1',
            	supports_error_handing: 'N',
            	// 有效参数
            	ctype : 'MergeJoin',
            	label : '合并连接',
            	join_type : '',
                step1 : '',
                step2 : '',
                key1 : '',
                key2 : ''
			}
		},
		//输出，插入/更新
		InsertUpdate : {
			showType : 'image',
			type : 'InsertUpdate',
			name : {
				text : '插入更新'
			},
			text : {
				text : '插入更新'
			},
			img : {
				src : rootPath + 'images/ico_data_output.png',
				width : 104,
				height : 86
			},
			props : {
				// 默认参数，作用暂时未知
				draw : 'Y',
            	distribute: 'Y',
            	partitioning: 'eyJtZXRob2QiOiJub25lIiwic2NoZW1hX25hbWUiOiIifQ==',
            	copies: '1',
            	supports_error_handing: 'Y',
            	update_bypassed: 'N',
            	// 有效参数
				ctype : 'InsertUpdate',
				label : '插入更新',
				connection : '',
				schema : '',
				table : '',
				tableComment : '',
				commit : '100',
				searchFields : '',
				updateFields : ''
			}
		},
		//开始
		SPECIAL : {
			showType : 'image',
			type : 'SPECIAL',
			name : {
				text : 'START'
			},
			text : {
				text : 'START'
			},
			img : {
				src : rootPath + 'images/ico_data_start.png',
				width : 104,
				height : 86
			},
			props : {
				// 默认参数，作用暂时未知
				start: 'Y',
				dummy: 'N',
				draw: 'Y',
                nr: '0',
                parallel: 'N',
                // 有效参数
                ctype: 'SPECIAL',
                label: 'START',
                repeat: '',
                schedulerType: '',
                DayOfMonth: '',
                weekDay: '',
                hour: '',
                minutes: '',
                intervalSeconds: ''
			}
		},
		//转换
		TRANS : {
			showType : 'image',
			type : 'TRANS',
			name : {
				text : '转换'
			},
			text : {
				text : '转换'
			},
			img : {
				src : rootPath + 'images/ico_data_transform.png',
				width : 104,
				height : 86
			},
			props : {
				// 默认参数，作用暂时未知
				supportsReferences: 'Y',
				specification_method: 'rep_name',
				directory: '/',
				arg_from_previous: 'N',
				params_from_previous: 'N',
				exec_per_row: 'N',
				clear_rows: 'N',
				clear_files: 'N',
				set_logfile: 'N',
				add_date: 'N',
				add_time: 'N',
				loglevel: 'Basic',
				cluster: 'N',
				set_append_logfile: 'N',
				wait_until_finished: 'Y',
				follow_abort_remote: 'N',
				create_parent_folder: 'N',
				logging_remote_work: 'N',
				draw: 'Y',
				nr: '0',
				parallel: 'N',
				// 有效参数
				ctype: 'TRANS',
				label: '转换',
				transname: ''
			}
		}
	});
})(jQuery);