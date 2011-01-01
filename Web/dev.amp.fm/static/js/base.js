DEBUG = false;
var commentCache =[];
var ajaxifyLinks = true;

$(document).ready(function () {

    soundManager.debugMode = DEBUG; // disable or enable debug output
    soundManager.debugID = "DEBUG";
    soundManager.url = '/static/js/swf/'; // path to directory containing SM2 SWF
    soundManager.useFastPolling = true;
    soundManager.useHighPerformance = true;
    soundManager.bufferTime = 1;
    soundManager.onload = function() {
      // soundManager.createSound() etc. may now be called
    }

    fb.core.init();
    
    $.ajaxSetup({
        timeout: 10,
        /* error: function() { alert('Request failed');} */
    });
    load_jQueryEvents();


    $.log(M_LOCATION);
    
    if (window.DEBUG) {
        $('#DEBUG').slideToggle('fast');
    }
    
    $.history.init(pageload);
    
    var myImages = [ '/images/amp.fm_record-logo.png'];
    for (var i = 0; i < myImages.length; i++) {
        var img = new Image();
        img.src = myImages;
    };
});

function load_jQueryEvents() {
    $("fan").each(function (i) {
            $(this).replaceWith("<fb:fan profile_id='" + $(this).attr('profile_id') + "' stream='" + $(this).attr('stream') + "'connections='" + $(this).attr('connections') + "'width='" + $(this).attr('width') + "' />");
    });
    
    $("button.change-location").click(function () {
        changeLocation(this);
        return false;
    });
    
    $("a.show-fb-friends").click(function () {
        facebook_getFriends(fb.uid);
        return false;
    });
    
    $("a.geo-location").click(function () {
        if(ajaxifyLinks) {
            $.history.load(this.href.replace(/^.*#/, ''));
            return false;
        } else {
            document.location = this.href.replace(/\/#/, '');
            return true;
        }
    });
    
    $("input.password").focus(function () {
        if ($(this).attr('type') == 'text') {
            $(this).replaceWith('<input type="password" class="password login" name="password" id="password" value=""/>').focus();
            //Safari seems to need an extra nudge to bring focus to the new password input element
            $('input.password').focus();
            /*$("input.password").blur(function () {
            if ($(this).attr('value') == undefined) {
            $(this).replaceWith('<input type="text" class="password" name="password" id="password" size="20" value="Password"/>');
            }
            });*/
        }
        return false;
    });

    $("input.login").focus(function () {
        if ($(this).attr('value') == 'Email') {
            $(this).attr('value', '').blur(function () {
                if ($(this).attr('value') == undefined) {
                    $(this).attr('value', 'Email');
                }
            });
        }
        return false;
    });
    
    $("input.search-text").focus(function () {
        if ($(this).attr('value') == 'Enter Genre, Artist, Tags, or Other Search Phrases') {
            $(this).attr('value', '').blur(function () {
                if ($(this).attr('value') == undefined) {
                    $(this).attr('value', 'Enter Genre, Artist, Tags, or Other Search Phrases');
                }
            });
        }
        return false;
    });
    
    $("a.fb_connect_operation").click(function () {
        FB.Connect[ this.rel]();
        return false;
    });
    
    $("a.fb_showPermissionDialog").click(function () {
        FB.Connect.showPermissionDialog(this.rel);
        return false;
    });
    
    $("a.rel='min-max'").click(function () {
        
        $('#quick-nav').slideToggle('slow');
        
        if (toggleWindowStatus == 'visible') {
            $(this).html("&#121;");
            toggleWindowStatus = "hidden";
        } else {
            $(this).html("&#120;");
            toggleWindowStatus = "visible";
        }
    });
    
    
//    $("a.rel='history-timespan'").click(function () {
//        $.log();
//        var hash = this.href;
//        var timespan = hash.replace(/^.*#/, '');
//        var view = $('#sub-menu > li.selected > a').attr('href').replace(/ ^. * # /, '');
//        var filters = (currentFilters != '')? '/filters:'.concat(currentFilters): '';
//        caller = timespan;
//        $.history.load('timespan:'.concat(timespan.concat('/view:'.concat(view.concat(filters)))));
//        return false;
//    });
//    
//    $("a.rel='history-view'").click(function () {
//        var hash = this.href;
//        var timespan = $('#timespan-menu > li.selected > a').attr('href').replace(/ ^. * # /, '');
//        var view = hash.replace(/^.*#/, '');
//        var filters = (currentFilters != '')? '/filters:'.concat(currentFilters): '';
//        caller = view;
//        $.history.load('timespan:'.concat(timespan.concat('/view:'.concat(view.concat(filters)))));
//        return false;
//    });
    
    $("a.render-content").click(function () {
        $(this.hash).empty();
        var hash = this.href;
        var timespan = this.id;
        var view = "list";
        var filters = (currentFilters != '')? '//filters:'.concat(currentFilters) : '';
        $.history.load('//location:'.concat(M_LOCATION).concat('//timespan:').concat(timespan).concat('//view:').concat(view).concat(filters));
        return false;
    });
    
    $("a.deleteEvent").click(function () {
        var hash = this.href;
        if (confirm('Are you sure you want to delete this event?')) {
            $.get('/service/event/delete/?eventid='.concat(this.rel));
            $(this.hash).slideUp('slow');
            $(this.hash).empty();
        }
        return false;
    });
    
//    $("a.quicknav").click(function () {
//        $.log();
//        var hash = this.href;
//        var current = hash.replace(/^.*#/, '');
//        var data_controller = this.rel.split(':');
//        $('#carousel-content').getTransform('/page/controller/'.concat(data_controller[1]).concat('.xsl'), data_controller[0].concat('.xml'), {
//            params: {
//                showModal: '1'
//            },
//            callback: function () {
//                $("a.map-birdseye-view").click(function () {
//                    var hash = this.href;
//                    var timespan = $('#timespan-menu > li.selected > a').attr('href').replace(/ ^. * # /, '');
//                    var view = 'map';
//                    var filters = (currentFilters != '')? '//'.concat(currentFilters): '';
//                    caller = view;
//                    var latLongDepth = this.rel.split(',');
//                    $.history.load('//timespan:'.concat(timespan.concat('//view:'.concat(view.concat('//location:'.concat(latLongDepth))))));
//                    loadMap(true, latLongDepth[0], latLongDepth[1], latLongDepth[2], latLongDepth[3], latLongDepth[4]);
//                    return false;
//                });
//            }
//        });
//        return false;
//    });
    
    $("a.rel='view'").click(function () {
        var hash = this.href;
        var current = hash.replace(/^.*#/, '');
        var currentViewSelected = $('#view-selector > li.selected > a').attr('href').replace(/^.*#/, '');
        document.getElementById(currentViewSelected.concat('-selector')).className = "not-selected";
        document.getElementById(current.concat('-selector')).className = "selected";
        
        $(this.hash).getTransform(
        '/test.xsl',
        '/test.xml', {
            params: {
                showModal: '1'
            }
        }).jqm({
            trigger: this.hash,
            autofire: true,
            focus: true
        }).jqmShow();
        return false;
    });
    
    $("a.rel='mapdispose'").click(function () {
        DisposeMap();
    });
    
    $('a.render-placeholder').click(function () {
        return false;
    });
    
    $("a.toggle-unimplemented-features").click(function () {
        $.log()
        $('.not-implemented').toggleClass('opacity-25');
        return false;
    });
    
    $("a.toggle-debug").click(function () {
        $.log()
        $('#DEBUG').toggleClass('opacity-85').toggle('fast');
        return false;
    });
    $("a.logout").click(function () {
        FB.Connect.logoutAndRedirect(this.href);
        return false;
    });
    
    $("a.facebook-login").click(function () {
        FB.Connect.requireSession();
        return false;
    });
    $("ul.playlist li").click(function () {
        $.log();
        var self = $(this).find("a");
        var id = this.id;
        var mp3playercontainerid = 'mp3-player-container-' + id;
        var progresscontainerid = 'progresscontainer-' + id;
        var progressbarid = 'progressbar-' + id;
        var playprogressbar = 'playprogressbar-' + id;
        var mp3timecontainerid = 'mp3-time-container-' + id;
        $('.mp3-player.playing').removeClass('playing').addClass('paused');
        var mySound = soundManager.getSoundById(id);
        
        if (mySound == null) {
            soundManager.pauseAll();
            self.replaceWith(
              "<div class='mp3-player finger-cursor' id='" + mp3playercontainerid + "'>"
                  +"<div class='mp3-player-state'>"
                      +"<div id='" + id + ('-mp3-time-position') + "' class='mp3-time-position finger-cursor opacity-50'>0</div>" 
                      +"<div class='progress-container finger-cursor' id='" + progresscontainerid + "'>"
                          +"<div class='loadingprogressbar opacity-35 finger-cursor' id='" + progressbarid + "'></div>"
                          +"<div class='playingprogressbar opacity-50 finger-cursor' id='" + playprogressbar + "'></div>"
                          +"<div class='mp3-time-container finger-cursor' id='" + mp3timecontainerid + "'>"
                              +"<div> of </div>"
                              +"<div id='" + id + '-mp3-time-total' + "' class='mp3-time-total finger-cursor'>(estimating)</div>" 
                              +"<div id='" + id + '-mp3-percent-complete' + "' class='mp3-percent-complete finger-cursor'>00</div>" 
                          +"</div>"
                          +"<div class='mp3-meta-data finger-cursor'>"
                              +"<div class='mp3-title finger-cursor'>Title: <span class='strong'>" + self.html() + "</span></div>"
                              +"<div class='mp3-album finger-cursor'>Album: <span class='strong'>" + "Rage Against The Machine" + "</span></div>" 
                          +"</div>"
                      +"</div>"
                  +"</div>"
              +"</div>"
              );
             $('#' + progressbarid).progressbar({
                value: 0
             });
             $('#' + playprogressbar).progressbar({
                value: 0
             });
             soundManager.createSound({
                id: id,
                url: self.attr("href"),
                whileloading: function() {
                        var total = parseInt((this.bytesLoaded / this.bytesTotal) * 100);
                        $('#' + id + '-mp3-percent-complete').html('<span>' + total + '% loaded</span>');
                        $('#' + progressbarid).progressbar('option', 'value', total);
                   },
                   whileplaying: function() { 
                        if(this.passes == undefined) this.passes = 0;
                        this.passes = this.passes + 1;
                        if(this.passes % 50 == 0) {
                         $('#' + id + '-mp3-time-total').html('~'.concat(parseInt(this.durationEstimate / 1000)));
                        } 
                        if(this.loaded) {
                         $('#' + id + '-mp3-time-total').html(parseInt(this.duration / 1000));
                        } 
                        $('#' + id + '-mp3-time-position').html(parseInt(this.position / 1000));
                        $('#' + playprogressbar).progressbar('option', 'value', parseInt((this.position / duration) * 100));
                   },
                   onid3: function() {
                       /*for( var prop in this.id3 ){
                       alert(prop + this.id3[prop]);
                    }*/   
                   }
            }).play();
            $('#' + mp3playercontainerid).addClass('playing');
        } else if (mySound.paused == true) {
            $.log("resuming ".concat(id));
            soundManager.pauseAll();
            $(this).find('.mp3-player').removeClass('paused').addClass('playing');
            mySound.resume();
        } else if (mySound.playState == 0) {
            $.log("playstate == 0 for ".concat(id));
            soundManager.pauseAll();
            $(this).find('.mp3-player').removeClass('paused').addClass('playing');
            mySound.play();
        } else if (mySound.playState == 1) {
            $.log("Pausing ".concat(id));
            mySound.pause();
            $(this).find('.mp3-player').removeClass('playing').addClass('paused');
            //mySound.unload();
        } else {
            $.log("Something isn't right for id ".concat(id));
        }
        
        return false;
    });
    
    $("a.myPlaylist").click(function () {
        $.log();
        var id = this.hash;
        toggleTabs(id, 'playlist');
        return false;
    });
    
    $("a.fb-share").click(function () {
        $.log();
        FB.Connect.showShareDialog('http://amp.fm/?' + this.rel, function () {
        });
        return false;
    });
    
    $("a.myComment").click(function () {
        $.log();
        id = this.hash;
        commentID = id + '-comment';
        xid = $(commentID).attr('id');
        if (commentCache[xid] == undefined) {
            $(commentID).html("<fb:comments xid='" + xid + "'></fb:comments>");
            FB.init("ff3131a56d8a527481a450f25d800b29", "/xd_receiver.htm");
            commentCache[xid] = 'initialized';
        }
        toggleTabs(id, 'comment');
        return false;
    });
    
    $('a.myCalendar').click(function () {
        $.log();
        $(this.hash).slideToggle('fast', switchBackground(this.hash, 'calendar'));
        return false;
    });
    
    $('a.map-view').click(function () {
        $.log();
        switch (this.rel) {
            case "road":
                map.SetMapStyle(VEMapStyle.Road);
                break;
            case "aerial":
                map.SetMapStyle(VEMapStyle.Aerial);
                break;
            case "hybrid":
                map.SetMapStyle(VEMapStyle.Hybrid);
                break;
            case "birdseye":
                map.SetMapStyle(VEMapStyle.Birdseye);
                break;
            case "shaded":
                map.SetMapStyle(VEMapStyle.Shaded);
                break;
            case "birdseye-hybrid":
                map.SetMapStyle(VEMapStyle.BirdseyeHybrid);
                break;
        }
        $('a.map-view.selected[@href=' + this.hash + ']').removeClass('selected');
        $(this).addClass('selected');
        return false;
    });
    
    $('input.findNearby_button').click(function() {
        try
        {
            map.Find($('#findNearby_text').val(), null);
        }
        catch(e)
        {
            alert(e.message);
        }
    });
    
    $("input.findNearby_text").focus(function () {
            $(this).attr('value', '').blur(function () {
                if ($(this).attr('value') == undefined) {
                    $(this).attr('value', 'Find Nearby Businesses');
                }
            });
        return false;
    });
    
    $("a.getDirections").click(function() {
        var myOptions = new VERouteOptions();
        //myOptions.SetBestMapView = false;
        // Don't change map view
        myOptions.RouteCallback = onGotRoute;
        
        /*$('#view-map').getTransform(
            '/page/controller/atomictalk/base.xsl',
            '/index.page', {
                params: {
                    showModal: '1'
                }
            }).jqm({
                trigger: '#view-map',
                autofire: true,
                focus: true,
                overlay: 1
            }).jqmShow();
            */
            
            $('#view-map').jqm({
                autofire: true,
                focus: true,
                overlay: 0
            }).jqmShow();
        var newMap = new VEMap("modal-map");
        var location = map.GetCenter();
        
        newMap.LoadMap(location, 15, VEMapStyle.Hybrid, false, VEMapMode.Mode2D, true, 1);
        newMap.HideDashboard();
        //map.ShowMiniMap(rightPixel, 10, VEMiniMapSize.Small);
        $('#MSVE_minimap').css("z-index", "50");
        $('#MSVE_minimap.expanded.MSVE_smallMinimap #MSVE_minimap_resize').remove();
        // Gets VERoute
        newMap.GetDirections(["201 E. South Temple, Salt Lake City", location], myOptions);
        return false;
    });
    
    $("a.closeModal").click(function () {
        $('#view-map').css('display', 'none');
    });
    
    $("a.deleteEvent").click(function () {
        var hash = this.href;
        renderContent('#'.concat(hash.replace(/ ^. * # /, '')), 'atomictalk:'.concat('event/delete/?eventid='.concat(this.rel)));
        return false;
    });
    
    $("a.toggle-unimplemented-features").click(function () {
        $.log()
        $('.not-implemented').toggleClass('opacity-25');
        return false;
    });

    $("a.map-birdseye-view").click(function () {
        var hash = this.href;
        $.log();
        var timespan = $('#timespan-menu > li.selected > a').attr('href').replace(/^.*#/, '');
        var view = 'map';
        var filters = (currentFilters != '') ? currentFilters: "'".concat(M_LAT).concat(',').concat(M_LONG).concat(',').concat(M_DEPTH).concat(',').concat(M_TYPE).concat("'");
        currentFilters = filters;
        var latLongDepth = this.rel.split(',');
        $.log(latLongDepth[3]);
        
        if (latLongDepth[5] == 'false') {
            $(this.hash).getTransform(
            '/test.xsl',
            '/test.xml', {
                params: {
                    showModal: '1'
                }
            }).jqm({
                trigger: this.hash,
                autofire: true,
                focus: true,
                overlay: 1
            }).jqmShow();
            try {
                loadMap(hash.replace(/^.*#/, '') + '-map', true, latLongDepth[0], latLongDepth[1], latLongDepth[2], latLongDepth[3], latLongDepth[4], latLongDepth[6], latLongDepth[7].concat('<br/>').concat(latLongDepth[8]).concat(latLongDepth[9]));
            }
            catch (e) {
                $.log('loadMap(): ' + e);
            }
        } else {
            var id = this.hash;
            toggleTabs(id, 'map', function () {
                if (map != null) {
                    map.Dispose();
                    map = null;
                }
                e = id.replace(/^.*#/, '') + '-inner-map';
                try {
                    loadMap(e, true, latLongDepth[0], latLongDepth[1], latLongDepth[2], $('a.map-view.selected[@href=#' + e + ']').attr('rel'), latLongDepth[4], latLongDepth[6], latLongDepth[7].concat('<br/>').concat(latLongDepth[8]).concat(latLongDepth[9]));
                }
                catch (e) {
                    $.log('loadMap(): ' + e);
                }
            });
        }
        return false;
    });
}

var historyInitialized = false;
var currentCall = '';

function pageload(hash) {
    $.log();
    var currentQuery = '';
    try {
        currentTimeSpanSelected = "today";
        currentViewSelected = "list";
        var winLoc = window.location.href;
        hashTest = /[#]/;
        var profileTest = new RegExp("profile");
        var location = (hash) ? hash : (hashTest.test(winLoc)) ? winLoc.replace(/^.*#/, '') : '';
        var view = null;
        var timespan = 'today';
        var viewspan = 'newspaper';
        var geolocation = '';
        var filters = '';
        if (location != '') {
            view = outputVars(location);
            geolocation = (view["location"] != '') ? view["location"] : M_LOCATION;
            timespan = (view["timespan"] != undefined) ? view["timespan"] : "today";
            viewspan = (view["view"] != undefined) ? view["view"] : "list";
            filters = (view["filters"] != undefined) ? view["filters"] : '';
            $.log(timespan);
            $.log(viewspan);
            $.log(geolocation);
            $.log(filters);
            currentFilters = filters;
        }
        currentQuery = 'atomictalk:'.concat(generateQueryString(geolocation, '%7C', getScopeSearchLabel(timespan), 'atom').concat(':Today'));
        if (currentCall != currentQuery && !profileTest.test(winLoc)) {
            
            updateContent(timespan, viewspan, filters, currentTimeSpanSelected, currentViewSelected);
            renderContent('#event-listing-container', currentQuery);
            currentCall = currentQuery;
        } else {
            return false;
        }
    }
    catch (e) {
        $.log(e);
    }
    return true;
}

function changeLocation(el){
    $(el).replaceWith(
        "<div id='change-location' style='position:relative;'>"
            +'<div id="change-location-container" style="display:none">'
                +'<form id="update-location" method="GET" action="/service/search" target="_top">'
                    +"<input id='change-location-text'"
                    +"class='single-input search-text' type='text' name='search'"
                    +"maxlength='255' style='position:relative;width:200px;margin-top:1px;padding:1px;border:1px solid #999;margin-right:2px;'/>"
                    +'<button type="submit" id="change-location-button" class="Button submit change-location" style="margin-top:2px;">'
                        +'<span class="ButtonLabel">change</span>'
                    +'</button>'
                +'</form>'
            +'</div>'
            +'<div class="toolTipWrapper opacity-75">'
        		+'<div class="toolTipTop"/>'
        		+'<div class="toolTipBody four-rounded-corners">'
                    +'<div class="toolTipMessage">Enter Zip Code or City</div>'
        		+'</div>'
        	+'</div>'
		+'</div>'
    );
    
    $("#update-location, #change-location-button").submit(function(){
        var currentQuery = 'atomictalk:'.concat(generateQueryString($('#change-location-text').val(), '%7C', getScopeSearchLabel('today'), 'atom').concat(':Today'));
        renderContent('#event-listing-container', currentQuery);
        changeBack($('#change-location-text'));
        return false;
    });
    
    if ($.browser.mozilla) {
        $("#change-location-text").keypress (checkForEnter);
    } else {
        $("#change-location-text").keydown (checkForEnter);
    }
    
    $('#change-location-container').fadeIn(300);
    $("#change-location-text").focus();
    

    $("#change-location-text").blur(function () {
        if ($(this).val() == 'Enter Zip Code or City' || $(this).val() == '') {
            changeBack(this);
        }
        else {
            var currentQuery = 'atomictalk:'.concat(generateQueryString($('#change-location-text').val(), '%7C', getScopeSearchLabel('today'), 'atom').concat(':Today'));
            renderContent('#event-listing-container', currentQuery);
            changeBack(this);
        }
        return false;
    });
    $("#change-location-text").focus(function () {
        if ($(this).attr('value') == 'Enter Zip Code or City') {
            $(this).attr('value', '').blur(function () {
                changeBack(this);
            });
        }
        return false;
    });
    
    return false;
}

function changeBack(el){
   $('#change-location-container').fadeOut(300);
   $('#change-location').replaceWith(
       '<button type="submit" id="change-location-button" class="Button submit change-location" style="margin-top:2px;">'
           +'<span class="ButtonLabel">change location</span>'
       +'</button>'
   );
   $("#change-location-button").click(function () {
       changeLocation(this);
       return false;
   });
   return false;
}

function checkForEnter (event) {
  if (event.keyCode == 13) {
    var currentQuery = 'atomictalk:'.concat(generateQueryString($(this).val(), '%7C', getScopeSearchLabel('today'), 'atom').concat(':Today'));
    renderContent('#event-listing-container', currentQuery);
  } 
}

function generateQueryString(location, topic, timescope, format) {
    return 'search/return-events-by-location/?location='.concat(location).concat('&topic='.concat(topic).concat('%7C&time_scope='.concat(timescope).concat('&format='.concat(format))))
}

var scopeSearchLabel =[];
scopeSearchLabel[ 'today'] = 'today';
scopeSearchLabel[ 'next-3-days'] = 'this_weekend';
scopeSearchLabel[ 'week'] = 'next_7_days';
scopeSearchLabel[ 'weekend'] = 'next_weekend';
scopeSearchLabel[ 'month'] = 'next_30_days';

function getScopeSearchLabel(timespan) {
    return scopeSearchLabel[timespan];
}

var currentCaller = '';
var currentTimeSpanCaller = '';
var currentFilters = '';
var currentTimeSpanScope = '';
var caller = undefined;

function updateContent(timespan, view, filters, currentTimeSpanSelected, currentViewSelected) {
    $.log();
    //$('#'.concat(currentTimeSpanSelected.concat('-container'))).css('display', 'none');
    $('#'.concat(timespan.concat('-container'))).css('display', 'block');
    $('#timespan-menu > li.selected').attr('class', 'not-selected');
    $('#'.concat(timespan.concat('-selector'))).attr('class', 'selected');
}

function renderContent(hash, data) {
    var data_controller = data.split(':');
    $('#loading').slideDown(function () {
        try {
            $(hash).getTransform(
            '/page/controller/'.concat(data_controller[0]).concat('/base.xsl'),
            '/service/'.concat(data_controller[1]), {
                params: {
                    timespanLabel: data_controller[2], renderUserEvents: 'true'
                },
                callback: function () {
                    load_jQueryEvents();
                }
            });
        }
        catch (e) {
            $.log(e.toString());
        }
    }).slideUp('slow');
    return false;
}



function onGotRoute(route)
         {
           // Unroll route
           var legs     = route.RouteLegs;
           var turns    = "<ul class='list menu TtoB'>";
           var numTurns = 0;
           var leg      = null;
            
            turns += '<li><h3>Directions</h3></li>';
            turns += "<li>Total distance: " + route.Distance.toFixed(1) + " mi</li>";
           // Get intermediate legs
            for(var i = 0; i < legs.length; i++)
            {
               // Get this leg so we don't have to derefernce multiple times
               leg = legs[i];  // Leg is a VERouteLeg object
                  
               // Unroll each intermediate leg
               var turn = null;  // The itinerary leg
                  
               for(var j = 0; j < leg.Itinerary.Items.length; j ++)
               {
                  turn = leg.Itinerary.Items[j];  // turn is a VERouteItineraryItem object
                  numTurns++;
                  turns += '<li>' + numTurns + ": " + turn.Text + " (" + turn.Distance.toFixed(1) + " mi)</li>";
               }
               
            }
            turns += '</ul>';
            $('#modal-map-directions').html(turns);
         }

var currentCache =[];
var currentControllerCache =[];

function toggleTabs(id, anchor, callback) {
    var currentController = currentCache[ 'currentID'];
    var currentAnchor = currentCache[ 'anchor'];
    var hash = id + anchor;
    var currentHash = currentController + currentAnchor;
    currentCache[ 'currentID'] = id;
    currentCache[ 'anchor'] = anchor;
    
    if (currentAnchor != undefined && currentController != undefined && currentCache[currentHash] == 'active') {
        $(currentController + '-' + currentAnchor).slideToggle('fast', function () {
            switchBackground(currentController, currentAnchor);
            currentCache[currentHash] = 'inactive';
        });
    }
    if (currentCache[hash] != 'active') {
        $(id + '-' + anchor).slideToggle('fast', function () {
            switchBackground(id, anchor);
            currentCache[hash] = 'active';
            if (callback != undefined) {
                callback();
            }
        });
    }
}

function switchBackground(id, anchor) {
    var eventContainer = id + '-event-container';
    var venueMapController = id + '-xCal-venue-adr';
    var venueController = id + '-venue-controller';
    var anchorController = id + '-' + anchor + '-anchor';
    var currentIDController = currentControllerCache[venueController];
    var currentIDControllerActive = (currentIDController == 'active');
    var eventContainerBackgroundColor = (currentIDControllerActive) ? '#FFF': '#FFF';
    var backgroundColor = (currentIDControllerActive) ? 'transparent': '#FFF';
    var borderColor = (currentIDControllerActive) ? '#CCC': '#CCC';
    var anchorBackgroundColor = (currentIDControllerActive) ? 'transparent': '#336699';
    var venueMapBackgroundColor = (currentIDControllerActive) ? '#FFF': '#EEE';
    var venueMapAnchorColor = (currentIDControllerActive) ? '#336699': '#003366';
    var anchorColor = (currentIDControllerActive)? '#336699': '#FFF';
    $(venueController).css({
        'background-color': backgroundColor,
        'border-top-color': borderColor,
        'border-bottom-color': borderColor,
    });
    $(id).css({
        'border-top-color': borderColor,
    });
    $(anchorController).css({
        'background-color': anchorBackgroundColor,
    });
    
    if (anchor == 'map') {
        $(eventContainer).css({
            'background-color': eventContainerBackgroundColor,
        });
        $(venueMapController).css({
            'background-color': venueMapBackgroundColor,
        }).hover(function () {
            $(this).css({
                'background-color': '#EEE'
            });
            $(venueMapController + ' .xCal-venue').css({
                'color': '#003366'
            });
        },
        function () {
            $(this).css({
                'background-color': venueMapBackgroundColor,
            });
            $(venueMapController + ' .xCal-venue').css({
                'color': venueMapAnchorColor,
            });
        });
        
        $(venueMapController + ' .xCal-venue').css({
            'color': venueMapAnchorColor,
        });
    }
    $(anchorController + ' > a').css({
        'color': anchorColor,
        /*'border-top-color': borderColor,
        'border-bottom-color': borderColor,*/
    });
    currentControllerCache[venueController] = (currentIDControllerActive)? 'inactive' : 'active';
}

function transformToModal(xml, xslt) {
    $('#xslt').getTransform(
    xslt,
    xml, {
        params: {
            showModal: '1'
        }
    }).jqm({
        trigger: '#xslt',
        autofire: true,
        focus: true
    }).jqmShow();
    return false;
}

function transformEventXmlAsync(xslt, eventSource, url) {
    var processor = new XSLTProcessor();
    var req = new XMLHttpRequest();
    req.open('GET', xslt, true);
    req.overrideMimeType('text/xml');
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                processor.importStylesheet(req.responseXML);
                var nreq = new XMLHttpRequest();
                nreq.open('GET', url, true);
                nreq.onreadystatechange = function (aEvt) {
                    if (nreq.readyState == 4) {
                        if (nreq.status == 200) {
                            var transformResult = processor.transformToDocument(nreq.responseXML);
                            eventSource.loadXML(transformResult, url);
                            return transformResult;
                        } else {
                            alert("Error loading page\n");
                        }
                    }
                };
                nreq.send(null);
                return false;
            } else {
                alert("Error loading page\n");
                return false;
            }
        }
    };
    req.send(null);
}

var serializer = new XMLSerializer();


function transform_EvalJS(xslt, xml, func) {
    var processor = new XSLTProcessor();
    var req = new XMLHttpRequest();
    req.open('GET', xslt, true);
    req.overrideMimeType('text/xml');
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                processor.importStylesheet(req.responseXML);
                var nreq = new XMLHttpRequest();
                nreq.open('GET', xml, true);
                nreq.onreadystatechange = function (aEvt) {
                    if (nreq.readyState == 4) {
                        if (nreq.status == 200) {
                            var transformResult = processor.transformToDocument(nreq.responseXML);
                            $.log($('script', transformResult).text());
                            eval($('script', transformResult).text());
                            func.call(transformResult);
                        } else {
                            alert("Error loading page\n");
                        }
                    }
                };
                nreq.send(null);
                return false;
            } else {
                alert("Error loading page\n");
                return false;
            }
        }
    };
    req.send(null);
}

function loadEventXmlAsync(eventSource, url) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.overrideMimeType('text/xml');
    req.onreadystatechange = function (evt) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                eventSource.loadXML(req.responseXML, url);
            } else {
                $.log("Error loading page\n");
                return false;
            }
        }
    };
    
    req.send(null);
}

var resizeTimerID = null;
function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function () {
            resizeTimerID = null;
            tl.layout();
        },
        500);
    }
}

var currentQuickViewFrame = 'timeline';
var currentQuickViewCaller = 'timeline-selector';
function updateQuickViewFrame(caller, elementId) {
    document.getElementById(currentQuickViewFrame).style.display = "none";
    document.getElementById(elementId).style.display = "block";
    document.getElementById(currentQuickViewCaller).className = "not-selected";
    document.getElementById(caller).className = "selected";
    currentQuickViewCaller = caller;
    currentQuickViewFrame = elementId;
    loadQuickView();
}

function getDirections() {
    var myOptions = new VERouteOptions();
    myOptions.SetBestMapView = false;
    // Don't change map view
    myOptions.RouteCallback = myRouteHandler;
    // Gets VERoute
    map.GetDirections("201 E. South Temple, 84111", new VELatLong(40.7596, -111.9024, 0, VEAltitudeMode.RelativeToGround), myOptions);
}

function PixelClick(e) {
    var x = e.mapX;
    var y = e.mapY;
    pixel = new VEPixel(x, y);
    var LL = map.PixelToLatLong(pixel);
    var log = "Pixel X: " + x + " | Pixel Y: " + y + " LatLong: " + LL;
    $.log(log);
}

var SCRIPTISLOADED = true;
var MAPISLOADED = false;

var map;

function loadMap(elementID, setMapAsLoaded, lat, long, depth, style, orientation, pinTitle, pinDescription) {
    $.log();
    if (SCRIPTISLOADED) {
        if (map == null) {
            map = new VEMap(elementID);
        }
        m_loadMap(map, lat, long, depth, style, orientation, pinTitle, pinDescription);
    } else {
        
        //transform_EvalJS('/page/controller/javascript-eval.xsl', '/js/mapcontrol.js.xml', function(){
        //  SCRIPTISLOADED = true;
        //  $.log("Script loaded... Loading Map.");
        //  map = this;
        //  m_loadMap(map, lat, long, depth, style, orientation);
        //});
        
        $.getScript("http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx", function () {
            SCRIPTISLOADED = true;
            $.log("Script loaded... Loading Map.");
            map = new VEMap(elementID);
            m_loadMap(map, lat, long, depth, style, orientation, pinTitle, pinDescription);
        });
    }
    $.log(orientation);
}

function m_loadMap(map, lat, long, depth, style, orientation, pinTitle, pinDescription) {
    onLoadMap = mapLoadingComplete;
    var veMapStyle;
    $.log();
    switch (style) {
        case 'aerial':
        veMapStyle = VEMapStyle.Aerial;
        break;
        case 'birdseye':
        veMapStyle = VEMapStyle.Birdseye;
        break;
        case 'birdseye-hybrid':
        veMapStyle = VEMapStyle.BirdseyeHybrid;
        break;
        case 'hybrid':
        veMapStyle = VEMapStyle.Hybrid;
        break;
        case 'road':
        default:
        veMapStyle = VEMapStyle.Road;
        break;
    }
    var location = new VELatLong(lat, long);
    if (orientation) {
        map.LoadMap(location, depth, veMapStyle, false, VEMapMode.Mode2D, true, 1);
        //setBirdsEyeOrientation(map,location,depth,orientation);
    } else {
        map.LoadMap(location, depth, veMapStyle, false, VEMapMode.Mode2D, true, 1);
    }
    map.AttachEvent("onclick", PixelClick);
    //map.ShowFindControl();
    var rightPixel = $("#map-container").width() - 160;
    map.HideDashboard();
    //map.ShowMiniMap(rightPixel, 10, VEMiniMapSize.Small);
    $('#MSVE_minimap').css("z-index", "50");
    $('#MSVE_minimap.expanded.MSVE_smallMinimap #MSVE_minimap_resize').remove();
    AddPin(pinTitle, pinDescription);
}

var currentMapContainerID = null;

function DisposeMap(mapContainerID) {
    if (currentMapContainerID != null && currentMapContainerID != mapContainerID) {
        $(currentMapContainerID).hide();
        if (map != null) {
            map.Dispose();
            map = null;
        }
    }
    currentMapContainerID = mapContainerID;
}
function birdsEyeMapComplete() {
    //MAPISLOADED = setMapAsLoaded;
    $.log();
}
function mapLoadingComplete() {
    MAPISLOADED = true;
    $.log();
}

function setBirdsEyeOrientation(map, latLong, zoom, orientation) {
    $.log();
    switch (orientation) {
        case 'north':
        $.log("Setting orientation to the North");
        map.SetBirdseyeScene(latLong, VEOrientation.North, zoom, birdsEyeMapComplete);
        break;
        case 'south':
        $.log("Setting orientation to the South");
        map.SetBirdseyeScene(latLong, VEOrientation.South, zoom, birdsEyeMapComplete);
        break;
        case 'east':
        $.log("Setting orientation to the East");
        map.SetBirdseyeScene(latLong, VEOrientation.East, zoom, birdsEyeMapComplete);
        break;
        default:
        $.log("Setting orientation to the West");
        map.SetBirdseyeScene(latLong, VEOrientation.West, zoom, birdsEyeMapComplete);
        break;
    }
}

function goToVenueInBirdsEyeView(lat, long, depth, orientation) {
    
    var mapDepth;
    if (depth == undefined) {
        mapDepth;
    }
    loadMap(true, lat, long, depth, 'birdseye', orientation);
    AddPin();
}

function _loadMapHistory(hash, rel) {
    $.log();
    var timespan = $('#timespan-menu > li.selected > a').attr('href').replace(/^.*#/, '');
    var view = 'map';
    var filters = (currentFilters != '') ? currentFilters: (rel == undefined) ? '@@lat-long@@,hybrid': rel;
    currentFilters = filters;
    var latLongDepth = this.filters.split(',');
    $.history.load('//timespan:'.concat(timespan.concat('//view:'.concat(view.concat('//filters:'.concat(filters))))));
    $.log(latLongDepth[3]);
    loadMap(true, latLongDepth[0], latLongDepth[1], latLongDepth[2], latLongDepth[3], latLongDepth[4]);
    return false;
}
var index = 0;
var results = null;

function FindLoc(numResults) {
    try {
        results = map.Find(document.getElementById('search-text').value,
        '@@location@@',
        null,
        null,
        index,
        numResults,
        true,
        true,
        true,
        true,
        MoreResults);
        index = parseInt(index) + 9;
        //map.SetMapStyle(VEMapStyle.Aerial);
        //map.SetZoomLevel(17);
    }
    catch (e) {
        alert(e.message);
    }
}

var QUICKVIEWISLOADED = false;

function loadQuickView() {
    if (! QUICKVIEWISLOADED) {
        $.getScript("@@static@@/js/carousel.js", function () {
            loadCarousel();
            QUICKVIEWISLOADED = true;
        });
    } else {
        return;
    }
}


function updateContentFrame(caller) {
    document.getElementById((currentCaller != '')? currentCaller.concat('-container'): 'today-container').style.display = "none";
    document.getElementById(caller.concat('-container')).style.display = "block";
    document.getElementById((currentCaller != '')? currentCaller.concat('-selector'): 'today-selector').className = "not-selected";
    document.getElementById(caller.concat('-selector')).className = "selected";
    if (currentCaller == '') {
        currentCaller = 'today';
    } else {
        currentCaller = caller;
    }
}

function updateViewFrame(caller) {
    document.getElementById((currentTimeSpanCaller != '')? currentTimeSpanCaller.concat('-container'): 'today-container').style.display = "none";
    document.getElementById(caller.concat('-container')).style.display = "block";
    document.getElementById((currentTimeSpanCaller != '')? currentTimeSpanCaller.concat('-selector'): 'today-selector').className = "not-selected";
    document.getElementById(caller.concat('-selector')).className = "selected";
    if (currentTimeSpanCaller == '') {
        currentTimeSpanCaller = 'newspaper';
    } else {
        currentTimeSpanCaller = caller;
    }
}


var toggleWindowStatus = "hidden";
var toggleCurrentTab = "timeline";

//function onToggle(id) {
//    if (toggleWindowStatus == 'visible') {
//        if (toggleCurrentTab == id) {
//            $('#quick-nav').slideToggle('slow');
//            toggleWindowStatus = "hidden";
//        }
//        else {
//            toggleCurrentTab = id;
//        }
//    }
//    else {
//        if (toggleCurrentTab != id) {
//            toggleCurrentTab = id;
//        }
//        $('#quick-nav').slideToggle('slow');
//        toggleWindowStatus = "visible";
//    }
//}

var status = 'visible';

function AddPin(title, description) {
    $.log();
    pinPoint = map.GetCenter();
    pinPixel = map.LatLongToPixel(pinPoint);
    var pin = map.AddPushpin(pinPoint);
    pin.SetTitle(title);
    pin.SetDescription(description);
}

var xmlFeeds = new Array();
var xmlURLList = new Array();
xmlURLList[0] = new Array("today", "/service/search/return-events-by-location/?location=salt+lake+city&amp;topic=%7C&amp;time_scope=today&amp;format=atom");

function loadXMLFeed(feedID) {
    var inMemory = false;
    var xmlFeedLength = xmlFeeds.length;
    var i;
    for (i = 0; i < xmlFeedLength; i++) {
        if (xmlFeeds[i][0] == feedID) {
            inMemory = true;
            $.log('Atom feed is cached');
            $.log($(xmlFeeds[i][1]).text());
            return xmlFeeds[i][1];
        }
    }
    if (! inMemory) {
        for (i = 0; i < xmlURLList.length; i++) {
            if (xmlURLList[i][0] == feedID) {
                var tempDoc = loadAtomFeed(feedID, xmlURLList[i][1]);
                $.log($(tempDoc).text());
                xmlFeeds[xmlFeedLength] = new Array(feedID, tempDoc);
                $.log('Atom feed is not cached');
                return tempDoc;
            }
        }
    }
    $.log('There was an error');
    return false;
}

function loadAtomFeed(feedID, xml) {
    $.log(xml);
    var nreq = new XMLHttpRequest();
    nreq.open('GET', xml, true);
    nreq.send(null);
    
    $.log($(nreq.responseXML).text());
    return nreq.responseXML;
    
    /*nreq.onreadystatechange = function(aEvt) {
    if (nreq.readyState == 4) {
    if (nreq.status == 200) {
    //var transformResult = processor.transformToDocument(nreq.responseXML);
    $.log($(nreq.responseXML).text());
    
    xmlFeeds[xmlFeedLength] = new Array(feedID, nreq.responseXML);
    //$.log($('script', transformResult).text());
    eval($('script', transformResult).text());
    func.call(transformResult);
    return nreq.responseXML;
    } else {
    $.log("Error loading page\n");
    }
    }
    };
    nreq.send(null);
    return nreq.responseXML;*/
}