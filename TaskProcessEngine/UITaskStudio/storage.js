storage = function () {
    var locker = "";
    var object = "";

    var setObj = function (obj) {
        object = obj;

    };

    var getObj = function () {
        return object;
    };

    var setLocker = function (name) {
        locker = name;
    };

    var checkLocker = function (name) {
        if (locker == "") {
            return true;
        }

        if (locker == name) {
            return true;
        }
        else {
            return false;
        }
    };

    return {
        setLocker: setLocker,
        checkLocker: checkLocker,
        getObj: getObj,
        setObj: setObj
    };
};