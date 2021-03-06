(function(w,d) {

	'use strict';

	Function.prototype.bind = Function.prototype.bind || function() {
		return function(context) {
			var fn = this,
				args = Array.prototype.slice.call(arguments, 1);

			if (args.length) {
				return function() {
					return arguments.length ? fn.apply(context, args.concat(Array.prototype.slice.call(arguments))) : fn.apply(context, args);
				};
			}
			return function() {
				return arguments.length ? fn.apply(context, arguments) : fn.apply(context);
			};
		};
	};

	var _ = {},
		_pfx = {},
		_collections = {};

	_.clear = function() {
		_collections = {};
	};

	_.select = function(target) {
		var arr = null;
		if (typeof target === 'string') {
			if (target.indexOf('#') !== -1) {
				arr = [d.getElementById(target.split('#')[1])];
			} else if (target.indexOf('.') !== -1) {
				arr = d.querySelectorAll(target);
			}
		} else if ('nodeType' in target && target.nodeType === 1) {
			arr = [target];
		}
		if (arr && arr.length > 0) {
			var str = '$scr-' + (Math.random() * new Date().getTime());
			var c = new ElementCollection(arr, str);
			var sel = c.collected();
			if (sel) {
				return _collections[sel];
			} else {
				_collections[str] = c;
				return _collections[str];
			}
		}
	};

	_.rafLast = 0;

	_.requestAnimFrame = (function(){
		return	w.requestAnimationFrame		||
				w.webkitRequestAnimationFrame	||
				w.mozRequestAnimationFrame		||
				function(callback, element) {
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, 16 - (currTime - _.rafLast));
					var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
					_.rafLast = currTime + timeToCall;
					return id;
				};
	})();

	_.cancelAnimFrame = (function() {
		return	w.cancelAnimationFrame	||
				w.cancelRequestAnimationFrame	||
				w.webkitCancelAnimationFrame	||
				w.webkitCancelRequestAnimationFrame	||
				w.mozCancelAnimationFrame	||
				w.mozCancelRequestAnimationFrame	||
				function(id) {
					clearTimeout(id);
				};
	})();

	_.support = (function() {
		if (!w.getComputedStyle) { return false; }
		var prop = 'Transform',
			lc = 'transform',
			pre = 'webkit Moz ms o *'.split(' '),
			css = '-webkit- -moz- -ms- -o- *'.split(' '),
			p = d.createElement('p');

		d.body.appendChild(p);
		for (var i = 0; i < pre.length; i++) {
			var pr = (pre[i] !== '*') ? pre[i] + prop : lc;
			var st = (css[i] !== '*') ? css[i] + lc : lc;
			p.style[pr] = 'transform3d(0,0,0);';
			if (w.getComputedStyle(p).getPropertyValue(st)) {
				_.support3d = (pr.replace(prop, 'Perspective') in p.style) ? true : false;
				_pfx.css = pr;
				_pfx.js = st;
				_pfx.pcss = pre[i] !== '*' ? pre[i] : '';
				_pfx.pjs = css[i] !== '*' ? css[i] : '';
				p.parentNode.removeChild(p);
				return true;
			}
		}
		p.parentNode.removeChild(p);
		return false;
	})();

	_.listen = (function() {
		if (w.addEventListener) {
			return function(el, ev, fn) {
				el.addEventListener(ev, fn, false);
			};
		} else if (w.attachEvent) {
			return function(el, ev, fn) {
				el.attachEvent('on' + ev, function() { fn.call(el); }, false);
			};
		}
	})();

	_.st = (function() {
		if (typeof w.pageYOffset !== 'undefined') {
			return function() {
				return w.pageYOffset;
			};
		} else {
			var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
			return function() {
				return b.scrollTop;
			};
		}
	})();

	_.sl = (function() {
		if (typeof w.pageXOffset !== 'undefined') {
			return function() {
				return w.pageXOffset;
			};
		} else {
			var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
			return function() {
				return b.scrollLeft;
			};
		}
	})();

	_.wh = (function() {
		if (typeof w.innerHeight !== 'undefined') {
			return function() {
				return w.innerHeight;
			};
		} else {
			var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
			return function() {
				return b.clientHeight;
			};
		}
	})();

	_.ww = (function() {
		if (typeof w.innerWidth !== 'undefined') {
			return function() {
				return w.innerWidth;
			};
		} else {
			var b = ('clientWidth' in d.documentElement) ? d.documentElement : d.body;
			return function() {
				return b.clientWidth;
			};
		}
	})();

	_.dh = function() {
		return Math.max(
			Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
			Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
			Math.max(d.body.clientHeight, d.documentElement.clientHeight)
		);
	};

	_.msƒ = function() {
		_.ms = _.dh() - _.wh();
	};

	_.msƒ();

	_.ios = (function() {
		var isiOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
		var count = 0;
		function eH(e) {
			switch (e.type) {
				case 'touchstart':
					pipeline.remove('render');
				break;
				case 'touchmove':
					count++;
					if (count % 3 === 0) {
						_.render();
					}
				break;
				case 'touchend':
				case 'touchcancel':
				case 'touchleave':
					count = 0;
					pipeline.add('render', _.render, function() {
						return _.cst !== _.st();
					});
				break;
			}
		}
		
		if (isiOS) {

			w.addEventListener('touchstart', eH, false);
			w.addEventListener('touchend', eH, false);
			w.addEventListener('touchcancel', eH, false);
			w.addEventListener('touchleave', eH, false);
			w.addEventListener('touchmove', eH, false);
		}
		return isiOS;
	})();

	_.cst = -1;

	_.scroll = function(val,d,e,c,t) {
		_.tween().queue()
			.from(_.st())
			.to(val)
			.duration(d || 400)
			.ease(e || _.easing.easeNone)
			.step(function(val) {
				w.scrollTo(0, val);
			})
			.start();
	};

	_.tween = function() {
		return new TweenController();
	};

	_.matrix = function() {
		return new Matrix3D();
	};

	_.render = function() {
		var st = _.st();
		var wh = _.wh();
		
		for (var c in _collections) {
			var _c = _collections[c];
			if (!_c.forceRender) {
				var _r = _c.elems[0].getBoundingClientRect();
				var height = _r.bottom - _r.top;
				if (_r.top > -30 - height && _r.top < wh) {
					_c.calculate(st,0);
				}
			} else {
				_c.calculate(st,0);
			}
			
		}
		_.cst = st;
	};

	_.noop = function() {};

	/*
	 *
	 *	TERMS OF USE - EASING EQUATIONS
	 * 
	 *	Open source under the BSD License. 
	 *
	 *	Copyright © 2001 Robert Penner
	 *	All rights reserved.
	 *
	 *	Redistribution and use in source and binary forms, with or without modification, 
	 *	are permitted provided that the following conditions are met:
	 *
	 *	Redistributions of source code must retain the above copyright notice, this list of 
	 *	conditions and the following disclaimer.
	 *	Redistributions in binary form must reproduce the above copyright notice, this list 
	 *	of conditions and the following disclaimer in the documentation and/or other materials 
	 *	provided with the distribution.
	 *
	 *	Neither the name of the author nor the names of contributors may be used to endorse 
	 *	or promote products derived from this software without specific prior written permission.
	 *
	 *	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
	 *	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	 *	MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	 *	COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 *	EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	 *	GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
	 *	AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 *	NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
	 *	OF THE POSSIBILITY OF SUCH DAMAGE. 
	 *
	 */

	_.easing = {
		easeNone: function(t, b, c, d) {
			return c * t / d + b;
		},
		easeInQuad: function(t, b, c, d) {
			return c*(t/=d)*t + b;
		},
		easeOutQuad: function(t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function(t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInCubic: function(t, b, c, d) {
			return c*(t/=d)*t*t + b;
		},
		easeOutCubic: function(t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOutCubic: function(t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},
		easeInQuart: function(t, b, c, d) {
			return c*(t/=d)*t*t*t + b;
		},
		easeOutQuart: function(t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOutQuart: function(t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		easeInQuint: function(t, b, c, d) {
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOutQuint: function(t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOutQuint: function(t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},
		easeInSine: function(t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOutSine: function(t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOutSine: function(t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		},
		easeInExpo: function(t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOutExpo: function(t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOutExpo: function(t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOutCirc: function(t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOutCirc: function(t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		},
		easeInElastic: function(t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOutElastic: function(t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},
		easeInOutElastic: function(t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		},
		easeInBack: function(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOutBack: function(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOutBack: function(t, b, c, d, s) {
			if (s == undefined) s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		easeInBounce: function(t, b, c, d) {
			return c - this.easeOutBounce (d-t, 0, c, d) + b;
		},
		easeOutBounce: function(t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOutBounce: function (t, b, c, d) {
			if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
			return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	}

	var Transformer = function(parent) {
		this.parent = parent;
		this.startAtTop = 0;
		this.endAtTop = _.ms;
		this.easing = _.easing.easeNone;
		this.methods = [];
		this.parent.transforms.push(this);
		this._push = function(m,o,e) {
			this.methods.push({ method: m, values: o, easing: e || this.easing });
			_.render();
		}
	};

	Transformer.prototype = {
		also: function() {
			return new Transformer(this.parent);
		},
		start: function(s) {
			this.startAtTop = s;
			return this;
		},
		at: function(s) {
			return this.start.call(this, s);
		},
		end: function(e) {
			this.endAtTop = e;
			return this;
		},
		until: function(e) {
			return this.end.call(this, s);
		},
		select: function(el) {
			return _.select(el);
		},
		ease: function(fn) {
			this.easing = fn;
			return this;
		},
		translate: function(o,e) {
			this._push('translate',o,e);
			return this;
		},
		translateX: function(o,e) {
			this._push('translateX',o,e);
			return this;
		},
		translateY: function(o,e) {
			this._push('translateY',o,e);
			return this;
		},
		translateZ: function(o,e) {
			this._push('translateZ',o,e);
			return this;
		},
		rotate: function(o,e) {
			this._push('rotate',o,e);
			return this;
		},
		rotateX: function(o,e) {
			this._push('rotateX',o,e);
			return this;
		},
		rotateY: function(o,e) {
			this._push('rotateY',o,e);
			return this;
		},
		rotateZ: function(o,e) {
			this._push('rotateZ',o,e);
			return this;
		},
		scale: function(o,e) {
			this._push('scale',o,e);
			return this;
		},
		scaleX: function(o,e) {
			this._push('scaleX',o,e);
			return this;
		},
		scaleY: function(o,e) {
			this._push('scaleY',o,e);
			return this;
		},
		scaleZ: function(o,e) {
			this._push('scaleZ',o,e);
			return this;
		},
		skew: function(o,e) {
			this._push('skew',o,e);
			return this;
		},
		skewX: function(o,e) {
			this._push('skewX',o,e);
			return this;
		},
		skewY: function(o,e) {
			this._push('skewY',o,e);
			return this;
		},
		stick: function() {
			this._push('stick',true);
			return this;
		},
		hold: function() {
			return this.stick.apply(this);
		},
		opacity: function(o,e) {
			this._push('opacity',o,e);
			return this;
		},
		content: function(o,e) {
			this._push('content',o,e);
			return this;
		},
		format: function(fn) {
			this.frmt = fn;
			return this;
		},
		values: function(o,e) {
			this._push('values',o,e);
			return this;
		},
		step: function(fn) {
			this.step = fn;
			return this;
		}
	}

	var ElementCollection = function(elems,name) {
		this.name = name;
		this.elems = elems;
		this.matrix = (function() {
			if (_.support) {
				return Matrix3D.fromTransform(w.getComputedStyle(this.elems[0]).getPropertyValue(_pfx.js)) || new Matrix3D();
			} else {
				return new Matrix3D();
			}
		}).call(this);
		this.prevMatrix = new Matrix3D();
		this.transforms = [];
		this.opacity = 1;
		this.prevOpacity = 1;
		this.content = '';
		this.prevContent = '';
		this.value = 0;
		this.prevValue = 0;
		this.forceRender = false;
	};

	ElementCollection.prototype = {
		each: function(fn) {
			for (var i = 0; i < this.elems.length; i++) {
				fn.apply(this.elems[i], [i, this.elems.length]);
			}
			return this;
		},
		collected: function() {
			if (this.elems[0].hasAttribute('data-scran')) {
				return this.elems[0].getAttribute('data-scran');
			} else {
				return;
			}
		},
		force: function(boo) {
			this.forceRender = boo;
			return this;
		},
		width: function(w) {
			var val;
			this.each(function() {
				if (typeof w === 'undefined') {
					val = parseInt(this.style.width);
					if (isNaN(val)) {
						var rect = this.getBoundingClientRect();
						val = rect.right - rect.left;
					}
				} else {
					this.style.width = w + 'px';
				}
			});
			return val || this;
		},
		height: function(h) {
			var val;
			this.each(function() {
				if (typeof h === 'undefined') {
					val = parseInt(this.style.height);
					if (isNaN(val)) {
						var rect = this.getBoundingClientRect();
						val = rect.bottom - rect.top;
					}
				} else {
					this.style.height = h + 'px';
				}
			});
			return val || this;
		},
		style: function(o) {
			for (var style in o) {
				this.each(function() {
					this.style[style] = o[style];
				});
			}
			return this;
		},
		offset: function() {
			return this.elems[0].getBoundingClientRect();
		},
		scroll: function(d,e,c) {
			var target = this.elems[0],
				rect = target.getBoundingClientRect();
			_.scroll(rect.top,d,e,c,this);
		},
		render: function(type) {
			var mtx = this.matrix;
			var opacity = this.opacity;
			var _t = this;

			if (!mtx.isEqual(this.prevMatrix)) {
				this.each(function() {
					if (_.support) {
						if (!_.support3d) {
							this.style[_pfx.css] = mtx.toTransform2D();
						} else {
							this.style[_pfx.css] = mtx.toTransform3D();
						}
					} else {
						var t = mtx.getTranslate();
						var s = mtx.getScale();
						var mL = _t.oML;
						var mT = _t.oMT;

						this.style.filter = mtx.toFilter() + 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + Math.round(opacity * 100) + ')';
					}
				});
			}

			if (opacity !== this.prevOpacity) {
				this.each(function() {
					if (_.support) {
						this.style.opacity = opacity;
					}
				});
			}
			
		},
		select: function(el) {
			return _.select(el);
		},
		calculate: function(sT,sL) {
			this.prevMatrix = this.matrix;
			this.matrix = new Matrix3D();
			for (var i = 0; i < this.transforms.length; i++) {
				var tfm = this.transforms[i];
				var eAT = typeof tfm.endAtTop === 'function' ?
								tfm.endAtTop.apply(this, [this.elems.length]) :
								tfm.endAtTop,
					sAT = typeof tfm.startAtTop === 'function' ?
								tfm.startAtTop.apply(this, [this.elems.length]) :
								tfm.startAtTop,

					eAT = typeof eAT === 'string' && eAT.indexOf('%') !== -1 ?
								(_.ms / 100) * parseFloat(eAT) :
								eAT,

					sAT = typeof sAT === 'string' && sAT.indexOf('%') !== -1 ?
								(_.ms / 100) * parseFloat(sAT) :
								sAT;

				var	aL = eAT - sAT,
					cP = sT - sAT;

				for (var j = 0; j < tfm.methods.length; j++) {
					var method = tfm.methods[j],
						mname = method.method,
						mvals = method.values,
						easing = method.easing,
						vals = [],
						dV;

					if (mname === 'hold' || mname === 'stick') {
						mname = 'translateY';				
						dV = (sT <= sAT) ? 0 : sAT - sT;
						vals.push(dV);
					} else {
						for (var o in mvals) {
							var sV = typeof mvals[o][0] === 'function' ?
											mvals[o][0].apply(this) :
											mvals[o][0],
								eV = typeof mvals[o][1] === 'function' ?
											mvals[o][1].apply(this) :
											mvals[o][1],
								fn = mname === 'translateY' || mname === 'translate' ?
											_.wh :
											_.ww;

							sV = typeof sV === 'string' && sV.indexOf('%') !== -1 ?
										(fn() / 100) * parseFloat(sV) : sV;
							eV = typeof eV === 'string' && eV.indexOf('%') !== -1 ?
										(fn() / 100) * parseFloat(eV) : eV;

							dV = easing.call(_.easing, cP, sV, eV - sV, aL);
							var	drV = sV > eV ? '>' : '<';

							dV = (dV < sV && drV !== '>') ?
									sV : (dV > sV && drV === '>') ?
										sV : (dV < eV && drV === '>') ?
											eV : (dV > eV && drV === '<') ?
												eV : dV;
							dV = (sT <= sAT) ?
									sV : (sT >= eAT) ?
										eV : dV;

							vals.push(dV);
						}
					}

					if (mname === 'opacity') {
						this.prevOpacity = this.opacity;
						this.opacity = vals[0];
					} else if (mname === 'content') {
						this.prevContent = this.content;
						this.content = tfm.hasOwnProperty('frmt') ? tfm.frmt(vals[0]) : vals[0];
						if (this.content !== this.prevContent) {
							this.each(function() {
								this.innerHTML = tfm.hasOwnProperty('frmt') ? tfm.frmt(vals[0]) : vals[0];
							});
						}
					} else if (mname === 'values') {
						this.prevValue = this.value;
						this.value = vals[0];
						if (tfm.hasOwnProperty('step') && this.value !== this.prevValue) {
							this.each(function() {
								tfm.step.call(this, vals[0]);
							});
						}
					} else {
						var mtx = new Matrix3D();
						mtx[mname].apply(mtx, vals);

						this.matrix = this.matrix.isEqual(new Matrix3D()) ? mtx : this.matrix.multiply(mtx);
					}
				}
			}
			this.render('calc');
		},
		matrix3d: function(mtx) {
			if (typeof mtx !== 'undefined') {
				this.prevMatrix = this.matrix;
				this.matrix = mtx;
				this.render('set');
				return;
			}
			return this.matrix;
		},
		transform: function() {
			(function() {
				var _t = this;
				_t.each(function() {
					this.setAttribute('data-scran', _t.name);
				});
			}).call(this);
			return new Transformer(this);
		}
	};

	var Matrix3D = function(mtx) {
		this.m = mtx || [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		this.COS = 'cos';
		this.SIN = 'sin';
		this.TAN = 'tan';

		this.deg2rad = function(deg) {
			return deg * (Math.PI / 180);
		};

		this.math = function(val,math) {
			return parseFloat(parseFloat(Math[math](val)).toFixed(8));
		};
	};

	Matrix3D.fromTransform = function(str) {
		var r = str.match(/([\d.-]+(?!\w))+/g);
		if (r) {
			return new Matrix3D([
				r[0],	r[1],	r[2],	r[3],
				r[4],	r[5],	r[6],	r[7],
				r[8],	r[9],	r[10],	r[11],
				r[12],	r[13],	r[14],	r[15]
			]);
		} else {
			return;
		}
	};

	Matrix3D.prototype = {
		identity: function() {
			return new Matrix3D([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			]);
		},
		multiply: function(mtx) {
			var a1 = this.m[0], b1 = this.m[1], c1 = this.m[2], d1 = this.m[3],
				e1 = this.m[4], f1 = this.m[5], g1 = this.m[6], h1 = this.m[7],
				i1 = this.m[8], j1 = this.m[9], k1 = this.m[10], l1 = this.m[11],
				m1 = this.m[12], n1 = this.m[13], o1 = this.m[14], p1 = this.m[15];

			var a2 = mtx.m[0], b2 = mtx.m[1], c2 = mtx.m[2], d2 = mtx.m[3],
				e2 = mtx.m[4], f2 = mtx.m[5], g2 = mtx.m[6], h2 = mtx.m[7],
				i2 = mtx.m[8], j2 = mtx.m[9], k2 = mtx.m[10], l2 = mtx.m[11],
				m2 = mtx.m[12], n2 = mtx.m[13], o2 = mtx.m[14], p2 = mtx.m[15];

			return new Matrix3D(
				[
					a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2, a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2, a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2, 0,
					e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2, e1 * b2 + f1 * f2 + g1 * f2 + h1 * n2, e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2, 0,
					i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2, i1 * b2 + j1 * f2 + k1 * f2 + l1 * n2, i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2, 0,
					m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2, m1 * b2 + n1 * f2 + o1 * f2 + p1 * n2, m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2, 1
				]
			);
		},
		isEqual: function(mtx) {
			var a1 = this.m[0], b1 = this.m[1], c1 = this.m[2], d1 = this.m[3],
				e1 = this.m[4], f1 = this.m[5], g1 = this.m[6], h1 = this.m[7],
				i1 = this.m[8], j1 = this.m[9], k1 = this.m[10], l1 = this.m[11],
				m1 = this.m[12], n1 = this.m[13], o1 = this.m[14], p1 = this.m[15];

			var a2 = mtx.m[0], b2 = mtx.m[1], c2 = mtx.m[2], d2 = mtx.m[3],
				e2 = mtx.m[4], f2 = mtx.m[5], g2 = mtx.m[6], h2 = mtx.m[7],
				i2 = mtx.m[8], j2 = mtx.m[9], k2 = mtx.m[10], l2 = mtx.m[11],
				m2 = mtx.m[12], n2 = mtx.m[13], o2 = mtx.m[14], p2 = mtx.m[15];

			if (a1 === a2 && b1 === b2 && c1 === c2 && d1 === d2
				&& e1 === e2 && f1 === f2 && g1 === g2 && h1 === h2
				&& i1 === i2 && j1 === j2 && k1 === k2 && l1 === l2
				&& m1 === m2 && n1 === n2 && o1 === o2 && p1 === p2) {
				return true;
			} else {
				return false;
			}
		},
		translate: function(tx,ty,tz) {
			this.m[12] = tx;
			this.m[13] = ty || 0;
			this.m[14] = tz || 0;
		},
		translateX: function(tx) {
			this.translate.apply(this, [tx]);
		},
		translateY: function(ty) {
			this.translate.apply(this, [0, ty]);
		},
		translateZ: function(tz) {
			this.translate.apply(this, [0, 0, tz]);
		},
		scale: function(sx,sy,sz) {
			this.m[0] = sx;
			this.m[5] = sy || 1;
			this.m[10] = sz || 1;
		},
		scaleX: function(sx) {
			this.scale.apply(this, [sx]);
		},
		scaleY: function(sy) {
			this.scale.apply(this, [1, sy]);
		},
		scaleZ: function(sz) {
			this.scale.apply(this, [1, 1, sz]);
		},
		rotate: function(deg) {
			var rad = this.deg2rad(deg),
				cos = this.math(rad, this.COS),
				sin = this.math(rad, this.SIN);

			this.m[0] = cos;
			this.m[1] = sin;
			this.m[4] = -sin;
			this.m[5] = cos;
		},
		rotateX: function(deg) {
			var rad = this.deg2rad(deg),
				cos = this.math(rad, this.COS),
				sin = this.math(rad, this.SIN);

			this.m[5] = cos;
			this.m[6] = sin;
			this.m[9] = -sin;
			this.m[10] = cos;
		},
		rotateY: function(deg) {
			var rad = this.deg2rad(deg),
				cos = this.math(rad, this.COS),
				sin = this.math(rad, this.SIN);

			this.m[0] = cos;
			this.m[2] = sin;
			this.m[8] = -sin;
			this.m[10] = cos;
		},
		rotateZ: function(deg) {
			this.rotate.apply(this, [deg]);
		},
		skew: function(xdeg,ydeg) {
			var xrad = this.deg2rad(xdeg),
				yrad = ydeg ? this.deg2rad(ydeg) : 0,
				xval = this.math(xrad, this.TAN),
				yval = this.math(yrad, this.TAN);

			this.m[4] = xval;
			this.m[1] = yval;
		},
		skewX: function(xdeg) {
			this.skew.apply(this, [xdeg]);
		},
		skewY: function(ydeg) {
			this.skew.apply(this, [0, ydeg]);
		},
		toTransform2D: function() {
			return 'matrix('
						+ this.m[0] + ',' + this.m[1] + ','
						+ this.m[4] + ',' + this.m[5] + ','
						+ this.m[12] + ',' + this.m[13] + ')';
		},
		toTransform3D: function() {
			return 'matrix3d('
						+ this.m[0] + ',' + this.m[1] + ',' + this.m[2] + ',' + this.m[3] + ','
						+ this.m[4] + ',' + this.m[5] + ',' + this.m[6] + ',' + this.m[7] + ','
						+ this.m[8] + ',' + this.m[9] + ',' + this.m[10] + ',' + this.m[11] + ','
						+ this.m[12] + ',' + this.m[13] + ',' + this.m[14] + ',' + this.m[15] + ')';
		},
		getTranslate: function() {
			return { x: this.m[12], y: this.m[13] };
		},
		getScale: function() {
			return { x: this.m[0], y: this.m[5] };
		},
		toFilter: function() {
			return 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\',M11=' + this.m[0] + ',M12=' + this.m[4] + ',M21=' + this.m[1] + ',M22=' + this.m[5] + ');';
		}
	};

	var TweenController = function() {
		this.q = [];
		return this;
	}

	TweenController.prototype = {
		queue : function() {
			var nt = new Tween(this);
			var pt = this.q[this.q.length - 1];
			if (!pt || pt && pt.completed) {
				nt.canStart = true;
			} else {
				nt.canStart = false;
				pt.then(function() {
					nt.canStart = true;
					nt.start();
				});
			}
			this.q.push(nt);
			return nt;
		}
	}

	var Tween = function(ctlr) {
		this.name = (function() {
			return '$scr-tween-' + (Math.random() * new Date().getTime()).toFixed(0);
		})();
		this.begin = 0;
		this.end = 0;
		this.differences = {};
		this.canStart = true;
		this.started = false;
		this.completed = false;
		this.tweenDuration = 400;
		this.delayTime = 0;
		this.delayed = false;
		this.easing = _.easing.easeNone;
		this.stp = _.noop;
		this.cmplt = _.noop;
		this.thn = _.noop;
		this.stppd = _.noop;
		this.controller = ctlr;
	};

	Tween.prototype = {
		from : function(val) {
			this.begin = val;
			return this;
		},
		to : function(val) {
			this.end = val;
			return this;
		},
		duration : function(val) {
			this.tweenDuration = val;
			return this;
		},
		delay : function(val) {
			this.delayTime = val;
			return this;
		},
		ease : function(fn) {
			this.easing = fn;
			return this;
		},
		step : function(fn) {
			this.stp = fn;
			return this;
		},
		complete : function(fn) {
			this.cmplt = fn;
			return this;
		},
		stopped : function(fn) {
			this.stppd = fn;
			return this;
		},
		then : function(fn) {
			this.thn = fn;
			return this;
		},
		start : function() {
			if (!this.canStart) {
				return this;
			}
			if (this.delayTime > 0 && !this.delayed) {
				var _t = this;
				setTimeout(function() {
					_t.start();
				}, this.delayTime);
				this.delayed = true;
				return this;
			}
			var	stepDuration = 1000 / 60,
				steps = this.tweenDuration / stepDuration,
				diff = this.end - this.begin;

			if (typeof this.end === 'object') {
				if (typeof this.begin !== 'object') {
					this.begin = {};
				}
				for (var val in this.end) {
					if (!this.begin.hasOwnProperty(val)) {
						this.begin[val] = 0;
					}
					this.differences[val] = this.end[val] - this.begin[val];
				}
			} else {
				this.differences.sctmain = this.end - this.begin;
			}

			var _t = this;

			_t.started = true;

			_t.stpFn = function() {
				if (steps >= 0 && _t.started) {
					var s = _t.tweenDuration;
					s = s - (steps * stepDuration);
					steps--;
					var vals = _t.differences.hasOwnProperty('sctmain') ? _t.easing(s, _t.begin, _t.differences.sctmain, _t.tweenDuration) : {};
					if (typeof vals === 'object') {
						for (var v in _t.differences) {
							vals[v] = _t.easing(s, _t.begin[v], _t.differences[v], _t.tweenDuration);
						}
					}
					_t.stp.call(_t, vals);
				} else if (!_t.started) {
					pipeline.remove(_t.name);
					_t.stppd.call(_t);
				} else {
					pipeline.remove(_t.name);
					_t.started = false;
					_t.completed = true;
					_t.cmplt.call(_t, _t.end);
					_t.thn.call(_t);
					_t.controller.q.shift();
				}
			};
			pipeline.add(this.name, _t.stpFn);
			return this;
		},
		stop : function() {
			this.started = false;
			return this;
		},
		queue : function() {
			return this.controller.queue();
		}
	}

	var Pipeline = function() {
		this.pipeline = {};
		this.raf;
	}

	Pipeline.prototype = {
		add : function(name, fn, check) {
			this.pipeline[name] = { fn: fn, check: check };
		},
		remove : function(name) {
			delete this.pipeline[name];
		},
		tick : function tick() {
			for (var n in this.pipeline) {
				if (typeof this.pipeline[n].check !== 'undefined') {
					if (this.pipeline[n].check()) {
						this.pipeline[n].fn();
					}
				} else {
					this.pipeline[n].fn();
				}
			}
			this.raf = _.requestAnimFrame.call(w, tick.bind(this));
		},
		start : function() {
			this.tick();
			
		},
		pause : function() {
			_.cancelAnimFrame.call(w, this.raf);
		}
	}

	var pipeline = new Pipeline();
	pipeline.add('render', _.render, function() {
		return _.cst !== _.st();
	});
	pipeline.start();

	_.listen(w, 'focus', function() {
		pipeline.start();
	});

	_.listen(w, 'blur', function() {
		pipeline.pause();
	});

	_.listen(w, 'resize', function() {
		_.msƒ();
	});

	if (w.addEventListener) {
		d.addEventListener('DOMContentLoaded', _.msƒ, false);
	} else if (w.attachEvent) {
		w.attachEvent('onload', _.msƒ);
	}

	var $s = function(el) {
		return _.select(el);
	};

	$s.tween = _.tween;
	$s.matrix = _.matrix;

	$s.clear = _.clear;
	$s.easing = _.easing;
	$s.scrollTo = _.scroll;
	$s.scrollTop = _.st;
	$s.scrollLeft = _.sl;
	$s.windowHeight = _.wh;
	$s.windowWidth = _.ww;
	$s.documentHeight = _.dh;
	$s.maxScroll = _.ms;
	$s.transformSupport = _.support;
	$s.render = _.render;

	w.Scran = w.$s = $s;

})(window,document);