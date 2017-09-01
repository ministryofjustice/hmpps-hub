(function (models) {
    models.tooltip = function () {
        var direction = d3TipDirection,
            offset = d3TipOffset,
            html = d3TipHtml,
            node = initNode(),
            svg = null,
            point = null,
            target = null;

        function tooltip(vis) {
            svg = getSVGNode(vis);
            point = svg.createSVGPoint();
            document.body.appendChild(node);
        }

        // Public - show the tooltooltip on the screen
        //
        // Returns a tooltip
        tooltip.show = function () {
            var args = Array.prototype.slice.call(arguments);
            if (args[args.length - 1] instanceof SVGElement) {
                target = args.pop();
            }

            var content = html.apply(this, args),
                poffset = offset.apply(this, args),
                dir = direction.apply(this, args),
                nodel = d3.select(node),
                i = 0,
                coords;

            nodel.html(content)
              .style({ opacity: 1, 'pointer-events': 'all' });

            while (i--) nodel.classed(directions[i], false);
            coords = directionCallbacks.get(dir).apply(this);
            nodel.classed(dir, true).style({
                top: (coords.top + poffset[0]) + 'px',
                left: (coords.left + poffset[1]) + 'px'
            });

            return tooltip;
        }

        // Public - hide the tooltooltip
        //
        // Returns a tooltip
        tooltip.hide = function () {
            nodel = d3.select(node);
            nodel.style({ opacity: 0, 'pointer-events': 'none' });
            return tooltip;
        }

        // Public: Proxy attr calls to the d3 tooltip container.  Sets or gets attribute value.
        //
        // n - name of the attribute
        // v - value of the attribute
        //
        // Returns tooltip or attribute value
        tooltip.attr = function (n, v) {
            if (arguments.length < 2 && typeof n === 'string') {
                return d3.select(node).attr(n);
            } else {
                var args = Array.prototype.slice.call(arguments);
                d3.selection.prototype.attr.apply(d3.select(node), args);
            }

            return tooltip;
        }

        // Public: Proxy style calls to the d3 tooltip container.  Sets or gets a style value.
        //
        // n - name of the property
        // v - value of the property
        //
        // Returns tooltip or style property value
        tooltip.style = function (n, v) {
            if (arguments.length < 2 && typeof n === 'string') {
                return d3.select(node).style(n);
            } else {
                var args = Array.prototype.slice.call(arguments);
                d3.selection.prototype.style.apply(d3.select(node), args);
            }

            return tooltip;
        }

        // Public: Set or get the direction of the tooltooltip
        //
        // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
        //     sw(southwest), ne(northeast)  se(southeast) , mp(x:mousePointer.x, y:n.y)
        //
        // Returns tooltip or direction
        tooltip.direction = function (v) {
            if (!arguments.length) return direction;
            direction = v == null ? v : d3.functor(v);

            return tooltip;
        }

        // Public: Sets or gets the offset of the tooltip
        //
        // v - Array of [x, y] offset
        //
        // Returns offset or
        tooltip.offset = function (v) {
            if (!arguments.length) return offset;
            offset = v == null ? v : d3.functor(v);

            return tooltip;
        }

        // Public: sets or gets the html value of the tooltooltip
        //
        // v - String value of the tooltip
        //
        // Returns html value or tooltip
        tooltip.html = function (v) {
            if (!arguments.length) return html;
            html = v == null ? v : d3.functor(v);

            return tooltip;
        }

        function d3TipDirection() {
            return 'pointerTop';
        };

        function d3TipOffset() {
            return [-5, 0];
        };

        function d3TipHtml() {
            return ' ';
        };

        var directionCallbacks = d3.map({
            n: directionN,
            s: directionS,
            e: directionE,
            w: directionW,
            nw: directionNw,
            ne: directionNE,
            sw: directionSW,
            se: directionSE,
            pointerTop: directionPointerTop,
            pointer: directionPointer
        });

        directions = directionCallbacks.keys();

        function directionPointer() {
            var mousePoistion = getMousePosition();
            return {
                top: mousePoistion.y - node.getBoundingClientRect().height,
                left: mousePoistion.x - node.getBoundingClientRect().width / 2
            }
        };

        function directionPointerTop() {
            var bbox = getScreenBBox();
            var mousePoistion = getMousePosition();
            var bcr = node.getBoundingClientRect();
            return {
                top: bbox.n.y - bcr.height,
                left: mousePoistion.x - bcr.width / 2
            }
        };

        function directionN() {
            var bbox = getScreenBBox();
            var bcr = node.getBoundingClientRect();
            return {
                top: bbox.n.y - bcr.height,
                left: bbox.n.x - bcr.width / 2
            }
        };

        function directionS() {
            var bbox = getScreenBBox();
            return {
                top: bbox.s.y,
                left: bbox.s.x - node.getBoundingClientRect().width / 2
            }
        };

        function directionE() {
            var bbox = getScreenBBox();
            return {
                top: bbox.e.y - node.getBoundingClientRect().height / 2,
                left: bbox.e.x
            }
        };

        function directionW() {
            var bbox = getScreenBBox();
            return {
                top: bbox.w.y - node.getBoundingClientRect().height / 2,
                left: bbox.w.x - node.getBoundingClientRect().width
            }
        };

        function directionNw() {
            var bbox = getScreenBBox();
            return {
                top: bbox.nw.y - node.getBoundingClientRect().height,
                left: bbox.nw.x - node.getBoundingClientRect().width
            }
        };

        function directionNE() {
            var bbox = getScreenBBox();
            return {
                top: bbox.ne.y - node.getBoundingClientRect().height,
                left: bbox.ne.x
            }
        };

        function directionSW() {
            var bbox = getScreenBBox();
            return {
                top: bbox.sw.y,
                left: bbox.sw.x - node.getBoundingClientRect().width
            }
        };

        function directionSE() {
            var bbox = getScreenBBox();
            return {
                top: bbox.se.y,
                left: bbox.e.x
            }
        };

        function initNode() {
            var node = d3.select(document.createElement('div'));
            node.attr('class', 'd3-toolip');
            node.style({
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                boxSizing: 'border-box'
            });

            return node.node();
        }

        function getSVGNode(el) {
            el = el.node();
            if (el.tagName.toLowerCase() === 'svg')
                return el;

            return el.ownerSVGElement;
        }

        function getMousePosition() {
            var mousePosition = {};
            mousePosition.x = d3.event.clientX;
            mousePosition.y = d3.event.clientY;
            return mousePosition;
        }

        // Private - gets the screen coordinates of a shape
        //
        // Given a shape on the screen, will return an SVGPoint for the directions
        // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
        // sw(southwest).
        //
        // Returns an Object {n, s, e, w, nw, sw, ne, se}
        function getScreenBBox() {
            var targetel = target || d3.event.target,
                bbox = {},
                matrix = targetel.getScreenCTM(),
                tbbox = targetel.getBBox(),
                width = tbbox.width || 0,
                height = tbbox.height || 0,
                x = tbbox.x || 0,
                y = tbbox.y || 0,
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

            point.x = x + scrollLeft;
            point.y = y + scrollTop;
            bbox.nw = point.matrixTransform(matrix);
            point.x += width;
            bbox.ne = point.matrixTransform(matrix);
            point.y += height;
            bbox.se = point.matrixTransform(matrix);
            point.x -= width;
            bbox.sw = point.matrixTransform(matrix);
            point.y -= height / 2;
            bbox.w = point.matrixTransform(matrix);
            point.x += width;
            bbox.e = point.matrixTransform(matrix);
            point.x -= width / 2;
            point.y -= height / 2;
            bbox.n = point.matrixTransform(matrix);
            point.y += height;
            bbox.s = point.matrixTransform(matrix);

            return bbox;
        }

        return tooltip;
    }
}(Sitecore.Speak.D3.models));