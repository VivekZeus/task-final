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
    }
};
