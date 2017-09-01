jQuery.extend(jQuery.easing, {
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInQuad: function (x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	}
});

//Stuff for using translate3d instead of left
jQuery(function() {
	var prefixes = ["Moz", "Webkit", "O", "ms"];
	var transformName = "transform";
	hasTransform3D = false;

	for (var i = 0; i < prefixes.length; i++) {
		transformName = prefixes[i] + "Transform";
		if (transformName in document.body.style) {
			hasTransform3D = true;
			break;
		}
	}

	jQuery.cssHooks["css3left"] = {
		get: function (el, computed, extra) {
			if( !hasTransform3D ) {
				return el.style.left;
			}
			
			var v = el.style[transformName];
			var left = v.replace(/.*translate3d\((\-?\d+).*/gi, "$1") || 0;			
			return left;
		},
		set: function (el, value) {	
			if( !hasTransform3D ) {
				el.style.left = value;
			}			
			el.style[transformName] = "translate3d(" + parseFloat(value) + "px,0,0)";
		}
	}
});
