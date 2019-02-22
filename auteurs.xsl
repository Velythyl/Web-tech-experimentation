<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    <xsl:import href="photo.xsl"/>
    <xsl:import href="couverture.xsl"/>
    <xsl:output method="xhtml"/>
    
    <xsl:param name="nomSearch" select="''"/>
    
    <xsl:template match="/">
        <xhtml>
            <head>
                <title>Ma bibliothèque</title>
                <style type="text/css">
                    th {  background-color: silver;  }</style>
            </head>
            <body>
                <h2>Auteurs de la bibliotheque</h2>
                <xsl:for-each select="//auteur">
                    <xsl:sort select="concat(nom, prenom)" order="ascending"/>
                    
                    <xsl:if test="$nomSearch = nom or $nomSearch = ''">
                        <h1><xsl:value-of select="concat(nom, ', ', prenom)"/></h1>
                        <p>Pays: <xsl:value-of select="pays"/></p>
                        
                        <xsl:call-template name="photoGetter">
                            <xsl:with-param name="photo" select="photo"/>
                        </xsl:call-template>
                        
                        <p>
                            <xsl:if test="commentaire">
                                Commentaire: <xsl:value-of select="commentaire"/>
                            </xsl:if>
                        </p>
                        
                        <xsl:call-template name="livreGetter">
                            <xsl:with-param name="ID" select="@ident"/>
                        </xsl:call-template>
                    </xsl:if>
                    
                    
                    
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
                                <xsl:call-template name="couvGetter">
                                    <xsl:with-param name="couv" select="couverture"/>
                                </xsl:call-template>
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