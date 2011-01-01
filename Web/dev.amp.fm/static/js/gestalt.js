// This is the path to the Gestalt XAP files.  Note that the path is always relative
// to the page that is using Gestalt, and NOT relative to the gestalt.js file.
// You can set the path directly from your page, or edit this page, and consider
// using an absolute path instead of relative.
if (!window.gestaltpath)
    window.gestaltpath = "/static/gs/";

/* 
    HTML Utility functions
*/


if (typeof HTMLElement != "undefined" && !
    HTMLElement.prototype.insertAdjacentElement) {
    HTMLElement.prototype.insertAdjacentElement = function
    (where, parsedNode) {
        switch (where) {
            case 'beforeBegin':
                this.parentNode.insertBefore(parsedNode, this)
                break;
            case 'afterBegin':
                this.insertBefore(parsedNode, this.firstChild);
                break;
            case 'beforeEnd':
                this.appendChild(parsedNode);
                break;
            case 'afterEnd':
                if (this.nextSibling)
                    this.parentNode.insertBefore(parsedNode, this.nextSibling);
                else this.parentNode.appendChild(parsedNode);
                break;
        }
    }
}

function get_lastchild(n) {
    x = n.lastChild;
    while (x.nodeType != 1) {
        x = x.previousSibling;
    }
    return x;
}

    
    
/*
    Gestalt uses Silverlight to instantiate the Dynamic Language Runtime.
    This section checks to make sure Silverlight is installed.  You can
    create a DIV in your page with id=getsilverlight and display:none to have us show your
    "install Silverlight" UI.  If no such DIV is found, we'll inject some default
    install message into the page.
*/

if (!window.Silverlight) {
    window.Silverlight = {};
}

Silverlight.defaultInstallMessage = '<div id="getsilverlight">';
Silverlight.defaultInstallMessage += 'This page uses Silverlight to support IronRuby and IronPython.  <a target="_new" href="http://go.microsoft.com/fwlink/?LinkId=124807">Install Silverlight by clicking here</a>.  It only takes a few seconds!';
Silverlight.defaultInstallMessage += '</div>';


Silverlight.onSilverlightInstalled = function() { window.location.reload(false); };

Silverlight.isInstalled = function(version) {
    var isVersionSupported = false;
    var container = null;

    try {
        var control = null;

        try {
            control = new ActiveXObject('AgControl.AgControl');
            if (version == null) {
                isVersionSupported = true;
            }
            else if (control.IsVersionSupported(version)) {
                isVersionSupported = true;
            }
            control = null;
        }
        catch (e) {
            var plugin = navigator.plugins["Silverlight Plug-In"];
            if (plugin) {
                if (version === null) {
                    isVersionSupported = true;
                }
                else {
                    var actualVer = plugin.description;
                    if (actualVer === "1.0.30226.2")
                        actualVer = "2.0.30226.2";
                    var actualVerArray = actualVer.split(".");
                    while (actualVerArray.length > 3) {
                        actualVerArray.pop();
                    }
                    while (actualVerArray.length < 4) {
                        actualVerArray.push(0);
                    }
                    var reqVerArray = version.split(".");
                    while (reqVerArray.length > 4) {
                        reqVerArray.pop();
                    }

                    var requiredVersionPart;
                    var actualVersionPart
                    var index = 0;


                    do {
                        requiredVersionPart = parseInt(reqVerArray[index]);
                        actualVersionPart = parseInt(actualVerArray[index]);
                        index++;
                    }
                    while (index < reqVerArray.length && requiredVersionPart === actualVersionPart);

                    if (requiredVersionPart <= actualVersionPart && !isNaN(requiredVersionPart)) {
                        isVersionSupported = true;
                    }
                }
            }
        }
    }
    catch (e) {
        isVersionSupported = false;
    }
    if (container) {
        document.body.removeChild(container);
    }

    return isVersionSupported;
}

Silverlight.WaitForInstallCompletion = function() {
    if (Silverlight.onSilverlightInstalled) {
        try {
            navigator.plugins.refresh();
        }
        catch (e) {
        }
        if (Silverlight.isInstalled(null)) {
            Silverlight.onSilverlightInstalled();
        }
        else {
            setTimeout(Silverlight.WaitForInstallCompletion, 3000);
        }
    }
}


Silverlight.__startup = function() {
    var installed = Silverlight.isInstalled(null);

    if (!installed) {
        var elem;

        elem = document.getElementById("getsilverlight");
        if (elem) {
            elem.style.display = "block";
        }
        else {
            var spantag = document.createElement("span");
            spantag.innerHTML = Silverlight.defaultInstallMessage;
            document.body.insertBefore(spantag, document.body.firstChild);
        }
        elem = document.getElementById("hideifslmissing");
        if (elem) {
            elem.style.display = "none";
        }

        Silverlight.WaitForInstallCompletion();

    }

    if (window.removeEventListener) {
        window.removeEventListener('load', Silverlight.__startup, false);
    }
    else {
        window.detachEvent('onload', Silverlight.__startup);
    }
}

if (window.addEventListener) {
    window.addEventListener('load', Silverlight.__startup, false);
}
else {
    window.attachEvent('onload', Silverlight.__startup);
}

if (!window.idcounter) {
    window.idcounter = 0;
}


///////////////////////////////////////////////////////////////////////////////
//
//  buildHTML:
//
//  create HTML that instantiates the control
//
///////////////////////////////////////////////////////////////////////////////
Silverlight.buildHTML = function(slProperties) {
    var htmlBuilder = [];

    htmlBuilder.push('<object type=\"application/x-silverlight\" data="data:application/x-silverlight,"');
    if (slProperties.id != null) {
        htmlBuilder.push(' id="' + Silverlight.HtmlAttributeEncode(slProperties.id) + '"');
    }
    if (slProperties.width != null) {
        htmlBuilder.push(' width="' + slProperties.width + '"');
    }
    if (slProperties.height != null) {
        htmlBuilder.push(' height="' + slProperties.height + '"');
    }
    htmlBuilder.push(' >');

    delete slProperties.id;
    delete slProperties.width;
    delete slProperties.height;

    for (var name in slProperties) {
        if (slProperties[name]) {
            htmlBuilder.push('<param name="' + Silverlight.HtmlAttributeEncode(name) + '" value="' + Silverlight.HtmlAttributeEncode(slProperties[name]) + '" />');
        }
    }
    htmlBuilder.push('<\/object>');
    return htmlBuilder.join('');
};


Silverlight.HtmlAttributeEncode = function(strInput) {
    var c;
    var retVal = '';

    if (strInput == null) {
        return null;
    }

    for (var cnt = 0; cnt < strInput.length; cnt++) {
        c = strInput.charCodeAt(cnt);

        if (((c > 96) && (c < 123)) ||
                  ((c > 64) && (c < 91)) ||
                  ((c > 43) && (c < 58) && (c != 47)) ||
                  (c == 95)) {
            retVal = retVal + String.fromCharCode(c);
        }
        else {
            retVal = retVal + '&#' + c + ';';
        }
    }

    return retVal;
};

function onSilverlightError(sender, args) {
    var divtag = document.createElement("div");

    if (args.errorType == 'InitializeError') {
        divtag.innerHTML = 'There was an error instantiating a Gestalt control on this page.  <p> Gestalt is trying to load the XAP from <a href="' + gestaltpath + '">' + gestaltpath + '</a>. <p> If this path is not correct, you may need to set gestaltpath in your page, or edit gestalt.js to set the appropriate path';
        document.body.insertBefore(divtag, document.body.firstChild);
    }
    else {
//        errorMsg = "Error Type:    " + args.errorType + "\n";
//        errorMsg += "Error Message: " + args.errorMessage + "\n";
//        errorMsg += "Errsor Code:    " + args.errorCode + "\n";
//        divtag.innerHTML = errorMsg;
//        document.body.insertBefore(divtag, document.body.firstChild);
    }
}

if (!window.gestaltLoaded) {
    window.gestaltLoaded = true;

    $(function() {

        function InjectSilverlightTag(sibling, settings) {

            var spantag = document.createElement("span");
            if (sibling.parentElement && sibling.parentElement.tagName == "HEAD") {
                document.body.appendChild(spantag);
            }
            else sibling.insertAdjacentElement('afterEnd', spantag);

            settings.source = gestaltpath;
            settings.initParams = "id=" + settings.htmlid;

            slHtml = Silverlight.buildHTML(settings);

            spantag.innerHTML = slHtml;

        };

        jQuery.fn.CheckIds = function() {
            this.each(function() {
                if (this.id == "") {
                    window.idcounter++;
                    this.id = "g-gen-id-" + window.idcounter;
                };
            });
        };

        jQuery.fn.InjectSilverlight = function() {
            this.each(function() {

                var settings = {};

                settings.width = this.getAttribute("width");
                settings.height = this.getAttribute("height");
                settings.htmlid = this.id;
                settings.onerror = "onSilverlightError";
                settings.id = settings.htmlid + "-sl";

                InjectSilverlightTag(this, settings);

            });
        };
 
        if (Silverlight.isInstalled(null)) {
            var xamlBlocks = $(".xaml").length;
            var pythonBlocks = $("script[language=python]").length + $("script[type=text/python]").length + $("script[type=application/python]").length;
            var rubyBlocks = $("script[language=ruby]").length + $("script[type=text/ruby]").length + $("script[type=application/ruby]").length;
            var jsBlocks = $("script[language=javascript]").length + $("script[type=text/javascript]").length + $("script[type=application/javascript]").length;

            if (pythonBlocks == 0) {
                if (rubyBlocks == 0) {  // No language support
                    gestaltpath += "Gestalt-x.xap";
                }
                else {  // Ruby, but no Python
                    gestaltpath += "Gestalt-rb.xap";
                }
            }
            else {
                if (rubyBlocks == 0) { // Python, but no Ruby
                    gestaltpath += "Gestalt-py.xap";
                }
                else {  // both languages
                    gestaltpath += "Gestalt.xap";
                }
            }

            if (xamlBlocks > 0) {
                $(".xaml").CheckIds();
                $(".xaml").css("display", "none").InjectSilverlight();
            }
            else {
                if (rubyBlocks > 0 || pythonBlocks > 0 || jsBlocks > 0) {
                    // there are code blocks but no SL control; inject one so they can party on DOM
                    var last = get_lastchild(document.body);

                    var settings = {};
                    settings.width = 1;
                    settings.height = 1;
                    settings.id = "GestaltDOMOnly-sl";
                    settings.htmlid = "GestaltDOMOnly";

                    InjectSilverlightTag(last, settings);
                }
            }
        }

    })

};