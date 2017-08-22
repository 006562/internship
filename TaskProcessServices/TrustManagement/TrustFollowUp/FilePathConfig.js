var FilePathConfig = (function () {
    //格式化字符串
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var VirtualPath = "/TaskProcessServices", FilePathRoot = "TrustFiles";

    var getFilePath = function (trustId, typeName, typeId, fileName) {
        var wl = window.location;
        var path = "{0}//{1}{2}/{3}/{4}/{5}/{6}/{7}";
        return path.format(wl.protocol, wl.host, VirtualPath, FilePathRoot, trustId, typeName, typeId, fileName);
    }

    return {
        GetFilePath: getFilePath
    }
})();