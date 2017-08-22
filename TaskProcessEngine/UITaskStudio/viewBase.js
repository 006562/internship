viewBase = function () {
    this.name;

    this.init = function (vContext) {
        this.name = vContext.name;
    };

    this.getName = function () {
        return this.name;
    };
};