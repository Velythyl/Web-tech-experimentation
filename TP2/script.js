var grid;
var gridDiv;

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

        case 13:
            if($("#init-wrapper").is(":visible")) initGame();
            return;

        default:
            return;
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)

    playTurn();
});

function playTurn() {
    const duration = 300;
    const gridGap = "0.25em";

    if(grid.x * grid.y < 36) {  // animations deviennent lourdes a peu pres a partir de 36 tuiles
        for(let key in grid.animDict) {
            let x = parseInt(key.substring(key.indexOf("x") + 1, key.indexOf("y")));
            let y = parseInt(key.split("y")[1]);

            x = (grid.animDict[key][0]-x);
            y = (grid.animDict[key][1]-y);

            const gridGapX = " + "+gridGap+" * " + x + " ";
            const gridGapY = " + "+gridGap+" * " + y + " ";

            $("#"+key).css({"transition": "transform "+duration+"ms", "transform": ("translate( calc( 100% * " + x + gridGapX + ") , calc( 100% * " + y + gridGapY + ") )") });
        }
    }

    setTimeout(function(){
        const xyv = grid.genRand();
        update();

        const newTile = $("#x"+xyv[0]+"y"+xyv[1]);
        newTile.css({"animation-name": "rotate", "animation-duration": ""+duration+"ms", "animation-iteration-count": "infinite", "animation-timing-function": "linear"});
        //{ "transition": ""+duration+"ms", "transform": "rotate(360deg)" } ne fonctionne pas car on est a l'interieur d'un setTimeout

        setTimeout(function () {
            newTile.removeAttr('style');    //https://stackoverflow.com/questions/1229688/how-can-i-erase-all-inline-styles-with-javascript-and-leave-only-the-styles-spec
        }, duration);

        if(grid.won || grid.lost) {
            $("#game").hide();

            if(grid.lost) $("#won").hide();
            if(grid.won) $("#lost").hide();
        }
    }, duration);
}

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
            tempArr.push(newTile(i, j));
        }

        grid.grid.push(tempArr);
    }

    grid.genRand = function() {
        var nullCells = [];

        for(let i=0; i<x; i++) {
            for(let j=0; j<y; j++) {
                if(this.grid[i][j].value === null) nullCells.push([this.grid[i][j], i, j]);
            }
        }

        const choice = nullCells[rand(nullCells.length)];
        choice[0].value = (rand(2)+1)*2;
        return [choice[1], choice[2], choice[0].value];
    };

    grid.move = function(dir) {
        this.nb++;
        this.animDict = {};

        switch (dir) {
            case -1:
            case 1: //left
                for(let j=0; j<this.y; j++) {
                    for(let falseI=1; falseI<this.x; falseI++) {

                        let i = (dir === 1? falseI : this.x-1-falseI);

                        let x = i;
                        let y = j;
                        let cond = true;

                        while(cond ) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x-dir][y];

                            cond = cell.moveInto(nextCell, i, j);

                            x -= dir;

                            if(x-dir<0 || x-dir >= this.x) break;
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
                        let cond = true;

                        while(cond) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x][y-dir];

                            cond = cell.moveInto(nextCell, i, j);

                            y -= dir;

                            if(y-dir<0 || y-dir>=this.y) break;
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

function newTile(x, y) {
    let obj = {};

    obj.value = null;
    obj.x = x;
    obj.y = y;

    obj.moveInto = function (tile, i, j) {
        if(this.value === null) return 0;

        if(this.value === tile.value) {
            this.value = null;
            tile.value = tile.value*2;
            if(tile.value === 2048) grid.won = true;

            grid.animDict["x"+i+"y"+j] = [tile.x, tile.y];

            return false;
        } else if(tile.value === null) {
            tile.value = this.value;
            this.value = null;

            grid.animDict["x"+i+"y"+j] = [tile.x, tile.y];

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

    sheet.insertRule("#grid { grid-template-rows: repeat("+grid.y+", auto); }")
}

function update() {
    $(".counter").text(""+grid.nb);

    let inside = "";
    let unsafe = true;

    for(let i=0; i<grid.x; i++) {
        for(let j=0; j<grid.y; j++) {
            let val = grid.grid[i][j].value;

            try {
                const up = grid.grid[i][j-1].value;
                if(up === val) unsafe = false;
            } catch (ignored) {}
            try {
                const down = grid.grid[i][j+1].value;
                if(down === val) unsafe = false;
            } catch (ignored) {}
            try {
                const left = grid.grid[i-1][j].value;
                if(left === val) unsafe = false;
            } catch (ignored) {
                const right = grid.grid[i+1][j].value;
                if(right === val) unsafe = false;
            }

            if(val !== null) inside += '<div class="tile v'+val+'" id="x'+i+'y'+j+'"><div class="v">' + val + '</div></div>';
            else {
                unsafe = false;
                inside += '<div class="tile" id="x'+i+'y'+j+'"><div class="empty-tile v">x</div></div>';
            }

        }
    }

    gridDiv.html(inside);

    if(unsafe) grid.lost = true;
}