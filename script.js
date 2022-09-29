const Body = document.body;
// let form = document.getElementById("theForm");

// let submit = document.getElementById("submit");
// submit.addEventListener("click", sub());

// async function sub() {
//   console.log("submit");
//   console.log("submit");
//   form.submit();
//   form.reset();
// }

function getcells() {
  fetch("http://192.168.0.103:8080/getCells")
  .then(function (response) {
    return response.json();
  })
    .then(function (myJson) {
      console.log(myJson);
      const table = document.getElementById("table");
      for (let cell of myJson) {
        console.log(cell);
        let row = table.insertRow(0);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = `${cell.frequency}`;
        cell2.innerHTML = `<ul class='ul li ol'><li>Cell id: ${cell.id} </li><li>Operting frequency: ${cell.frequency}</li><li>Cell type: ${cell.type}</li><li>Rx power level: ${cell.rxPowerLevel}</li><li>MCC: ${cell.mcc}</li><li>MNC: ${cell.mnc}</li></ul <p><a role='button'>BCCH</a></p>`;
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });

    
  }
  let getCells = document.getElementById("gcells");
  getCells.addEventListener("click", getcells(),false);