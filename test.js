let Scanner = require("./LTE_Scanner");
let scanner = new Scanner();

async function test() {
    await scanner.search(796, 2, 50, []);
    // await scanner.search(806, 2 , 30);
    // await scanner.search(816, 2);
    console.log(scanner.cells)
    console.log(scanner.frequencies)
}


test();