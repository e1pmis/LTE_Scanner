const { spawn, exec } = require("child_process");

class Scanner {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  do(req, res) {
    return new Promise((resolve) => {
      exec("ls && pwd && ps", (err, stdout, stderr) => {
        if (err) {
          return resolve(stderr);
        }
        return resolve(stdout);
      });
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
