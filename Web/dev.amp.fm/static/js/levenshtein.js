String.prototype.padRight = function (length, padWithChar) {
    while (this.length < length) {
        this = this.concat(padWithChar);
    }
    return this;
}

(function () {

    String.Matching = {
    
        areNeighbors: function (x, y, threshold) {
            // if the length difference between the strings is greater
            // than the threshold, we don't even bother
            // This may miss some matches modulo extra spaces
            // but improve the performances in the general use case
            if (Math.abs(x.length - y.length) > threshold)
            {
                return false;
            }

            // We want to test strings of equal lengths
            if (x.length < y.length)
            {
                x = x.padRight(y.length, ' ');
            }
            else if (y.length < x.length)
            {
                y = y.padRight(x.length, ' ');
            }

            var dist = computeLevenshteinDistance(x, y);

            // Take the case of:
            // x = "js"
            // y = "do"
            // threshold = 2
            // Then distance would be 2 but x and y are clearly different
            if ((dist == threshold) && (dist == x.length) && (dist == y.length))
            {
                return false;
            }

            return (dist <= threshold);
        },
        
        computeLevenshteinDistance: function ( str1, str2 ) {
            // http://kevin.vanzonneveld.net
            // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
            // +   bugfixed by: Onno Marsman
            // *     example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
            // *     returns 1: 3
         
            var s, l = (s = (str1+'').split("")).length, t = (str2 = (str2+'').split("")).length, i, j, m, n;
            if(!(l || t)) return Math.max(l, t);
            for(var a = [], i = l + 1; i; a[--i] = [i]);
            for(i = t + 1; a[0][--i] = i;);
            for(i = -1, m = s.length; ++i < m;){
                for(j = -1, n = str2.length; ++j < n;){
                    a[(i *= 1) + 1][(j *= 1) + 1] = Math.min(a[i][j + 1] + 1, a[i + 1][j] + 1, a[i][j] + (s[i] != str2[j]));
                }
            }
            return a[l][t];
        }
    };
}());
