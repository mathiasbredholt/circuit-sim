define(function (require, exports, module) {
    require('thirdparty/jquery');
    require('thirdparty/svg');

    var Wire = require('ui/Wire');

    function create(position, container, isNode) {
        var svg, elem;

        $(container).append(elem = $("<div>"));

        elem.addClass('terminal')
            .click(function (event) {
                event.stopPropagation();

                var position = {
                    x: $(this).offset().left + 16,
                    y: $(this).offset().top + 16
                };

                Wire.selectedTerminal(position);
            })
            .mouseover(function (event) {

                if (!isNode) {
                    $(this).css('opacity', '1');
                }

                var position = {
                    x: $(this).offset().left + 16,
                    y: $(this).offset().top + 16
                };

                Wire.snapToTerminal(position);
            })
            .mouseout(function (event) {
                if (!isNode) {
                    $(this).css('opacity', '0');
                }

                Wire.snapOut();
            })
            .css({
                left: position.x - elem.width() / 2,
                top: position.y - elem.height() / 2
            });

        if (!isNode) {
            elem.css('opacity', '0');
        }

        elem.append(svg = SVG(elem[0]));

        svg.circle(8).cx(16).cy(16).addClass('terminalPoint');
    }

    function snapMode(value) {
        console.log(value);
        if (value) {
            $(".terminalPoint").css('stroke-width', 16);
        } else {
            $(".terminalPoint").css('stroke-width', 4);
        }
    }

    exports.create = create;
    exports.snapMode = snapMode;
});
