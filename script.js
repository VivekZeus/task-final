var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function () {
    function create2dArray(n, m, cellDefaultvalue) {
        if (cellDefaultvalue === void 0) { cellDefaultvalue = ""; }
        var array = new Array(n);
        for (var i = 0; i < n; i++) {
            if (typeof cellDefaultvalue == "object") {
                array[i] = new Array(m).fill(__assign({}, cellDefaultvalue));
            }
            else {
                array[i] = new Array(m).fill(cellDefaultvalue);
            }
        }
        return array;
    }
    var rows = 100;
    var cols = 100;
    var spreadSheetdata = create2dArray(rows, cols, "");
    var cellProperties = create2dArray(rows, cols, { textAlign: "left" });
    var rowHeights = new Array(rows).fill(26);
    var colHeights = new Array(rows).fill(100);
    var canvas;
    var context;
    var DrawComponent = (function () {
        function drawSingleCell(row, col) {
            var properties = cellProperties[row][col];
            var y = 0;
            var x = 0;
            for (var r = 0; r < row; r++) {
                y += rowHeights[r];
            }
            for (var c = 0; c < col; c++) {
                x += colHeights[c];
            }
            context === null || context === void 0 ? void 0 : context.strokeRect(x, y, colHeights[row], rowHeights[col]);
        }
        function drawcells() {
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < cols; c++) {
                    drawSingleCell(r, c);
                }
            }
        }
        function drawGrid() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = "rgba(0,0,0,0.2)";
            drawcells();
        }
        return { drawGrid: drawGrid };
    })();
    var selectedCell = {
        row: 1,
        col: 1,
    };
    var selectedcellRange = {
        startRow: selectedCell.row,
        startCol: selectedCell.col,
        endRow: selectedCell.row,
        endCol: selectedCell.col,
    };
    document.addEventListener("DOMContentLoaded", function () {
        canvas = document.getElementById("spreadsheet");
        context = canvas.getContext("2d");
        DrawComponent.drawGrid();
    });
});
