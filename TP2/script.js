let grid;
const gap = 4; //4 px de gap
const duration = 300;   //duration des animations

$(document).ready(function () {
    $("#alert").hide();

    $("#init-button").click(function () {
        initGame();
    });

    $("#return-button").click(function () {
        window.location.reload(true);
    });

    $(window).resize(function () {
        buildGrid();
    });
});

function initGame() {
    let xStr = $("#x-input").val();
    let yStr = $("#y-input").val();

    let x = parseInt(xStr);
    let y = parseInt(yStr);

    if (xStr === "" || yStr === "" || x < 2 || y < 2) {
        $("#alert").show();
        return;
    }

    newGame(x, y);

    $("#game-init").hide();

    setKeyEvents();
}

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

function endTurn() {
    update();

    checkForLoss();    //si on a pas trouve de cellules null dans genrand, on a une possibilite d'avoir perdu: on le teste

    if (grid.won || grid.lost) {
        $("#game").hide();

        if (grid.lost) $("#won").hide();
        if (grid.won) $("#lost").hide();
    }
}

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

function newGame(x, y) {
    grid = {};

    grid.nb = 0;
    grid.lost = false;
    grid.won = false;

    grid.x = x;
    grid.y = y;
    grid.grid = [];

    for (let i = 0; i < x; i++) {
        let tempArr = [];
        for (let j = 0; j < y; j++) {
            tempArr.push(newTile(i, j));
        }

        grid.grid.push(tempArr);
    }

    grid.genRand = function () {
        let nullCells = [];

        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                if (this.grid[i][j].value === null) nullCells.push([i, j]);
            }
        }

        if (nullCells.length === 0) return false;

        const choice = nullCells[rand(nullCells.length)];

        const i = choice[0];
        const j = choice[1];

        this.grid[i][j].value = (rand(2) + 1) * 2;
        this.stateChanges["x" + i + "y" + j] = [i, j];

        return [i, j];
    };

    grid.stateChanges = {};
    grid.movedATile = false;    //as-t-on bouge une tuile lors de ce move?
    /*
        Prends une direction et la rend abstraite a l'aide des sous-fonctions de direction (left, right, up, down).

        Puis, appelle makeMove, qui fait un mouvement abstrait et les animations correspondantes
     */
    grid.move = function (dir) {
        grid.movedATile = false;

        function left(x, y) {
            return ok(x - 1, y);
        }

        function right(x, y) {
            return ok(x + 1, y);
        }

        function up(x, y) {
            return ok(x, y - 1);
        }

        function down(x, y) {
            return ok(x, y + 1);
        }

        function ok(x, y) {
            if (y < 0 || y >= grid.y || x < 0 || x >= grid.x) return null;
            else return grid.grid[x][y];
        }

        this.stateChanges = {};

        if (dir === -1 || dir === 1) {
            for (let j = 0; j < this.y; j++) {
                for (let falseI = 1; falseI < this.x; falseI++) {

                    let i = (dir === 1 ? falseI : this.x - 1 - falseI);
                    this.makeMove(i, j, dir === -1 ? right : left);
                }
            }
        } else {
            dir /= 2;
            for (let i = 0; i < this.x; i++) {
                for (let falseJ = 1; falseJ < this.y; falseJ++) {

                    let j = (dir === 1 ? falseJ : this.y - 1 - falseJ);
                    this.makeMove(i, j, dir === -1 ? down : up);
                }
            }
        }

        if (this.movedATile) {
            this.nb++;
            setTimeout(function () {
                endTurn();
                setKeyEvents();
            }, duration);
        } else {
            setKeyEvents();
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
        coordonnee donnee par dir.
     */
    grid.makeMove = function (i, j, dir) {
        function moveValue(value, x, y) {
            if (value === null) return false;

            let tile = dir(x, y);

            if (tile === null) return false;

            //let temp = grid.stateChanges["x"+tile.x+"y"+tile.y];

            if (value === tile.value) {

                /*
                    regarder si la tile a ete barree (etrangement juste aller voir dans l'objet tile ne fonctionne pas,
                    bug de JS?)
                 */
                try {
                    if (grid.stateChanges["x" + tile.x + "y" + tile.y][2]) return false;
                } catch (ignored) {
                }

                tile.value = tile.value * 2;
                tile.locked = true;

                if (tile.value === 2048) grid.won = true;

                return tile;
            } else if (tile.value === null) {
                let result = moveValue(value, tile.x, tile.y, dir);
                if (result === false) {
                    tile.value = value;
                    result = tile;
                }

                return result;
            }

            return false;
        }

        const gridSpacer = " + " + gap + "px * ";

        const editedTile = moveValue(this.grid[i][j].value, i, j);
        if (editedTile !== false) {
            this.stateChanges["x" + editedTile.x + "y" + editedTile.y] = [editedTile.x, editedTile.y, editedTile.locked];

            editedTile.locked = false;  //reset les locks

            this.grid[i][j].value = null;
            this.stateChanges["x" + i + "y" + j] = [i, j, false];

            let x = (editedTile.x - i);
            let y = (editedTile.y - j);

            let last = $("#x" + i + "y" + j);
            last.css({
                "transition": "transform " + duration + "ms",
                "transform": "translate( calc( 100% * " + x + gridSpacer + x + " ), calc( 100% * " + y + gridSpacer + y + " ) )"
            });

            this.movedATile = true;
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

function rand(max) {
    return Math.floor(Math.random() * max);
}

function buildGrid() {
    let inside = "";
    let css = "";

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

            css += "#" + key + "{ left: " + (width + gap + gap / (grid.x - 1)) * i + "px; top: " + (height + gap + gap / (grid.y - 1)) * j + "px; width: " + width + "px; height: " + height + "px; }\n";

            inside += '<div class="tile v' + val + '" id="' + key + '"><div class="v">' + (val !== null ? val : "") + '</div></div>';
        }
    }

    $("#style").html(css);   //efface l'ancien css et le remplace par le nouveau
    gridDiv.html(inside);
}

function update() {
    $(".counter").text("" + grid.nb);

    let xy = grid.genRand();

    for (let key in grid.stateChanges) {
        const tile = $("#" + key);

        const arr = grid.stateChanges[key];
        const val = grid.grid[arr[0]][arr[1]].value;

        tile.attr("style", "");
        tile.attr("class", "tile " + "v" + val);
        tile.html('<div class="v">' + (val === null ? "" : "" + val) + '</div>');
    }

    if (xy !== false) $("#x" + xy[0] + "y" + xy[1]).css({
        "animation-name": "rotate",
        "animation-duration": "" + duration + "ms",
        "animation-timing-function": "linear"
    });
}