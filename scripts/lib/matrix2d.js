(function(factory) {

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        self.Matrix2D = factory();
    }

})(function() {
    
    var w = window, d = document;
    var Matrix2D = {};

    function _getFirstSupported(arr) {
        var div = d.createElement('div');
        var ven = null;
        arr.forEach(function(vendor) {
             if (typeof div.style[vendor] !== 'undefined') ven = vendor;
        });

        return ven;
    }

    Matrix2D.CSS_TRANSFORM = (function() {
        var arr = ' ms Moz Webkit O'.split(' ').map(function(prefix) {
            return prefix === '' ? 'transform' : prefix + 'Transform';
        });
        return _getFirstSupported(arr);
    })();

    Matrix2D._typedArraySupport = (function() {
        return 'ArrayBuffer' in w;
    })();

    Matrix2D._deg2rad = function(deg) {
        return deg * (Math.PI / 180);
    };

    Matrix2D._rad2deg = function(rad) {
        return (rad / Math.PI) * 180;
    };

    Matrix2D.create = function() {
        var out, args = Array.prototype.slice.call(arguments);
        if (args.length > 0 && args.length < 9) throw 'Invalid arguments supplied!';
        if (args.length === 0) {
            var arr = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            out = Matrix2D._typedArraySupport ? new Float32Array(arr) : Array.apply(w, arr);
        } else {
            out = Matrix2D._typedArraySupport ? new Float32Array(args) : Array.apply(w, args);
        }
        return out;
    };

    Matrix2D.fromTransform = function(str) {
        var r = str.match(/([\d.-]+(?!\w))+/g);
        if (r) {
            var arr = [r[0], r[1], 0, r[2], r[3], 0, r[4], r[5], 1];
            return Matrix2D._typedArraySupport ? new Float32Array(arr) : Array.apply(w, arr);
        } else {
            return;
        }
    };

    Matrix2D.identity = function(out) {
        out[0] = out[4] = out[8] = 1;
        out[1] = out[2] = out[3] = out[5] = out[6] = out[7] = 0;
    };

    Matrix2D.multiply = function(mx1, mx2, out) {
        var a1 = mx1[0], b1 = mx1[1], c1 = mx1[2],
            d1 = mx1[3], e1 = mx1[4], f1 = mx1[5],
            g1 = mx1[6], h1 = mx1[7], i1 = mx1[8];

        var a2, b2, c2;

        if (mx2.length === 3 && mx2.length === out.length) {
            a2 = mx2[0];
            b2 = mx2[1];
            c2 = mx2[2];

            out[0] = a1 * a2 + b1 * b2 + c1 * c2;
            out[1] = d1 * a2 + e1 * b2 + f1 * c2;
            out[2] = g1 * a2 + h1 * b2 + i1 * c2;
        } else {
            a2 = mx2[0];
            b2 = mx2[1];
            c2 = mx2[2];
            
            var d2 = mx2[3], e2 = mx2[4], f2 = mx2[5],
                g2 = mx2[6], h2 = mx2[7], i2 = mx2[8];

            out[0] = a1 * a2 + b1 * d2 + c1 * g2;
            out[1] = a1 * b2 + b1 * e2 + c1 * h2;
            out[2] = a1 * c2 + b1 * f2 + c1 * i2;
            out[3] = d1 * a2 + e1 * d2 + f1 * g2;
            out[4] = d1 * b2 + e1 * e2 + f1 * h2;
            out[5] = d1 * c2 + e1 * f2 + f1 * i2;
            out[6] = g1 * a2 + h1 * d2 + i1 * g2;
            out[7] = g1 * b2 + h1 * e2 + i1 * h2;
            out[8] = g1 * c2 + h1 * f2 + i1 * i2;
        }
    };

    Matrix2D.isEqual = function(mx1, mx2) {
        var a1 = mx1[0], b1 = mx1[1], c1 = mx1[2],
            d1 = mx1[3], e1 = mx1[4], f1 = mx1[5],
            g1 = mx1[6], h1 = mx1[7], i1 = mx1[8];

        var a2 = mx2[0], b2 = mx2[1], c2 = mx2[2],
            d2 = mx2[3], e2 = mx2[4], f2 = mx2[5],
            g2 = mx2[6], h2 = mx2[7], i2 = mx2[8];

        if (a1 === a2 && b1 === b2 && c1 === c2 &&
            d1 === d2 && e1 === e2 && f1 === f2 &&
            g1 === g2 && h1 === h2 && i1 === i2) {
            return true;
        } else {
            return false;
        }
    };

    Matrix2D.translate = function(out, tx, ty) {
        out[2] = tx;
        out[5] = ty || out[5];
    };

    Matrix2D.translateX = function(out, tx) {
        out[2] = tx;
    };

    Matrix2D.translateY = function(out, ty) {
        out[5] = ty;
    };

    Matrix2D.scale = function(out, sx, sy) {
        out[0] = sx;
        out[4] = sy || out[4];
    };

    Matrix2D.scaleX = function(out, sx) {
        out[0] = sx;
    };

    Matrix2D.scaleY = function(out, sy) {
        out[4] = sy;
    };

    Matrix2D.rotate = function(out, deg) {
        var rad = Matrix2D._deg2rad(deg),
            cos = Math.cos(rad),
            sin = Math.sin(rad);

        out[0] = cos;
        out[1] = -sin;
        out[3] = sin;
        out[4] = cos;
    };

    Matrix2D.skew = function(out, xdeg, ydeg) {
        var xrad = Matrix2D._deg2rad(xdeg),
            yrad = ydeg ? Matrix2D._deg2rad(ydeg) : 0,
            xtan = Math.tan(xrad),
            ytan = Math.tan(yrad);

        out[3] = xtan;
        out[1] = ytan;
    };

    Matrix2D.skewX = function(out, xdeg) {
        var rad = Matrix2D._deg2rad(xdeg),
            tan = Math.tan(rad);

        out[3] = tan;
    };

    Matrix2D.skewY = function(out, ydeg) {
        var rad = Matrix2D._deg2rad(ydeg),
            tan = Math.tan(rad);

        out[1] = tan;
    };

    Matrix2D.toTransform = function(mx) {
        return 'matrix(' +  mx[0] + ',' + mx[1] + ',' +
                            mx[3] + ',' + mx[4] + ',' +
                            mx[2] + ',' + mx[5] + ')';
    };

    Matrix2D.toFilter = function(mx) {
        return 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\',M11=' +
            mx[0] + ',M12=' + -mx[1] + ',M21=' + -mx[3] + ',M22=' + mx[4] + ');';
    };

    return Matrix2D;

});