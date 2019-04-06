USE gautchar_IFT3225TP3;

/* select login('Antonio500', 'HVA90YJU7'); */
CREATE FUNCTION login (uname VARCHAR(255), mdp VARCHAR(255))
RETURNS BINARY
READS SQL DATA
RETURN
(
    SELECT(EXISTS(SELECT 1 FROM Individu WHERE login='Antonio500' AND mot_de_passe='HVA90YJIU7'))
);
