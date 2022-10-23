const { spawn, exec } = require("child_process");
const Cell = class Cell {
  constructor() {
    this.frequency;
    this.id;
    this.type;
    this.rxPowerLevel;
    this.mcc = "N/A";
    this.mnc = "N/A";
  }
};
class Scanner {
  constructor() {
    this.cells = [];
    this.frequencies = [];
  }

  search(frequency) {
    return new Promise((resolve) => {
      if (this.frequencies.indexOf(frequency) !== -1) {
        return resolve();
      }
      this.frequencies.push(frequency);
      exec(
        `cd /home/ibra/LTE-Cell-Scanner/build && ./src/CellSearch -s ${frequency}e6 `,
        async (err, stdout, stderr) => {
          if (err) {
            return resolve(stderr);
          }
          if (stdout.match("No LTE cells were found...")) {
            console.log("nothing found");
          } else if (stdout.match("Detected the following cells:")) {
            let arr = stdout.split("\n");

            let indexes = [];
            indexes = await this._getAllIndexes(arr, "At freqeuncy");
            for (let index of indexes) {
              let cell = new Cell();
              let arr0 = arr[index + 1].split(/\s+/);
              cell.id = arr0[3];
              let arr1 = arr[index + 3].split(/\s+/g);
              cell.rxPowerLevel = arr1[4] + "dB";
              if (arr[index].match("FDD")) {
                cell.type = "FDD";
              }
              if (arr[index].match("TDD")) {
                cell.type = "TDD";
              }
              cell.frequency = frequency;
              this.cells.push(cell);
            }
            return resolve();
          }
        }
      );
    });
  }

  octo(req, res) {
    let bcch = [];

    return new Promise((resolve) => {
      const ls = spawn("./octo.sh");

      ls.stdout.on("data", async (data) => {
        let str = data.toString();
        if (str.match("<plmn-Identity>")) {
          bcch.push(str);
        }
        if (str.match("</plmn-Identity>")) {
          bcch.push(str);
          let mccmnc = await getCell(result);
          resolve(cell);
        }
      });

      ls.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });
    });
  }
  _getAllIndexes(arr, val) {
    return new Promise(async (resolve) => {
      let indexes = [],
        i;
      for (i = 0; i < arr.length; i++) {
        if (arr[i].match(val)) indexes.push(i);

        if (i + 1 === arr.length) {
          console.log(indexes);
          return resolve(indexes);
        }
      }
    });
  }
}

module.exports = Scanner;

function getCell(result) {
  let mccmnc = { mcc: "", mnc: "" };
  return new Promise((resolve) => {
    let lines = result[result.length - 1].split("\n");
    let arr = [];
    for (let line of lines) {
      if (line.match("<MCC-MNC-Digit>")) {
        arr.push(line.match(/\d+/));
      }
    }
    mccmnc.mcc = `${arr[0]}${arr[1]}${arr[2]}`;
    mccmnc.mnc = `${arr[3]}${arr[4]}`;
    resolve(mccmnc);
  });
}
