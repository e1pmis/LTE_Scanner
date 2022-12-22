let plt = require("nodeplotlib");
// let fetch = require("node-fetch");
let x = [];
let y = [];
let id = [];

let cells = [];
const data = [
    {
        x: x,
        y: y,
        mode: "markers",
        marker: {size:16 , color: 'red'},
        text: id,
        type: "scatter",
    },
];
let check = () => {
    setTimeout(() => {
        fetch("http://192.168.0.103:2250/getCells")
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                if (myJson.length !== cells.length) {
                    // console.log(myJson[0]);
                    cells = myJson
                    for (let cel of myJson) {
                        x.push(cel.frequency);
                        y.push(cel.rxPowerLevel);
                        id.push(`Cell ID: ${cel.id}`);
                    }
                    console.log('plotting')
                    plt.plot.apply(data)
                }
                check();
            })
            .catch(function (error) {
                console.log("Error: " + error);
            });
    }, 1000);
};
plt.plot(data);
check();
