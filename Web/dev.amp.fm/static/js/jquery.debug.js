/*
* Simple jQuery logger / debugger.
* Based on: http://jquery.com/plugins/Authoring/
* See var DEBUG below for turning debugging/logging on and off.
*
* @version   20070111
* @since     2006-07-10
* @copyright Copyright (c) 2006 Glyphix Studio, Inc. http://www.glyphix.com
* @author    Brad Brizendine <brizbane@gmail.com>
* @license   MIT http://www.opensource.org/licenses/mit-license.php
* @requires  >= jQuery 1.0.3
*/
// global debug switch ... add DEBUG = true; somewhere after jquery.debug.js is loaded to turn debugging on
var DEBUG = false;
var lineCount = 0;
var lcPad = 5;

function zeroPad(num) {
    var numZeropad = num + '';
    while (numZeropad.length < lcPad) {
        numZeropad = "0" + numZeropad;
    }
    return numZeropad;
}
// shamelessly ripped off from http://getfirebug.com/
if (!("console" in window) || !("firebug" in console)) {
    var names =[ "log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
    // create the logging div
    jQuery(document) .ready(
    function () {
        $(document.body) .append('<div id="DEBUG"><ol></ol></div>');
    });
    // attach a function to each of the firebug methods
    window.console = {
    };
    for (var i = 0; i < names.length;++ i) {
        window.console[names[i]] = function (msg) {
            var callingFunc = arguments.callee.caller.caller;
            var callingFuncName = callingFunc.toString();
            var callingFuncArguments = callingFunc.arguments;
            callingFuncName = callingFuncName.substr(0, callingFuncName.indexOf('{'));
            
            var str = '';
            var message = (msg == undefined)? '': ' [Message: '.concat(msg).concat(']');
            for (var i = 0; i < callingFuncArguments.length; i++) {
                try {
                    var arg = callingFuncArguments[i];
                    var closeString = (i < (callingFuncArguments.length - 1)) ? '", ' : '"';
                    str += ' ' + typeof(arg) + ': "' + callingFuncArguments[i].toString().replace('<', '&lt;').replace('>', '&gt;') + closeString;
                }
                
                catch (e) {
                    str += ' "<span class="log error">' + e.toString() + '</span>"';
                }
            }
            $('#DEBUG ol') .prepend('<li><span class="log lineCount">' + zeroPad(lineCount) + ': </span>' + dateFormat() + ' <span class="log functionName">' + callingFuncName + '</span><span class="log argValues">' + str + '</span></li>');
            lineCount++;
            if (message.length > 0) {
                var callingFuncShortName = callingFuncName.substr(0, callingFuncName.indexOf('(')).replace('function ', '<span class="ellipsis">...</span>');
                $('#DEBUG ol') .prepend('<li><span class="log lineCount">' + zeroPad(lineCount) + ': </span>' + dateFormat() + ' <span class="log functionName">' + callingFuncShortName + '</span>' + '<span class="log message">' + message + '</span></li>');
                lineCount++;
            }
        }
    }
}

/*
* debug
* Simply loops thru each jquery item and logs it
*/
jQuery.fn.debug = function () {
    return this .each(function () {
        $.log(this);
    });
};

/*
* log
* Send it anything, and it will add a line to the logging console.
* If firebug is installed, it simple send the item to firebug.
* If not, it creates a string representation of the html element (if message is an object), or just uses the supplied value (if not an object).
*/
jQuery.log = function (message) {
    // only if debugging is on
    if (window.DEBUG) {
        // if no firebug, build a debug line from the actual html element if it's an object, or just send the string
        var str = message;
        if (!('firebug' in console)) {
            if (typeof (message) == 'object') {
                str = '&lt;';
                str += message.nodeName.toLowerCase();
                for (var i = 0; i < message.attributes.length; i++) {
                    str += ' ' + message.attributes[i].nodeName.toLowerCase() + '="' + message.attributes[i].nodeValue + '"';
                }
                str += '&gt;';
            }
        } else {
            var callingFunc = arguments.callee.caller.caller;
            var callingFuncName = callingFunc.toString();
            var callingFuncArguments = callingFunc.arguments;
            var str = '';
            try {
                for (var i = 0; i < callingFuncArguments.length; i++) {
                    str += ' "' + callingFuncArguments[i].toString() + '"';
                }
            }
            catch (e) {
                str += ' "' + e.toString() + '"';
            }
        }
        
        console.debug(str);
        //var objDiv = document.getElementById("DEBUG");
        //objDiv.scrollTop = objDiv.scrollHeight;
    }
};