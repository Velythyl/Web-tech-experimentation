var grid;
var gridDiv;
const duration = 300;

$(document).ready(function() {
    $("#alert").hide();

    gridDiv = $("#grid");

    $("#init-button").click(function() {
       initGame();
    });

    $("#return-button").click(function () {
        $("#init-wrapper").show();
    })
});

function initGame() {
    let xStr = $("#x-input").val();
    let yStr = $("#y-input").val();

    let x = parseInt(xStr);
    let y = parseInt(yStr);

    if(xStr === "" || yStr === "" || x < 2 || y < 2) {
        $("#alert").show();
        return;
    }

    newGame(x, y);

    $("#init-wrapper").hide();

    // reset divs
    $("#game").show();
    $("#lost").show();
    $("#won").show();
    $("#alert").hide();
}

$(document).keyup(function(e) {
    if(!grid.ready) return; //on doit attendre que la grille se soit fait updater avant de jouer...

    switch(e.which) {
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

        case 13:    //enter
            if($("#init-wrapper").is(":visible")) initGame();
            return;

        default:
            return;
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

function endTurn() {
    let xy = grid.genRand();
    update();

    if(xy !== false) $("#x"+xy[0]+"y"+xy[1]).css({"animation-name": "rotate", "animation-duration": ""+duration+"ms", "animation-timing-function": "linear"});
    else checkForLoss();    //si on a pas trouve de cellules null dans genrand, on a une possibilite d'avoir perdu: on le teste

    if(grid.won || grid.lost) {
        $("#game").hide();

        if(grid.lost) $("#won").hide();
        if(grid.won) $("#lost").hide();
    }

    grid.ready = true;
}

function checkForLoss() {
    for(let i=0; i<grid.x; i++) {
        for(let j=0; j<grid.y; j++) {
            let val = grid.grid[i][j].value;

            /*
                Les try-catch permettent de beaucoup simplifier la logique: on ne fait que betement prendre tous les
                voisins de la cellule, et tant pis si c'est hors de la grille.
             */
            try {
                const up = grid.grid[i][j-1].value;
                if(up === val) return;
            } catch (ignored) {}
            try {
                const down = grid.grid[i][j+1].value;
                if(down === val) return;
            } catch (ignored) {}
            try {
                const left = grid.grid[i-1][j].value;
                if(left === val) return;
            } catch (ignored) {
                const right = grid.grid[i+1][j].value;
                if(right === val) return;
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

    grid.stateChanges = {};

    for(let i=0; i<x; i++) {
        var tempArr = [];
        for(let j=0; j<y; j++) {
            tempArr.push(newTile(i, j));
        }

        grid.grid.push(tempArr);
    }

    grid.genRand = function() {
        var nullCells = [];

        for(let i=0; i<x; i++) {
            for(let j=0; j<y; j++) {
                if(this.grid[i][j].value === null) nullCells.push([i, j]);
            }
        }

        if(nullCells.length === 0) return false;

        const choice = nullCells[rand(nullCells.length)];

        const i = choice[0];
        const j = choice[1];

        this.grid[i][j].value = (rand(2)+1)*2;
        this.stateChanges["x"+i+"y"+j] = [i, j];

        return [i, j];
    };

    grid.ready = true;  //le prochain tour est il pret?
    grid.move = function(dir) {
        this.nb++;
        this.stateChanges = {};
        this.ready = false;

        let last;   //last tile to be changed

        const gridSpacer = " + 0.25em * ";

        switch (dir) {
            case -1:
            case 1: //left
                for(let j=0; j<this.y; j++) {
                    for(let falseI=1; falseI<this.x; falseI++) {

                        let i = (dir === 1? falseI : this.x-1-falseI);

                        let x = i;
                        let y = j;

                        while(true) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x-dir][y];

                            let cond = cell.moveInto(nextCell, i, j);
                            if(cond === 0) break;

                            x -= dir;

                            if(cond === 1) break;

                            if(x-dir<0 || x-dir >= this.x) break;
                        }

                        if(x !== i) {
                            x = (x-i);

                            last = $("#x"+i+"y"+j);
                            last.css({"transition": "transform "+duration+"ms", "transform": ("translateX( calc( 100% * " + x + gridSpacer + x + " ) )") });
                        }
                    }
                }
                break;
            case -2: //down
            case 2: //up
                dir /= 2;

                for(let i=0; i<this.x; i++) {
                    for(let falseJ=1; falseJ<this.y; falseJ++) {

                        let j = (dir === 1? falseJ : this.y-1-falseJ);

                        let x = i;
                        let y = j;

                        while(true) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x][y-dir];

                            let cond = cell.moveInto(nextCell, i, j);
                            if(cond === 0) break;

                            y -= dir;

                            if(cond === 1) break;

                            if(y-dir<0 || y-dir>=this.y) break;
                        }

                        if(y !== j) {
                            y = (y-j);

                            last = $("#x"+i+"y"+j);
                            last.css({"transition": "transform "+duration+"ms", "transform": ("translateY( calc( 100% * " + y + gridSpacer + y + " ) )") });
                        }
                    }
                }
                break;
        }

        //https://blog.teamtreehouse.com/using-jquery-to-detect-when-css3-animations-and-transitions-end
        let hasNotFired = true;
        last.bind( 'transitionend', function() {
            if(hasNotFired) endTurn();
            hasNotFired = false;   //previent de fire le event deux fois
        });
    };

    grid.genRand();
    grid.genRand();

    buildGrid();
}

function newTile(x, y) {
    let obj = {};

    obj.value = null;
    obj.x = x;
    obj.y = y;

    /*
        Retourne 0 pour aucun mouvements,
        1 pour s'il y a eu un mouvement et qu'il ne peut y en avoir d'autres
        2 s'il y a eu un mouvement et qu'il peut y en avoir d'autres
     */
    obj.moveInto = function (tile, i, j) {
        if(this.value === null) return 0;

        if(this.value === tile.value) {
            this.value = null;
            tile.value = tile.value*2;
            if(tile.value === 2048) grid.won = true;

            this.changeDict(tile, i, j);

            return 1;
        } else if(tile.value === null) {
            tile.value = this.value;
            this.value = null;

            this.changeDict(tile, i, j);

            return 2;
        }

        return 0;
    };

    obj.changeDict = function (tile, i, j) {
        grid.stateChanges["x"+i+"y"+j] = [i, j];
        grid.stateChanges["x"+tile.x+"y"+tile.y] = [tile.x, tile.y];
    };

    return obj;
}

function rand(max) {
    return Math.floor(Math.random() * max);
}

function buildGrid() {
    let sheet = document.styleSheets[0];
    let inside = "";

    let gap = 4; //4 px de gap

    //cote de grid / nb de carres - les gaps entre les carres
    let width = gridDiv.width()/grid.x - gap;
    let height = gridDiv.height()/grid.y - gap;

    for(let i=0; i<grid.x; i++) {
        for(let j=0; j<grid.y; j++) {
            let val = grid.grid[i][j].value;

            let key = 'x'+i+'y'+j;

            if(val !== null) inside += '<div class="tile v'+val+'" id="'+key+'"><div class="v">' + val + '</div></div>';
            else inside += '<div class="tile" id="'+key+'"><div class="v"></div></div>';

            /*
                Pourrait facilement etre fait avec un css grid (donc, donner a grid: display: grid; grid-gap 4px;
                grid-auto-flow: column; et le nombre approprie de rows pour grid.x),
                mais ceci n'est pas compatible avec position: absolute ou fixed pour les grid items et on en a
                absolument besoin pour eviter des tonnes de reflow lors des animations du tour.
             */
            sheet.insertRule("#"+key+" { left: "+(width + gap)*i+"px; top: "+(height + gap)*j+"px; width: "+width+"px; height: "+height+"px; }");
        }
    }

    gridDiv.html(inside);
}

function update() {
    $(".counter").text(""+grid.nb);

    gridDiv.hide(); //prevent reflow

    for(let key in grid.stateChanges) {
        const tile = $("#"+key);

        const arr = grid.stateChanges[key];
        const val = grid.grid[arr[0]][arr[1]].value;

        tile.attr("style", "");
        tile.attr("class", "tile "+(val === null ? "" : "v"+val));
        tile.html('<div class="v">' + (val === null ? "" : ""+val) + '</div>');
    }

    gridDiv.show();
}