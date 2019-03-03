var grid;
var gridDiv;

$(document).ready(function() {
    $("#alert").hide();

    gridDiv = $("#grid");

    $("#init-button").click(function() {
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
    });

    $("#return-button").click(function () {
        $("#init-wrapper").show();
    })
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

    displayTurn();

    if(grid.won || grid.lost) {
        $("#game").hide();

        if(grid.lost) $("#won").hide();
        if(grid.won) $("#lost").hide();
    }
    //TODO tester grid.won et grid.lost, faire trucs appropries
});

function displayTurn() {
    const duration = 300;
    const gridGap = "0.25em";

    for(let key in grid.animDict) {
        let x = parseInt(key.substring(key.indexOf("x") + 1, key.indexOf("y")));
        let y = parseInt(key.split("y")[1]);

        x = (grid.animDict[key][0]-x);
        y = (grid.animDict[key][1]-y);

        const gridGapX = " + "+gridGap+" * " + x + " ";
        const gridGapY = " + "+gridGap+" * " + y + " ";

        $("#"+key).css({"transition": "transform "+duration+"ms", "transform": ("translate( calc( 100% * " + x + gridGapX + ") , calc( 100% * " + y + gridGapY + ") )") });
    }

    const xyv = grid.genRand();
    const tile = $("#x"+xyv[0]+"y"+xyv[1]);
    tile.addClass("v"+xyv[2]);
    tile.css({ "transition": "transform "+duration+"ms", "transform": "rotate(360deg)" });

    setTimeout(function(){
        update();
    }, duration*2);
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
        let tempArr = [];
        for(let j=0; j<y; j++) {
            tempArr.push(newTile());
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
        //if(cond) this.animDict[i][j] = [x, y+1];
        //let corrI = (dir === -1 ? this.x-1-i : i);

        switch (dir) {
            case 0: //right
                for(let j=0; j<this.y; j++) {
                    for(let i=this.x-2; i>=0; i--) {

                        let x = i;
                        let y = j;
                        let cond = 2;

                        while(cond === 2) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x+1][y];

                            cond = cell.moveInto(nextCell);

                            x++;

                            if(cond > 0) this.animDict["x"+i+"y"+j] = [x, y];

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
                        let cond = 2;

                        while(cond === 2) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x-1][y];

                            cond = cell.moveInto(nextCell);

                            x--;

                            if(cond > 0) this.animDict["x"+i+"y"+j] = [x, y];

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
                        let cond = 2;

                        while(cond === 2) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x][y+1];

                            cond = cell.moveInto(nextCell);

                            y++;

                            if(cond > 0) this.animDict["x"+i+"y"+j] = [x, y];

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
                        let cond = 2;

                        while(cond === 2) {
                            let cell = this.grid[x][y];
                            let nextCell = this.grid[x][y-1];

                            cond = cell.moveInto(nextCell);

                            y--;

                            if(cond > 0) this.animDict["x"+i+"y"+j] = [x, y];

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
        if(this.value === null) return 0;

        if(this.value === tile.value) {
            this.value = null;
            tile.value = tile.value*2;
            if(tile.value === 2048) grid.won = true;
            return 1;
        } else if(tile.value === null) {
            tile.value = this.value;
            this.value = null;
            return 2;
        }

        return 0;
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