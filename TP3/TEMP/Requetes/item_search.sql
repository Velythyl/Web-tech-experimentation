set search_path to kijiji;

CREATE OR REPLACE FUNCTION search_item(categorie VARCHAR, prix_lo FLOAT, prix_hi FLOAT)
RETURNS TABLE (
	ID INT,
	Prix FLOAT,
	Titre VARCHAR,
	Description VARCHAR,
	Quantite INT,
	Condition INT,
	Nom_categorie VARCHAR,
	Etat etat
) AS $$
BEGIN
	RETURN QUERY
		SELECT * FROM item
		WHERE item.Nom_categorie=categorie AND item.Prix > prix_lo AND item.Prix < prix_hi;
END; $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION cat_recurs(categorie VARCHAR)
RETURNS TABLE (
	Nom VARCHAR
) AS $$
BEGIN
	INSERT categorie INTO $$;

	FOR Sous_categorie IN (SELECT Sous_categorie FROM sous_categorie WHERE Categorie=categorie)
	LOOP
		SELECT * FROM cat_recurs(Sous_categorie) INTO $$;
	END LOOP;
END; $$
LANGUAGE 'plpgsql';