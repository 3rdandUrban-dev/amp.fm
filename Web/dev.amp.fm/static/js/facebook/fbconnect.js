var sequencer = null;
var api = null;
var connect = null;
var Debug = null;
var match = null;
var friendList = null;
var commentCache =[];

function Facebook() {
}

Facebook = window.Facebook = window.$fb = window.fb = function (uid) {
    return new Facebook.core.init(uid);
};

Facebook.core = Facebook.prototype = {
    init: function () {
        if (! this._initialized) {
            FB_RequireFeatures([ "Api", "Connect", "CanvasUtil", "XFBML"], function () {
                FB.Facebook.init("ff3131a56d8a527481a450f25d800b29", "/xd_receiver.htm", {
                    "ifUserConnected": fb.onloginReady,
                    "ifUserNotConnected": fb.onloginNotReady
                });
            });
            this._initialized = true;
        }
    },
    _initialized: false,
};

Facebook.core.init.prototype = Facebook.core;

//Stolen directly from jQuery.fn.extend
Facebook.extend = Facebook.core.extend = function () {
    // copy reference to target object
    var target = arguments[0] || {
    },
    i = 1, length = arguments.length, deep = false, options, name, src, copy;
    
    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {
        };
        // skip the boolean and the target
        i = 2;
    }
    
    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && ! jQuery.isFunction(target)) {
        target = {
        };
    }
    
    // extend jQuery itself if only one argument is passed
    if (length === i) {
        target = this;-- i;
    }
    
    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];
                
                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                
                // Recurse if we're merging object values
                if (deep && copy && typeof copy === "object" && ! copy.nodeType) {
                    target[name] = jQuery.extend(deep,
                    // Never move original objects, clone them
                    src || (copy.length != null?[]: {
                    }), copy);
                    
                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
};

Facebook.extend({
    
    uid: null,
    
    username: null,
    
    profile_url: null,
    
    onloginReady: function (id) {
        fb.uid = id;
        fb._inituser(fb.updateLoginStatus);
    },
    
    onloginNotReady: function () {
        FB_RequireFeatures([ "CanvasClient"], function () {
            $("login-button").each(function (i) {
                var fbloginimage = '<img id="fb_login_image" src="http://static.ak.fbcdn.net/images/fbconnect/login-buttons/connect_light_medium_long.gif" alt="Connect"/>';
                $(this).replaceWith('<a href="#" onclick="FB.Connect.requireSession(); return false;">' + fbloginimage + '</a>');
            });
            $("share-button").each(function (i) {
                $(this).replaceWith("<fb:share-button class='url' href='" + $(this).attr('href') + "'>" + $(this).html() + "</fb:share-button>");
            });
        });
    },
    
    updateLoginStatus: function () {
        var logout = '<a href="/service/account/logout/" class="logout" rel="facebook">Disconnect?</a>';
        $("#facebook-login").html('<ul class="menu list TtoB" style="text-align:center"><small><li class="logged-in">Connected via</li><li class="logged-in"><a href="' + fb.profile_url + '">Facebook Connect</a> as <a href="/account">' + fb.username + '</a> | ' + logout + '</li></small></ul>');
        $("a.logout").click(function () {
            if (this.rel == 'facebook') {
                if (confirm("You are about to be logged out of both amp.fm and Facebook. Choose 'Ok' to continue or 'Cancel' to logout of just amp.fm and then be redirected to Facebook.")) {
                    FB.Connect.logoutAndRedirect(this.href);
                } else {
                    window.location = this.href;
                    window.location = "http://www.facebook.com/";
                }
            } else {
                window.location = this.href;
            }
            return false;
        });
    },
    
    _inituser: function (callback) {
        var query = "SELECT name, profile_url FROM user WHERE uid=" + fb.uid;
        facebook_fql_query(query, function (result, ex) {
            fb.username = result[0].name;
            fb.profile_url = result[0].profile_url;
            callback();
        });
    },
});

function facebook_fql_query(query, callback) {
    FB_RequireFeatures([ "Api"], function () {
        FB.Facebook.apiClient.fql_query(query, callback);
    });
}

function facebook_getFriends(uid) {
    var query = "SELECT uid, first_name, last_name FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = " + uid + ") order by first_name";
    facebook_fql_query(query, facebook_setFriendList);
}

function facebook_setFriendList(result, ex) {
    facebook_generateFriendList(result, facebook_updateFriendsContainer);
}

function facebook_updateFriendsContainer(data) {
    $("#friend-list").html(data);
}

function facebook_generateFriendList(friends, object) {
    cb = (typeof (object) == 'function')? facebook_generateFriendOrderedList: function (friendArray, object) {
        object = friendArray;
    };
    cb(friends, object);
}

function facebook_generateFriendOrderedList(friends, callback) {
    data = '<ol>';
    for (item in friends) {
        data += '<li><ol>';
        for (key in friends[item]) {
            data += "<li class=" + key + ">" + friends[item][key] + "</li>";
        }
        data += '</ol></li>';
    }
    data += '</ol>';
    callback(data);
}
