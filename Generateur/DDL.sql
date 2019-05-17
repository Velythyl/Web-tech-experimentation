/*TODO/*TODO
Club de sport(joueurs, gestionnaire)
Individu(ID, nom, prénom, login, mot de passe) ID clé primaire
joueurs(I_ID) clé étrangère
gestionnaire(I_ID) clé étrangère

Terrain(T_ID, Date, 6-7, 7-8, 8-9, 9-10, 10-11, 11-12, 12-13, 13-14, 14-15, 15-16, 16-17, 17-18, 18-19, 19-20, 20-21)

END TODO*/

drop database if exists gautchar_IFT3225TP3;
create database gautchar_IFT3225TP3;
use gautchar_IFT3225TP3;

	CREATE TABLE Individu (
    ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nom VARCHAR (255) UNIQUE NOT NULL,
    prenom VARCHAR (255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR (30) NOT NULL,
    login VARCHAR (30) UNIQUE NOT NULL
);

CREATE TABLE Joueur (
    ID INT NOT NULL,
    FOREIGN KEY(ID) REFERENCES Individu(ID)
);

CREATE TABLE Gestionnaire (
    ID INT NOT NULL,
    FOREIGN KEY(ID) REFERENCES Individu(ID)
);

CREATE TABLE Terrain (
    ID INT NOT NULL PRIMARY KEY
);

CREATE TABLE Plages (
    ID INT NOT NULL PRIMARY KEY
);

CREATE TABLE Reservation (
	T_ID INT,
	R_date DATE NOT NULL,
    Heure INTEGER NOT NULL,
    J_ID INT NOT NULL,
    FOREIGN KEY(J_ID) REFERENCES Joueur(ID),
	FOREIGN KEY(T_ID) REFERENCES Terrain(ID),
FOREIGN KEY(Heure) REFERENCES Plages(ID),
    CONSTRAINT def_heures CHECK (Heure >= 6 AND Heure <= 20),
    PRIMARY KEY (T_ID, R_date, Heure),
	UNIQUE(R_date, J_ID)
);


/*
GRANT ALL PRIVILEGES ON gautchar_IFT3225TP3 TO 'gautchar'@'localhost';
GRANT ALL PRIVILEGES ON gautchar_IFT3225TP3.* TO 'gautchar'@'localhost'

grant all on schema IFT3225TP3 to gautchar;
grant all on all tables in schema IFT3225TP3 to gautchar;*/
