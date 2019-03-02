var grid;
var gridDiv;

$(document).ready(function() {
    gridDiv = $("#grid");

    $("#init-button").click(function() {
        newGame(parseInt($("#x-input").val()), parseInt($("#y-input").val()));

        $("#init-wrapper").hide();
    });
});

$(document).keyup(function(e) {

    switch(e.which) {
        case 65:    //a
        case 37:    //left
            grid.move(1);
            break;

        case 87:    //w
        case 38:    // up
            grid.move(4);
            break;

        case 68:
        case 39: // right
            grid.move(0);
            break;

        case 83:    //s
        case 40:    // down
            grid.move(3);
            break;

        default:
            return;
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)

    grid.genRand();
    update();
    //TODO tester grid.won et grid.lost, faire trucs appropries
});

function newGame(x, y) {
    grid = {};

    grid.nb = 0;
    grid.lost = false;
    grid.won = false;

    grid.x = x;
    grid.y = y;
    grid.grid = [];

    for(let i=0; i<x; i++) {
        var tempArr = [];
        for(let j=0; j<y; j++) {
            tempArr.push(newTile());
        }

        grid.grid.push(tempArr);
    }

    grid.genRand = function() {
        var nullCells = [];

        for(let i=0; i<x; i++) {
            for(let j=0; j<y; j++) {
                if(this.grid[i][j].value === null) nullCells.push(this.grid[i][j]);
            }
        }

        nullCells[rand(nullCells.length)].value = (rand(2)+1)*2;
    };

    grid.move = function(dir) {
        this.animArrX = [];
        this.animArrY = [];
        this.nb++;

        switch (dir) {
            case 0: //right
                for(let j=0; j<this.y; j++) {
                    for(let i=this.x-2; i>=0; i--) {

                        let x = i;
                        let y = j;
                        let cond = true;

                        while(cond) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x+1][y];

                            cond = cell.moveInto(nextCell);

                            x++;

                            if(x+1>=this.x) break;
                        }
                    }
                }
                break;
            case 1: //left
                for(let j=0; j<this.y; j++) {
                    for(let i=1; i<this.x; i++) {

                        let x = i;
                        let y = j;
                        let cond = true;

                        while(cond) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x-1][y];

                            cond = cell.moveInto(nextCell);

                            x--;

                            if(x-1<0) break;
                        }
                    }
                }
                break;
            case 3: //down
                for(let i=0; i<this.x; i++) {
                    for(let j=this.y-2; j>=0; j--) {

                        let x = i;
                        let y = j;
                        let cond = true;

                        while(cond) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x][y+1];

                            cond = cell.moveInto(nextCell);

                            y++;

                            if(y+1>=this.y) break;
                        }
                    }
                }
                break;
            case 4: //up
                for(let i=0; i<this.x; i++) {
                    for(let j=1; j<this.y; j++) {

                        let x = i;
                        let y = j;
                        let cond = true;

                        while(cond) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x][y-1];

                            cond = cell.moveInto(nextCell);

                            y--;

                            if(y-1<0) break;
                        }
                    }
                }
                break;
        }

    };

    grid.genRand();
    grid.genRand();

    update();
    setCSS();
}

function newTile() {
    let obj = {};

    obj.value = null;
    obj.moveInto = function (tile) {
        if(this.value === null) return false;

        if(this.value === tile.value) {
            this.value = null;
            tile.value = tile.value*2;
            if(tile.value === 2048) grid.won = true;
        } else if(tile.value === null) {
            tile.value = this.value;
            this.value = null;
            return true;
        }

        return false;
    };

    return obj;
}

function rand(max) {
    return Math.floor(Math.random() * max);
}

function setCSS() { //set le css une seule fois pour toute la partie
    let sheet = document.styleSheets[0];

    sheet.insertRule(".row { width: 100%; height: calc( 100% / "+grid.y+"); }");
    sheet.insertRule(".col { width: calc( 100% / "+grid.x+"); height: 100%; display: inline-block }");
}

function update() {
    $("#counter").text(""+grid.nb);

    let inside = "";
    let safe = false;

    for(let i=0; i<grid.x; i++) {
        inside += '<div class="col">';
        for(let j=0; j<grid.y; j++) {
            inside += '<div class="row tile" id="x'+i+'y'+j+'"><div class="v';

            let val = grid.grid[i][j].value;
            if(val !== null) inside += ' v'+val+'">' + val;
            else {
                safe = true;
                inside += '">x';
            }

            inside += '</div></div>';
        }
        inside += '</div>'
    }

    gridDiv.html(inside);

    if(!safe) grid.lost = true;
}