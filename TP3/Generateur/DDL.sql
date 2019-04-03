/*TODO/*TODO
Club de sport(joueurs, gestionnaire)
Individu(ID, nom, prénom, login, mot de passe) ID clé primaire
joueurs(I_ID) clé étrangère
gestionnaire(I_ID) clé étrangère

Terrain(T_ID, Date, 6-7, 7-8, 8-9, 9-10, 10-11, 11-12, 12-13, 13-14, 14-15, 15-16, 16-17, 17-18, 18-19, 19-20, 20-21)

END TODO*/

drop schema if exists IFT3325TP3;
create schema IFT3325TP3;
use IFT3325TP3;

CREATE TABLE Individu(
    ID INT PRIMARY KEY,
    nom VARCHAR (255) NOT NULL,
    prenom VARCHAR (255) NOT NULL,
    mot_de_passe VARCHAR (30) NOT NULL,
    login VARCHAR (255) UNIQUE NOT NULL
);

CREATE TABLE Joueur(
    ID INT REFERENCES Individu(ID) NOT NULL
);

CREATE TABLE Gestionnaire(
    ID INT REFERENCES Individu(ID) NOT NULL
);

CREATE TABLE Terrain(
	T_ID INT PRIMARY KEY,
	T_date DATE NOT NULL DEFAULT CURRENT DATE,
    6_7 INT NOT NULL,
    7_8 INT NOT NULL,
    8_9 INT NOT NULL,
    9_10 INT NOT NULL,
	10_11 INT NOT NULL,
	11_12 INT NOT NULL,
	12_13 INT NOT NULL,
	13_14 INT NOT NULL,
	14_15 INT NOT NULL,
	15_16 INT NOT NULL,
	16_17 INT NOT NULL,
	17_18 INT NOT NULL,
	18_19 INT NOT NULL,
	19_20 INT NOT NULL,
	20_21 INT NOT NULL
);

grant all on schema IFT3325TP3 to gautchar;
grant all on all tables in schema IFT3325TP3 to gautchar;