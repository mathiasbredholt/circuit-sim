/*jslint plusplus: true */
/*global define, $*/
define(function (require, exports, module) {
    "use strict";

    require("thirdparty/jquery");

    var UI = require("ui/UI");

    function run(cmd) {
        switch (cmd.cmd) {
        case "toggle_grid":
            $("#grid").toggle();
            break;
        case "add_component":
            UI.addComponent(cmd.content);
            break;
        }
    }

    exports.run = run;
});