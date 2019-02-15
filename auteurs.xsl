<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    <xsl:output method="xhtml"/>
    
    <xsl:template match="/">
        <xhtml>
            <head>
                <title>Ma bibliothèque</title>
                <style type="text/css">
                    th {  background-color: silver;  }                     
                    .ligne {background-color: #FFCCCC; }
                    td {
                    border-style: solid;
                    border-width: 1px;
                    }</style>
            </head>
            <body>
                <h2>Auteurs de la bibliotheque</h2>
                <table>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Pays</th>
                        <th>Commentaire</th>
                        <th>Photo</th>
                    </tr>
                    <xsl:for-each select="bibliotheque/auteurs/auteur">
                        <xsl:sort select="nom" order="ascending"/>
                            
                        <tr>
                           <td>
                           <xsl:value-of select="nom"/>
                           </td>
                           <td>
                           <xsl:value-of select="prenom"/>
                           </td>
                           <td>
                           <xsl:value-of select="pays"/>
                           </td>
                           <td>
                           <xsl:if test="commentaire">
                           <xsl:value-of select="commentaire"/>
                           </xsl:if>
                           </td>
                           <td>
                           <xsl:value-of select="photo"/>
                           </td>
                        </tr>
                        
                    </xsl:for-each>
                </table>
            </body>
        </xhtml>
        
    </xsl:template>
    
</xsl:stylesheet>