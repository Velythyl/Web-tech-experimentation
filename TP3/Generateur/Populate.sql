USE gautchar_IFT3225TP3;

/*https://stackoverflow.com/questions/3635166/how-to-import-csv-file-to-mysql-table*/

LOAD DATA INFILE 'genned_csv/gestionnaire.csv'
INTO TABLE Gestionnaire
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n';

LOAD DATA INFILE 'genned_csv/individu.csv'
INTO TABLE Individu
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n';

LOAD DATA INFILE 'genned_csv/joueur.csv'
INTO TABLE Joueur
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n';

LOAD DATA INFILE 'genned_csv/Reservation.csv'
INTO TABLE Reservation
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n';
