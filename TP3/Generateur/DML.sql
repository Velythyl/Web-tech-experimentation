USE gautchar_IFT3225TP3;

/* select login('Antonio500', 'HVA90YJU7'); */
CREATE FUNCTION login (uname VARCHAR(255), mdp VARCHAR(255))
RETURNS INTEGER
READS SQL DATA
RETURN
(
    SELECT ID FROM Individu WHERE login=uname AND mot_de_passe=mdp
);

CREATE FUNCTION is_admin (ID INTEGER)
RETURNS BINARY
READS SQL DATA
RETURN
(
    SELECT(EXISTS(SELECT 1 FROM Gestionnaire WHERE ID=Gestionnaire.ID))
);

CREATE FUNCTION is_player (ID INTEGER)
RETURNS BINARY
READS SQL DATA
RETURN
(
    SELECT(EXISTS(SELECT 1 FROM Joueur WHERE ID=Joueur.ID))
);

DELIMITER $$
CREATE FUNCTION create_user(name VARCHAR(255), fname VARCHAR(255), mdp VARCHAR(30), uname VARCHAR(30))
RETURNS INT
BEGIN
	DECLARE newID INT;
	SET newID = (SELECT max(ID)+1 FROM Individu);
	INSERT INTO Individu VALUES (newID, name, fname, mdp, uname);
	INSERT INTO Joueur VALUES (newID);
	RETURN newID;
END;
$$
DELIMITER ;



/*Insert a new expert/categories pair to the expert table*/
CREATE OR REPLACE FUNCTION del_expertise(id_expert INT, cat VARCHAR)
RETURNS void AS $$
BEGIN
	PERFORM DELETE FROM expert WHERE nom_categorie=cat;
END; $$
LANGUAGE 'plpgsql';