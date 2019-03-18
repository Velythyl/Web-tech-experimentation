let grid;
const gap = 4; //4 px de gap
const duration = 300;   //duration des animations

$(document).ready(function () {
    $("#alert").hide(); //cache le message d'erreur de début de jeu tant qu'il n'y a pas eu d'erreur

    $("#init-button").click(function () {   //commence la partie lorsqu'on clique sur le bouton
        initGame();
    });

    $("#return-button").click(function () { //on refresh toute la page lorsqu'on veut une nouvelle partie
                                            //(donc, tout se fait reset)
        window.location.reload(true);
    });

    $(window).resize(function () {  //lorsque la page se fait resize, on recalcule toute la grille de jeu
        buildGrid();
    });
});

/*
Fait une nouvelle partie en prenant les dimensions de champs input et en appelant newGame
 */
function initGame() {
    let xStr = $("#x-input").val();
    let yStr = $("#y-input").val();

    let x = parseInt(xStr); //prend le string du champ en int
    let y = parseInt(yStr);

    if (xStr === "" || yStr === "" || x < 2 || y < 2) {
        $("#alert").show(); //si aucune valeur ou x et y < 2, erreur
        return;
    }

    newGame(x, y);

    $("#game-init").hide();

    setKeyEvents(); //initie les keyEvents initiaux
}

/*
On ecoute les key events des fleches et de WASD. Lorsqu'un mouvement est detecte, on appelle grid.move.

Les mouvements horizontaux sont 1 et -1, verticaux 2 et -2. Si le mouvement se fera en réduisant une valeur de
coordonnee alors la valeur passee a move est negative...

https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
 */
function setKeyEvents() {
    $(document).one("keyup", function (e) {
        switch (e.which) {
            case 65:    //a
            case 37:    //left
                grid.move(1);
                break;

            case 87:    //w
            case 38:    //up
                grid.move(2);
                break;

            case 68:    //d
            case 39:    //right
                grid.move(-1);
                break;

            case 83:    //s
            case 40:    //down
                grid.move(-2);
                break;

            default:
                return;
        }

        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
}

/*
Fait la fin d'un tour en appelant update et en verifiant les conditions de fin de jeu
 */
function endTurn() {
    update();           //update la grille avec les changements

    checkForLoss();     //si on a pas trouve de cellules null dans genrand, on a une possibilite d'avoir perdu: on le teste

    //si on a gagne/perdu, on cache le jeu et on affiche le bon message de fin
    if (grid.won || grid.lost) {
        $("#game").hide();

        if (grid.lost) $("#won").hide();
        if (grid.won) $("#lost").hide();
    }
}

/*
Parcours toutes les tuiles et regarde si:

Sa valeur est null ou ses voisins ont la meme valeur on sort de la fonction
Si on arrive a la fin de la fonction, on a perdu
 */
function checkForLoss() {
    for (let i = 0; i < grid.x; i++) {
        for (let j = 0; j < grid.y; j++) {
            let val = grid.grid[i][j].value;

            if (val === null) return;

            /*
                Les try-catch permettent de beaucoup simplifier la logique: on ne fait que betement prendre les
                voisins de la cellule, et tant pis si c'est hors de la grille.
             */
            try {
                const down = grid.grid[i][j + 1].value;
                if (down === val) return;
            } catch (ignored) {
            }

            try {
                const right = grid.grid[i + 1][j].value;
                if (right === val) return;
            } catch (ignored) {
            }
        }
    }

    grid.lost = true;
}

/*
Fait une nouvelle partie en faisant un nouvel objet grid
 */
function newGame(x, y) {
    grid = {};

    grid.nb = 0;        //nb de coups faits
    grid.lost = false;  //si on a perdu
    grid.won = false;   //si on a gagne

    grid.x = x;         //dimensions en x
    grid.y = y;         //dimensions en y
    grid.grid = [];     //la grille contenant les tuiles

    //on remplie la grid avec des tuiles null
    for (let i = 0; i < x; i++) {
        let tempArr = [];   //chaque colonne a une ligne
        for (let j = 0; j < y; j++) {
            tempArr.push(newTile(i, j));
        }

        grid.grid.push(tempArr);
    }

    //cree une nouvelle tuile parmi toutes les tuiles qui sont null
    grid.genRand = function () {
        let nullCells = [];

        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                if (this.grid[i][j].value === null) nullCells.push([i, j]);
            }
        }

        //nullCells contient maintenant toutes les tuiles null
        if (nullCells.length === 0) return false;

        const choice = nullCells[rand(nullCells.length)];

        const i = choice[0];
        const j = choice[1];

        this.grid[i][j].value = (rand(2) + 1) * 2;      //soit 2 ou 4
        this.stateChanges["x" + i + "y" + j] = [i, j];        //on met le changement dans stateChanges pour update

        return [i, j];
    };

    grid.stateChanges = {};     //les changements aux tuiles faits ce tour-ci
    grid.movedATile = false;    //as-t-on bouge une tuile lors de ce move?

    /*
        Prends une direction et la rend abstraite a l'aide des sous-fonctions de direction (left, right, up, down).

        Puis, appelle makeMove, qui fait un mouvement abstrait et les animations correspondantes
     */
    grid.move = function (dir) {
        this.movedATile = false;    //reset movedATile
        this.stateChanges = {};     //reset stateChanges

        function left(x, y) {       //retourne la case a gauche de x, y
            return ok(x - 1, y);
        }

        function right(x, y) {      //retourne la case a droite de x, y
            return ok(x + 1, y);
        }

        function up(x, y) {         //retourne la case en haut de x, y
            return ok(x, y - 1);
        }

        function down(x, y) {       //retourne la case en bas de x, y
            return ok(x, y + 1);
        }

        function ok(x, y) {         //indique si la position demandee est hors de la grille en retournant null; retourne
                                    //la tuile de cette position sinon
            if (y < 0 || y >= grid.y || x < 0 || x >= grid.x) return null;
            else return grid.grid[x][y];
        }

        //Note: ce code de double for-loops est assez laid, mais il a ete concu pour reduire le dedoublement de code

        //si mouvement horizontal, on calcule la bonne position en i selon dir et on appelle makeMove sur la position
        if (dir === -1 || dir === 1) {
            for (let j = 0; j < this.y; j++) {
                for (let falseI = 1; falseI < this.x; falseI++) {

                    let i = (dir === 1 ? falseI : this.x - 1 - falseI);
                    this.makeMove(i, j, dir === -1 ? right : left);
                }
            }


        //si mouvement vertical, on calcule la bonne position en i selon dir et on appelle makeMove sur la position
        } else {
            dir /= 2;   //on veut juste 1, le 2 est utilise pour differencier vertical d'horizontal mais ce qui est
                        //important c'est la negativite
            for (let i = 0; i < this.x; i++) {
                for (let falseJ = 1; falseJ < this.y; falseJ++) {

                    let j = (dir === 1 ? falseJ : this.y - 1 - falseJ);
                    this.makeMove(i, j, dir === -1 ? down : up);
                }
            }
        }

        if (this.movedATile) {              //si on a bouge une tuile
            this.nb++;                          //on incremente le nb de coups
            setTimeout(function () {    //et, apres que les animations soient faites,
                endTurn();                      //on fait une fin de tour
                setKeyEvents();                 //et on reset les keyEvents
            }, duration);
        } else {                            //sinon
            setKeyEvents();                     //on ne fait que reset les keyEvents
        }


        /*
            Note: le timing avec setTimeout n'est pas exacte: on attend la duration des animations APRES que ces
            dernieres aient ete initialisees. Autrement dit, on attend un peu plus qu'on devrait. Une bonne alternative
            serait d'attendre que la derniere tuile visitee ait termine son animation comme suit:

            if(this.movedATile !== null) {
                //https://blog.teamtreehouse.com/using-jquery-to-detect-when-css3-animations-and-transitions-end
                this.movedATile.bind('transitionend', function () {
                    endTurn();
                    grid.movedATile.unbind();
                    setKeyEvents(); //refait les key events pour le prochain move
                });
            } else {
                setKeyEvents();
            }

            Cependant, ceci cree des bugs: parfois, aucun event de transitionend n'est envoye, ce qui fait que
            l'application gele puisqu'on n'appelle jamais setKeyEvents().
         */
    };
    /*
        Fait un mouvement abstrait decrit par dir a l'aide de moveValue, fonction qui bouge une valeur vers une
        coordonnee donnee par dir et anime ce mouvement.
     */
    grid.makeMove = function (i, j, dir) {

        /*
        Fait le mouvement abstrait
         */
        function moveValue(value, x, y) {
            if (value === null) return false;   //pas besoin de mouvement si la value est null

            let tile = dir(x, y);

            if (tile === null) return false;    //si la tuile est null, on est hors de la grille et on retourne false

            if (value === tile.value) {         //si on a une meme valeur dans la grille vers laquelle on bouge

                /*
                    regarder si la tile a ete barree (etrangement juste aller voir dans l'objet tile ne fonctionne pas,
                    bug de JS?)
                 */
                try {
                    if (grid.stateChanges["x" + tile.x + "y" + tile.y][2]) return false;    //si barree, on retourne
                } catch (ignored) {}

                tile.value = tile.value * 2;    //sinon, on double la valeur
                tile.locked = true;             //et on barre la tuile

                if (tile.value === 2048) grid.won = true;   //si la valeur et 2048 on a gagne

                return tile;    //on retourne la tuile

            } else if (tile.value === null) {   //si la valeur de la tuile cible est null
                let result = moveValue(value, tile.x, tile.y, dir); //on essaie de bouger la valeur a la tuile apres
                                                                    //cette cible

                if (result === false) { //si on ne peut pas, on recoit false
                    tile.value = value; //donc, on doit en fait update la cible courante
                    result = tile;      //et retourner la tile puisque c'est elle qui s'est fait updater
                }

                return result;          //peu importe, on retourne la tile qui s'est fait updater
            }

            return false;   //si aucun cas n'a fonctionne, retourne false
        }

        const gridSpacer = " + " + gap + "px * ";   //l'espace entre les tuiles

        const editedTile = moveValue(this.grid[i][j].value, i, j);  //la tuile changee par moveValue
        if (editedTile !== false) { //si editedTile est pas false, on a fait un changement

            //on ajoute la tuile changee a stateChanges pour update
            this.stateChanges["x" + editedTile.x + "y" + editedTile.y] = [editedTile.x, editedTile.y, editedTile.locked];

            editedTile.locked = false;  //reset les locks

            //peu importe le changement, s'il y en a eu un, la tuile d'origine est maintenant null
            this.grid[i][j].value = null;
            this.stateChanges["x" + i + "y" + j] = [i, j, false];   //on ajoute cela a stateChanges

            let x = (editedTile.x - i);
            let y = (editedTile.y - j);

            //on anime le mouvement de la tuile
            $("#x" + i + "y" + j).css({
                "transition": "transform " + duration + "ms",
                "transform": "translate( calc( 100% * " + x + gridSpacer + x + " ), calc( 100% * " + y + gridSpacer + y + " ) )"
            });

            this.movedATile = true; //on indique qu'on a fait un mouvement pour la dernier partie de grid.move
        }
    };

    grid.genRand(); //on met deux nouvelles tuiles dans la grille
    grid.genRand();

    buildGrid();    //on construit la grille avec les bonnes valeurs
}

/*
    Voir une tile comme un datatype, pas comme un objet...
 */
function newTile(x, y) {
    let obj = {};

    obj.value = null;
    obj.x = x;
    obj.y = y;
    obj.locked = false;

    return obj;
}

/*
Retourne un nb de 0 a max-1
 */
function rand(max) {
    return Math.floor(Math.random() * max);
}

/*
Construit la grille de jeu
 */
function buildGrid() {
    let inside = "";    //inside, le html qui va dans le div de jeu
    let css = "";       //le css qui agence les tuiles de la bonne facon

    let gridDiv = $("#grid");

    //cote de grid / nb de carres - les gaps entre les carres
    let width = gridDiv.width() / grid.x - gap;
    let height = gridDiv.height() / grid.y - gap;

    for (let i = 0; i < grid.x; i++) {
        for (let j = 0; j < grid.y; j++) {
            let val = grid.grid[i][j].value;

            /*
                Ceci pourrait facilement etre fait avec un css grid (donc, donner a grid: display: grid; grid-gap 4px;
                grid-auto-flow: column; et le nombre approprie de rows pour grid.x),
                mais ceci n'est pas compatible avec position: absolute ou fixed pour les grid items et on en a
                absolument besoin pour eviter des tonnes de reflow lors des animations du tour.

                De plus, il serait plus elegant de placer les regles de css de position et de grosseur dans une feuille
                css externe, mais en faisant ceci on ne peut plus changer la grosseur de la fenetre du browser sans
                faire une manipulation compliquee des regles de css.
             */

            let key = 'x' + i + 'y' + j;

            //ajoute au css une regle pour chaque tuile
            css += "#" + key + "{ left: " + (width + gap + gap / (grid.x - 1)) * i + "px; top: " + (height + gap + gap / (grid.y - 1)) * j + "px; width: " + width + "px; height: " + height + "px; }\n";

            //ajoute un div pour chaque tuile
            inside += '<div class="tile v' + val + '" id="' + key + '"><div class="v">' + (val !== null ? val : "") + '</div></div>';
        }
    }

    $("#style").html(css);      //efface l'ancien css et le remplace par le nouveau
    gridDiv.html(inside);       //efface l'ancien html du jeu et le remplace par le nouveau
}

/*
Update la grille (seulement les tuiles ayant eu un changement; plus efficace que d'appeler buildGrid a chaque tour
 */
function update() {
    $(".counter").text("" + grid.nb);   //update tous les counter avec le nouveau grid.nb

    let xy = grid.genRand();            //genere une nouvelle tuile aux coordonnees x, y

    for (let key in grid.stateChanges) {    //pour chaque changement
        const tile = $("#" + key);              //on prend le div de la tuile

        const arr = grid.stateChanges[key];
        const val = grid.grid[arr[0]][arr[1]].value;

        tile.attr("style", "");                     //on reset son style pour annuler ses animations
        tile.attr("class", "tile " + "v" + val);    //on lui donne les bonnes classes pour sa nouvelle valeur
        //on lui donne le bon texte pour sa valeur
        tile.html('<div class="v">' + (val === null ? "" : "" + val) + '</div>');
    }

    /*
    On anime la nouvelle tuile generee par genRand.

    Pas besoin de reset ce style puisqu'on specifie que l'animation ne se fait qu'une fois
     */
    if (xy !== false) $("#x" + xy[0] + "y" + xy[1]).css({
        "animation-name": "rotate",
        "animation-duration": "" + duration + "ms",
        "animation-timing-function": "linear"
    });
}