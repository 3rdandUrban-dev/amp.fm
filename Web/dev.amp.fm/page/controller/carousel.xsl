<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="xml"/>
  <xsl:variable name="q">'</xsl:variable>
  <xsl:template match="/">
    <div>
      <xsl:apply-templates select="photos/photo"/>
    </div>
  </xsl:template>
  <xsl:template match="photo">
    <a rel="{concat(@lat,',',@long,',',@depth,',',@view,',',@orientation)}" class="map-birdseye-view" href="#map">
      <img src="{@src}"/>
    </a>
  </xsl:template>
</xsl:stylesheet>
