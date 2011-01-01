// M. David Peterson
// m.david@xmlhacker.com
// 02/16/2009
//
// The following is a quick and dirty lunchtime port of the code found at [1,2]:
//
// [1] Sylvain Hellegouarch: http://nuxleus.com/dev/browser/trunk/nuxleus/Source/Nuxleus.Utility/Utility/StringMatching.cs
// [2] http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_levenshtein/
//
// Overview:
// Javascript 'Matching' object + prototype extensions to compute and
// compare the Levenshtein distance of two given strings, using
// a given threshold to determine if the two strings match closely
// enough to be considered equivalent. Useful for catching basic typos
// entered into an form.

// Sample usage:
/*
var match = new Matching('friday', 'frdiay', 2);
alert(match.areNeighbors());
*/
// Result: alert box with the boolean value: true
//
// Changing the threshold value of the Matching object
// to 1 will result in a return value of false.
// See: http://en.wikipedia.org/wiki/Levenshtein_distance for
// a deeper understanding as to why.

function Matching(str1, str2, threshold) {
    this.x = str1
    this.y = str2
    this.threshold = threshold
}

Matching.prototype.areNeighbors = function() {

    var x = this.x, y = this.y, threshold = this.threshold;

    // if the length difference between the strings is greater
    // than the threshold, we don't even bother
    // This may miss some matches modulo extra spaces
    // but improve the performances in the general use case

    if (Math.abs(x.length - y.length) > threshold) {
        return false;
    }

    // We want to test strings of equal lengths
    if (x.length < y.length) {
        x = x.padRight(y.length, ' ');
    }
    else if (y.length < x.length) {
        y = y.padRight(x.length, ' ');
    }

    var dist = this.computeEditDistance(x, y);

    // Take the case of:
    // x = "js"
    // y = "do"
    // threshold = 2
    // Then distance would be 2 but x and y are clearly different
    if ((dist == threshold) && (dist == x.length) && (dist == y.length)) {
        return false;
    }

    return (dist <= threshold);
}

Matching.prototype.computeEditDistance = function() {

    // M. David Peterson: Modified to be used as a prototype of a Matching object
    // Original found at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_levenshtein/
    // with the following meta-data:
    //
    // http://kevin.vanzonneveld.net
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +   bugfixed by: Onno Marsman
    // *     example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
    // *     returns 1: 3

    var str1 = this.x, str2 = this.y;
    var s, l = (s = (str1 + '').split("")).length, t = (str2 = (str2 + '').split("")).length, i, j, m, n;
    if (!(l || t)) return Math.max(l, t);
    for (var a = [], i = l + 1; i; a[--i] = [i]);
    for (i = t + 1; a[0][--i] = i; );
    for (i = -1, m = s.length; ++i < m; ) {
        for (j = -1, n = str2.length; ++j < n; ) {
            a[(i *= 1) + 1][(j *= 1) + 1] = Math.min(a[i][j + 1] + 1, a[i + 1][j] + 1, a[i][j] + (s[i] != str2[j]));
        }
    }
    return a[l][t];
}

String.prototype.padRight = function(length, padWithChar) {
    var newString = this.valueOf();
    while (newString.length < length) {
        newString = newString.concat(padWithChar);
    }
    return newString;
}

String.prototype.padLeft = function(length, padWithChar) {
    var newString = this.valueOf();
    while (newString.length < length) {
        newString = padWithChar.concat(newString);
    }
    return newString;
}