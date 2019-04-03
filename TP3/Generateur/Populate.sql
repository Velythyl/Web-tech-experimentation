begin transaction;

set search_path to IFT3325TP3;

\copy categorie(Nom) from './genned_csv/categories.csv' WITH (FORMAT csv);

\copy individu(ID, Email, Mot_de_passe, Pseudonyme, Telephone, Adresse) from './genned_csv/individus.csv' WITH (FORMAT csv);

\copy item(ID, Prix, Titre, Description, Quantite, Condition, Nom_categorie, Etat) from './genned_csv/items.csv' WITH (FORMAT csv);

\copy expert(ID_expert, Nom_categorie) from './genned_csv/experts.csv' WITH (FORMAT csv);

\copy offre(No_offre, ID_acheteur, ID_annonceur, ID_item, Prix, Date,Date_val) from './genned_csv/offres.csv' WITH (FORMAT csv);

\copy proposition(No_prop,ID_annonceur,ID_item,Date) from './genned_csv/propositions.csv' WITH (FORMAT csv);

\copy sous_categorie(Categorie, Sous_categorie) from './genned_csv/par_enf.csv' WITH (FORMAT csv);

commit;
