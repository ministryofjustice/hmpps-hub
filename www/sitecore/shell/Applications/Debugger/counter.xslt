<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!-- output directives -->
<xsl:output method="html" indent="no" encoding="UTF-8"  />

<!-- entry point -->
<xsl:template match="*">
  <div style="background:white">
    <table border="1" cellpadding="4">
      <tr><td/></tr>
      <xsl:apply-templates select="." mode="header" />

      <xsl:apply-templates select="/count/counter" mode="line">
        <xsl:sort select="@name" />
      </xsl:apply-templates>
    </table>
  </div>
</xsl:template>

<xsl:template match="*" mode="line">
  <tr>
    <td><xsl:value-of select="@name"/></td>
    <td align="right"><xsl:value-of select="."/></td>
  </tr>
</xsl:template>

<xsl:template match="*" mode="header">
  <tr>
    <td>Created:</td>
    <td><xsl:value-of select="@created"/></td>
  </tr>
</xsl:template>

</xsl:stylesheet>

