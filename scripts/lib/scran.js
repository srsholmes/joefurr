// --------------------------------------------------------------------------
//
// @title: Scran.js
// @description: Animate elements on window scroll
// @author: Joe Harlow
// @date: 22nd March 2013
//
// --------------------------------------------------------------------------


(function(w,d) {

	'use strict';

	var _ = {},
		_elems = {},
		_jsprefix = '',
		_cssprefix = '',
		_settings = {
			tolerance: 40,
			use_tolerance: false
		},
		_listening = false;

	_.type = function(o) {
		return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
	};

	_.st = function() {
		if (typeof w.pageYOffset !== 'undefined') {
			return w.pageYOffset;
		} else {
			var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
			return b.scrollTop;
		}
	};

	_.sl = function() {
		if (typeof w.pageXOffset !== 'undefined') {
			return w.pageXOffset;
		} else {
			var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
			return b.scrollLeft;
		}
	};

	_.wh = function() {
		if (typeof w.innerHeight !== 'undefined') {
			return w.innerHeight;
		} else {
			var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
			return b.clientHeight;
		}
	}

	_.ww = function() {
		if (typeof w.innerWidth !== 'undefined') {
			return w.innerWidth;
		} else {
			var b = ('clientWidth' in d.documentElement) ? d.documentElement : d.body;
			return b.clientWidth;
		}
	}

	_.dh = function() {
		return Math.max(
			Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
			Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
			Math.max(d.body.clientHeight, d.documentElement.clientHeight)
		);
	}

	_.select = function(target) {
		if (typeof target === 'string') {
			if (target.indexOf('#') !== -1) {
				return d.getElementById(target.split('#')[1]);
			} else if (target.indexOf('.') !== -1) {
				var arr = d.querySelectorAll(target);
				return (arr.length >= 1) ? arr[0] : null;
			}
		} else if ('nodeType' in target && target.nodeType === 3) {
			return target;
		} else {
			return null;
		}
	};

	_.extend = function(obj, ext)
	{
		for (var prop in ext) {
			obj[prop] = (obj.hasOwnProperty(prop)) ? obj[prop] : ext[prop];
		}
		return obj;
	};

	_.support = (function() {
		if (!w.getComputedStyle) return false;
		var prop = 'Transform',
			lc = 'transform',
			pre = 'webkit Moz ms o *'.split(' '),
			css = '-webkit- -moz- -ms- -o- *'.split(' '),
			p = d.createElement('p');

		d.body.insertBefore(p, null);
		for (var i = 0; i < pre.length; i++) {
			var pr = (pre[i] !== '*') ? pre[i] + prop : lc;
			var st = (css[i] !== '*') ? css[i] + lc : lc;
			p.style[pr] = 'transform3d(0,0,0);';
			if (w.getComputedStyle(p).getPropertyValue(st)) {
				_cssprefix = pr;
				_jsprefix = st;
				return true;
			}
		}
		d.body.removeChild(p);
		return false;
	})();

	_.render = function(el, val) {
		el.style[_cssprefix] = val;
	};

	_.hold = function(el) {
		return function(sT, sL) {
			var eAT = (_.type(el.endAtTop) === 'Function') ? el.endAtTop() : el.endAtTop,
				sAT = (_.type(el.startAtTop) === 'Function') ? el.startAtTop() : el.startAtTop,
				aL = eAT - sAT,
				cP = sT - sAT;

			if (sT >= sAT) {
				var mtx = _elems[el.id].matrix;
				var nmtx = new Mtx();
				nmtx.translateY(sAT - sT);
				_elems[el.id].matrix = Mtx.multiply(mtx, nmtx);
				_.render(el.target, _elems[el.id].matrix.toTransform());
			}
		}
	}

	_.transform = function(el,fn) {
		var args = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
		var deps = fn.toString().match(args)[1].split(/\s*,\s*/);
		el.deps = deps;
		var method = _.method(el, fn.apply(this,deps));
		if (method) {
			_.resolve(el);
			return function(sT, sL) {
				var eAT = (_.type(el.endAtTop) === 'Function') ? el.endAtTop() : el.endAtTop,
					sAT = (_.type(el.startAtTop) === 'Function') ? el.startAtTop() : el.startAtTop,
					aL = eAT - sAT,
					cP = sT - sAT;

				var values = _.values(el, aL, cP);
				var mtx = _elems[el.id].matrix;

				var mmtx = new Mtx();
				mmtx[method].apply(mmtx, values);
				_elems[el.id].matrix = Mtx.multiply(mtx, mmtx);
				
				_.render(el.target, _elems[el.id].matrix.toTransform());
			}
		}
	}

	_.method = function(el,str) {
		var ret = /^([a-z]+)([A-Z]+)?\(/g.exec(str);
		if (ret[1] && _.check(ret[1])) {
			el.method = ret[1];
			if (ret[2]) {
				el.method += ret[2];
			}
			return el.method;
		} else {
			throw 'That transform method is currently not supported';
		}		

	}

	_.check = function(method) {
		var methods = 'rotate scale skew translate'.split(' ');
		for (var i = 0; i < methods.length; i++) {
			if (methods[i] === method) {
				return method;
			}
		}
		return null;
	}

	_.values = function(el, aL, cP) {
		var values = [];
		for (var i = 0; i < el.deps.length; i++) {
			var vals = el[el.deps[i]],
				sV = vals[0],
				eV = vals[1];

			var dV = sV + (((eV - sV) / aL) * cP),
				drV = sV > eV ? '>' : '<';

			dV = (dV < sV && drV !== '>') ? sV : (dV > sV && drV === '>') ? sV : (dV < eV && drV === '>') ? eV : (dV > eV && drV === '<') ? eV : dV;

			values.push(dV);
		}
		return values;
	};

	_.resolve = function(el) {
		for (var i = 0; i < el.deps.length; i++) {
			var dep = el.deps[i];
			if (!el.hasOwnProperty(dep) || _.type(el[dep]) !== 'Array') {
				throw 'Your transform function dependencies are not set correctly: ' + el.deps;
			}
		}
	}

	_.scroll = function(ev) {
		var sT = _.st(),
			sL = _.sl();

		for (var el in _elems) {
			var tfms = _elems[el];
			tfms.matrix = new Mtx();
			for (var i = 0; i < tfms.length; i++) {
				var tfm = tfms[i];
				if (_settings.use_tolerance) {
					if (sT >= tfm.startAtTop - _settings.tolerance && sT <= tfm.endAtTop + _settings.tolerance) tfm.render(sT, sL);
				} else {
					tfm.render(sT, sL);
				}
			}
		}
	};

	_.init = function() {
		if (!_listening) {
			_.listen(d, 'scroll', _.scroll);
			_listening = true;
		}
	};

	_.listen = (function() {
		if (w.addEventListener) {
			return function(el, ev, fn) {
				el.addEventListener(ev, fn, false);
			};
		} else if (w.attachEvent) {
			return function(el, ev, fn) {
				w.attachEvent('on' + ev, fn, false);
			};
		}
	})();

	var Mtx = function(mtx) {
		this.m = mtx || [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];

		this.deg2rad = function(deg) {
			return deg * (Math.PI / 180);
		};

		this.mathWrap = function(val, math) {
			return parseFloat(parseFloat(Math[math](val)).toFixed(8));
		};

		return this;
	}


	Mtx.multiply = function(mtx1, mtx2) {
		var a1 = mtx1.m[0][0],
			b1 = mtx1.m[0][1],
			c1 = mtx1.m[1][0],
			d1 = mtx1.m[1][1],
			tx1 = mtx1.m[2][0],
			ty1 = mtx1.m[2][1];

		var a2 = mtx2.m[0][0],
			b2 = mtx2.m[0][1],
			c2 = mtx2.m[1][0],
			d2 = mtx2.m[1][1],
			tx2 = mtx2.m[2][0],
			ty2 = mtx2.m[2][1];

		return new Mtx([
			[ a1 * a2 + b1 * c2, 			a1 * b2 + b1 * d2, 			0 ],
			[ c1 * a2 + d1 * c2, 			c1 * b2 + d1 * d2, 			0 ],
			[ tx1 * a2 + ty1 * c2 + tx2,	tx1 * b2 + ty1 * d2 + ty2, 	1 ]
		]);
	};

	Mtx.fromTransform = function(str) {
		var regex = /^matrix\(([0-9-.]+),\s?([0-9-.]+),\s?([0-9-.]+),\s?([0-9-.]+),\s?([0-9-.]+)\w*?,\s?([0-9-.]+)\w*?\)/g.exec(str);
		if (regex) {
			return new Mtx([
				[parseFloat(regex[1]), parseFloat(regex[2]), 0],
				[parseFloat(regex[3]), parseFloat(regex[4]), 0],
				[parseFloat(regex[5]), parseFloat(regex[6]), 1]
			]);
		}
	};

	Mtx.prototype = {
		rotate: function(deg) {
			var rad = this.deg2rad(deg),
				cos = this.mathWrap(rad, 'cos'),
				sin = this.mathWrap(rad, 'sin');

			this.m[0][0] = cos;
			this.m[0][1] = -sin;
			this.m[1][0] = sin;
			this.m[1][1] = cos;
		},
		scale: function(sx, sy) {
			this.m[0][0] = sx;
			this.m[1][1] = sy;
			 // this.m[0][0] *= sx;
			// this.m[1][0] *= sx;
			// this.m[2][0] *= sx;

			// this.m[0][1] *= sy;
			// this.m[1][1] *= sy;
			// this.m[2][1] *= sy;
		},
		scaleX: function(sx) {
			this.m[0][0] = sx;
			// this.m[1][0] *= sx;
			// this.m[2][0] *= sx;
		},
		scaleY: function(sy) {
			//this.m[0][1] *= sy;
			this.m[1][1] = sy;
			//this.m[2][1] *= sy;
		},
		translate: function(x, y) {
			this.m[2][0] = x;
			this.m[2][1] = y;
		},
		translateX: function(x) {
			this.m[2][0] = x;
		},
		translateY: function(y) {
			this.m[2][1] = y;
		},
		skew: function(xdeg, ydeg) {
			var xrad = this.deg2rad(xdeg),
				yrad = this.deg2rad(ydeg),
				xval = this.mathWrap(xrad, 'tan'),
				yval = this.mathWrap(yrad, 'tan');

			var mtx = new Mtx();
			this.m[1][0] = xval;
			this.m[0][1] = yval;
		},
		skewX: function(xdeg) {
			var xrad = this.deg2rad(xdeg),
				xval = this.mathWrap(xrad, 'tan');

			var mtx = new Mtx();
			this.m[1][0] = xval;
		},
		skewY: function(ydeg) {
			var yrad = this.deg2rad(ydeg),
				yval = this.mathWrap(yrad, 'tan');

			var mtx = new Mtx();
			this.m[0][1] = yval;
		},
		identity: function() {
			return [
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			];
		},
		toTransform: function() {
			return 'matrix(' + this.m[0][0] + ',' + this.m[0][1] + ',' + this.m[1][0] + ',' + this.m[1][1] + ',' + this.m[2][0] + ',' + this.m[2][1] + ')';
		},
		toFilter: function() {
			return 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\',M11=' + this.m[0][0] + ',M12=' + this.m[0][1] + ',M21=' + this.m[1][0] + ',M22=' + this.m[1][1] + ');';
		}
	};

	var Scran = function() {
		return Scran;
	};

	Scran.animate = function(elems) {
		elems = (_.type(elems) === 'Array') ? elems : [elems];
		for (var i = 0; i < elems.length; i++) {
			var _el = {
				startAtTop: 0,
				endAtTop: _.dh()
			};
			_el = _.extend(elems[i], _el);
			_el.id = ('target' in elems[i] && _.type(elems[i].target === 'String')) ? elems[i].target : elems[i].target.getAttribute('id');
			_el.target	= ('target' in elems[i]) ? _.select(elems[i].target) : null;
			if (_el.hasOwnProperty('transform')) {
				_el.render = _.transform(_el, _el.transform);
			}
			if (_el.hasOwnProperty('hold') && _el.hold) {
				_el.render = _.hold(_el);
			}
			_elems[_el.id] = _elems[_el.id] || [];
			_elems[_el.id].push(_el);
		}
		_.init();
		return Scran;
	};

	Scran.scrollTop = _.st;
	Scran.scrollLeft = _.sl;
	Scran.windowHeight = _.wh;
	Scran.windowWidth = _.ww;
	Scran.documentHeight = _.dh;
	Scran.transformSupport = _.support;

	w.Scran = Scran;

})(window, document);