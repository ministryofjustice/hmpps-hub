<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  
  xmlns:msxml="urn:schemas-microsoft-com:xslt" 
  xmlns:sc="http://www.sitecore.net">

<!-- include files -->
<xsl:output method="html"/>

<!-- script -->

<!-- parameters -->
<xsl:param name="site" select="''"/>
<xsl:param name="lang" select="'en'"/>
<xsl:param name="type" select="''"/>

<xsl:param name="id" select="''"/>

<msxml:script language="c#" implements-prefix="sc" xmlns:msxml="urn:schemas-microsoft-com:xslt">
<![CDATA[

string FmtDateTime(string time)
{
  if (time != null && time.Length > 0 ) {
    time = time.Substring(0, 2) + ":" + time.Substring(2, 2) + ":" + time.Substring(4, 2);
    return time;
  }
  
  return "";
}

]]>
</msxml:script>

<!-- variables -->
<xsl:template match="*">
  <table border="0" cellspacing="0" cellpadding="4" class="sc_font">
  <col valign="top"/>
  <col valign="top"/>
  <col valign="top"/>
  <tr>
    <td>Category</td>
    <td>Timestamp</td>
    <td>Text</td>
  </tr>
  <tr><td colspan="6" height="1" bgcolor="silver"></td></tr>
  
  <xsl:for-each select="/sitecore/l">
    <tr>
      <td><xsl:value-of select="@cat" disable-output-escaping="yes"/></td>
    
      <td nowrap="nowrap"><xsl:value-of select="sc:FmtDateTime(string(@t))" disable-output-escaping="yes"/></td>
  
      <td><xsl:value-of select="." disable-output-escaping="yes"/></td>
      
    </tr>
    <tr><td colspan="3" height="1" bgcolor="silver"></td></tr>
  </xsl:for-each>
  </table>

</xsl:template>

</xsl:stylesheet>
