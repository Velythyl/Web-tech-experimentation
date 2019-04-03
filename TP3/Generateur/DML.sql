set search_path to kijiji;

/*SETTERS*/
/*Insert a new individu to the corresponding table*/
/*TODO the id should be extracted from the actual table, not 
  pass as an argument ! Apply to all these setters using id*/
CREATE OR REPLACE FUNCTION new_individu(id INT, email VARCHAR, mot_de_passe VARCHAR, pseudonyme VARCHAR,telephone CHAR, adresse VARCHAR)
RETURNS void AS $$
BEGIN
	INSERT INTO individu VALUES
	(id,email,mot_de_passe,pseudonyme,telephone,adresse);
END; $$
LANGUAGE 'plpgsql';

/*Insert a new expert/categories pair to the expert table*/
CREATE OR REPLACE FUNCTION new_expert_cat(id_expert INT, nom_categorie VARCHAR)
RETURN void AS $$
BEGIN
	INSERT INTO expert VALUES
	(id_expert, nom_categorie);
END; $$
LANGUAGE 'plpgsql';

/*Insert a new item to the corresponding table*/
CREATE OR REPLACE FUNCTION new_item(id INT, prix INT, titre VARCHAR, description VARCHAR, quantite INT, condition INT, nom_categorie VARCHAR, etat STATUS)
RETURN void AS $$
BEGIN
	INSERT INTO item VALUES
	(id,prix,titre,description,quantite,condition,nom_categorie,etat);
END; $$
LANGUAGE 'plpgsql';

/*Insert a new offre to the corresponding table*/
CREATE OR REPLACE FUNCTION new_offre(no_offre INT, id_acheteur INT, id_annonceur INT, id_item INT, prix INT, date DATE, date_val DATE)
RETURN void AS $$
BEGIN
	INSERT INTO offre VALUES
	(no_offre,id_acheteur,id_annonceur,id_item,prix,date,date_val);
END; $$
LANGUAGE 'plpgsql';

/*Insert a new proposition to the corresponding table*/
CREATE OR REPLACE FUNCTION new_proposition(no_prop INT, id_annonceur INT, id_item INT, date DATE)
RETURN void AS $$
BEGIN
	INSERT INTO proposition VALUES
	(no_prop,id_annonceur,id_item,date);
END; $$
LANGUAGE 'plpgsql';

/*Insert a new evaluation to the corresponding table*/
CREATE OR REPLACE FUNCTION new_evaluation(no_eval INT, id_expert INT, prix INT, date DATE, id_item INT ,date_val DATE)
RETURN void AS $$
BEGIN
	INSERT INTO evaluation VALUES
	(no_eval, id_expert, prix, date, id_item, date_val);
END; $$
LANGUAGE 'plpgsql';

/*Function to search an item*/
CREATE OR REPLACE FUNCTION search_item(annonceur_id INT, categorie VARCHAR, prix_lo INT, prix_hi INT, etat STATUS)
RETURNS TABLE (
    	ID INT,
	Prix INT,
	Titre VARCHAR,
	Description VARCHAR,
	Quantite INT,
	Condition INT,
	Nom_categorie VARCHAR,
	Etat STATUS
) AS $$
DECLARE
	
BEGIN
	RETURN QUERY
		SELECT * FROM item
		WHERE
			(categorie IS NULL OR item.Nom_categorie=categorie)
			AND (prix_lo IS NULL OR item.Prix > prix_lo)
			AND (prix_hi IS NULL OR item.Prix < prix_hi)
			AND (etat IS NULL OR item.etat=etat) 
			AND (annonceur_id IS NULL 
				OR EXISTS(SELECT 1 FROM proposition WHERE proposition.ID_annonceur=annonceur_id AND item.ID=proposition.ID_item) 
			);
END; $$
LANGUAGE 'plpgsql';

/*Function to return the childs of a category, if the boolean
  only_one is set to true, only return the direct child otherwise 
  the whole set of child/grandchild ect is return*/
CREATE OR REPLACE FUNCTION cat_recurs(cat VARCHAR, only_one BOOLEAN)
RETURNS TABLE (
	Nom VARCHAR
) AS $$
DECLARE
	rec RECORD;
BEGIN
	IF only_one THEN
		RETURN QUERY SELECT Sous_categorie FROM sous_categorie WHERE Categorie=cat;
	ELSE
		RETURN QUERY SELECT cat;
		FOR rec IN SELECT Sous_categorie FROM sous_categorie WHERE Categorie=cat
		LOOP
			RETURN QUERY SELECT * FROM cat_recurs(rec.Sous_categorie);
		END LOOP;
	END IF;
END; $$
LANGUAGE 'plpgsql';

/*Function to query from the list of item*/
CREATE OR REPLACE FUNCTION cat_items(annonceur_id INT, cat VARCHAR, prix_lo INT, prix_hi INT, etat STATUS)
RETURNS TABLE (
	ID INT,
	Prix INT,
	Titre VARCHAR,
	Description VARCHAR,
	Quantite INT,
	Condition INT,
	Nom_categorie VARCHAR,
	Etat STATUS
) AS $$
DECLARE
	rec RECORD;
BEGIN
	RETURN QUERY SELECT * FROM search_item(annonceur_id, cat, prix_lo, prix_hi, etat);
	FOR rec IN SELECT * FROM cat_recurs(cat, FALSE)
	LOOP
		RETURN QUERY SELECT * FROM search_item(annonceur_id, rec.Nom, prix_lo, prix_hi, etat);
	END LOOP;
END; $$
LANGUAGE 'plpgsql';

/*Function that validate the connection of a user*/
CREATE OR REPLACE FUNCTION login(param VARCHAR, mdp VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
	IF EXISTS(SELECT * FROM individu WHERE (param=Pseudonyme OR param=Email) AND Mot_de_passe=mdp) THEN
		RETURN TRUE;
	ELSE
	  RETURN FALSE;
	END IF;
END; $$
LANGUAGE 'plpgsql';
