const Body = document.body;

async function test() {
  setTimeout(window.alert("welcome Abdullah"), 5000);
}
test();

let start = document.getElementById("startButton");
start.addEventListener("click", go);

async function go() {
  fetch("http://192.168.0.103:8080/search")
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      const table = document.getElementById("table");
      var row = table.insertRow(0);

      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);

      // Add some text to the new cells:
      cell1.innerHTML = "vodafone";
      cell2.innerHTML = "<ul class='ul li ol'><li>cellid</li><li>operting frequency</li><li>power</li></ul";
    //   table.innerText = JSON.stringify(myJson);
      console.log(myJson);
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve(), time);
  });
}
