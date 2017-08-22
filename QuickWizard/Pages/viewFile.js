

var setting = {
    view: {
        selectedMulti: false
    },
    edit: {
        enable: true,
        showRemoveBtn: true,
        showRenameBtn: false
    },
    data: {
        keep: {
            parent: true,
            leaf: true
        },
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeRemove: beforeRemove,
        onRemove: onRemove
    }
};


  
var zNodes = [];

var className = "dark";
function beforeRemove(treeId, treeNode) {
    className = (className === "dark" ? "" : "dark");
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.selectNode(treeNode);
    return  confirm("确认删除  -- " + treeNode.name + " 吗？");
}

function onRemove(e, treeId, treeNode) {
    var nodeId = treeNode.id;
    var isFolder = treeNode.isParent;
    DataOperate.DocumentDelete(bid, nodeId, isFolder);
}

 
function remove(e) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    nodes = zTree.getSelectedNodes(),
    treeNode = nodes[0];
    if (nodes.length == 0) {
        mac.alert("请先选择一个文件夹或者文件");
        return;
    }

    var callbackFlag = $("#callbackTrigger").attr("checked");
    zTree.removeNode(treeNode, callbackFlag);

    var nodeId = treeNode.id;
    var isFolder = treeNode.isParent;
    //DataOperate.DocumentDelete(bid, nodeId, isFolder);

};
 
function add(e) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var isParent = e.data.isParent;
    var nodeName = "";
    var nodes = zTree.getSelectedNodes();
    var  treeNode = nodes[0];

    if (isParent) {
        nodeName = $("#folder").val();
        if (nodeName == null || nodeName == "")
        {
            mac.alert("文件夹名称不能为空.");
            return;
        }
    }
    else {
        var file = $("#file").val();
        nodeName = getFileName(file);
        if (nodeName == null || nodeName == "") {
            mac.alert("请添加要上传的文件.");
            return;
        }
    }
     
    if (treeNode) {
        if (isParent) {
            DataOperate.CreateFolder(bid, treeNode.id, nodeName, function (nId) {
                if (nId == -1) {
                    mac.alert("文件夹：" + nodeName + " 已经存在了。");
                }
                else if (nId == -3) {
                    mac.alert("文件夹数据库操作异常。");
                }
                else {
                    treeNode = zTree.addNodes(treeNode, { id: parseInt(nId), pId: treeNode.id, isParent: isParent, name: nodeName});
                }
            })
        }
        else {
            var fileData = document.getElementById("file").files[0];
            DataOperate.UploadFile(bid, treeNode.id, nodeName,fileData, function (nId) {
                if (nId == -1) {
                    mac.alert("文件：" + nodeName + " 已经存在了。");
                }
                else if (nId == -2)
                {
                    mac.alert("文件创建异常。");
                }
                else if (nId == -3) {
                    mac.alert("文件数据库操作异常。");
                }
                else {
                    treeNode = zTree.addNodes(treeNode, { id: parseInt(nId), pId: treeNode.id, isParent: isParent, name: nodeName, icon: getTreeICON(nodeName) });
                }
            })
        }
       
    } else {
        if (isParent) {
            DataOperate.CreateFolder(bid, 0, nodeName, function (nId) {
                if (nId == -1) {
                    mac.alert("文件夹：" + nodeName + " 已经存在了。");
                }
                else if (nId == -3) {
                    mac.alert("文件夹数据库操作异常。");
                }
                else {
                    treeNode = zTree.addNodes(null, { id: parseInt(nId), pId: 0, isParent: isParent, name: nodeName });
                }
            })
        }
        else {
            var fileData = document.getElementById("file").files[0];
            DataOperate.UploadFile(bid, 0, nodeName, fileData,function (nId) {
                if (nId == -1) {
                    mac.alert("文件：" + nodeName + " 已经存在了。");
                }
                else if (nId == -2) {
                    mac.alert("文件创建异常。");
                }
                else if (nId == -3) {
                    mac.alert("文件数据库操作异常。");
                }
                else {
                    treeNode = zTree.addNodes(null, { id: parseInt(nId), pId: 0, isParent: isParent, name: nodeName, icon: getTreeICON(nodeName) });
                }
            })
        }
        
    }
    if (treeNode) {
        zTree.editName(treeNode[0]);
    } else {
        //alert("叶子节点被锁定，无法增加子节点");
    }
};

 

function getFileName(o) {
    var pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
}

 

 

var bid;
$(document).ready(function () {
    bid = getQueryString("bid");
    DataOperate.getDocumentsByBid(bid, function (data) {
        $.each(data, function (i, note) {
            if (note.IsFolder) {
                var folder = { id: note.NodeId, pId: note.ParentNodeId, isParent: note.IsFolder, name: note.NodeName, open: true };
                zNodes.push(folder);
            }
            else {
                var file = { id: note.NodeId, pId: note.ParentNodeId, isParent: note.IsFolder, name: note.NodeName, open: true,icon:getTreeICON(note.NodeName) };
                zNodes.push(file);
            }
          
        })

        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        $("#addParent").bind("click", { isParent: true }, add);
        $("#addLeaf").bind("click", { isParent: false }, add);
        $('#loading').fadeOut();
    });
});


function getTreeICON(nodeName)
{
    var index = nodeName.lastIndexOf('.');
    var type= nodeName.substr(index + 1);
    switch (type)
    {
        case "xls":
        case "xlsx":
            return "../Scripts/zTree/css/zTreeStyle/img/xls.gif";
        case "doc":
        case "docx":
            return "../Scripts/zTree/css/zTreeStyle/img/doc.gif";
        case "ppt":
        case "pptx":
            return "../Scripts/zTree/css/zTreeStyle/img/ppt.gif";
        case "html":
        case "htm":
        case "aspx":
            return "../Scripts/zTree/css/zTreeStyle/img/html.gif";
        case "txt":
            return "../Scripts/zTree/css/zTreeStyle/img/txt.gif";
        case "pdf":
            return "../Scripts/zTree/css/zTreeStyle/img/pdf.png";
        default:
            return "../Scripts/zTree/css/zTreeStyle/img/default.gif";
    }
}