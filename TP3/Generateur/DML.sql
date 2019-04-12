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
CREATE FUNCTION used_by (field INTEGER, day DATE, hour INTEGER, player_id INTEGER)
RETURNS VARCHAR(10)
BEGIN
	DECLARE player VARCHAR(10);
	SET player = (SELECT J_ID FROM Reservation WHERE T_ID=field AND R_date=day AND Heure=hour);

	IF player IS NULL THEN
		RETURN "Free";
	ELSEIF player=player_id THEN
		RETURN "You";
	ELSE
		RETURN "Taken";
	END IF;
END;
$$
DELIMITER ;

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

DELIMITER $$
CREATE PROCEDURE all_on_day(day DATE, hour VARCHAR(2), field VARCHAR(1), player INTEGER)
BEGIN
	CREATE TEMPORARY TABLE hourTable (h INTEGER);
	IF hour='a' THEN
		INSERT INTO hourTable VALUES(6), (7), (8), (9), (10), (11), (12), (13), (14), (15), (16), (17), (18), (19), (20);
	ELSE
		INSERT INTO hourTable VALUES(CAST(hour AS UNSIGNED)); 
	END IF;

	CREATE TEMPORARY TABLE fieldTable (f INTEGER);
	IF field='a' THEN
		INSERT INTO fieldTable VALUES(1), (2), (3), (4), (5);
	ELSE
		INSERT INTO fieldTable VALUES(CAST(field AS UNSIGNED)); 
	END IF;

	SELECT f, h, used_by(f, day, h, player) FROM (SELECT * FROM fieldTable CROSS JOIN hourTable) AS temp;
		
END;
$$
DELIMITER ;