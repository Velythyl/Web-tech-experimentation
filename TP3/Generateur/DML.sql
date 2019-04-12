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
CREATE FUNCTION used_by (field INTEGER, day DATE, hour INTEGER, player_id VARCHAR(30))
RETURNS VARCHAR(540)
BEGIN
	DECLARE player INTEGER;
	SET player = (SELECT J_ID FROM Reservation WHERE T_ID=field AND R_date=day AND Heure=hour);

	IF player IS NULL THEN
		RETURN "Free";
	ELSEIF player=CAST(player_id as UNSIGNED) THEN
		RETURN "You";
	ELSEIF player_id='admin' THEN
		RETURN (SELECT CONCAT("User: ", login, ". Name: ", nom, ". First name: ", prenom, ".") FROM Individu WHERE Individu.ID=player);
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
CREATE PROCEDURE all_on_day(day DATE, hourLo VARCHAR(3), hourHi VARCHAR(3), field VARCHAR(3), player VARCHAR(30))
BEGIN
	DECLARE x INTEGER;

	CREATE TEMPORARY TABLE hourTable (h INTEGER NOT NULL AUTO_INCREMENT, PRIMARY KEY  (h));
	INSERT INTO hourTable VALUES(hourLo);
	SET x=hourLo+1;

	WHILE x<= hourHi DO
		INSERT INTO hourTable VALUES (NULL);
		SET x=x+1;
	END WHILE;

	CREATE TEMPORARY TABLE fieldTable (f INTEGER);
	IF field='all' THEN
		INSERT INTO fieldTable VALUES(1), (2), (3), (4), (5);
	ELSE
		INSERT INTO fieldTable VALUES(CAST(field AS UNSIGNED)); 
	END IF;

	SELECT f, h, used_by(f, day, h, player) as u FROM (SELECT * FROM fieldTable CROSS JOIN hourTable) AS temp ORDER BY f, h;
		
END;
$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE reserve(terrain INTEGER, day DATE, hour INTEGER, player_id INTEGER)
BEGIN
	IF EXISTS(SELECT 1 FROM Reservation WHERE T_ID=terrain AND R_date=day AND heure=hour) OR DATEDIFF(day, CURDATE()) != 1 THEN
		SELECT 'FAILURE';
	ELSE
		INSERT INTO Reservation VALUES(terrain, day, hour, player_id);
		SELECT 'SUCCESS';
	END IF;	
END;
$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE unreserve(terrain INTEGER, day DATE, hour INTEGER, player_id INTEGER)
BEGIN
	DECLARE id INTEGER;

	SET id = SELECT J_ID FROM Reservation WHERE T_ID=terrain AND R_date=day AND heure=hour;

	IF NOT EXISTS(id) OR id!=player_id OR DATEDIFF(day, CURDATE()) < 0 THEN
		SELECT 'FAILURE';
	ELSE
		DELETE FROM Reservation WHERE T_ID=terrain AND R_date=day AND heure=hour;
		SELECT 'SUCCESS';
	END IF;	
END;
$$
DELIMITER ;