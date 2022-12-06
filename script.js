const Body = document.body;
let cells = [];
let check = () => {
    setTimeout(() => {
        fetch("./getCells")
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                if (myJson.length !== cells.length) {
                    const button = document.getElementById("gcells");
                    button.style.color = "red";
                    cells = myJson;
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
});

let getCells = (document.getElementById("gcells").onclick = () => {
    const button = document.getElementById("gcells");
    button.style.color = "black";
    fetch("./getCells")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson.length);
            try {
                const table = document.getElementById("table");
                let tableRows = table.getElementsByTagName("tr");
                let rowCount = tableRows.length;

                for (let x = rowCount - 1; x > 0; x--) {
                    table.removeChild(tableRows[x]);
                }
            } catch {}
            let x = myJson.length % 3;
            let y = myJson.length + (3 - x);
            let rawsnumber = y / 3;
            if (myJson.length <= 3) {
                rawsnumber = 1;
            }
            console.log(x + y + rawsnumber);
            for (let i = 0; i < rawsnumber; i++) {
                let row = table.insertRow();
                for (let i = 0; i < 3; i++) {
                    if (myJson.length > 0) {
                        let cell = myJson.pop();
                        let TableCell = row.insertCell();
                        TableCell.innerHTML = `<ul class='ul li ol'> <li>Cell id: ${cell.id} </li> <li>Operting frequency: ${cell.frequency}</li><li>Cell type: ${cell.type}</li><li>Rx power level: ${cell.rxPowerLevel}</li><li>MCC: ${cell.mcc}</li><li>MNC: ${cell.mnc}</li></ul> <p><a role='button'>BCCH</a></p>`;
                    }
                }
            }
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
});
