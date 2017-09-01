define(["sitecore"], function (Sitecore) {
    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function (options) {
            this._super();

            this.set({
                "imageUrl": "",
                "isVisible": false
            });
        }
    });

    var view = Sitecore.Definitions.Views.ControlView.extend({
        _zoomSelector: "#dvZoom",
        _zoomCloseSelector: "#imgZoomClose",
        _zoomContainer: "#dvImgZoom",
        _zoomImageSelector: "#imgZoom",
        _targetDoc: null,
        _dvZoomElem: null,

        currentMousePos: {},

        initialize: function (options) {
            //this._super();

            if (!window.parent) {
                return;
            }

            this._targetDoc = window.parent.document;
            var parentBody = this._targetDoc.body;
            var $parentBody = $(parentBody);
            if ($parentBody.find(this._zoomSelector).length === 0) {
                $parentBody.append($(this._zoomSelector)[0].outerHTML);
                this._dvZoomElem = $parentBody.find(this._zoomSelector);
            }
            else {
                this._dvZoomElem = $parentBody.find(this._zoomSelector);
            }

            // Add stylesheet to parent
            // todo: only add if it doesn't already exist
            var link = this._targetDoc.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = "/-/speak/v1/contenttesting/ZoomFrame.css";
            this._targetDoc.getElementsByTagName("head")[0].appendChild(link);

            // add the "dvImgZoom" elem to window.parent
            var self = this;

            if ($parentBody.find(this._zoomContainer).length === 0) {
                $parentBody.append($(this._zoomContainer)[0].outerHTML);
            }

            $parentBody.find(this._zoomCloseSelector).click(this, this.closeFrame);

            this.model.on("change:imageUrl", this.imageUrlChanged, this);
            this.model.on("change:isVisible", this.isVisibleChanged, this);
        },

        imageUrlChanged: function (e) {
            var imageUrl = this.model.get("imageUrl");
            if (imageUrl) {
                this.model.set("isVisible", true);
            }
        },

        isVisibleChanged: function (e) {
            var isVisible = this.model.get("isVisible");
            if (isVisible) {
                this.zoomImage();
            }
        },

        zoomImage: function (e) {
            //var targetElem = e.currentTarget;
            var imageUrl = this.model.get("imageUrl");
            if (!imageUrl || imageUrl === "") {
                return;
            }

            var zoomElemWidth = window.outerWidth;
            if (zoomElemWidth < window.innerWidth) {
                zoomElemWidth = window.innerWidth + 10;
            }
            this._dvZoomElem.css({
                width: zoomElemWidth,
                height: window.outerHeight,
                display: "block"
            });

            var parentBody = $(this._targetDoc.body);
            var imgZoomELem = parentBody.find(this._zoomImageSelector);
            //imgZoomELem.attr("src", $(targetElem).attr("src"));
            imgZoomELem.attr("src", imageUrl);

            // prevent speak app from scrolling while zoom is open
            parentBody.addClass("zoom-open");

            // mouse moving in area of "imgZoomELem"
            var self = this;
            this.currentMousePos = { x: -1, y: -1 };
            imgZoomELem.mousemove({ contextElem: this }, this.imgZoomMouseMove);

            // mouse wheeling
            parentBody.mousewheel(function (e, delta) {

                var heightPerc = imgZoomELem.height() / imgZoomELem.parent().height() * 100;
                var widthPerc = imgZoomELem.width() / imgZoomELem.parent().width() * 100;

                var width = imgZoomELem.width();
                var height = imgZoomELem.height();

                var onePercWidth = width / 100;
                var onePercHeight = height / 100;

                var stepPerc = 5;
                if (delta > 0 && heightPerc < 200) {
                    width += stepPerc * onePercWidth;
                    height += stepPerc * onePercHeight;

                    imgZoomELem.css("width", width + "px");
                }

                if (delta < 0 && heightPerc > 100) {
                    width -= stepPerc * onePercWidth;
                    height -= stepPerc * onePercHeight;

                    heightPerc = height / imgZoomELem.parent().height() * 100;
                    widthPerc = width / imgZoomELem.parent().width() * 100;

                    if (heightPerc < 99 || widthPerc < 99) {
                        imgZoomELem.css("width", "100%");
                    }
                    else {
                        imgZoomELem.css("width", width + "px");
                    }
                }

                // resetting width - fixing when img was hidden
                var widthParent = imgZoomELem.parent().width();
                imgZoomELem.parent().css("width", widthParent);
            });

            $(window.document).keydown(this, this.closeKeyHandler);
            $(window.parent.document).keydown(this, this.closeKeyHandler);

            imgZoomELem.css("width", "100%");

            // setting new size for "dvImgZoom" 
            var dvImgZoomELem = parentBody.find(this._zoomContainer);
            dvImgZoomELem.css({
                width: (window.outerWidth - 100),
                height: (window.outerHeight - 200),
                top: "50px",
                left: "50px",
                display: "block"
            });
        },

        imgZoomMouseMove: function (event) {
            var self = this;
            if (event.data && event.data.contextElem) {
                self = event.data.contextElem;
            }

            var isLeft = false, isRight = false, isUp = false, isDown = false;

            if (event.pageX < self.currentMousePos.x) { isLeft = true; }
            if (event.pageX > self.currentMousePos.x) { isRight = true; }
            if (event.pageY < self.currentMousePos.y) { isUp = true; }
            if (event.pageY > self.currentMousePos.y) { isDown = true; }

            self.currentMousePos.x = event.pageX;
            self.currentMousePos.y = event.pageY;

            var scrollStep = 5;

            var $parentBody = $(self._targetDoc.body);

            var zoomContainer = $parentBody.find(self._zoomContainer);
            var toLeft = zoomContainer.scrollLeft();
            var toTop = zoomContainer.scrollTop();

            if (isLeft) {
                toLeft -= scrollStep;
            }
            else if (isRight) {
                toLeft += scrollStep;
            }

            if (isUp) {
                toTop -= scrollStep;
            }
            else if (isDown) {
                toTop += scrollStep;
            }

            zoomContainer.scrollLeft(toLeft);
            zoomContainer.scrollTop(toTop);
        },

        closeFrame: function (event) {
            // ZoomFrame is in the event data. Passing in as context would be the source of the event
            var self = event.data;
            self._dvZoomElem.css("display", "none");

            $(self._targetDoc.body)
              .removeClass("zoom-open")
              .find(self._zoomContainer)
                .css("display", "none");

            // Remove key event handlers
            $(window.document).unbind("keydown", event.data.closeKeyHandler);
            $(window.parent.document).unbind("keydown", event.data.closeKeyHandler);

            self.model.set("isVisible", false);
        },

        closeKeyHandler: function (event) {
            console.log("key " + event.which);
            if (event.which === 27) {
                event.data.closeFrame(event);
            }
        }

    });

    Sitecore.Factories.createComponent("ZoomFrame", model, view, ".sc-ZoomFrame");
});
