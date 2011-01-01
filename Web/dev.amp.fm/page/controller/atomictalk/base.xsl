<?xml version="1.0" encoding="UTF-8"?>
<!--
  COPYRIGHT: (c) 2007, M. David Peterson (mailto:m.david@xmlhacker.com; http://mdavid.name/)
  LICENSE: The code contained in this file is licensed under The New BSD License. Please see
  http://www.opensource.org/licenses/bsd-license.php for specific detail.
  Contributors to this code base include: 
      Russ Miles (mailto:aohacker@gmail.com; http://www.russmiles.com/)
      Sylvain Hellegourach (mailto:sylvain@defuze.org; http://www.defuze.org/)
      Eric Larson (mailto:eric@ionrock.org; http://www.ionrock.org/)
      Jacob Joaquin (mailto:jacob.joaquin@gmail.com; http://www.thumbuki.com/)
-->
<xsl:stylesheet version="1.0" xmlns:html="http://www.w3.org/1999/xhtml"
  xmlns:fb="http://www.facebook.com/2008/fbml" xmlns:at="http://atomictalk.org/2009/AtomicTalk#"
  xmlns:pledge="http://4lessig.org/pledge" xmlns:debug="http://nuxleus.com/session/debug"
  xmlns:request="http://nuxleus.com/session/request"
  xmlns:response="http://nuxleus.com/message/response" xmlns:session="http://atomictalk.org/session"
  xmlns:geo="http://nuxleus.com/geo" xmlns:my="http://xameleon.org/my"
  xmlns:page="http://atomictalk.org/page" xmlns:doc="http://atomictalk.org/feed/doc"
  xmlns:service="http://atomictalk.org/page/service"
  xmlns:output="http://atomictalk.org/page/output"
  xmlns:head="http://atomictalk.org/page/output/head"
  xmlns:body="http://atomictalk.org/page/output/body"
  xmlns:advice="http://atomictalk.org/page/advice" xmlns:view="http://atomictalk.org/page/view"
  xmlns:layout="http://atomictalk.org/page/view/layout"
  xmlns:form="http://atomictalk.org/page/view/form"
  xmlns:menu="http://atomictalk.org/page/view/menu" xmlns:exsl="http://exslt.org/common"
  xmlns:resource="http://atomictalk.org/page/resource"
  xmlns:model="http://atomictalk.org/page/model" xmlns:app="http://purl.org/atom/app#"
  xmlns:atompub="http://www.w3.org/2007/app" xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt"
  xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xCal="urn:ietf:params:xml:ns:xcal"
  xmlns:geo2="http://www.w3.org/2003/01/geo/wgs84_pos#"
  exclude-result-prefixes="html exsl my app response advice atom head page service resource output form body view menu model msxsl doc atompub geo2 xCal dc">

  <xsl:param name="closure-token-pre-delimiter" select="'|@@'"/>
  <xsl:param name="closure-token-post-delimiter" select="'@@|'"/>
  <xsl:param name="replace-token-pre-delimiter" select="'@@'"/>
  <xsl:param name="replace-token-post-delimiter" select="'@@'"/>
  <xsl:param name="cond-token-pre-delimiter" select="'|$$'"/>
  <xsl:param name="cond-token-post-delimiter" select="'$$|'"/>
  <xsl:param name="cond-if-token" select="'test:'"/>
  <xsl:param name="cond-then-token" select="'IfTrue:'"/>
  <xsl:param name="cond-else-token" select="'IfFalse:'"/>
  <xsl:param name="system-variable-pre-delimiter" select="'%%'"/>
  <xsl:param name="system-variable-post-delimiter" select="'%%'"/>
  <xsl:param name="parameter-list-pre-delimiter" select="'($'"/>
  <xsl:param name="parameter-list-post-delimiter" select="'$)'"/>
  <xsl:param name="parameter-pre-delimiter" select="':'"/>
  <xsl:param name="parameter-post-delimiter" select="':'"/>
  <xsl:param name="replace-parameter-list-pre-delimiter" select="'[$'"/>
  <xsl:param name="replace-parameter-list-post-delimiter" select="'$]'"/>
  <xsl:param name="replace-parameter-pre-delimiter" select="':'"/>
  <xsl:param name="replace-parameter-post-delimiter" select="':'"/>
  <xsl:param name="parameter-list-delimeter" select="','"/>
  <xsl:param name="parameter-value-assigment-token" select="'='"/>

  <xsl:param name="timespanLabel" select="'Today'"/>
  <xsl:param name="renderUserEvents" select="'true'"/>
  <xsl:param name="google-ad-mod-count" select="3"/>

  <xsl:param name="session-info" select="document('/service/session/')/response:message"/>

  <xsl:variable name="request-id" select="$session-info/@id"/>
  <xsl:variable name="request-date" select="$session-info/@date"/>
  <xsl:variable name="request-time" select="$session-info/@time"/>
  <xsl:variable name="session-id" select="$session-info/response:session/@id"/>
  <xsl:variable name="user-id" select="$session-info/response:session/response:userid"/>
  <xsl:variable name="session-name" select="$session-info/response:session/response:name"/>
  <xsl:variable name="session-username" select="$session-info/response:session/response:username"/>
  <xsl:variable name="session-validated"
    select="$session-info/response:session/response:uservalidated"/>
  <xsl:variable name="preferences" select="$session-info/response:session/response:preferences"/>
  <xsl:variable name="location" select="$preferences/response:location"/>
  <xsl:variable name="geo-ip" select="$session-info/response:geo"/>
  <xsl:variable name="ip" select="$geo-ip/response:ip"/>
  <xsl:variable name="city" select="$geo-ip/response:city"/>
  <xsl:variable name="region" select="$geo-ip/response:region"/>
  <xsl:variable name="country" select="$geo-ip/response:country"/>
  <xsl:variable name="lat" select="$geo-ip/response:lat"/>
  <xsl:variable name="long" select="$geo-ip/response:long"/>

  <xsl:variable name="vendor" select="system-property('xsl:vendor')"/>
  <xsl:variable name="vendor-uri" select="system-property('xsl:vendor-uri')"/>
  <xsl:variable name="page" select="/my:session/my:page"/>
  <xsl:variable name="servicedoc" select="document($page/at:servicedoc/@src)"/>
  <xsl:variable name="config" select="$page/page:config"/>
  <xsl:variable name="browser" select="$config/page:browser[@vendor = $vendor]/@replace"/>
  <xsl:variable name="advice" select="$config/page:advice"/>
  <xsl:variable name="resource"
    select="document($page/page:resource/@src)/page:config|$page/page:resource"/>
  <xsl:variable name="service"
    select="document($page/page:service/@src)/page:config|$page/page:service"/>
  <xsl:variable name="view" select="document($page/page:view/@src)/page:config|$page/page:view"/>
  <xsl:variable name="navigation" select="$session-info/response:navigation"/>

  <xsl:variable name="lb">
    <xsl:text>
</xsl:text>
  </xsl:variable>
  <xsl:variable name="quote">"</xsl:variable>
  <xsl:variable name="squote">'</xsl:variable>
  <xsl:variable name="uppercase">abcdefghijklmnopqrstuvwxyz</xsl:variable>
  <xsl:variable name="lowercase">ABCDEFGHIJKLMNOPQRSTUVWXYZ</xsl:variable>
  
  <xsl:strip-space elements="*"/>

  <xsl:output cdata-section-elements="script"
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" method="html" indent="no"/>

  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="my:session">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="my:page">
    <xsl:apply-templates select="page:output"/>
  </xsl:template>

  <xsl:template match="page:output">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <xsl:apply-templates select="$page.output.head"/>
      <xsl:copy-of select="$page.output.body"/>
    </html>
  </xsl:template>

  <xsl:template match="page:head">
    <head>
      <xsl:apply-templates select="head:title"/>
      <xsl:apply-templates select="head:meta"/>
      <meta http-equiv="Content-Type" content="application/xhtml+xml;"/>
      <xsl:apply-templates select="head:link"/>
      <style type="text/css">
        <xsl:apply-templates select="head:include[@fileType = 'css']"/>
      </style>
      <script type="text/javascript">
        <xsl:text>//&lt;![CDATA[</xsl:text>
                var M_LOCATION =<xsl:value-of select="concat($quote, $city, $quote, ';')"/>
                var M_LAT =<xsl:value-of select="concat($quote, $lat, $quote, ';')"/>
                var M_LONG =<xsl:value-of select="concat($quote, $long, $quote, ';')"/>
                var M_DEPTH = "9";
                var M_TYPE = "road";<xsl:text>//]]&gt;</xsl:text>
      </script>
      <xsl:apply-templates select="head:include[@fileType = 'javascript']"/>
    </head>
  </xsl:template>

  <xsl:template match="page:body">
    <body>
      <xsl:apply-templates select="body:onload|body:onresize|body:onunload"/>
      <div id="friends"/>
      <xsl:apply-templates select="body:layout"/>
      <script src="http://static.ak.connect.facebook.com/js/api_lib/v0.4/FeatureLoader.js.php" type="text/javascript"/>
      <script src="/static/js/facebook/fbconnect.js" type="text/javascript"/>
      <div id="FB_HiddenContainer"
        style="position:absolute; top:-10000px; left:-10000px; width:0px; height:0px;"/>
    </body>
  </xsl:template>

  <xsl:template match="doc:nav">
    <xsl:apply-templates select="$navigation//response:path/*" mode="navigation"/>
  </xsl:template>

  <xsl:template match="response:*" mode="navigation">
    <li>
      <a href="{.}">
        <xsl:value-of select="local-name()"/>
      </a>
    </li>
  </xsl:template>

  <xsl:template match="body:onload|body:onresize|body:onunload">
    <xsl:attribute name="{local-name()}">
      <xsl:call-template name="replace">
        <xsl:with-param name="string" select="@action"/>
      </xsl:call-template>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="head:meta">
    <meta>
      <xsl:apply-templates select="@*"/>
    </meta>
  </xsl:template>

  <xsl:template match="head:include[@fileType = 'css']">
    <xsl:variable name="uri">
      <xsl:call-template name="resolve-uri">
        <xsl:with-param name="href" select="@href"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:value-of select="concat('@import ', $quote, $uri, $quote, ';')"/>
  </xsl:template>

  <xsl:template
    match="head:include[@fileType = 'javascript' and not(@src)]|view:script[@type = 'javascript' and not(@src)]">
    <script type="text/javascript">
      <xsl:text>//&lt;![CDATA[</xsl:text>
      <xsl:call-template name="replace">
        <xsl:with-param name="string" select="text()"/>
      </xsl:call-template>
      <xsl:text>//]]&gt;</xsl:text>
    </script>
  </xsl:template>

  <xsl:template
    match="head:include[@fileType = 'javascript' and @src]|view:script[@type = 'javascript' and @src]">
    <xsl:variable name="uri">
      <xsl:call-template name="resolve-uri">
        <xsl:with-param name="href" select="@src"/>
      </xsl:call-template>
    </xsl:variable>
    <script type="text/javascript" src="{$uri}">
      <xsl:comment>/* hack to ensure browser compatibility */</xsl:comment>
    </script>
  </xsl:template>

  <xsl:template name="resolve-uri">
    <xsl:param name="href"/>
    <xsl:call-template name="replace">
      <xsl:with-param name="string" select="translate($href, ' ', '')"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="advice:*[@compare = 'xsl:vendor']">
    <xsl:value-of select="current()[@compare-with = $vendor]/text()"/>
  </xsl:template>

  <xsl:template match="advice:*">
    <xsl:copy-of select="."/>
  </xsl:template>

  <xsl:template match="head:title">
    <title>
      <xsl:apply-templates/>
    </title>
  </xsl:template>

  <xsl:template match="head:link">
    <link>
      <xsl:apply-templates select="@*"/>
    </link>
  </xsl:template>

  <xsl:template match="body:layout">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="atom:feed">
    <div id="center-content">
      <xsl:if test="$renderUserEvents = 'true'">
        <xsl:apply-templates
          select="document('/service/event/return-events-by-user/')//response:event"/>
      </xsl:if>
      <xsl:apply-templates select="atom:entry"/>
    </div>
  </xsl:template>

  <xsl:template match="layout:view">
    <ul class="list {@style}" id="{@id}">
      <xsl:apply-templates/>
    </ul>
  </xsl:template>

  <xsl:template match="session:name">
    <xsl:variable name="name">
      <xsl:choose>
        <xsl:when test="$session-name != 'not-set'">
          <xsl:value-of select="$session-name"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:text>amp.fm visitor</xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:value-of select="$name"/>
  </xsl:template>

  <xsl:template match="doc:location-nav">
    <xsl:for-each select="$location/*">
      <li>
        <xsl:variable name="uri">
          <xsl:for-each select="preceding-sibling::*">
            <xsl:value-of select="concat('/', translate(translate(., ' ', '_'), $lowercase, $uppercase))"/>
          </xsl:for-each>
        </xsl:variable>
        <a class="geo-location" href="{concat('/#/location:', $uri, '/', translate(translate(., ' ', '_'), $lowercase, $uppercase))}">
          <xsl:value-of select="."/>
        </a>
      </li>
    </xsl:for-each>
  </xsl:template>

  <xsl:template match="geo:location">
    <xsl:value-of select="$city"/>
  </xsl:template>

  <xsl:template match="geo:location">
    <xsl:value-of select="$city"/>
  </xsl:template>

  <xsl:template match="geo:country">
    <xsl:value-of select="$country"/>
  </xsl:template>

  <xsl:template match="geo:lat">
    <xsl:value-of select="$lat"/>
  </xsl:template>

  <xsl:template match="geo:long">
    <xsl:value-of select="$long"/>
  </xsl:template>

  <xsl:template match="session:id">
    <xsl:value-of select="$session-id"/>
  </xsl:template>

  <xsl:template match="session:request-id">
    <xsl:value-of select="$request-id"/>
  </xsl:template>

  <xsl:template match="session:request-date">
    <xsl:value-of select="$request-date"/>
  </xsl:template>

  <xsl:template match="session:request-time">
    <xsl:value-of select="$request-time"/>
  </xsl:template>

  <xsl:template match="geo:ip">
    <xsl:value-of select="$ip"/>
  </xsl:template>

  <xsl:template match="doc:local-news"/>

  <xsl:template match="doc:local-flickr-photos"/>

  <xsl:template match="doc:local-blog-entries"/>

  <xsl:template match="*" mode="blogs">
    <xsl:apply-templates mode="blogs"/>
  </xsl:template>

  <xsl:template match="atom:title" mode="blogs">
    <h2>
      <a href="{../atom:link[@rel = 'alternate']/@href}">
        <xsl:value-of select="."/>
      </a>
    </h2>
  </xsl:template>

  <xsl:template match="atom:content" mode="blogs">
    <p>
      <xsl:value-of select="."/>
    </p>
  </xsl:template>

  <xsl:template match="atom:link|atom:author" mode="blogs"/>

  <xsl:template match="*" mode="flickr">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="*" mode="message">
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="doc:blog-summary">
    <h3>No new blog entries</h3>
  </xsl:template>
  <xsl:template match="doc:messages-summary">
    <h3 style="text-align:center">No new messages</h3>
  </xsl:template>
  <xsl:template match="doc:summary">
    <div id="{@id}"/>
    <!--<div class="summary-container">
            <div class="foo-container">
                <h4> </h4>
                <div class="filter-container"> </div>
            </div>
        </div>-->
    <!--<xsl:variable name="translated-city" select="translate($city, ' ', '&#32;')"/>-->

    <!--<div id="forward-back" class="forward-back">
            <div class="scope-left not-implemented">
                <a href="#">&#xAB; Yesterday</a>
            </div>
            <div class="scope-right not-implemented">
                <a href="#">Tomorrow &#xBB;</a>
            </div>
        </div>-->
  </xsl:template>

  <xsl:template match="doc:event">
    <div id="myEvents">
      <xsl:apply-templates
        select="document('/service/event/return-events-by-user/')//response:event"/>
    </div>
  </xsl:template>

  <xsl:template match="doc:media-files">
    <xsl:apply-templates
      select="document('/service/media/return-media-files-by-user/')//response:MediaFile"/>
  </xsl:template>

  <xsl:template match="doc:media-collections">
    <xsl:apply-templates
      select="document('/service/collection/return-collections-by-user/')//response:MediaCollection"
    />
  </xsl:template>

  <xsl:template match="response:MediaCollection">
    <xsl:variable name="collection-name" select="response:CollectionName"/>
    <xsl:variable name="collection-id" select="response:ItemName"/>
    <div class="event-container">
      <h2>
        <xsl:value-of select="$collection-name"/>
      </h2>
      <div class="add-new-file">
        <form name="file-upload" id="file-upload" method="post"
          action="/service/media/create/service.op" enctype="multipart/form-data">
          <input type="hidden" name="return-url" id="return-url" value="/account/media-manager/"/>
          <input type="hidden" name="collection-name" id="collection-name"
            value="{$collection-name}"/>
          <input type="hidden" name="collection-id" id="collection-id" value="{$collection-id}"/>
          <fieldset>
            <legend>
              <h3> Upload a new media file to the <xsl:value-of select="$collection-name"/>
                collection </h3>
            </legend>
            <table id="events">
              <!--<tr>
                <td style="vertical-align:top;">Media File Name:</td>
                <td>
                  <input type="text" name="name" id="name" size="50"/>
                </td>
              </tr>
              <tr>
                <td style="vertical-align:top;">Description:</td>
                <td>
                  <input type="text" name="description" id="description" size="50"/>
                </td>
              </tr>
              <tr>
                <td style="vertical-align:top;">Tags:</td>
                <td>
                  <input type="text" name="tags" id="tags" size="50"/>
                </td>
              </tr>-->
              <tr>
                <td style="vertical-align:top;">File Location:</td>
                <td>
                  <input type="file" name="mediafile" id="mediafile" size="50"/>
                </td>
                <td>
                  <input type="submit" style="width:75px" value="Upload"/>
                </td>
              </tr>
            </table>
          </fieldset>
        </form>
      </div>
      <xsl:apply-templates
        select="document(concat('/service/media/return-media-files-by-user/?media-collection=', $collection-id))//response:MediaFile"
      />
    </div>
  </xsl:template>

  <xsl:template match="response:MediaFile">
    <xsl:variable name="uri" select="response:uri"/>
    <div class="event-container">
      <h4>
        <!--<a href="{../atom:link[@rel = 'alternate']/@href}">-->
        <a href="{$uri}">
          <div class="xCal-venue">
            <xsl:value-of select="$uri"/>
          </div>
        </a>
      </h4>
      <div class="xCal-venue-container">
        <div class="xCal-venue-adr">
          <a href="#">
            <!--<div class="xCal-venue">
              <xsl:value-of select="response:description"/>
            </div>-->
            <!--<div class="xCal-venue">
              <xsl:value-of select="response:uri"/>
            </div>-->
            <!--<div class="xCal-venue">
              <xsl:value-of select="response:tags"/>
            </div>--></a>
        </div>
        <xsl:variable name="playlist-id" select="generate-id()"/>
        <div class="venue-artist-controllers" style="position:relative">
          <div class="inline-playlist-controller">
            <!--<div>
              <a class="myPlaylist" href="#{$playlist-id}">
                Related Media
                Collection
              </a>
            </div>-->
            <div>
              <a class="myPlaylist" href="#{$playlist-id}">Edit Metadata</a>
            </div>
            <div>
              <a class="myPlaylist" href="#{$playlist-id}">Delete File</a>
            </div>
          </div>

          <div id="{$playlist-id}" class="playlist-container"/>
        </div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="response:event">

    <xsl:variable name="playlist-id" select="generate-id()"/>
    <div id="{$playlist-id}">
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

          <div class="venue-artist-controllers" style="position:relative">
            <div class="inline-playlist-controller">
              <div>
                <a class="myPlaylist" href="#{$playlist-id}">Related Playlist</a>
              </div>
              <div>
                <a class="myPlaylist" href="#{$playlist-id}">Edit Event</a>
              </div>
              <div>
                <a class="deleteEvent" rel="{response:eventid}" href="#{$playlist-id}">Delete
                  Event</a>
              </div>

              <div class="not-implemented">
                <a href="#">Comment</a>
              </div>
            </div>

            <div id="{$playlist-id}" class="playlist-container"/>
          </div>
        </div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="*" mode="event-listing">
    <xsl:variable name="name" select="local-name(.)"/>
    <tr>
      <td style="vertical-align:top;align-text:left">
        <xsl:value-of select="$name"/>: </td>
      <td>
        <input type="text" name="{$name}" id="{$name}" value="{.}" size="50"/>
      </td>
    </tr>
  </xsl:template>
  <xsl:template match="doc:search-box">
    <div id="search-box">
      <div style="z-index:999;">
        <form id="search-form" method="get" action="/search/" target="_top" class="opacity-95">
          <input id="search-text" class="single-input search-text" type="text" name="search"
            maxlength="255" value="Enter Genre, Artist, Tags, or Other Search Phrases"/>
          <!--<input id="submit-search" type="submit" value="plug me in!"/>-->
          <button class="Button submit search">
            <span class="ButtonLabel">plug me in!</span>
          </button>
        </form>
      </div>
    </div>
  </xsl:template>
  <xsl:template match="doc:search">
    <xsl:variable name="query">
      <xsl:call-template name="replace">
        <xsl:with-param name="string" select="@query"/>
      </xsl:call-template>
    </xsl:variable>
    <script type="text/javascript">
      <xsl:text>M_LOCATION = '</xsl:text><xsl:value-of select="$query"/><xsl:text>';</xsl:text>
    </script>
    <!-- <xsl:variable name="href" select="concat('/service/search/return-events-by-location/?location=', translate($query, ' ', '&#32;'), '&amp;topic=%7C&amp;time_scope=today&amp;format=atom')"/>
        <xsl:variable name="atom-doc" select="document($href)"/>
        <xsl:apply-templates select="$atom-doc//atom:entry">
            <xsl:sort select="xCal:dtstart"/>
            <xsl:with-param name="articleCount" select="@articleCount"/>
            <xsl:with-param name="pos" select="position()"/>
            <xsl:with-param name="cCount" select="@characterCount"/>
            <xsl:with-param name="displayRank" select="@displayRank"/>
        </xsl:apply-templates> -->
  </xsl:template>

  <xsl:template match="doc:feed">
    <xsl:variable name="href">
      <xsl:call-template name="replace">
        <xsl:with-param name="string" select="@href"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="atom-doc" select="document($href)"/>
    <!--<h3>
            <xsl:value-of select="substring-before($atom-doc//atom:feed/atom:published, 'T')"/>
            </h3>-->
    <xsl:apply-templates select="$atom-doc//atom:entry">
      <xsl:sort select="xCal:dtstart"/>
      <xsl:with-param name="articleCount" select="@articleCount"/>
      <xsl:with-param name="pos" select="position()"/>
      <xsl:with-param name="cCount" select="@characterCount"/>
      <xsl:with-param name="displayRank" select="@displayRank"/>
    </xsl:apply-templates>
  </xsl:template>

  <xsl:template match="doc:profile">
    <xsl:variable name="doc">
      <xsl:call-template name="replace">
        <xsl:with-param name="string" select="@src"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:apply-templates select="document($doc)/profile/*" mode="profile"/>
  </xsl:template>

  <xsl:template match="username|openid" mode="profile">
    <h2>
      <xsl:value-of select="."/>
    </h2>
  </xsl:template>

  <xsl:template match="doc:location">
    <xsl:call-template name="replace">
      <xsl:with-param name="string" select="@value"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="doc:date">
    <xsl:value-of select="document('/date.xml')/date/current"/>
  </xsl:template>

  <xsl:template match="doc:login">
    <xsl:choose>
      <xsl:when test="$session-validated = 'false' or $session-validated = 'not-set'">
        <li id="{@id}" class="{@style}">
          <form id="login-form" method="POST" action="/service/account/login/" target="_top">
            <input type="hidden" name="return_url" id="return_url" value="/profile"/>
            <ul id="login-container" class="menu list TtoB">
              <!--<li>
                <label for="username" class="selected">
                  <a href="#login" class="login" rel="amp.fm">Email</a>
                </label>
                <label for="openid-login">
                  <a href="#login" class="login" rel="openid">OpenID</a>
                </label>
                <label for="facebook-connect">
                  <a href="#login" class="login" rel="facebook-connect">Facebook Connect</a>
                </label>
                </li>-->
              <li style="text-align:left;">
                <ul id="login-options" class="menu list LtoR">
                  <li style="margin-right:5px">
                    <a href="/profile/settings/password/reset">
                      <span style="font-size:x-small;color:#2F2A23">Forgot Password?</span>
                    </a>
                  </li>
                  <li>
                    <a class="highlight-link no-hover-background" href="/profile/create">
                      <span style="font-size:x-small;color:#2F2A23">Create Account</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li id="login-text">
                <table id="login-table">
                  <tr>
                    <td>
                      <input type="text" class="login" name="email" id="email" value="Email"/>
                    </td>
                    <td>
                      <input type="text" class="password login" name="password" id="password"
                        value="Password"/>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align:left">
                      <input id="remember-login" name="remember-login" value="1" type="checkbox"/>
                      <span style="font-size:xx-small">Remember me?</span>
                    </td>
                    <td style="text-align:right;">
                      <input type="submit" value="Login"/>
                    </td>
                  </tr>
                </table>
              </li>


              <!-- <li id="facebook-login" style="text-align:center;">
                <a href="#" class="facebook-login no-hover-background">
                  <img id="fb_login_image"
                    src="http://static.ak.fbcdn.net/images/fbconnect/login-buttons/connect_light_medium_long.gif"
                    alt="Connect"/>
                </a>
              </li> -->
            </ul>
          </form>
        </li>
      </xsl:when>
      <xsl:otherwise>
        <li id="{@id}" class="{@style}">
          <span style="color:#3F3F3F;margin-right:5px;"> Hi, <a class="session profile"
              href="/profile">
              <xsl:value-of select="$session-name"/>
            </a>
          </span>
          <span style="color:#3F3F3F;margin-right:5px;">|</span>
          <a class="session" href="/service/account/logout" title="Connected as {$session-name}"
            >logout</a>
        </li>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="doc:html[@type = 'myspace-events']">
    <xsl:apply-templates select="document(@href)//html:div[@id = current()/@id]"/>
  </xsl:template>

  <xsl:template match="doc:html[@type = 'external-html']">
    <xsl:apply-templates select="document(@href)//body:html"/>
  </xsl:template>

  <xsl:template match="page:content[@src]">
    <xsl:apply-templates select="document(@src)"/>
  </xsl:template>

  <xsl:template match="page:content">
    <xsl:copy-of select="*"/>
  </xsl:template>

  <xsl:template match="page:view">
    <ul>
      <xsl:apply-templates/>
    </ul>
  </xsl:template>

  <xsl:template match="view:container">
    <ul class="list {@style}" id="{@id}">
      <xsl:apply-templates/>
    </ul>
  </xsl:template>

  <xsl:template match="view:item[@src]">
    <li class="list {@style}" id="{@id}">
      <xsl:apply-templates select="document(@src)/view:*"/>
    </li>
  </xsl:template>

  <xsl:template match="view:item[not(@src)]">
    <li class="list menu {@style}" id="{@id}">
      <xsl:apply-templates/>
    </li>
  </xsl:template>

  <xsl:template match="view:menu[@src]">
    <ul class="list menu {@style}" id="{@id}">
      <xsl:apply-templates select="document(@src)/view:menu"/>
    </ul>
  </xsl:template>

  <xsl:template match="view:menu[not(@src)]">
    <ul class="list menu {@style}" id="{@id}">
      <xsl:apply-templates/>
    </ul>
  </xsl:template>

  <xsl:template match="view:module[@src]">
    <li class="list {@style}" id="{@id}">
      <xsl:apply-templates select="document(@src)/view:module/*"/>
    </li>
  </xsl:template>

  <xsl:template match="view:module[not(@src)]">
    <li class="list {@style}" id="{@id}">
      <xsl:apply-templates/>
    </li>
  </xsl:template>

  <xsl:template match="view:menu">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="page:heading">
    <xsl:element name="{@size}">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="*">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates select="@*"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="@*">
    <xsl:attribute name="{local-name()}">
      <xsl:call-template name="replace">
        <xsl:with-param name="string" select="."/>
      </xsl:call-template>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="text()">
    <xsl:call-template name="replace">
      <xsl:with-param name="string" select="."/>
    </xsl:call-template>
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
            select="concat(generate-id($xCal-connect-venue-id), '-', count(../preceding-sibling::atom:entry) + 1)"
          />
        </xsl:when>
        <xsl:otherwise>
          <xsl:text>view-map</xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="xCal-address"
      select="concat($xCal-adr//xCal:x-calconnect-city, ', ', $xCal-adr//xCal:x-calconnect-region, ' ', $xCal-adr//xCal:x-calconnect-postalcode)"/>
    <xsl:variable name="map-string"
      select="concat(../geo2:lat,',',../geo2:long,',','15',',','road',',','east', ',', $generate-venue-id, ',', $xCal-adr//xCal:x-calconnect-venue-name, ',', $xCal-adr//xCal:x-calconnect-street, ',', $xCal-address)"/>
    <xsl:variable name="playlist-id" select="generate-id()"/>
    <div id="{concat($generated-venue-id, '-event-container')}" class="event-container">
      <!-- <div class="transparent-background"/> -->
      <div class="xCal-event-title">
        <h4>
          <a href="{../atom:link[@rel = 'alternate']/@href}">
            <xsl:value-of select="."/>
          </a>
          <!--<a href="{$xCal-connect-venue-id}">
          <span style="color:#CC3300">@</span>
          <xsl:value-of select="$xCal-adr//xCal:x-calconnect-venue-name"/>
        </a>-->
        </h4>
      </div>
      <div class="xCal-venue-container">
        <div class="xCal-venue-adr">
          <xsl:if test="$generate-venue-id">
            <xsl:attribute name="id">
              <xsl:value-of select="concat($generated-venue-id, '-xCal-venue-adr')"/>
            </xsl:attribute>
          </xsl:if>
          <a rel="{$map-string}" class="map-birdseye-view" href="{concat('#', $generated-venue-id)}">
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
      </div>
      <div id="{$generated-venue-id}-venue-controller" class="venue-artist-controllers"
        style="position:relative">
        <div class="inline-playlist-controller">
          <xsl:if test="$generate-venue-id">
            <div id="{$generated-venue-id}-map-anchor">
              <a rel="{$map-string}" class="map-birdseye-view" href="#{$generated-venue-id}"
                title="{$xCal-adr//xCal:x-calconnect-venue-name}"> Venue </a>
            </div>
          </xsl:if>
          <div id="{$generated-venue-id}-playlist-anchor">
            <a class="myPlaylist" href="#{$generated-venue-id}" title="{translate(., $squote, '')}"
              >Related Playlist</a>
          </div>

          <!--<div class="not-implemented">
              <a href="#">Purchase Tickets</a>
            </div>-->
          <!--<div class="not-implemented">
              <a class="myCalendar" href="#calendar-{$playlist-id}"> Add To Calendar </a>
            </div>-->
          <!--<div class="not-implemented">
              <a href="#">Add To Watchlist</a>
            </div>
            <div class="not-implemented">
              <a href="#">Who's Attending?</a>
            </div>-->
          <div id="{$generated-venue-id}-comment-anchor">
            <a class="myComment" href="#{$generated-venue-id}">Comment</a>
          </div>
          <div>
            <a href="{$generated-venue-id}" class="fb-share" rel="{$generated-venue-id}">Share <img
                src="http://static.ak.fbcdn.net/images/share/facebook_share_icon.gif"/>
            </a>
          </div>
          <!--<div>
            <div class="addthis_toolbox addthis_default_style">
              <a href="http://www.addthis.com/bookmark.php?v=250&amp;pub=xa-4a4d48fb07716cd5"
                class="addthis_button_compact">Share</a>
              <a class="addthis_button_facebook"/>
              <a class="addthis_button_myspace"/>
              <a class="addthis_button_google"/>
              <a class="addthis_button_twitter"/>
            </div>
            <script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js?pub=xa-4a4d48fb07716cd5"/>
          </div>-->
        </div>
        <xsl:if test="$generate-venue-id">
          <div style="display:none;" id="{$generated-venue-id}-map" class="xCal-venue-map-container">
            <div id="{$generated-venue-id}-inner-map" class="xCal-venue-map"/>
            <div id="{concat($generated-venue-id, '-filter-container')}" class="filter-container opacity-90">
              <div class="not-implemented">
                <a href="#{$generated-venue-id}-inner-map" class="selected map-view" rel="road"
                  >Road</a>
              </div>
              <div class="not-implemented">
                <a href="#{$generated-venue-id}-inner-map" rel="hybrid" class="map-view">Aerial</a>
              </div>
              <div class="not-implemented">
                <a href="#{$generated-venue-id}-inner-map" rel="birdseye-hybrid" class="map-view"
                  >BirdsEye</a>
              </div>
              <div class="not-implemented">
                <a href="#{$generated-venue-id}-inner-map" class="getDirections">Get Directions</a>
              </div>
              <div id="findNearby">
                <input style="width:175px;border:1px solid #3B5998;padding:3px" id="findNearby_text"
                  class="findNearby_text" type="text" name="findNearby_text"
                  value="Find Nearby Businesses"/>
                <input id="find" type="button" value="Find" name="find" class="findNearby_button"/>
              </div>
            </div>
          </div>
        </xsl:if>
        <div style="display:none;" id="{$generated-venue-id}-calendar">
          <h3>Please login to add this event to your calendar</h3>
        </div>
        <div style="display:none;height:auto" id="{$generated-venue-id}-comment"/>
        <div id="{$generated-venue-id}-playlist" class="playlist-container">

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

          <div style="position:relative;left:0;top:0;display:inline;">
            <ul class="playlist list menu TtoB finger-cursor">
              <li id="01KidOnMyShoulders">
                <a name="01KidOnMyShoulders" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/01%20Bombtrack.mp3"
                  >Bomb Track</a>
              </li>
              <li id="02ThePlot">
                <a name="02ThePlot" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage Against the Machine/02%20Killing%20in%20the%20Name.mp3"
                  >Killing in the Name Of</a>
              </li>
              <li id="03DinnerParty">
                <a name="03DinnerParty" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/03%20Take%20the%20Power%20Back.mp3"
                  >Take the Power Back</a>
              </li>
              <li id="04NavyWives">
                <a name="04NavyWives" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/04%20Settle%20for%20Nothing.mp3"
                  > Settle for Nothing </a>
              </li>
              <li id="05WhileWeGoDancing">
                <a name="05WhileWeGoDancing" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/05%20Bullet%20in%20the%20Head.mp3"
                  >Bullet in the Head</a>
              </li>
              <li id="06IUsedToComplainNowIDont">
                <a name="06IUsedToComplainNowIDont" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/06%20Know%20Your%20Enemy.mp3"
                  >Know Your Enemy</a>
              </li>
              <li id="07TakeAWalkAroundTheTable">
                <a name="07TakeAWalkAroundTheTable" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/07%20Wake%20Up.mp3"
                  >Wake Up</a>
              </li>
              <li id="08MarchOfTheCamels">
                <a name="08MarchOfTheCamels" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/08%20Fistful%20of%20Steel.mp3"
                  >Fistful of Steel</a>
              </li>
              <li id="09FortNightly">
                <a name="09FortNightly" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/09%20Township%20Rebellion.mp3"
                  > Township Rebellion</a>
              </li>
              <li id="10Reprise">
                <a name="10Reprise" class="mp3"
                  href="http://cf.media.amp.fm/artist/RageAgainstTheMachine/Rage%20Against%20the%20Machine/10%20Freedom.mp3"
                  >Reprise</a>
              </li>
            </ul>
          </div>
          <div style="width:120px;position:absolute;right:0;top:5px;display:inline;">
            <xsl:element name="embed">
              <xsl:attribute name="type">application/x-shockwave-flash</xsl:attribute>
              <xsl:attribute name="src">
                <xsl:text>http://ws.amazon.com/widgets/q?MarketPlace=US&amp;Operation=GetDisplayTemplate&amp;ServiceVersion=20070822&amp;WS=1&amp;ID=MP3Clips</xsl:text>
              </xsl:attribute>
              <xsl:attribute name="width">120</xsl:attribute>
              <xsl:attribute name="height">300</xsl:attribute>
              <xsl:attribute name="style">undefined</xsl:attribute>
              <xsl:attribute name="id">amzn_widget</xsl:attribute>
              <xsl:attribute name="name">amzn_widget</xsl:attribute>
              <xsl:attribute name="quality">high</xsl:attribute>
              <xsl:attribute name="bgcolor">#FFFFFF</xsl:attribute>
              <xsl:attribute name="allowscriptaccess">always</xsl:attribute>
              <xsl:attribute name="flashvars">
                <xsl:text>MarketPlace=US&amp;Operation=GetDisplayTemplate&amp;ServiceVersion=20070822&amp;WS=1&amp;ID=MP3Clips&amp;Tag=widgetsamazon-20&amp;WidgetType=SearchAndAdd&amp;Keywords=</xsl:text>
                <xsl:value-of select="."/>
                <xsl:text>&amp;Title=Related Tracks&amp;Width=120&amp;Height=300&amp;ShuffleTracks=True</xsl:text>
              </xsl:attribute>
            </xsl:element>
          </div>
        </div>
      </div>
    </div>
    <!-- <xsl:if test="$position mod $google-ad-mod-count = 0">
      <xsl:variable name="pos" select="count(parent::atom:entry/preceding-sibling::atom:entry)"/>
      <ul class="list LtoR">
        <fieldset style="margin:0 0 15px;background-color:#FFF;border-color:#663300">
          <legend style="font-size:11pt;color:#993300;font-weight:600;">
            sponsored
            advertisement
          </legend>
          <xsl:choose>
            <xsl:when test="$pos mod 2 = 0">
              <li class="google-ad" style="margin-right:5px;">
                <iframe width="728" height="90" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" style="border:none;" src="/static/google-ads/leaderboard.html"/>
              </li>
              <li>
                <iframe src="http://rcm.amazon.com/e/cm?t=xsltblogcom-20&amp;o=1&amp;p=20&amp;l=ur1&amp;category=mp3&amp;banner=1TBPBDZEMKKFFXCVTT82&amp;f=ifr" width="120" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"/>
              </li>
            </xsl:when>
            <xsl:when test="$pos mod 3 = 0">
              <li>
                <iframe src="http://rcm.amazon.com/e/cm?t=xsltblogcom-20&amp;o=1&amp;p=48&amp;l=ur1&amp;category=electronics&amp;banner=1H12JWKJGH6B7A6WMY02&amp;f=ifr" width="728" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"/>
              </li>
            </xsl:when>
            <xsl:otherwise>
              <li style="margin-right:5px;">
                <iframe src="http://rcm.amazon.com/e/cm?t=xsltblogcom-20&amp;o=1&amp;p=20&amp;l=ur1&amp;category=mp3&amp;banner=1TBPBDZEMKKFFXCVTT82&amp;f=ifr" width="120" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"/>
              </li>
              <li class="google-ad">
                <iframe width="728" height="90" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" style="border:none;" src="/static/google-ads/leaderboard.html"/>
              </li>
            </xsl:otherwise>
          </xsl:choose>
        </fieldset>
      </ul>
    </xsl:if> -->
  </xsl:template>

  <xsl:template match="fb:*">
    <xsl:element name="{local-name()}" xmlns="http://www.facebook.com/2008/fbml">
      <xsl:apply-templates select="@*"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <xsl:template
    match="atom:summary|atom:published|atom:updated|atom:generator|atom:id|atom:category|atom:source|atom:author"/>

  <xsl:template match="atom:content">
    <xsl:param name="cCount"/>
    <div style="z-index:0;">
      <object style="z-index:0;" type="application/x-shockwave-flash"
        data="/media/button/musicplayer.swf?&amp;playlist_url=http://media.amp.fm/amp.fm/presents/amp.fm-presents-austin-comp.xspf"
        width="17" height="17">
        <param name="movie"
          value="/media/button/musicplayer.swf?&amp;playlist_url=http://media.amp.fm/amp.fm/presents/amp.fm-presents-austin-comp.xspf"/>
        <img src="noflash.gif" width="17" height="17" alt=""/>
      </object>
    </div>
    <p style="font-size:small">
      <xsl:copy-of select="substring(., 1, $cCount)"/> ... [<a
        href="{../atom:link[@rel = 'alternate']/@href}">more</a>] </p>
  </xsl:template>

  <xsl:variable name="page.output.head"
    select="document($page/page:output/page:head/@src)/page:head|$page/page:output/page:head"/>
  <xsl:variable name="page.output.body">
    <xsl:choose>
      <xsl:when test="$page/page:output/page:body/@src">
        <xsl:apply-templates select="document($page/page:output/page:body/@src)/page:body"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates select="$page/page:output/page:body"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:variable>

  <xsl:template name="replace">
    <xsl:param name="string"/>
    <xsl:variable name="nString">
      <xsl:call-template name="cond">
        <xsl:with-param name="string" select="$string"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="contains($nString, $closure-token-pre-delimiter)">
        <xsl:variable name="name"
          select="substring-before(substring-before(substring-after($nString, $closure-token-pre-delimiter), $closure-token-post-delimiter), $parameter-list-pre-delimiter)"/>
        <xsl:call-template name="replace-vars">
          <xsl:with-param name="value-string"
            select="substring-before(substring-after($nString, $parameter-list-pre-delimiter), $parameter-list-post-delimiter)"/>
          <xsl:with-param name="replace-var-string"
            select="substring-before(substring-after($advice//advice:*[local-name() = $name]/text(), $replace-parameter-list-pre-delimiter), $replace-parameter-list-post-delimiter)"
          />
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="contains($nString, $replace-token-pre-delimiter)">
        <xsl:variable name="name"
          select="substring-before(substring-after($nString, $replace-token-pre-delimiter), $replace-token-pre-delimiter)"/>
        <xsl:variable name="replace-with">
          <xsl:apply-templates select="$advice//advice:*[local-name() = $name]"/>
        </xsl:variable>
        <xsl:call-template name="replace">
          <xsl:with-param name="string"
            select="concat(substring-before($nString, concat($replace-token-pre-delimiter, $name)), $replace-with, substring-after($nString, concat($name, $replace-token-pre-delimiter)))"
          />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$nString"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="cond">
    <xsl:param name="string"/>
    <xsl:choose>
      <xsl:when test="contains($string, $cond-token-pre-delimiter)">
        <xsl:variable name="sString" select="translate($string, ' ', '')"/>
        <xsl:variable name="conditional"
          select="substring-before(substring-after($sString, $cond-token-pre-delimiter), $cond-token-post-delimiter)"/>
        <xsl:variable name="pre-cond" select="substring-before($sString, $cond-token-pre-delimiter)"/>
        <xsl:variable name="post-cond"
          select="substring-after($sString, $cond-token-post-delimiter)"/>
        <xsl:variable name="if"
          select="substring-before(substring-after($conditional, $cond-if-token), $cond-then-token)"/>
        <xsl:variable name="then"
          select="substring-before(substring-after($conditional, $cond-then-token), $cond-else-token)"/>
        <xsl:variable name="else" select="substring-after($conditional, $cond-else-token)"/>
        <xsl:variable name="nString">
          <xsl:choose>
            <xsl:when
              test="$advice//advice:*[local-name() = substring-before(substring-after($if, '@@'), '@@')]">
              <xsl:variable name="replace-string">
                <xsl:call-template name="replace">
                  <xsl:with-param name="string" select="$then"/>
                </xsl:call-template>
              </xsl:variable>
              <xsl:value-of select="concat($pre-cond, $replace-string, $post-cond)"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:variable name="replace-string">
                <xsl:call-template name="replace">
                  <xsl:with-param name="string" select="$else"/>
                </xsl:call-template>
              </xsl:variable>
              <xsl:value-of select="concat($pre-cond, $replace-string, $post-cond)"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <xsl:call-template name="cond">
          <xsl:with-param name="string" select="$nString"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$string"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="replace-vars">
    <xsl:param name="value-string"/>
    <xsl:param name="replace-var-string"/>
    <xsl:variable name="nValue-string">
      <xsl:call-template name="replace">
        <xsl:with-param name="string" select="$value-string"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="nReplace-var-string">
      <xsl:call-template name="replace">
        <xsl:with-param name="string" select="$replace-var-string"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="name"
      select="substring-before(substring-after($nValue-string, $parameter-pre-delimiter), $parameter-post-delimiter)"/>
    <xsl:variable name="value"
      select="substring-before(substring-after($nValue-string, concat($parameter-value-assigment-token, $squote)), $squote)"/>
    <xsl:variable name="evaluated-value"
      select="concat(substring-before($nReplace-var-string, concat($replace-parameter-pre-delimiter, $name)), $value, substring-after($nReplace-var-string, concat($name, $replace-parameter-post-delimiter)))"/>
    <xsl:variable name="next" select="substring-after($nValue-string, $parameter-list-delimeter)"/>
    <xsl:choose>
      <xsl:when test="$next">
        <xsl:call-template name="replace-vars">
          <xsl:with-param name="value-string" select="$next"/>
          <xsl:with-param name="replace-var-string" select="$evaluated-value"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$evaluated-value"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
