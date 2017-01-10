/**
 * Created with JetBrains WebStorm.
 * User: yangyu3
 * Date: 15-7-6
 * Time: 上午9:25
 * To change this template use File | Settings | File Templates.
 */

$.extend(true, $.grid.defaults, {
    editUrl: '', // 编辑url
    ajaxEditOptions: {},
    defaultBindEdit: false
    //cellEdit: false
});


$.grid.init.push(function () {
    var that = this,
        colModel = that.settings.colModel,
        formart;

    $.each(colModel, function (i, model) {
        if (model.editAble == true) {

            formart = model.formart;

            model.formart = function (data) {

                var type = model.editType || 'text',
                    html,
                    editFn = $.grid.edit[type];

                html = editFn.parse(data, model);
                return formart ? formart.apply(null, arguments) : html.html;
            }
        }
    })
})

$.extend(true, $.grid._events, {
    'dblclick | .ui-jqgrid-bdiv tr': 'onEdit'
});

$.extend(true, $.grid,{
    onEdit: function (event, obj) {

        if (obj.settings.defaultBindEdit&&!$(this).hasClass('grid_edit')) {
            var id = $(this).attr('id');
            $.grid.fn.rowEdit.call(obj, id);
        }
    }
});

$.extend(($.grid.edit={}), {
    text: {
        set: function (colModel, cellData) {
            return '<input type="text" value="'+cellData+'" class="grid_edit_text grid_edit"/>';
        },

        get: function (cell) {
            var val = cell.find('[class^=grid_edit_]').val() || '';

            return this.parse(val)
        },

        parse: function (val) {
            return {
                html: val,
                val: val
            }
        }
    },
    checkbox: {
        option: ['YES:0', 'NO:1'],
        set: function (colModel, cellData) {
            var  option = colModel.editOptions || this.option;

            return '<input type="checkbox" class="grid_edit_radio grid_edit" '+ ((cellData == option[0].split(':')[1]) ? 'checked ' : ' ')  +'/>'

        },
        get: function (cell, colModel) {
            var  option = colModel.editOptions || this.option,
                isCheck = cell.find('[class^=grid_edit_]').is(':checked'),
                val = option[isCheck ? 0 : 1].split(':')[1];

            return this.parse(val, colModel)

        },
        parse: function (val, colmodel) {

            var option = colmodel.editOptions || this.option;
            val = option[0].split(':')[1] === val ? option[0] : option[1];

            return {
                html: val.split(':')[0],
                val:  val.split(':')[1]
            }
        }
    },
    select: {
        set: function (colModel, cellData) {
            var option = colModel.editOptions,
                html = ['<select class="grid_edit_select grid_edit">'];

            for (var i in option) {

                html.push('<option value="'+option[i]+'"  '+(option[i]==cellData && 'selected')+'>'+i+'</option>')
            }
            html.push('</select>');

            return html.join('');
        },
        get: function (cell, colModel) {
            var   select = cell.find('[class^=grid_edit_]'),
                val = select.val();

            return this.parse(val, colModel)
        },

        parse: function (val, colModel) {
            var html, options = colModel.editOptions;

            for (var i in options) {
                if (options[i] === val) {
                    html = i;
                }
            }

            return {
                html: html,
                val: val
            }
        }
    }
});


// 外部调用的接口

$.extend($.grid.fn, {
    getStringData: function (sid) {
        if (!$.isArray(sid)) {
            sid = sid ? [sid] : [];
        }
        var val = [], that = this, rows = this._pageData.rows;

        $.each(sid, function (i, n) {
            var index = that.getGridDataIndex(n);
            val.push(str ? rows[index][str] : rows[index]);
        });
        return JSON.stringify(val.length ? val : rows);
    },

    rowEdit: function (id) {
        var that = this,
            colModel = that.settings.colModel;

        for (var i=0, len=colModel.length; i < len; i++) {
            that.cellEdit(id, colModel[i].name)
        }
        this.getTrById(id).addClass('grid_edit');
        that.wrap.triggerHandler('rowEdit', [id]);
    },

    rowSave: function (id) {
        var that = this,
            colModel = that.settings.colModel;

        for(var i=0, len=colModel.length; i < len; i++) {
            that.cellSave(id, colModel[i].name);
        }
        this.getTrById(id).removeClass('grid_edit');
        that.wrap.triggerHandler('rowSave', [id]);
    }
})


$.extend($.grid.prototype, {

    cellEdit: function (id, name) {
        var cellData, rowData, cell, type,
            that= this,
            colModel = that.settings.colModel,
            index = that.getcolModelIndexByName(name);

        colModel = colModel[index];

        if (!colModel || colModel.editAble !== true) {
            return;
        }

        cell = that.getTrById(id).find('[role=gridcell]').eq(index);
        rowData = that._pageData.rows[that.getGridDataIndex(id)];

        type = colModel.editType || 'text';
        cell.html($.grid.edit[type].set(colModel, rowData[name], rowData) || '');

    },

    cellSave: function (id, name) {
        var html, title, valData, type,formart,
            that= this,
            rowData = that._pageData.rows[that.getGridDataIndex(id)],
            index = that.getcolModelIndexByName(name),
            colModel = that.settings.colModel[index],
            cell = that.getTrById(id).find('[role=gridcell]').eq(index);

        if (!colModel || colModel.editAble !== true || !cell.find('.grid_edit').length) {
            return;
        }

        type = colModel.editType || 'text';
        valData = $.grid.edit[type].get(cell, colModel, rowData);
        rowData[name] = valData['val'];
        formart = colModel.formart
        html = valData['html'];

        title = $.grid.stripHtml(html);
        cell.html(html).attr('title', title);
    },

    recoveData: function (id) {
        var data = this._pageData.rows[that.getGridDataIndex(id)];
        this.setRowData(id, data)
    }
})