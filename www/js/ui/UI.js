/*globals define, $*/
define(function (require, exports, module) {
    'use strict';

    require('thirdparty/jquery');

    var CommandPanel = require('ui/CommandPanel'),
        Wire = require('ui/Wire'),
        Marquee = require('ui/Marquee'),
        Inspector = require('ui/Inspector'),
        Component = require('ui/Component');

    var tabIndex = 10,
        hasFocus = null;

    var container = {
        setFocus: function (obj) {
            Inspector.update(obj);
        },
        getTabIndex: function () {
            return ++tabIndex;
        }
    };

    function init() {

        CommandPanel.init(container);
        Wire.init(container);
        Marquee.init();
        Inspector.init();

        //Hotkeys:
        $(document).keydown(function (event) {
            if ((event.metaKey || event.ctrlKey) && event.which === 73) {
                Inspector.toggle();
            }
        });
    }

    function addComponent(content) {
        var component = new Component(content, container);

        component.addEventListener('terminal', function (event) {
            Wire.selectedTerminal(event.message);
        });
    }

    exports.init = init;
    exports.container = container;
    exports.addComponent = addComponent;
});
