require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ƒ = require('hdom');
var scran = require('scran');
ƒ(function() {
   
	console.log('hello my joe');

    
});
},{"hdom":"SZ033r","scran":"jIez3g"}],"hdom":[function(require,module,exports){
module.exports=require('SZ033r');
},{}],"SZ033r":[function(require,module,exports){
(function (global){
(function browserifyShim(module, exports, define, browserify_shim__define__module__export__) {
(function(factory) {

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(window, document);
    } else {
        window.hDOM = window.ƒ = factory(window, document);
    }

})(function(w, d) {
    
    'use strict';

    var _defaults = {
            configurable: false,
            enumerable: false,
            writable: false
        },
        _support = {
            classList: 'classList' in d.documentElement,
            addEventListener: w.addEventListener,
            attachEvent: w.attachEvent
        },
        _utils = {
            extend: function() {
                var args = [].slice.call(arguments),
                    ret = args[0];
                for (var i = 1, len = args.length; i < len; i++) {
                    var obj = args[i];
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) ret[prop] = obj[prop];
                    }
                }
                return ret;
            },
            each: function(obj, fn, context) {
                for (var p in obj) {
                    if (!('hasOwnProperty' in obj) || obj.hasOwnProperty(p)) fn.apply(context || obj[p], [obj[p], p]);
                }
            },
            emitter: (function() {
                var _listeners = {};
    
                function on() {
                    var args = [].slice.call(arguments);
                    var ev = args[0],
                        fn = args[1],
                        scope = args[2] || hDOM;
                 
                    _listeners[ev] = _listeners[ev] || [];
                    _listeners[ev].push({ fn : fn, scope : scope });
                }
                 
                function emit() {
                    var args = [].slice.call(arguments);
                    var ev = args[0],
                        props = args.slice(1);
                 
                    if (!(ev in _listeners)) return;

                    _utils.each(_listeners[ev], function(listener) {
                        listener.fn.apply(listener.scope, props);
                    });
                }
                 
                return {
                    on: on,
                    emit: emit
                };
            })(),
            format: function(str, obj) {
                return str.toString().replace(/\{([^}]+)\}/g, function(match, group) {
                    return obj[group];
                });
            },
            ajax: function(opts) {
                var args = _utils.extend({
                    url : undefined,
                    dataType : 'text',
                    data : '',
                    cache : true,
                    success : function(r) {},
                    error : function(r) {},
                    method : 'GET',
                    async : true
                }, opts);

                if (!args.url) return;
                if (args.method === 'GET' && !args.cache) args.data += '_=' + new Date().getTime();

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    var rs = xhr.readyState;
                    if (rs < 4) return;
                    if (rs === 4) {
                        if (xhr.status !== 200 && xhr.status !== 0) {
                            args.error.call(this, xhr.responseText);
                            return;
                        }
                        switch (args.dataType)
                        {
                            case 'text':
                            case 'html':
                            case 'script':
                                args.success.call(this, xhr.responseText);
                            break;
                            case 'json':
                                args.success.call(this, JSON.parse(xhr.responseText));
                            break;
                            case 'xml':
                                args.success.call(this, xhr.responseXML);
                            break;
                        }
                    }
                };
                xhr.onerror = function() {
                    args.error.call(this, xhr.responseText);
                };
                xhr.open(args.method, args.url, args.async);
                if (args.method === 'POST') xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.send(args.data);
            },
            wrapEvent: function(e) {
                if (e.preventDefault) return e;
                _utils.extend(e, {
                    preventDefault: function() {
                        e.returnValue = false;
                    }
                });
                return e;
            },
            ready: (function() {
                if (w.addEventListener) {
                    return function(fn) {
                        d.addEventListener('DOMContentLoaded', function rdy(ev) {
                            d.removeEventListener('DOMContentLoaded', rdy);
                            fn.call(hDOM, ev);
                        }, false);
                    };
                } else if (w.attachEvent) {
                    return function(fn) {
                        d.attachEvent('onreadystatechange', function rdy(ev) {
                            if (d.readyState === 'complete') {
                                d.detachEvent('onreadystatechange', rdy);
                                fn.call(hDOM, ev);
                            }
                        });
                    };
                }
            })(),
            scrollTop: (function() {
                if (typeof w.pageYOffset !== 'undefined') {
                    return function(val) {
                        if (val && !isNaN(val)) {
                            var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
                            b.scrollTop = val;
                        }
                        return w.pageYOffset;
                    };
                } else {
                    var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
                    return function(val) {
                        if (val && !isNaN(val)) b.scrollTop = val;
                        return b.scrollTop;
                    };
                }
            })(),
            range: function(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            },
            windowHeight: (function() {
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
            })(),
            windowWidth: (function() {
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
            })(),
            documentHeight: function() {
                return Math.max(
                    Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
                    Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
                    Math.max(d.body.clientHeight, d.documentElement.clientHeight)
                );
            },
            documentWidth: function() {
                return Math.max(
                    Math.max(d.body.scrollWidth, d.documentElement.scrollWidth),
                    Math.max(d.body.offsetWidth, d.documentElement.offsetWidth),
                    Math.max(d.body.clientWidth, d.documentElement.clientWidth)
                );
            }
        };

    if (!Object.defineProperty || !(function() { try { Object.defineProperty({}, 'x', {}); return true; } catch(e) { return false; }})()) {
        var orig = Object.defineProperty;
        Object.defineProperty = function(o, prop, desc) {
            if (orig) {
                try {
                    return orig(o, prop, desc);
                } catch(e) {}
            }

            if (Object.prototype.__defineSetter__ && ('set' in desc)) {
                Object.prototype.__defineSetter__.call(o, prop, desc.set);
            }

            if (Object.prototype.__defineGetter__ && ('get' in desc)) {
                Object.prototype.__defineGetter__.call(o, prop, desc.get);
            }

            if ('value' in desc) {
                o[prop] = desc.value;
            }

        };
    }

    var ElementCollection = function(arr) {
        _utils.extend(this, arr);
        this.length = arr.length;
        return this;
    };

    Object.defineProperty(ElementCollection.prototype, 'each', _utils.extend(_defaults, {
        value: function(fn) {
            for (var i = 0, len = this.length; i < len; i++) {
                fn.apply(this[i], [this[i], i]);
            }
            return this;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'find', _utils.extend(_defaults, {
        value: function(sel) {
            var arr = [];
            var last = /:last\-child/.test(sel);
            if (last) {
                sel = sel.split(':last-child').join('');
            }
            this.each(function() {
                var _self = this;
                var tmp = [];
                var query = !last ? _self.querySelectorAll(sel) : [_self.querySelector(sel).parentNode.lastChild];
                _utils.each(query, function(val, prop) {
                    tmp[prop] = val;
                });
                arr = arr.concat(tmp);
            });
            return new ElementCollection(arr);
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'bind', _utils.extend(_defaults, {
        value: (function() {
            if (_support.addEventListener) {
                return function(ev, fn) {
                    var evs = ev.split(' ');
                    var loopFn = function(e) {
                        return function(el) {
                            el.addEventListener(e, fn, false);
                        };
                    };
                    for (var i = 0, len = evs.length; i < len; i++) {
                        this.each(loopFn(evs[i]));
                    }
                    return this;
                };
            } else if (_support.attachEvent) {
                return function(ev, fn) {
                    var evs = ev.split(' ');
                    var loopFn = function(e) {
                        return function(el) {
                            el['hEvRaw' + ev + fn] = fn;
                            el['hEv' + ev + fn] = function(e) { fn.call(el, _utils.wrapEvent(e || w.event)); };
                            el.attachEvent('on' + e, el['hEv' + ev + fn], false);
                        };
                    };
                    for (var i = 0, len = evs.length; i < len; i++) {
                        this.each(loopFn(evs[i]));
                    }
                    return this;
                };
            }
        })()
    }));

    Object.defineProperty(ElementCollection.prototype, 'unbind', _utils.extend(_defaults, {
        value: (function() {
            if (_support.addEventListener) {
                return function(ev, fn) {
                    var evs = ev.split(' ');
                    var loopFn = function(e) {
                        return function(el) {
                            el.removeEventListener(e, fn, false);
                        };
                    };
                    for (var i = 0, len = evs.length; i < len; i++) {
                        this.each(loopFn(evs[i]));
                    }
                    return this;
                };
            } else if (_support.attachEvent) {
                return function(ev, fn) {
                    var evs = ev.split(' ');
                    var loopFn = function(e) {
                        return function(el) {
                            var func = el['hEv' + ev + fn] || function() {};
                            el.detachEvent('on' + e, func, false);
                            el['hEvRaw' + ev + fn] = el['hEv' + ev + fn] = null;
                        };
                    };
                    for (var i = 0, len = evs.length; i < len; i++) {
                        this.each(loopFn(evs[i]));
                    }
                    return this;
                };
            }
        })()
    }));

    Object.defineProperty(ElementCollection.prototype, 'addClass', _utils.extend(_defaults, {
        value: (function() {
            if (_support.classList) {
                return function(cls) {
                    if (!cls) return this;
                    _utils.each(cls.split(' '), function(value, i) {
                        this.each(function() {
                            if (this.classList.contains(value)) return;
                            this.classList.add(value);
                        });
                    }, this);
                    return this;
                };
            } else {
                return function(cls) {
                    if (!cls) return this;
                    _utils.each(cls.split(' '), function(value, i) {
                        var regex = new RegExp('(\\s|^)' + value + '(\\s|$)');
                        this.each(function() {
                            if (this.className.match(regex)) return;
                            this.className += ' ' + value;
                            this.className = this.className.replace(/(^\s*)|(\s*$)/g, '');
                        });
                    }, this);
                    return this;
                };
            }
        })()
    }));

    Object.defineProperty(ElementCollection.prototype, 'removeClass', _utils.extend(_defaults, {
        value: (function() {
            if (_support.classList) {
                return function(cls) {
                    if (!cls) return this;
                    _utils.each(cls.split(' '), function(value, i) {
                        this.each(function() {
                            if (!this.classList.contains(value)) return;
                            this.classList.remove(value);
                        });
                    }, this);
                    return this;
                };
            } else {
                return function(cls) {
                    if (!cls) return this;
                    _utils.each(cls.split(' '), function(value, i) {
                        var regex = new RegExp('(\\s|^)' + value + '(\\s|$)');
                        this.each(function() {
                            this.className = this.className.replace(regex, ' ').replace(/(^\s*)|(\s*$)/g, '');
                        });
                    }, this);
                    return this;
                };
            }
        })()
    }));

    Object.defineProperty(ElementCollection.prototype, 'hasClass', _utils.extend(_defaults, {
        value: (function() {
            if (_support.classList) {
                return function(cls) {
                    if (cls.constructor.name === 'RegExp') return cls.test(this[0].className);
                    return this[0].classList.contains(cls);
                };
            } else {
                return function(cls) {
                    if (cls.constructor.name === 'RegExp') return cls.test(this[0].className);
                    return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(this[0].className);
                };
            }
        })()
    }));

    Object.defineProperty(ElementCollection.prototype, 'toggleClass', _utils.extend(_defaults, {
        value: function(cls) {
            var fn = this.hasClass(cls) ? 'removeClass' : 'addClass';
            return this[fn](cls);
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'attr', _utils.extend(_defaults, {
        value: function(name, val) {
            if (typeof val !== 'undefined') {
                this.each(function() {
                    this.setAttribute(name, val);
                });
                return this;
            } else {
                var ret;
                this.each(function() {
                    ret = this.getAttribute(name);
                });
                return ret;
            }
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'offset', _utils.extend(_defaults, {
        value: function() {
            return this[0].getBoundingClientRect() || undefined;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'clone', _utils.extend(_defaults, {
        value: function(deep) {
            deep = typeof deep === 'undefined' ? true : deep;
            var arr = [];
            this.each(function() {
                arr.push(this.cloneNode(deep));
            });
            return new ElementCollection(arr);
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'append', _utils.extend(_defaults, {
        value: function(el) {
            var args = el.__proto__ === ElementCollection.prototype ? el : [].slice.call(arguments);
            var frag = d.createDocumentFragment();
            _utils.each(args, function(value, i) {
                if (isNaN(value) && 'nodeType' in value && value.nodeType === 1) {
                    frag.appendChild(value);
                }
            });
            this.each(function() {
                this.appendChild(frag);
            });
            return this;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'prepend', _utils.extend(_defaults, {
        value: function(el) {
            var args = el.__proto__ === ElementCollection.prototype ? el : [].slice.call(arguments);
            var frag = d.createDocumentFragment();
            _utils.each(args, function(value, i) {
                if (isNaN(value) && 'nodeType' in value && value.nodeType === 1) {
                    frag.appendChild(value);
                }
            });
            this.each(function() {
                this.insertBefore(frag, this.childNodes[0]);
            });
            return this;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'remove', _utils.extend(_defaults, {
        value: function() {
            this.each(function() {
                this.parentNode.removeChild(this);
            });
            return this;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'html', _utils.extend(_defaults, {
        value: function(h) {
            var val;
            if (h || h === '') {
                this.each(function() {
                    this.innerHTML = h;
                });
            } else {
                val = this[0].innerHTML;
            }
            return val || this;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'width', _utils.extend(_defaults, {
        value: function(width) {
            var val;
            if (this[0] === w) return _utils.windowWidth();
            if (this[0] === d) return _utils.documentWidth();
            this.each(function() {
                if (typeof width === 'undefined') {
                    val = parseInt(this.style.width, 10);
                    if (isNaN(val)) {
                        var rect = this.getBoundingClientRect();
                        val = rect.right - rect.left;
                    }
                } else {
                    this.style.width = width + 'px';
                }
            });
            return val || this;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'height', _utils.extend(_defaults, {
        value: function(height) {
            var val;
            if (this[0] === w) return _utils.windowHeight();
            if (this[0] === d) return _utils.documentHeight();
            this.each(function() {
                if (typeof height === 'undefined') {
                    val = parseInt(this.style.height, 10);
                    if (isNaN(val)) {
                        var rect = this.getBoundingClientRect();
                        val = rect.bottom - rect.top;
                    }
                } else {
                    this.style.height = height + 'px';
                }
            });
            return val || this;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'index', _utils.extend(_defaults, {
        value: function() {
            function prevElSib(el) {
                if ('previousElementSibling' in el) {
                    return el.previousElementSibling;
                } else {
                    while ((el = el.previousSibling))  {
                        if (el.nodeType === 1) return el;
                    }
                    return null;
                }
            }
            var val, child = this[0], i = 0;
            while ((child = prevElSib(child)) !== null) i++;
            return i;
        }
    }));

    Object.defineProperty(ElementCollection.prototype, 'click', _utils.extend(_defaults, {
        value: function() {
            var e = d.createEvent ? d.createEvent('MouseEvent') : d.createEventObject();
            this.each(function() {
                if (this.click) {
                    this.click();
                    return;
                }
                if (d.createEvent) {
                    e.initEvent('click', true, true);
                    this.dispatchEvent(e);
                } else {
                    this.fireEvent('onclick', e);
                }
            });
            return this;
        }
    }));

    var hDOM = function(sel) {
        if (typeof sel === 'string') {
            var arr = [];
            _utils.each(d.querySelectorAll(sel), function(val, prop) {
                arr[prop] = val;
            });
            return new ElementCollection(arr);
        } else if ('nodeType' in sel || sel === w) {
            return new ElementCollection([sel]);
        } else if (typeof sel === 'function') {
            hDOM.ready(sel);
        }
    };

    (function() {

        if (!_support.addEventListener) return;
        
        var createEvent = function(el, name) {
            var e = d.createEvent('CustomEvent');
            e.initCustomEvent(name, true, true, el.target);
            el.target.dispatchEvent(e);
            e = null;
            return false;
        };

        var notMoved = true,
            startPos = { x: 0, y: 0 },
            endPos = { x: 0, y: 0},
            evs = {
                touchstart: function(e) {
                    startPos.x = e.touches[0].pageX;
                    startPos.y = e.touches[0].pageY;
                },
                touchmove: function(e) {
                    notMoved = false;
                    endPos.x = e.touches[0].pageX;
                    endPos.y = e.touches[0].pageY;
                },
                touchend: function(e) {
                    if (notMoved) {
                        createEvent(e, 'fastclick');
                        createEvent(e, 'tap');
                    } else {
                        var x = endPos.x - startPos.x,
                            xr = Math.abs(x),
                            y = endPos.y - startPos.y,
                            yr = Math.abs(y);

                        if (Math.max(xr, yr) > 20) {
                            createEvent(e, xr > yr ? (x < 0 ? 'swipeleft' : 'swiperight') : (y < 0 ? 'swipeup' : 'swipedown'));
                            notMoved = true;
                        }
                    }
                },
                touchcancel: function(e) {
                    notMoved = false;
                }
            };

        for (var e in evs) {
            hDOM(d).bind(e, evs[e]);
        }

    })();

    hDOM.ready = _utils.ready;
    hDOM.each = _utils.each;
    hDOM.extend = _utils.extend;
    hDOM.format = _utils.format;
    hDOM.range = _utils.range;
    hDOM.ajax = _utils.ajax;
    hDOM.emitter = _utils.emitter;
    hDOM.scrollTop = _utils.scrollTop;

    return hDOM;

});
; browserify_shim__define__module__export__(typeof ƒ != "undefined" ? ƒ : window.ƒ);

}).call(global, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"scran":[function(require,module,exports){
module.exports=require('jIez3g');
},{}],"jIez3g":[function(require,module,exports){
(function (global){
(function browserifyShim(module, exports, define, browserify_shim__define__module__export__) {
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
; browserify_shim__define__module__export__(typeof scran != "undefined" ? scran : window.scran);

}).call(global, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])