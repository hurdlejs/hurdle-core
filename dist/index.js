"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./runner/index");
var Hello = (function () {
    function Hello() {
        this.world = '';
    }
    Hello.prototype.help = function () {
        var world = 'blue';
        this.world = world;
    };
    return Hello;
}());
exports.default = Hello;
var runner = new index_1.Runner();
runner.start();
//# sourceMappingURL=index.js.map