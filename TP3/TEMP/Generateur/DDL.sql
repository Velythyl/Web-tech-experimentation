/*TODO
Club de sport(joueurs, gestionnaire)
Individu(ID, nom, prénom, login, mot de passe) ID clé primaire
joueurs(I_ID) clé étrangère
gestionnaire(I_ID) clé étrangère

Terrain(T_ID, 6-7, 7-8, 8-9, 9-10, 10-11, 11-12, 12-13, 13-14, 14-15, 15-16, 16-17, 17-18, 18-19, 19-20, 20-21)

END TODO*/

begin transaction;

drop schema if exists IFT3325TP3 cascade;
create schema IFT3325TP3;
set search_path to IFT3325TP3;

CREATE TABLE Individu(
    ID INT PRIMARY KEY,
    nom VARCHAR (255) UNIQUE NOT NULL,
    prenom VARCHAR (255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR (30) NOT NULL,
    login VARCHAR (255) UNIQUE NOT NULL
);

CREATE TABLE Joueurs(
    ID INT REFERENCES Individu(ID) NOT NULL
);

CREATE TABLE Gestionnaire(
    ID INT REFERENCES Individu(ID) NOT NULL
);

CREATE TABLE Terrain(
	T_ID INT PRIMARY KEY,
	6-7 INT,
    7-8 INT,
    8-9 INT,
    9-10 INT,
    10-11 INT,
    11-12 INT,
    12-13 INT,
    13-14 INT,
    14-15 INT,
    15-16 INT,
    16-17 INT,
    17-18 INT,
    18-19 INT,
    19-20 INT,
    20-21 INT
);

grant all on schema kijiji to liurober_app;
grant all on all tables in schema kijiji to liurober_app;
grant all on schema kijiji to blanchdo_app;
grant all on all tables in schema kijiji to blanchdo_app;

commit;
