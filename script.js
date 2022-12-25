const Body = document.body;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let cells = [];
let getCells = (document.getElementById("table").onclick = () => {
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

            for (let cell of myJson) {
                let row = table.insertRow();
                let tableCell = row.insertCell();
                tableCell.innerHTML = `<dl><dt>Initial cell id:</dt><dt>Operting frequency:</dt><dt>Cell type:</dt><dt>Provider:</dt></dl>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<dl><dt>${cell.id}</dt><dt>${cell.frequency} Mhz</dt><dt>${cell.type}</dt><dt><img src="img/${cell.provider}.gif" alt="v" title="vv"></dt></dl>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<dl> <dt>Antennas:</dt><dt>RB's:</dt><dt>FN:</dt> <dt>PHICH_duration:</dt></dl>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<dl>${cell.mib.Antennas}</dt><dt>${cell.mib.RBs}</dt><dt>${cell.mib.FN}</dt> <dt>${cell.mib.PHICH_duration}</dt></dl>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<dl> <dt>RNTI:</dt> <dt>Modulation:</dt><dt>Redundancy_Version:</dt> <dt>TransportBlock:</dt></dl>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<dl> <dt>${cell.PDSCH.RNTI}</dt><dt>${cell.PDSCH.Modulation}</dt><dt>${cell.PDSCH.Redundancy_Version}</dt> <dt>${cell.PDSCH.TransportBlock}</dt></dl>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<dl> <dt>Decoded id:</dt> <dt>MCC:</dt><dt>MNC:</dt> <dt>qRxPowerLevel:</dt></dl>`;
                tableCell = row.insertCell();
                tableCell.innerHTML = `<dl> <dt>${cell.decodedID} </dt> <dt>${cell.mcc}</dt><dt>${cell.mnc}</dt> <dt>${cell.rxPowerLevel} dB</dt></dl>`;
            }
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
});

let check = () => {
    setTimeout(() => {
        fetch("./getCells")
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                if (myJson.length !== cells.length) {
                    // const button = document.getElementById("results");
                    // button.innerText = "Show results!";
                    // button.style.color = "green";
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

let reset = (document.getElementById("reset").onclick = () => {
    cells = [];
    fetch("./reset")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {})
        .catch(function (error) {
            console.log("Error: " + error);
        });
    window.location.reload();
});
