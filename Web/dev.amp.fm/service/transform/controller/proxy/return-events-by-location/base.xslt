<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="2.0" xmlns:dateTime="clitype:System.DateTime" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xCal="urn:ietf:params:xml:ns:xcal" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xdt="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:saxon="http://saxon.sf.net/" xmlns:clitype="http://saxon.sf.net/clitype" xmlns:at="http://atomictalk.org" xmlns:func="http://atomictalk.org/function" xmlns:http-sgml-to-xml="clitype:Xameleon.Function.HttpSgmlToXml?partialname=Xameleon" xmlns:aspnet-context="clitype:System.Web.HttpContext?partialname=System.Web" xmlns:proxy="http://xameleon.org/service/proxy" xmlns:html="http://www.w3.org/1999/xhtml" exclude-result-prefixes="#all">

    <xsl:import href="../../base.xslt" />
    <xsl:output cdata-section-elements="event"/>

    <xsl:template match="proxy:return-events-by-location">
        <xsl:variable name="location" select="func:resolve-variable(@location)" />
        <xsl:variable name="topic" select="tokenize(func:resolve-variable(@topic), '\|')" />
        <xsl:variable name="format" select="func:resolve-variable(@format)" />
        <xsl:variable name="time-scope" select="func:resolve-variable(@timescope)" />
	<xsl:variable name="yahoo-api-key" select="'0f24246faa'" />
	
        <xsl:variable name="event-doc" select="document(concat('http://upcoming.yahooapis.com/services/rest/?method=event.search&amp;api_key=', $yahoo-api-key, '&amp;category_id=1&amp;location=', $location, '+', ., '+United+States&amp;quick_date=', $time-scope, '&amp;sort=start-date-asc'))"/>
        <xsl:variable name="result">
            <xsl:choose>
                <xsl:when test="$format = 'atom'">
                    <atom:feed xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xCal="urn:ietf:params:xml:ns:xcal" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">
                        <atom:title>
                            <xsl:value-of select="$event-doc//channel/title"/>
                        </atom:title>
                        <atom:published>
                            <xsl:value-of select="current-dateTime()"/>
                        </atom:published>
                        <xsl:apply-templates select="$event-doc//item" mode="atom"/>
                    </atom:feed>
                </xsl:when>
                <xsl:otherwise>
                    <data>
                        <xsl:apply-templates select="$event-doc"/>
                    </data>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:sequence select="$result"/>
    </xsl:template>

    <xsl:template match="item" mode="atom">
        <atom:entry>
            <xsl:apply-templates mode="atom">
                <xsl:sort select="xCal:dtstart" order="descending"/>
            </xsl:apply-templates>
        </atom:entry>
    </xsl:template>

    <xsl:template match="xCal:summary" mode="atom">
        <xsl:element name="atom:title">
            <xsl:attribute name="type">text</xsl:attribute>
            <xsl:value-of select="text()" />
        </xsl:element>
    </xsl:template>

    <xsl:template match="description" mode="atom">
        <xsl:variable name="xhtml" select="http-sgml-to-xml:GetXmlFromHtmlString(http-sgml-to-xml:DecodeHtmlString(concat('&lt;div&gt;', .,'&lt;/html&gt;')))"/>
        <xsl:element name="atom:content">
            <xsl:attribute name="type">xhtml</xsl:attribute>
            <xsl:apply-templates select="saxon:parse($xhtml)" mode="xhtml" />
        </xsl:element>
    </xsl:template>

    <xsl:template match="pubDate" mode="atom">
        <xsl:element name="atom:published">
            <xsl:value-of select="." />
        </xsl:element>
    </xsl:template>

    <xsl:template match="link" mode="atom">
        <xsl:element name="atom:link">
            <xsl:attribute name="rel">alternate</xsl:attribute>
            <xsl:attribute name="href">
                <xsl:value-of select="." />
            </xsl:attribute>
        </xsl:element>
    </xsl:template>

    <xsl:template match="xCal:dtstart" mode="atom">
        <xsl:variable name="dtstart" select="."/>
        <xsl:variable name="verifiedDateTime" select="if(contains($dtstart, 'T')) then $dtstart else if(empty($dtstart)) then '' else concat($dtstart, 'T00:00:00Z')"/>
        <xsl:element name="xCal:dtstart">
            <xsl:value-of select="xs:dateTime($verifiedDateTime)" />
        </xsl:element>
    </xsl:template>

    <xsl:template match="xCal:dtend" mode="atom">
        <xsl:variable name="dateTime" select="../xCal:dtstart"/>
        <xsl:variable name="verifiedDateTime" select="if(contains($dateTime, 'T')) then $dateTime else concat($dateTime, 'T00:00:00Z')"/>
        <xsl:variable name="adjusted-dtend" select="xs:dateTime($verifiedDateTime) + xdt:dayTimeDuration('PT2H')"/>
        <xsl:element name="xCal:dtend">
            <xsl:value-of select="$adjusted-dtend" />
        </xsl:element>
    </xsl:template>

    <xsl:template match="geo:lat|geo:long|xCal:x-calconnect-venue" mode="atom">
        <xsl:copy-of select="."/>
    </xsl:template>

    <xsl:template match="*" mode="atom">
        <xsl:apply-templates select="*" mode="atom" />
    </xsl:template>

    <xsl:template match="div" mode="xhtml">
        <html:div>
            <xsl:copy-of select="*"/>
        </html:div>
    </xsl:template>

    <xsl:template match="rss|channel">
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="item">
        <xsl:variable name="dtstart" select="func:format-dateTime-string(xCal:dtstart)"/>
        <xsl:variable name="dtend" select="func:format-dateTime-string(concat(dateTime:ToString(dateTime:ToUniversalTime(dateTime:AddHours(dateTime:Parse($dtstart), 2)), string('s'), null), 'Z'))"/>
        <xsl:if test="$dtstart != ''">
            <event start="{$dtstart}" isDuration="{if(not($dtend = '')) then 'true' else 'false'}" title="{title}" image="/images/amp.fm_icon.png">
                <xsl:if test="$dtend != ''">
                    <xsl:attribute name="end">
                        <xsl:value-of select="$dtend"/>
                    </xsl:attribute>
                    <xsl:value-of select="description"/>
                </xsl:if>
            </event>
        </xsl:if>
    </xsl:template>

    <xsl:template match="text()" />

</xsl:transform>
