/// <reference path="jquery-1.7.2.min.js" />
/// <reference path="knockout-3.4.0.js" />

ko.bindingHandlers.renderControl = {

    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var dataType = viewModel.DataType().toLocaleLowerCase();
        var currentValue = viewModel.ItemValue();
        var isRequired = (viewModel.IsCompulsory() == 'True') ? ' Required' : '';

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
                var itemCode = viewModel.ItemCode();
                var optionsSource = getOptionsSource(itemCode);
                if (optionsSource == null) {
                    html = '<select class="form-control" ></select>';
                } else {
                    var op = "";
                    $.each(optionsSource, function (i, option) {
                        op = op + '<option value="' + option.ValueShort + '">' + option.Value + '</option>';
                    });
                    var id = allBindings.get('id');
                    if (id == null) {
                        html = '<select class="form-control" data-bind="value: ItemValue">' + op + '</select>';
                    } else {
                        html = '<select id=' + id + itemCode + ' class="form-control" data-bind="value: ItemValue">' + op + '</select>';
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
            case 'text':
                html += '<span data-bind="text: ItemValue"></span>';
                $(html).appendTo($(element));
                break;

            default:
                html += '<input type="text" class="form-control" data-bind="value: ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + isRequired + '" />';
                $(html).appendTo($(element));
                break;
        }
    }
};


