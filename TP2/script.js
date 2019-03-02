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
        var tempArr = new Array(y);
        tempArr.fill(null);
        grid.grid.push(tempArr);
    }

    grid.genRand = function() {
        const x = rand(this.x);
        const y = rand(this.y);

        const temp = {};
        temp.value = 10;

        this.grid[x][y] = temp;
    };

    grid.genRand();
    grid.genRand();

    update();

    setCSS();
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

            let cell = grid.grid[i][j];
            if(cell !== null) inside += ' v'+cell.value+'">' + cell.value;
            else inside += '">'+i+", "+j;

            inside += '</div></div>';
        }
        inside += '</div>'
    }

    gridDiv.html(inside);
}