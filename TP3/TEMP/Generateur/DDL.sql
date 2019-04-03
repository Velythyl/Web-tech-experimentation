begin transaction;

drop schema if exists kijiji cascade;
create schema kijiji;
set search_path to kijiji;

CREATE TABLE categorie(
       Nom VARCHAR (50) PRIMARY KEY
);

CREATE TABLE individu(
       ID int PRIMARY KEY,
       Email VARCHAR (255) UNIQUE NOT NULL,
       Mot_de_passe VARCHAR (30) NOT NULL,
       Pseudonyme VARCHAR (20) UNIQUE NOT NULL,
       Telephone CHAR (12),
       Adresse VARCHAR (255)
);

CREATE TYPE STATUS as ENUM ('Evince', 'Attente', 'Affiche', 'Vendu');

CREATE TABLE item(
	ID int PRIMARY KEY,
	Prix int NOT NULL CONSTRAINT positive_price CHECK(prix>0),
	Titre VARCHAR (100) NOT NULL,
	Description VARCHAR (355) NOT NULL,
	Quantite int NOT NULL CONSTRAINT positive_amount
	CHECK(quantite>0),
	Condition int NOT NULL,
	Nom_categorie VARCHAR (50) REFERENCES categorie NOT NULL,
	Etat etat NOT NULL
);

CREATE TABLE expert(
	ID_expert int REFERENCES individu(ID) NOT NULL,
	Nom_Categorie VARCHAR(50) NOT NULL
);

CREATE TABLE offre(
	No_offre int PRIMARY KEY,
	ID_acheteur int REFERENCES individu(ID) NOT NULL,
	ID_annonceur int REFERENCES individu(ID) NOT NULL,
	ID_item int REFERENCES item(ID) NOT NULL,
	Prix int NOT NULL
	CONSTRAINT positive_price CHECK(prix>0),
	Date date NOT NULL,
	Date_val date
);

CREATE TABLE evaluation(
	No_eval int PRIMARY KEY,
	ID_expert int REFERENCES individu(ID) NOT NULL,
	Prix int  NOT NULL
	CONSTRAINT positive_price CHECK(prix>0),
	Date date NOT NULL,
	ID_item int REFERENCES item(ID) NOT NULL,	
	Date_val date
);

CREATE TABLE proposition(
	No_prop int PRIMARY KEY,
	ID_annonceur int REFERENCES individu(ID) NOT NULL,
	ID_item int REFERENCES item(ID) NOT NULL,
	Date date NOT NULL
);

CREATE TABLE sous_categorie(
	Categorie varchar(50) REFERENCES categorie(Nom) NOT NULL,
	Sous_categorie varchar(50) REFERENCES categorie(Nom)
);

grant all on schema kijiji to liurober_app;
grant all on all tables in schema kijiji to liurober_app;
grant all on schema kijiji to blanchdo_app;
grant all on all tables in schema kijiji to blanchdo_app;


commit;
