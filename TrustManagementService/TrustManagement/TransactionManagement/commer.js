
//检索
var layout = new kendo.Layout("<div class='input-group pull-right' id='content' style='display:inline-block'>" + "检索:" +
       "<input type='text' id='PoolDBNameDate' style='display:inline-block;line-height:25px;margin-right:5px;' aria-describedby='basic-addon2'>" + "<button type='button' id='PoolDBNameBtn' class='btn btn-primary'>检索</button>" +
   "</div>");
layout.render($("#LayOutapp"));
//view7
var viewlayout = new kendo.Layout("<div class='input-group pull-right' id='content' style='display:inline-block'>"
    + "资产编号:" +
    "<input type=s'text' id='PoolDBNameDate' style='display:inline-block;line-height:25px;margin-right:10px' aria-describedby='basic-addon2'>" +
    "产品名称:" +
    "<input type='text' id='PoolDBNameDate1' style='display:inline-block;line-height:25px;margin-right:5px;' aria-describedby='basic-addon2'>" +
    "<button type='button' id='PoolDBNameBtn' class='btn btn-primary'>检索</button>" +
   "</div>");
viewlayout.render($("#LayOutview"));
//view
var viewslayout = new kendo.Layout("<div class='input-group pull-right' id='content' style='display:inline-block'>"
    + "截止日期:" +
    "<input type='text' id='PoolDBNameDate' style='display:inline-block;line-height:25px;margin-right:10px' aria-describedby='basic-addon2'>" +
    "资产编号:" +
    "<input type='text' id='PoolDBNameDate1' style='display:inline-block;line-height:25px;margin-right:5px;' aria-describedby='basic-addon2'>" +
    "<button type='button' id='PoolDBNameBtn' class='btn btn-primary'>检索</button>" +
   "</div>");
viewslayout.render($("#LayOutviews"));
//多项检索
var layouts = new kendo.Layout("<div class='input-group pull-right' id='content' style='display:inline-block'>"
                                   + "资产池名称:" +
       "<input type='text' id='PoolDBNameDate1' class='date-plugins' style='display:inline-block;line-height:25px;margin-right:5px' aria-describedby='basic-addon2'>"
    + "赎回日期:" +
    "<input type='text' id='PoolDBNameDate2' style='display:inline-block;line-height:25px;margin-right:5px' aria-describedby='basic-addon2'>"
    + "交易主体:" +
    "<input type='text' id='PoolDBNameDate3' style='display:inline-block;line-height:25px;margin-right:5px;' aria-describedby='basic-addon2'>" +
    "<button type='button' id='PoolDBNameBtn' class='btn btn-primary'>检索</button>" +
   "</div>");
layouts.render($("#LayOutslist"));

//单位净价
var NetAssetValueApp = new kendo.Layout("<div class='input-group pull-right NetAssetValueDateDiv' style='display:none'>"+
"单位净价："+
"<input type='number' id='NetAssetValueDate' style='display:inline-block;line-height:25px;margin-right:10px' >" +
"<button type='button' id='NetAssetValueBtn' class='btn btn-primary'>"+"单位净价修改"+"</button>"
+"</div>");
NetAssetValueApp.render($("#NetAssetValueApp"));



