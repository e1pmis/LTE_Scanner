let Scanner = require("./LTE_Scanner");
let scanner = new Scanner();

async function test() {
  let x = await scanner.search(796); 

  console.log(x);
}
test();
