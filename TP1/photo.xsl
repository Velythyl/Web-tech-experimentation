<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:template name="photoGetter">
        <xsl:param name="photo"></xsl:param>
        
        <img height="200">
            <xsl:attribute name="src">
                <xsl:value-of select="$photo"/>
            </xsl:attribute>
        </img>
    </xsl:template>
    
</xsl:stylesheet>