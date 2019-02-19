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
                <xsl:for-each select="bibliotheque/auteurs/auteur">
                    <xsl:sort select="concat(nom, prenom)" order="ascending"/>
                    <h1><xsl:value-of select="concat(nom, ', ', prenom)"/></h1>
                    <p>Pays: <xsl:value-of select="pays"/></p>
                    
                    <xsl:variable name="pic" select="photo"/>
                    
                    <img height="200">
                        <xsl:attribute name="src">
                            <xsl:value-of select="photo"/>
                        </xsl:attribute>
                    </img>
                    
                    <p>
                        <xsl:if test="commentaire">
                            Commentaire: <xsl:value-of select="commentaire"/>
                        </xsl:if>
                    </p>
                    
                    <xsl:call-template name="livreGetter">
                        <xsl:with-param name="ID" select="@ident"/>
                    </xsl:call-template>
                    
                </xsl:for-each>
                
            </body>
        </xhtml>
        
    </xsl:template>
    
    <xsl:template name="livreGetter">
        <xsl:param name="ID"></xsl:param>
        
        <h3>Livres:</h3>
        <table>
            <tr>
                <th>Prix</th>
                <th>Titre</th>
                <th>Annee</th>
                <th>Couverture</th>
                <th>Commentaire</th>
            </tr>
            
            <xsl:for-each select="//livre">
                <xsl:sort select="prix" order="ascending"/>
                <xsl:if test="contains(@auteurs, $ID)">
                    <tr>
                        <td>
                            <xsl:value-of select="prix"/>
                        </td>
                        <td>
                            <xsl:value-of select="titre"/>
                        </td>
                        <td>
                            <xsl:value-of select="annee"/>
                        </td>
                        <td>
                            <xsl:if test="couverture">
                                <xsl:value-of select="couverture"/>
                            </xsl:if>
                        </td>
                        <td>
                            <xsl:if test="commentaire">
                                <xsl:value-of select="commentaire"/>
                            </xsl:if>
                        </td>
                    </tr>
                </xsl:if>
                
            </xsl:for-each>
            
        </table>
    </xsl:template>
    
</xsl:stylesheet>