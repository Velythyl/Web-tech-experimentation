# IFT3225TP1


1. Faire ce qui est expliqué en haut de procédure.txt. Cela te permet de te connecter à la base de données sur les serveurs du DIRO.

2. Se connecter au diro en ssh. Puis, cloner la repo github et rouler le fichier init.sh

3. Setup est fait ! 🎉 C'est normal qu'après avoir entré ton mot de passe pour la 3e fois ca
plante.

4. Arranger le fichier DML.sql pour notre TP. Commencer par la fonction du bas, login. En fait, il faudrait une fonction pour faire: login, ajouter un joueur ou un individu ou une réservation, transmettre les droits de gestionnaire, et finalement aller cherher toutes les réservations selon la personne, l'heure, ou le jour (s'inspirer de item_search). Toutes ces fonctions sont déjà écrites, il faut juste les traduire de kijiji a notre club de sport. Boucle pour tester ca: dans un terminal, se logger en ssh au diro, partir mysql. Sur un autre terminal, lorsque DML.sql a finit d'être modifié, utiliser la ligne qui est dans procédure pour placer tes fonctions dans la BD. Puis, dans le premier terminal, appeler select * from fonction(args); pour tester
