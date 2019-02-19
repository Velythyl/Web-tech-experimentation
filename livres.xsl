<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    <xsl:output method="xhtml"/>
    
    <xsl:param name="lowPrice" select="2"></xsl:param>
    <xsl:param name="highPrice" select="20"></xsl:param>
    <xsl:param name="mot" select='""'></xsl:param>
    
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
                <xsl:for-each select="bibliotheque/auteurs/auteur">
                    <xsl:sort select="concat(nom, prenom)"/>
                    
                    <xsl:variable name="ID" select="@ident"/>
                    
                    <xsl:for-each select="//livre">
                        <xsl:sort select="prix"/>
                        <xsl:if test="prix>=$lowPrice and $highPrice>=prix and contains(titre, $mot) and starts-with(@auteurs, $ID)">  <!-- < ne marche pas? -->
                            <h1><xsl:value-of select="titre"/></h1>
                            <p>Prix: <xsl:value-of select="prix"/></p>
                            <p>Année: <xsl:value-of select="annee"/></p>
                            <p><xsl:if test="commentaire">
                                
                                Commentaire: <xsl:value-of select="commentaire"/>
                            </xsl:if></p>
                            <p><xsl:if test="couverture">
                                Couverture: <xsl:value-of select="couverture"/>
                            </xsl:if></p>
                            
                            <table>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prenom</th>
                                    <th>Pays</th>
                                    <th>Photo</th>
                                    <th>Commentaire</th>
                                </tr>
                            
                                <xsl:variable name="auts" select="tokenize(@auteurs, '\s')"/>
                                <xsl:variable name="autsR" select="//auteur[@ident=$auts]"/>
                                <xsl:for-each select="$autsR">
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
                                            <xsl:value-of select="photo"/>
                                        </td>
                                        <td>
                                            <xsl:if test="commentaire">
                                                <xsl:value-of select="commentaire"/>
                                            </xsl:if>
                                        </td>
                                    </tr>
                                </xsl:for-each>
                                
                            </table>
                        </xsl:if>
                        
                    </xsl:for-each>
                    
                </xsl:for-each>
            </body>
        </xhtml>
        
    </xsl:template>
    
</xsl:stylesheet>