let Scanner = require("./LTE_Scanner");
let scanner = new Scanner();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let plt = require("nodeplotlib");
const data = [
    {
        x: [1, 3, 4, 5],
        y: [3, 12, 1, 4],
        type: "scatter",
    },
];

plt.plot(data);

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
    await scanner.scan(obj);
}

// test();
