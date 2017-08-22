ko.bindingHandlers.renderControl = {

    init: function (element, valueAccessor, allBindings, viewModel) {

        var dataType = viewModel.DataType().toLocaleLowerCase();
        var setName = viewModel.ItemAliasSetName();
        var currentValue = viewModel.ItemValue();
        var isRequired = (viewModel.IsCompulsory() == true) ? ' Required' : '';
        var html = '';
        switch (dataType) {
            case 'double':
            case 'float':
                html += '<input type="text" class="form-control" data-bind="value:ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                $(element).find("input").eq(0).keyup(function (event) {
                    if (!this.value.match(/^[\+\-]?\d*?\.?\d*?$/)) {
                        this.value = this.t_value;
                        viewModel.ItemValue(this.value);
                    }
                    else {
                        this.t_value = this.value;
                    }
                    if (this.value.match(/^(?:[\+\-]?\d+(?:\.\d+)?)?$/)) {
                        this.o_value = this.value
                    }
                });
                break;
            case 'decimal':
                html+= '<div class="input-group">';
                html += '<label></label>';
                html += '<input type="text" data-name="pc" class="form-control" ';
                html += ' data-valid="' + dataType + isRequired + '" />';
                html += '<span class="input-group-btn">';
                html += '<select  class="form-control">';
                html += getDrodownpOption(setName);
                html += '</select>';
                html += '</span>';
                html += '</div>';
                $(html).appendTo($(element));
               
                $(element).find("select").eq(0).change(function () {
                    var inp = $(element).find("label").eq(0).attr("value");
                    var drop = $(element).find("select").eq(0).val();
                    var drop_Old = $(element).find("label").eq(0).attr("drop");
                    var power = getPower(drop,drop_Old);
                    if (power > 0) {
                        var moneyValue = moneyAlgorithm(inp, power, true);
                        if (isNaN(moneyValue))
                            moneyValue = "";
                        $(element).find("label").eq(0).attr("value", moneyValue);
                        viewModel.ItemValue(moneyValue + "|" + drop);
                    }
                    else if(power<0){
                        power = parseInt(power.toString().substr(1, 1));
                        var moneyValue = moneyAlgorithm(inp, power, false);
                        if (isNaN(moneyValue))
                            moneyValue = "";
                        $(element).find("label").eq(0).attr("value", moneyValue);
                        viewModel.ItemValue(moneyValue + "|" + drop);
                    }
                    $(element).find("label").eq(0).attr("drop", drop);
                   
                });

                $(element).find("input").eq(0).keyup(function (event) {
                    var number=new FormatNumber()
                    number.checkNumberFunc(null, event, callback);
                    function callback(float)
                    {
                        var drop = $(element).find("select").eq(0).val();
                        if (float != null && float != "") {
                            $(element).find("label").eq(0).attr("value", float);
                            viewModel.ItemValue(float + "|" + drop);
                        }
                        else {
                            $(element).find("label").eq(0).attr("value", "");
                            viewModel.ItemValue("");
                        }
                    }
                    validControlValue(this);
                });
                
                if (currentValue != null && currentValue != "") {
                    var array = currentValue.split('|');
                    if (array.length < 2) {
                        $(element).find("input").eq(0).val(getMoneyFormat(array[0]));
                        var old = $(element).find("select").eq(0).val();
                        $(element).find("label").eq(0).attr("drop", old);
                        $(element).find("label").eq(0).attr("value", (array[0]));
                    }
                    else {
                        $(element).find("input").eq(0).val(getMoneyFormat(array[0]));
                        $(element).find("select").eq(0).val(array[1]);
                        $(element).find("label").eq(0).attr("drop", array[1]);
                        $(element).find("label").eq(0).attr("value", (array[0]));
                    }
                }
                else {
                    $(element).find("input").eq(0).val("");
                    var old = $(element).find("select").eq(0).val();
                    $(element).find("label").eq(0).attr("drop", old);
                    $(element).find("label").eq(0).attr("value", "");
                }
                break;
            case 'list':
                var itemId = 'list_'+viewModel.ItemId();
                var setName = viewModel.ItemAliasSetName();
                var options = RoleOperate.getChildItems(itemId, setName);
                html += '<input type="text" list="' + itemId + '" class="form-control" data-bind="value: ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + isRequired + '" />';
                $(html).appendTo($(element));
                if (options == null) {
                    html = '<datalist id="' + itemId + '"></datalist>';
                } else {
                    var op = "";
                    $.each(options, function (i, option) {
                        op = op + '<option value="' + option.ItemChildId + '">' + option.ItemAliasValue + '</option>';
                    });
                    html = '<datalist id="' + itemId + '">' + op + '</datalist>';
                }
                $(html).appendTo($(element));
                break;
            case 'int':
                html += '<input type="text" class="form-control" data-bind="value:ItemValue" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                $(element).find("input").eq(0).keyup(function (event) {
                    if (this.value.length == 1) {
                        this.value = this.value.replace(/[^1-9]/g, '')
                        viewModel.ItemValue(this.value);
                    } else {
                        this.value = this.value.replace(/\D/g, '')
                        viewModel.ItemValue(this.value);
                    }
                });
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
                var itemValue = viewModel.ItemValue();
                if (itemValue == "True") {
                    html += '<input type="checkbox" data-bind="checked:true" />';
                }
                else{
                    html += '<input type="checkbox" data-bind="checked:false" />';
                    viewModel.ItemValue("False");
                }
                $(html).appendTo($(element));
                $(element).find("[type='checkbox']").click(function () {
                    var a = $(element).find("[type='checkbox']").attr("checked");
                    if (a == "checked") {
                        viewModel.ItemValue("True");
                    }
                    else {
                        viewModel.ItemValue("False");
                    }
                });
                break;
            case 'select':
                var itemId = viewModel.ItemId();
                var itemCode = viewModel.ItemCode();
                var setName = viewModel.ItemAliasSetName();
                var options = RoleOperate.getChildItems(itemId, setName);
                if (options == null) {
                    html = '<select class="form-control" ></select>';
                } else {
                    var op = "";
                    $.each(options, function (i, option) {
                        op = op + '<option value="' + option.ItemChildId + '">' + option.ItemAliasValue + '</option>';
                    });
                    html = '<select id=dropDown_' + itemCode + ' class="form-control" data-bind="value: ItemValue">' + op + '</select>';
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
    },

    update: function(element, valueAccessor, allBindings, viewModel){
        var dataType = viewModel.DataType().toLocaleLowerCase();
        var currentValue = viewModel.ItemValue();
        switch (dataType) {
            case 'decimal':
                if (currentValue != null && currentValue != "") {
                    var array = currentValue.split('|');
                    if (array.length < 2) {
                        $(element).find("input").eq(0).val(getMoneyFormat(array[0]));
                        var old = $(element).find("select").eq(0).val();
                        $(element).find("label").eq(0).attr("drop", old);
                        $(element).find("label").eq(0).attr("value", array[0]);
                    }
                    else {
                        $(element).find("input").eq(0).val(getMoneyFormat(array[0]));
                        $(element).find("select").eq(0).val(array[1]);
                        $(element).find("label").eq(0).attr("drop", array[1]);
                        $(element).find("label").eq(0).attr("value", array[0]);
                    }
                }
                else {
                    $(element).find("input").eq(0).val("");
                    var old = $(element).find("select").eq(0).val();
                    $(element).find("label").eq(0).attr("drop", old);
                    $(element).find("label").eq(0).attr("value", "");
                }
                break;
            case "bool":
                var itemValue = viewModel.ItemValue();
                if (itemValue == "True") {
                    $(element).find("[type='checkbox']").attr("checked",'true');
                }
                else {
                    $(element).find("[type='checkbox']").removeAttr("checked");
                }
                break;
        }
    }
};

/*自定义Item时使用，需要data-bind="renderControl2: ItemCode, DataType: 'Decimal',SetName:$parent.SetName">*/
ko.bindingHandlers.renderControl2 = {
    init: function (element, valueAccessor, allBindings) {
        var dataType = allBindings.get('DataType').toLocaleLowerCase();
        var setName = allBindings.get('SetName');
        var itemId = allBindings.get('ItemId');
        var itemCode = allBindings.get('ItemCode');
        var itemValueF = valueAccessor();
        var itemValue = itemValueF();
        var isRequired =' Required';
        var html = '';
        switch (dataType) {
            case 'double':
            case 'float':
                html += '<input type="text" class="form-control" data-bind="value:'+itemCode+'" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                break;
            case 'decimal':
                html += '<div class="input-group">';
                html += '<label></label>';
                html += '<input type="text" data-name="pc" class="form-control" ';
                html += ' data-valid="' + dataType + isRequired + '" />';
                html += '<span class="input-group-btn">';
                html += '<select  class="form-control">';
                html += getDrodownpOption(setName);
                html += '</select>';
                html += '</span>';
                html += '</div>';
                $(html).appendTo($(element));

                $(element).find("select").eq(0).change(function () {
                    var inp = $(element).find("label").eq(0).attr("value");
                    var drop = $(element).find("select").eq(0).val();
                    var drop_Old = $(element).find("label").eq(0).attr("drop");
                    var power = getPower(drop, drop_Old);
                    if (power > 0) {
                        var moneyValue = moneyAlgorithm(inp, power, true);
                        $(element).find("label").eq(0).attr("value", moneyValue);
                        itemValueF(moneyValue + "|" + drop);
                    }
                    else if (power < 0) {
                        power = parseInt(power.toString().substr(1, 1));
                        var moneyValue = moneyAlgorithm(inp, power, false);
                        $(element).find("label").eq(0).attr("value", moneyValue);
                        itemValueF(moneyValue + "|" + drop);
                    }
                    $(element).find("label").eq(0).attr("drop", drop);

                });

                $(element).find("input").eq(0).keyup(function (event) {
                    var number = new FormatNumber()
                    number.checkNumberFunc(null, event, callback);
                    function callback(float) {
                        var drop = $(element).find("select").eq(0).val();
                        if (float != null && float != "") {
                            $(element).find("label").eq(0).attr("value", float);
                            itemValueF(float + "|" + drop);
                        }
                        else {
                            $(element).find("label").eq(0).attr("value", "");
                            itemValueF("");
                        }
                    }
                    validControlValue(this);
                });

                if (itemValue != null && itemValue != "") {
                    var array = itemValue.split('|');
                    if (array.length < 2) {
                        $(element).find("input").eq(0).val(getMoneyFormat(array[0]));
                        var old = $(element).find("select").eq(0).val();
                        $(element).find("label").eq(0).attr("drop", old);
                        $(element).find("label").eq(0).attr("value", (array[0]));
                    }
                    else {
                        $(element).find("input").eq(0).val(getMoneyFormat(array[0]));
                        $(element).find("select").eq(0).val(array[1]);
                        $(element).find("label").eq(0).attr("drop", array[1]);
                        $(element).find("label").eq(0).attr("value", (array[0]));
                    }
                }
                else {
                    $(element).find("input").eq(0).val("");
                    var old = $(element).find("select").eq(0).val();
                    $(element).find("label").eq(0).attr("drop", old);
                    $(element).find("label").eq(0).attr("value", "");
                }
                break;
          
            case 'int':
                html += '<input type="text" class="form-control" data-bind="value:' + itemCode + '" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                break;

            case 'date':
                html += '<input type="text" class="form-control date-plugins" data-bind="value:' + itemCode + '" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                break;

            case 'datetime':
                html += '<input type="text" class="form-control date-plugins" data-bind="value:' + itemCode + '" onchange="validControlValue(this)"';
                html += ' data-valid="' + dataType + isRequired + '" />';
                $(html).appendTo($(element));
                break;

            case 'bool':
                if (itemValue == "True") {
                    html += '<input type="checkbox" data-bind="checked:true" />';
                }
                else {
                    html += '<input type="checkbox" data-bind="checked:false" />';
                }
                $(html).appendTo($(element));
                $(element).find("[type='checkbox']").click(function () {
                    var a = $(element).find("[type='checkbox']").attr("checked");
                    if (a == "checked") {
                        itemValueF("True");
                    }
                    else {
                        itemValueF("False");
                    }
                });
                break;
            case 'select':
                var options = RoleOperate.getChildItems(itemId, setName);
                if (options == null) {
                    html = '<select class="form-control" ></select>';
                } else {
                    var op = "";
                    $.each(options, function (i, option) {
                        op = op + '<option value="' + option.ItemChildId + '">' + option.ItemAliasValue + '</option>';
                    });
                    html = '<select id=dropDown_' + itemId + ' class="form-control" data-bind="value: ItemValue">' + op + '</select>';
                }
                $(html).appendTo($(element));
                break;

            case 'text':
                html += '<span data-bind="text: ' + itemCode + '"></span>';
                $(html).appendTo($(element));
                break;

            default:
                html += '<input type="text" class="form-control" data-bind="value: ' + itemCode + '" onchange="validControlValue(this)"';
                html += ' data-valid="' + isRequired + '" />';
                $(html).appendTo($(element));
                break;
        }
    },
    update: function (element, valueAccessor, allBindings) {
        var dataType = allBindings.get('DataType').toLocaleLowerCase();
        var setName = allBindings.get('SetName');
        var itemId = allBindings.get('ItemId');
        var itemCode = allBindings.get('ItemCode');
        var itemValueF = valueAccessor();
        var itemValue = itemValueF();
        var isRequired = ' Required';
        switch (dataType) {
            case 'decimal':
                if (itemValue != null && itemValue != "") {
                    var array = itemValue.split('|');
                    if (array.length < 2) {
                        $(element).find("input").eq(0).val(getMoneyFormat(array[0]));
                        var old = $(element).find("select").eq(0).val();
                        $(element).find("label").eq(0).attr("drop", old);
                        $(element).find("label").eq(0).attr("value", array[0]);
                    }
                    else {
                        $(element).find("input").eq(0).val(getMoneyFormat(array[0]));
                        $(element).find("select").eq(0).val(array[1]);
                        $(element).find("label").eq(0).attr("drop", array[1]);
                        $(element).find("label").eq(0).attr("value", array[0]);
                    }
                }
                else {
                    $(element).find("input").eq(0).val("");
                    var old = $(element).find("select").eq(0).val();
                    $(element).find("label").eq(0).attr("drop", old);
                    $(element).find("label").eq(0).attr("value", "");
                }
                break;
            case "bool":
                var itemValue = viewModel.ItemValue();
                if (itemValue == "True") {
                    $(element).find("[type='checkbox']").attr("checked", 'true');
                }
                else {
                    $(element).find("[type='checkbox']").removeAttr("checked");
                }
                break;
        }
    }
};

var zh = { One: "元", TenThoursand: "万", Million: "百万", TenMillion: "千万", HundredMillion: "亿" };
var en = { One: "Y", TenThoursand: "TT", Million: "M", TenMillion: "TM", HundredMillion: "HM" };
var moneyEnum={ One: 0, TenThoursand:4, Million:6, TenMillion: 7, HundredMillion: 8};

function getPower(newM,oldM)
{
    return parseInt(moneyEnum[oldM])-parseInt(moneyEnum[newM]);
}

function getDrodownpOption(setName)
{
    var html = "";
    switch (setName) {
        case "zh-CN":
            html += ' <option value="HundredMillion">' + zh["HundredMillion"] + '</option>';
            html += ' <option value="TenMillion">' + zh["TenMillion"] + '</option>';
            html += ' <option value="Million">' + zh["Million"] + '</option>';
            html += ' <option value="TenThoursand">' + zh["TenThoursand"] + '</option>';
            html += ' <option value="One">' + zh["One"] + '</option>';
            break;
        case "en-US":
            html += ' <option value="HundredMillion">' + en["HundredMillion"] + '</option>';
            html += ' <option value="TenMillion">' + en["TenMillion"] + '</option>';
            html += ' <option value="Million">' + en["Million"] + '</option>';
            html += ' <option value="TenThoursand">' + en["TenThoursand"] + '</option>';
            html += ' <option value="One">' + en["One"] + '</option>';
            break;
    }
    return html;
}

//数据库中的DataType=Decimal时数据，转换为页面显示的钱（对应于Edit里DropDown相应的Grid数据显示）
function getMoneyText(itemValue, setName) {
    var text = "";
    if (itemValue != null && itemValue != "")
    {
        var money = itemValue.split('|')[0];
        moneyFormat = getMoneyFormat(money);
        var key = itemValue.split('|')[1];
        if (setName == "zh-CN") {
            text = moneyFormat + zh[key];
        }
        else  if (setName == "en-US") {
            text = moneyFormat + en[key];
        }
    }
    return text;
}

//将货币模式显示
function getMoneyFormat(money) {
    if (money.indexOf("e") != -1 || money.indexOf("E") != -1) {
        var left = money.split("e-")[0];
        var right = parseInt(money.split("e-")[1]);

        if (left.indexOf(".") != -1) {
            var l = left.split(".")[0].length;
            return "0." + getZero(right - l) + left.replace(".", "");
        }
        else {
            var l = left.length;
            return "0." + getZero(right - l) + left;
        }
    }
    else {
        var number = new FormatNumber();
        if (parseFloat(money) == money) {
            var ret = number.convertNumberN(1, money);
            return ret;
        }
        else
            return money;
    }

    function getZero(number) {
        var r = "";
        for (i = 0; i < number; i++) {
            r += "0";
        }
        return r;
    }
}

function moneyAlgorithm(money, power, by) {
    money = parseFloat(money);
    var powerT = Math.pow(10, power);
    if (by) {
        money = accMul(money,powerT);
    }
    else {
        money = accDiv(money,powerT);
    }

    return parseFloat(money);
}




