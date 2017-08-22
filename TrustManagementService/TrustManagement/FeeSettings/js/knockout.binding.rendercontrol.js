/// <reference path="jquery-1.7.2.min.js" />
/// <reference path="knockout-3.4.0.js" />

ko.bindingHandlers.renderControl = {

    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var dataType = viewModel.DataType ? viewModel.DataType().toLocaleLowerCase() : '';
        var currentValue = viewModel.ItemValue ? viewModel.ItemValue() : viewModel.DisplayName();
        var isRequired = (viewModel.IsCompulsory && viewModel.IsCompulsory() == 'True') ? ' Required' : '';

        var html = '';

        switch (dataType) {
            case 'double':
            case 'float':
            case 'decimal':
                html += '<input type="text" class="form-control" data-bind="value:ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                break;

            case 'int':
                html += '<input type="text" class="form-control" data-bind="value:ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                break;

            case 'date':
                html += '<input type="text" class="form-control date-plugins" data-bind="value:ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                break;

            case 'datetime':
                html += '<input type="text" class="form-control date-plugins" data-bind="value:ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                break;

            case 'bool':
                html += '<input type="checkbox" data-bind="checked: ItemValue" />';
                $(html).appendTo($(element));
                break;

            case 'select':
                var DataSourceName = viewModel.DataSourceName();
                var optionsSource = getOptionsSource(DataSourceName);
                if (optionsSource == null) {
                    html = '<select class="form-control" ></select>';
                } else {
                    var op = "";
                    $.each(optionsSource, function (i, option) {
                        op = op + '<option value="' + option.Value + '">' + option.Title + '</option>';
                    });
                    var id = allBindings.get('id');
                    if (id == null) {
                        //html = '<select class="form-control" data-bind="value: ItemValue">' + op + '</select>';
                        html = '<select class="form-control" data-bind="value: ItemValue">' + op + '</select>';
                    } else {
                        html = '<select id=' + id + DataSourceName + ' class="form-control" data-bind="value: ItemValue">' + op + '</select>';
                    }
                }
                $(html).appendTo($(element));
                break;
            case 'list':
                var itemCode = viewModel.ItemCode();
                var listid = itemCode + "_IdList";
                html += '<input type="text" list="' + listid + '" class="form-control" data-bind="value: ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + isRequired + '" />';
                $(html).appendTo($(element));
                var idList = getIdList(itemCode);
                if (idList == null) {
                    html = '<datalist id="' + listid + '"></datalist>';
                } else {
                    var op = "";
                    $.each(idList, function (i, option) {
                        op = op + '<option value="' + option.Value + '"></option>';
                    });
                    html = '<datalist id="' + listid + '">' + op + '</datalist>';
                }
                $(html).appendTo($(element));
                break;
            case 'autocomplete':
                var actioncode = viewModel.ActionCode();
                var optionsSource = getFeeSource(actioncode);
                if (optionsSource == null) {
                    html = '<select class="form-control" ></select>';
                } else {
                    var op = "";
                    $.each(optionsSource, function (i, option) {
                        op = op + '<option value="' + option.ActionCode + '">' + option.DisplayName + '</option>';
                    });
                    //var id = allBindings.get('id');
                    //if (id == null) {
                    //    html = '<select class="form-control" data-bind="value: DisplayName">' + op + '</select>';
                    //} else {
                    html = '<select id="' + actioncode + '" type="autocomplete" class="form-control" defaultValue="' + viewModel.DisplayName() + '">' + op + '</select>';
                    //}
                }
                $(html).appendTo($(element));
                $('#' + actioncode).combobox({
                });
                $(html).removeAttr('defaultValue');
                break;
            case 'text':
                html += '<span data-bind="text: ItemValue"></span>';
                $(html).appendTo($(element));
                break;

            default:
                /* 
                 * 针对ie下onchange事件引起表单无光标bug的替代方案，这个方案不是最好的，推荐使用subscribe来订阅改变
                 * 在viewModel中添加validControlValue方法，替代 onchange="validControlValue(this)"
                 */
                html += '<input type="text" class="form-control" data-bind="value: ItemValue,event:{change:$root.validControlValue}"';
                html += ' data-valid="' + isRequired.trim() + '" />';
                $(html).appendTo($(element));
                break;
        }
    }
};


