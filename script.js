const Body = document.body;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let cells = [];
let check = () => {
    setTimeout(() => {
        fetch("./getCells")
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                if (myJson.length !== cells.length) {
                    const button = document.getElementById("results");
                    button.innerText = "Show results!";
                    button.style.color = "green";
                    cells = myJson;
                    getCells();
                }
                check();
            })
            .catch(function (error) {
                console.log("Error: " + error);
            });
    }, 1000);
};
check();

// let reset = (document.getElementById("reset").onclick = () => {
//     cells = [];
//     fetch("./reset")
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (myJson) {})
//         .catch(function (error) {
//             console.log("Error: " + error);
//         });
// });

let getCells = (document.getElementById("results").onclick = async () => {
    const button = document.getElementById("results");
    button.innerText = "";
    fetch("./getCells")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            // console.log(myJson.length);

            const table = document.getElementById("table");

            let tableRows = table.getElementsByTagName("tr");
            let rowCount = tableRows.length;

            console.log(rowCount);

            for (let x = rowCount - 1; x > 0; x--) {
                table.deleteRow(x);
            }

            // let row = table.insertRow();
            // let tc = row.insertCell();
            // tc.innerText = "Cell";
            // tc = row.insertCell();
            // tc.innerText = "MIB";
            // tc = row.insertCell();
            // tc.innerText = "PDSCH";
            // tc = row.insertCell();
            // tc.innerText = "BCCH Message";

            for (let i = 0; i < myJson.length + 2; i++) {
                let row = table.insertRow();
                let cell = myJson.pop();
                let tableCell = row.insertCell();
                // TableCell.innerHTML = `<ul class='ul li ol'> <li>Initial cell id: ${cell.id} </li> <li>Operting frequency: ${cell.frequency}</li><li>Cell type: ${cell.type}</li><li>Rx power level: ${cell.rxPowerLevel}</li><li>MCC: ${cell.mcc}</li><li>MNC: ${cell.mnc}</li></ul>`;
                tableCell.innerHTML = `<a>Initial cell id: ${cell.id}</a><ul><li>Operting frequency: ${cell.frequency} Mhz</li><li>Cell type: ${cell.type}</li></ul>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<ul> <li>Antennas: ${cell.mib.Antennas} </li> <li>RB's: ${cell.mib.RBs}</li><li>FN: ${cell.mib.FN}</li> <li>PHICH_duration: ${cell.mib.PHICH_duration}</li></ul>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<ul> <li>RNTI: ${cell.PDSCH.RNTI} </li> <li>Modulation: ${cell.PDSCH.Modulation}</li><li>Redundancy_Version: ${cell.PDSCH.Redundancy_Version}</li> <li>TransportBlock: ${cell.PDSCH.TransportBlock}</li></ul>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<ul> <li>decodedID: ${cell.decodedID} </li> <li>MCC: ${cell.mcc}</li><li>MNC: ${cell.mnc}</li> <li>RxPowerLevel: ${cell.rxPowerLevel} dB</li></ul>`;
            }
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
});
