export const Utils = {
    numberToColheader(num) {
        let colHeader = "";
        num++;
        while (num > 0) {
            let remainder = (num - 1) % 26;
            colHeader = String.fromCharCode(65 + remainder) + colHeader;
            num = Math.floor((num - 1) / 26);
        }
        return colHeader;
    },
    updateCellSelectionInfo(grid) {
        const { startCol, startRow } = grid.SELECTED_CELL_RANGE;
        let char = Utils.numberToColheader(startCol);
        const cellElement = document.getElementById("cellInfo");
        if (cellElement) {
            cellElement.innerHTML = `${char}${startRow + 1}`;
        }
    },
};
