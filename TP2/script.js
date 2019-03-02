var grid;
var gridDiv;

$(document).ready(function() {
    gridDiv = $("#grid");

    $("#init-button").click(function() {
        newGame(parseInt($("#x-input").val()), parseInt($("#y-input").val()));

        $("#init-wrapper").hide();
    });
});

function newGame(x, y) {
    grid = {};

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
        let cell = newTile();
        cell.value = 1;
        while(cell.value !== null) {
            const x = rand(this.x);
            const y = rand(this.y);
            cell = this.grid[x][y];
        }

        cell.value = (rand(1)+1)*2;
    };

    grid.move = function(dir) {

        switch (dir) {
            case -1: //right
                for(let j=0; j<this.y; j++) {
                    for(let i=this.x-1; i>=0; i--) {

                        let cell = this.grid[i][j];
                        let nextCell = this.grid[i+1][j];

                        while(cell.moveInto(nextCell));
                    }
                }
            case 1: //left
                for(let j=0; j<this.y; j++) {
                    for(let i=1; i<this.x; i++) {

                        let cell = this.grid[i][j];
                        let nextCell = this.grid[i-1][j];

                        while(cell.moveInto(nextCell));
                    }
                }
        }
    };

    grid.genRand();
    grid.genRand();

    update();

    setCSS();
}



function newTile() {
    let obj = {};

    obj.value = null;  //nb qui est 0 ou 1 +1 : 1 ou 2 * 2: 2 ou 4
    obj.moveInto = function (tile) {
        if(this.value === tile.value) {
            this.value = null;
            tile.value = tile.value*2;
        } else if(tile.value === null) {
            tile.value = this.value;
            tile.value = null;
            return true;
        }

        return false;
    };

    return obj;
}

function rand(max) {
    return Math.floor(Math.random() * max);
}

function setCSS() {
    $(".row").css({"width": "100%", "height": "calc( 100% / "+grid.y+")"});
    $(".col").css({"width": "calc( 100% / "+grid.x+")", "display": "inline-block"});
}

function update() {
    let inside = "";

    for(let i=0; i<grid.x; i++) {
        inside += '<div class="col">';
        for(let j=0; j<grid.y; j++) {
            inside += '<div class="row tile'+i+' '+j+'"><div class="v';

            let val = grid.grid[i][j].value;
            if(val !== null) inside += ' v'+val+'">' + val;
            else inside += '">'+i+", "+j;

            inside += '</div></div>';
        }
        inside += '</div>'
    }

    gridDiv.html(inside);
}