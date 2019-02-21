<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    <xsl:import href="photo.xsl"/>
    <xsl:import href="couverture.xsl"/>
    <xsl:output method="xhtml"/>
    
    <xsl:param name="lowPrice" select="0"></xsl:param>
    <xsl:param name="highPrice" select="100"></xsl:param>
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
                    }
                </style>
            </head>
            <body>
                <h2>Livres de la bibliotheque</h2>
                <xsl:for-each select="//auteur">
                    <xsl:sort select="concat(nom, prenom)"/>
                    
                    <xsl:call-template name="livreGetter">
                        <xsl:with-param name="ID" select="@ident"/>
                    </xsl:call-template>
                    
                </xsl:for-each>
            </body>
        </xhtml>
    </xsl:template>
    
    <xsl:template name="livreGetter">
        <xsl:param name="ID"/>
        
        <xsl:for-each select="//livre">
            <xsl:sort select="prix"/>
            <!-- le contains(concat(' ',titre,' '), concat(' ',$mot,' ')) permet de s'assurer que le titre contient le mot exact, et non pas qu'un de ses mots contient le mot comme substring -->
            <xsl:if test="prix>=$lowPrice and $highPrice>=prix and (contains(concat(' ',titre,' '), concat(' ',$mot,' ')) or $mot='') and starts-with(@auteurs, $ID)">
                <h1><xsl:value-of select="titre"/></h1>
                <p>Prix: <xsl:value-of select="prix"/></p>
                <p>Année: <xsl:value-of select="annee"/></p>
                
                <xsl:if test="couverture">
                    <xsl:call-template name="couvGetter">
                        <xsl:with-param name="couv" select="couverture"/>
                    </xsl:call-template>
                </xsl:if>
                
                <p><xsl:if test="commentaire">
                    
                    Commentaire: <xsl:value-of select="commentaire"/>
                </xsl:if></p>
                
                <xsl:call-template name="auteurGetter">
                    <xsl:with-param name="autList" select="@auteurs"/>
                </xsl:call-template>
                
            </xsl:if>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template name="auteurGetter">
        <xsl:param name="autList"/>
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
                <xsl:sort select="concat(nom, prenom)"></xsl:sort>
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
                        <xsl:call-template name="photoGetter">
                            <xsl:with-param name="photo" select="photo"/>
                        </xsl:call-template>
                    </td>
                    <td>
                        <xsl:if test="commentaire">
                            <xsl:value-of select="commentaire"/>
                        </xsl:if>
                    </td>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>
    
</xsl:stylesheet>