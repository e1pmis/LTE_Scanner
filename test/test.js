let Scanner = require("./LTE_Scanner");
let scanner = new Scanner();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let obj = {
    noa: "2",
    rxgain: "80",
    sFreq: "796",
    step: "10",
    eFreq: "816",
    time: "40",
    attemps: "3",
};

async function test() {
    await plt.start();
}

test();
