<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:template name="couvGetter">
        <xsl:param name="couv"></xsl:param>
        <!-- https://stackoverflow.com/questions/10184694/how-to-create-hyperlink-using-xslt -->
        <a href="{$couv}">Couverture</a>
    </xsl:template>
</xsl:stylesheet>