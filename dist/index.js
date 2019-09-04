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
export default Hello;
//# sourceMappingURL=index.js.map