//资产转让：39 资产赎回：44   清仓回购：40 回购上划42：   信托对价：43   回收上划：41
function saveItem(){
    console.log('aaaaa');
    if(document.getElementById("check1").checked)
        DataOperate.UpdateEC(39, 1);
    else
        DataOperate.UpdateEC(39, 0);
    if (document.getElementById("check2").checked)
        DataOperate.UpdateEC(44, 1);
    else
        DataOperate.UpdateEC(44, 0);
    if (document.getElementById("check3").checked)
        DataOperate.UpdateEC(40, 1);
    else
        DataOperate.UpdateEC(40, 0);
    if (document.getElementById("check4").checked)
        DataOperate.UpdateEC(42, 1);
    else
        DataOperate.UpdateEC(42, 0);
    if (document.getElementById("check5").checked)
        DataOperate.UpdateEC(43, 1);
    else
        DataOperate.UpdateEC(43, 0);
    if (document.getElementById("check6").checked)
        DataOperate.UpdateEC(41, 1);
    else
        DataOperate.UpdateEC(41, 0);
    
}