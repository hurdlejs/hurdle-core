"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./runner/index");
function error(error) {
    console.error(error);
}
if (!process.env.test) {
    var runner = new index_1.Runner();
    runner.start().catch(error);
}
//# sourceMappingURL=index.js.map