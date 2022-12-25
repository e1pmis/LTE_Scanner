let plt = require("nodeplotlib");
let rx = require("rxjs");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let x = [];
let y = [];
let id = [];

let cells = [];
var layout = {
    title: "LTE Scanner plot",
    xaxis: {
        title: "Frequency Mhz",
        showgrid: true,
        zeroline: false,
    },
    yaxis: {
        title: "qRxLevMin dB",
        showgrid: true,
        showline: false,
    },
    autosize: false,
    width: 1300,
    height: 500,
    margin: {
        l: 100,
        r: 100,
        b: 100,
        t: 100,
        pad: 4,
    },
    paper_bgcolor: "#c8cbcf",
    plot_bgcolor: "#f9f9f9",
};

const stream = rx.interval(1000).pipe(rx.map(pltCells));
function pltCells() {
    const data = [
        {
            x: x,
            y: y,
            mode: "markers",
            marker: { size: 16, color: "blue", symbol: "cross" },
            text: id,
            type: "scatter",
        },
        {
            x: [x[0]],
            y: [0],
            // marker: {
            //     color: "rgb(255, 217, 102)",
            //     size: 12,
            //     line: {
            //       color: "green",
            //       width: 0.5
            //     },
            type: "scatter",
        },
    ];
    // let graphOptions = {
    //     layout: layout,
    //     filename: "bubblechart",
    //     fileopt: "overwrite",
    // };
    return data;
}
plt.plot(stream, layout);

// const data = [
//     {
//         x: x,
//         y: y,
//         mode: "markers",
//         marker: {size:16 , color: 'red'},
//         text: id,
//         type: "scatter",
//     },
// ];
let check = () => {
    setTimeout(async () => {
        fetch("http://192.168.0.103:2250/getCells")
            .then(function (response) {
                return response.json();
            })
            .then(async function (myJson) {
                if (myJson.length == 0) {
                    x = [];
                    y = [];
                    id = [];
                    cells = [];
                }
                if (myJson.length !== cells.length) {
                    // console.log(myJson[0]);
                    cells = myJson;
                    for (let cel of myJson) {
                        x.push(cel.frequency);
                        y.push(cel.rxPowerLevel);
                        id.push(
                            `Cell ID: ${cel.id}\t\n RBs: ${cel.mib.RBs}\t\n Provider: ${cel.provider}`
                        );
                    }
                }
                check();
            })
            .catch(function (error) {
                console.log("Error: " + error);
            });
    }, 1000);
};
check();
