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
                <h2>Livres de la bibliotheque</h2>
                <table>
                    <tr>
                        <th>Titre</th>
                        <th>Année</th>
                        <th>Prix</th>
                        <th>Commentaire</th>
                        <th>Couverture</th>
                    </tr>
                    <xsl:for-each select="bibliotheque/livres/livre">
                        <!-- https://stackoverflow.com/questions/40806811/xslt-select-one-idref-and-find-corr-element -->
                        
                        <xsl:sort select="id(livres/@auteurs)/nom" order="ascending"/>
                        
                        <tr>
                            <td>
                                <xsl:value-of select="titre"/>
                            </td>
                            <td>
                                <xsl:value-of select="annee"/>
                            </td>
                            <td>
                                <xsl:value-of select="prix"/>
                            </td>
                            <td>
                                <xsl:if test="commentaire">
                                    <xsl:value-of select="commentaire"/>
                                </xsl:if>
                            </td>
                            <td>
                                <xsl:if test="couverture">
                                    <xsl:value-of select="couverture"/>
                                </xsl:if>
                            </td>
                        </tr>
                        
                    </xsl:for-each>
                </table>
            </body>
        </xhtml>
        
    </xsl:template>
    
</xsl:stylesheet>