<?xml version="1.0" encoding="UTF-8"?>
<!--
  COPYRIGHT: (c) 2007, M. David Peterson (mailto:m.david@xmlhacker.com; http://mdavid.name/)
  LICENSE: The code contained in this file is licensed under The New BSD License. Please see
  http://www.opensource.org/licenses/bsd-license.php for specific detail.
-->
<xsl:stylesheet version="1.0" xmlns:html="http://www.w3.org/1999/xhtml"
        xmlns:doc="http://atomictalk.org/feed/doc" xmlns:app="http://purl.org/atom/app#"
        xmlns:atompub="http://www.w3.org/2007/app" xmlns:atom="http://www.w3.org/2005/Atom"
        xmlns:response="http://nuxleus.com/message/response"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:xCal="urn:ietf:params:xml:ns:xcal" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
        exclude-result-prefixes="html app atom doc atompub dc xCal geo">

    <xsl:param name="timespanLabel" select="'Today'"/>
    <xsl:param name="renderUserEvents" select="'false'"/>
    <xsl:param name="google-ad-mod-count" select="3"/>

    <xsl:variable name="event-doc" select="document('/service/event/return-events-by-user/')"/>

    <xsl:template match="/">
        <div class="inner-content">
            <!--<div id="forward-back" class="forward-back">
                <div class="scope-left not-implemented">
                    <a href="#">&#xAB; Yesterday</a>
                </div>
                <div class="scope-right not-implemented">
                    <a href="#">Tomorrow &#xBB;</a>
                </div>
            </div>-->
            <!--<div><img src="/static/images/amp.fm-logo.png" height="75px"/></div>-->

            <!--<div id="ampfm-graphic">
                <img src="/static/images/amp.fm-logo.png" width="100%"/>
            </div>-->
            <!--<div id="search-box" class="not-implemented opacity-85">
                <form id="search-form" method="get" action="/search" target="_top">
                    <input id="search-text" class="single-input" type="text" name="search"
                        maxlength="255" value="Get Plugged In..."
                        onclick="if (this.value == 'Get Plugged In...') this.value = ''; return true;"
                        onblur="if (this.value == '') this.value = 'Get Plugged In...'; return true;"/>
                    <button class="Button submit">
                        <span class="ButtonLabel">plug me in!</span>
                    </button>
                </form>
            </div>-->
            <!--<h3>Salt Lake City</h3>-->

            <!--<h1 class="view-nav">
        <xsl:value-of select="$timespanLabel"/>
        </h1>-->
            <!--<div id="sub-nav">
        <ul class="menu LtoR not-implemented" id="sub-menu">
          <li>
            <label>Sort By:</label>
          </li>
          <li id="newspaper-selector" class="selected">
            <a rel="history-view" href="#newspaper">Time of Day</a>
          </li>
          <li id="distance-selector" class="not-selected">
            <a rel="history-view" href="#distance">Distance</a>
          </li>
          <li id="artist-selector" class="not-selected">
            <a rel="history-view" href="#artist">Artist</a>
          </li>
          <li id="genre-selector" class="not-selected">
            <a rel="history-view" href="#genre">Genre</a>
          </li>
          <li id="venue-selector" class="not-selected">
            <a rel="history-view" href="#venue">Venue</a>
          </li>
          <li id="calendar-selector" class="not-selected">
            <a rel="history-view" href="#calendar">Custom...</a>
          </li>
        </ul>
      </div>-->

            <!--<h3 class="published-time">
        <xsl:value-of select="substring-before(/atom:feed/atom:published, 'T')"/>
        </h3>-->
            <!--<div id="create-event">
                <ul class="list menu RtoL">
                    <li id="create-event-selector" class="not-selected">
                        <a class="highlight-link" href="/event/create">create event</a>
                    </li>
                </ul>
            </div>-->
            <div id="center-content">
                <!--<div
                    style="padding:5px 5px 2px;margin:auto;">
                    <img style="border:0;margin:0;padding:0;" src="/images/amp.fm-get-plugged-in.png"/>
                </div>-->
                <!--<div class="google-ad">
          <iframe width="728" height="90" frameborder="0" marginheight="0" marginwidth="0"
            scrolling="no" src="/static/google-ads/leaderboard.html"/>
            </div>-->
                <xsl:if test="$renderUserEvents = 'true'">
                    <xsl:apply-templates select="$event-doc//response:event"/>
                </xsl:if>
                <xsl:apply-templates select="/atom:feed/atom:entry">
                    <xsl:sort select="xCal:dtstart"/>
                </xsl:apply-templates>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="response:event">
        

        <div class="event-container">
            <h4>
                <a href="{../atom:link[@rel = 'alternate']/@href}">
                    <xsl:value-of select="response:name"/>
                </a>
            </h4>
            <div class="xCal-venue-container">
                <div class="xCal-venue-adr">
                    <a href="#">
                        <div class="xCal-venue">
                            <xsl:value-of select="response:description"/>
                        </div>
                        <div class="xCal-venue">
                            <xsl:value-of select="response:startdate"/>
                        </div>
                        <div class="xCal-venue">
                            <xsl:value-of select="response:enddate"/>
                        </div>
                    </a>

                </div>
                <xsl:variable name="playlist-id" select="generate-id()"/>
                <div class="venue-artist-controllers" style="position:relative">
                    <div class="inline-playlist-controller">
                        <div>
                            <a class="myPlaylist" href="#{$playlist-id}">Related Playlist</a>
                        </div>
                        <div>
                            <a class="myPlaylist" href="#{$playlist-id}">Edit Event</a>
                        </div>
                        <div>
                            <a class="myPlaylist" href="#{$playlist-id}">Delete Event</a>
                        </div>

                        <div class="not-implemented">
                            <a href="#">Comment</a>
                        </div>
                    </div>

                    <div id="{$playlist-id}" class="playlist-container"></div>
                </div>
            </div>
        </div>

    </xsl:template>

    <xsl:template match="atom:entry">
        <xsl:variable name="position" select="position()"/>
        <xsl:apply-templates select="atom:title">
            <xsl:with-param name="position" select="$position"/>
        </xsl:apply-templates>
    </xsl:template>

    <xsl:template match="atom:title">
        <xsl:param name="position"/>
        <xsl:variable name="xCal-connect-venue" select="../xCal:x-calconnect-venue"/>
        <xsl:variable name="xCal-connect-venue-id"
                select="$xCal-connect-venue//xCal:x-calconnect-venue-id"/>
        <xsl:variable name="xCal-adr" select="$xCal-connect-venue//xCal:adr"/>
        <xsl:variable name="generate-venue-id" select="true()"/>
        <xsl:variable name="generated-venue-id">
            <xsl:choose>
                <xsl:when test="$generate-venue-id">
                    <xsl:value-of
                            select="concat(generate-id($xCal-connect-venue-id), '-', count(../preceding-sibling::atom:entry) + 1)" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>view-map</xsl:text>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="xCal-address"
                select="concat($xCal-adr//xCal:x-calconnect-city, ', ', $xCal-adr//xCal:x-calconnect-region, ' ', $xCal-adr//xCal:x-calconnect-postalcode)"/>
        <xsl:variable name="map-string"
                select="concat(../geo:lat,',',../geo:long,',','15',',','road',',','east', ',', $generate-venue-id, ',', $xCal-adr//xCal:x-calconnect-venue-name, ',', $xCal-adr//xCal:x-calconnect-street, ',', $xCal-address)"/>
        <div class="event-container">
            <h4>
                <a href="{../atom:link[@rel = 'alternate']/@href}">
                    <xsl:value-of select="."/>
                </a>
                <!--<a href="{$xCal-connect-venue-id}">
          <span style="color:#CC3300">@</span>
          <xsl:value-of select="$xCal-adr//xCal:x-calconnect-venue-name"/>
        </a>-->
            </h4>
            <div class="xCal-venue-container">
                <div class="xCal-venue-adr">
                    <xsl:if test="$generate-venue-id">
                        <xsl:attribute name="id">
                            <xsl:value-of select="concat($generated-venue-id, '-xCal-venue-adr')"/>
                        </xsl:attribute>
                    </xsl:if>
                    <a rel="{$map-string}" class="map-birdseye-view"
                            href="{concat('#', $generated-venue-id)}">
                        <div class="xCal-venue">
                            <!--<a href="{$xCal-connect-venue-id}">-->
                            <xsl:value-of select="$xCal-adr//xCal:x-calconnect-venue-name"/>
                            <!--</a>-->
                        </div>
                        <div class="xCal-venue">
                            <xsl:value-of select="$xCal-adr//xCal:x-calconnect-street"/>
                        </div>
                        <div class="xCal-venue">
                            <xsl:value-of select="$xCal-address"/>
                        </div>
                    </a>
                </div>
                <xsl:variable name="playlist-id" select="generate-id()"/>
                
                <div class="venue-artist-controllers" style="position:relative">
                    <div class="inline-playlist-controller">
                        <xsl:if test="$generate-venue-id">
                            <div>
                                <a rel="{$map-string}" class="map-birdseye-view"
                                        href="{concat('#', $generated-venue-id)}"
                                        title="{$xCal-adr//xCal:x-calconnect-venue-name}">Venue</a>
                            </div>
                        </xsl:if>
                        <div>
                            <a class="myPlaylist" href="#{$playlist-id}">Artist Playlist</a>
                        </div>
                        <!--<div class="not-implemented">
              <a href="#">Purchase Tickets</a>
            </div>-->
                        <!--<div class="not-implemented">
                            <a href="#">Add To Calendar</a>
                        </div>-->
                        <!--<div class="not-implemented">
              <a href="#">Add To Watchlist</a>
            </div>
            <div class="not-implemented">
              <a href="#">Who's Attending?</a>
            </div>-->
                        <div class="not-implemented">
                            <a class="myComment" href="#comment-{$playlist-id}">Comment</a>
                        </div>
                    </div>
                    <xsl:if test="$generate-venue-id">
                        <div  style="display:none;" id="{concat($generated-venue-id, '-container')}"
                            class="xCal-venue-map-container">
                            <div id="{concat($generated-venue-id, '-filter-container')}"
                                class="filter-container">
                                <div class="not-implemented">
                                    <a href="#" class="selected">Road</a>
                                </div>
                                <div class="not-implemented">
                                    <a href="#">Aerial</a>
                                </div>
                                <div class="not-implemented">
                                    <a href="#">Birds Eye</a>
                                </div>
                            </div>
                            <div id="{$generated-venue-id}" class="xCal-venue-map"/>
                        </div>
                    </xsl:if>
                    <div style="display:none;" id="comment-{$playlist-id}">
                        <iframe width="728" height="300" frameborder="0" marginheight="0"
                                marginwidth="0" scrolling="no" style="border:none;"/>
                    </div>
                    <div id="{$playlist-id}" class="playlist-container">
                        <!--<div class="filter-container">
              <div class="not-implemented">
                <a href="#">Filter 1</a>
              </div>
              <div class="not-implemented">
                <a href="#">Filter 2</a>
              </div>
              <div class="not-implemented">
                <a href="#">Filter 3</a>
              </div>
            </div>-->
                        <ul class="playlist">
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="01KidOnMyShoulders" class="mp3"
                                                href="/static/media/WhiteRabbits/01KidOnMyShoulders.mp3">Kid On My Shoulders</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="01KidOnMyShoulders-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="02ThePlot" class="mp3"
                                                href="/static/media/WhiteRabbits/02ThePlot.mp3">The
                                            Plot</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="02ThePlot-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="03DinnerParty" class="mp3"
                                                href="/static/media/WhiteRabbits/03DinnerParty.mp3">Dinner Party</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="03DinnerParty-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="04NavyWives" class="mp3"
                                                href="/static/media/WhiteRabbits/04NavyWives.mp3">While
                                            We Go Dancing</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="04NavyWives-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="05WhileWeGoDancing" class="mp3"
                                                href="/static/media/WhiteRabbits/05WhileWeGoDancing.mp3">While We Go Dancing</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="05WhileWeGoDancing-purchase" href="#">Buy Now3</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="06IUsedToComplainNowIDont" class="mp3"
                                                href="/static/media/WhiteRabbits/06IUsedToComplainNowIDont.mp3">I Used To Complain Now I Don't</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="06IUsedToComplainNowIDont-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="07TakeAWalkAroundTheTable" class="mp3"
                                                href="/static/media/WhiteRabbits/07TakeAWalkAroundTheTable.mp3">Take A Walk Around The Table</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="07TakeAWalkAroundTheTable-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="08MarchOfTheCamels" class="mp3"
                                                href="/static/media/WhiteRabbits/08MarchOfTheCamels.mp3">March of the Camels</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="08MarchOfTheCamels-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>

                                        <a id="09FortNightly" class="mp3"
                                                href="/static/media/WhiteRabbits/09FortNightly.mp3">Fort
                                            Nightly</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="09FortNightly-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="10Reprise" class="mp3"
                                                href="/static/media/WhiteRabbits/10Reprise.mp3">Reprise</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="10Reprise-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="list menu LtoR">
                                    <li>
                                        <a id="11TouristTrap" class="mp3"
                                                href="/static/media/WhiteRabbits/11TouristTrap.mp3">Tourist Trap</a>
                                    </li>
                                    <li class="buy-now">
                                        <a id="11TouristTrap-purchase" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <xsl:if test="$position mod $google-ad-mod-count = 0">
            <xsl:variable name="pos"
                    select="count(parent::atom:entry/preceding-sibling::atom:entry)"/>
            <ul class="list LtoR">
                <xsl:choose>
                    <xsl:when test="$pos mod 2 = 0">
                        <li class="google-ad">
                            <iframe width="728" height="90" frameborder="0" marginheight="0"
                                    marginwidth="0" scrolling="no" style="border:none;"
                                    src="/static/google-ads/leaderboard.html"/>
                        </li>
                        <li>
                            <!--<a
                href="http://www.amazon.com/gp/product/B001FA1O0E?ie=UTF8&amp;tag=xsltblogcom-20&amp;linkCode=as2&amp;camp=1789&amp;creative=9325&amp;creativeASIN=B001FA1O0E">
                <img border="0"
                  src="https://images-na.ssl-images-amazon.com/images/I/41KNABB9GRL._SL160_.jpg"/>
              </a>
              <img
                src="http://www.assoc-amazon.com/e/ir?t=xsltblogcom-20&amp;l=as2&amp;o=1&amp;a=B001FA1O0E"
                width="1" height="1" border="0" alt=""
                style="border:none !important; margin:0px !important;"/>-->
                            <iframe
                                    src="http://rcm.amazon.com/e/cm?t=xsltblogcom-20&amp;o=1&amp;p=8&amp;l=as1&amp;asins=B001FA1NZK&amp;fc1=000000&amp;IS2=1&amp;lt1=_blank&amp;m=amazon&amp;lc1=0000FF&amp;bc1=FFFFFF&amp;bg1=FFFFFF&amp;f=ifr"
                                    style="width:120px;height:240px;" scrolling="no" marginwidth="0"
                                    marginheight="0" frameborder="0"/>
                        </li>
                    </xsl:when>
                    <xsl:when test="$pos mod 3 = 0">
                        <li>
                            <iframe
                                    src="http://rcm.amazon.com/e/cm?t=xsltblogcom-20&amp;o=1&amp;p=48&amp;l=ur1&amp;category=electronics&amp;banner=1H12JWKJGH6B7A6WMY02&amp;f=ifr"
                                    width="728" height="90" scrolling="no" border="0" marginwidth="0"
                                    style="border:none;" frameborder="0"/>
                        </li>
                    </xsl:when>
                    <xsl:otherwise>
                        <li>
                            <iframe
                                    src="http://rcm.amazon.com/e/cm?t=xsltblogcom-20&amp;o=1&amp;p=20&amp;l=ur1&amp;category=mp3&amp;banner=1TBPBDZEMKKFFXCVTT82&amp;f=ifr"
                                    width="120" height="90" scrolling="no" border="0" marginwidth="0"
                                    style="border:none;" frameborder="0"/>
                        </li>
                        <li class="google-ad">
                            <iframe width="728" height="90" frameborder="0" marginheight="0"
                                    marginwidth="0" scrolling="no" style="border:none;"
                                    src="/static/google-ads/leaderboard.html"/>
                        </li>
                    </xsl:otherwise>
                </xsl:choose>
            </ul>
        </xsl:if>
    </xsl:template>

    <xsl:template
            match="atom:summary|atom:published|atom:updated|atom:generator|atom:id|atom:category|atom:source|atom:author"/>
    <xsl:template match="text()"/>
</xsl:stylesheet>
