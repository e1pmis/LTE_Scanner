let Scanner = require("./LTE_Scanner");
let scanner = new Scanner();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function test() {
    await scanner.search(796, 2, 50, []).then((data)=> console.log(data)).catch((err)=> console.log(err));
    await scanner.search(806, 2, 50, []).then((data)=> console.log(data)).catch((err)=> console.log(err));
    await scanner.search(816, 2, 50, []).then((data)=> console.log(data)).catch((err)=> console.log(err));
    console.log("delay");
    await delay(1000 * 10);
    console.log(scanner.cells);
    console.log(scanner.frequencies);
}

test();
