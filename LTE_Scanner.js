const fs = require("fs");
const hexToBinary = require("hex-to-binary");
const { spawn, exec } = require("child_process");
const { ReadlineParser } = require("@serialport/parser-readline");
const { connected } = require("process");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const Cell = class Cell {
    constructor() {
        this.id;
        this.frequency;
        this.type = "FDD";
        this.rxPowerLevel;
        this.mcc = "N/A";
        this.mnc = "N/A";
        this.decodedID = "N/A";
        this.mib = {
            Antennas: "nan",
            RBs: "nan",
            FN: "nan",
            PHICH_duration: "nan",
            Ng: "nan",
        };
        this.PDSCH = {
            RNTI: "nan",
            Modulation: "nan",
            Redundancy_Version: "nan",
            TransportBlock: null,
        };
    }
};
class Scanner {
    constructor() {
        this.cells = [];
        this.frequencies = {};
    }

    search(frequency, attemps, time, res) {
        let cell = new Cell();
        let hex = false;
        let hexArr = [];
        let cancel = false;
        let ready = true;
        cell.frequency = frequency;
        console.log(`\nScaning ... frequency = ${frequency}`);
        return new Promise(async (resolve, reject) => {
            const ltedecode = spawn("ltedecode", [
                `-c 2`,
                `-f ${frequency}e6`,
                `-g 100`,
            ]);
            let timer = setTimeout(() => {
                // console.log(`No cells detected on frequeny = ${frequency}`);
                cancel = true;
                ltedecode.kill();
                resolve(`No cells detected on frequeny = ${frequency}`);
            }, time * 1000);

            ltedecode.stderr.on("data", (data) => {
                // console.error(`ltedecode stderr: ${data}`);
            });

            const parser = ltedecode.stdout.pipe(
                new ReadlineParser({ delimiter: "\n" })
            );
            parser.on("data", (data) => {
                let line = data.toString();

                if (line.match("Cell ID")) {
                    let arr = line.split(/\s+/);
                    arr[5] = arr[5].split(",");
                    cell.id = arr[5][0];
                    this.estimate(frequency, cell.id);
                } else if (line.match("PHICH duration")) {
                    let arr = line.split(/\s+/);
                    arr[4] = arr[4].split(",");
                    cell.mib.Antennas = arr[4][0];
                    arr[7] = arr[7].split(",");
                    cell.mib.RBs = arr[7][0];
                    arr[10] = arr[10].split(",");
                    cell.mib.FN = arr[10][0];
                    arr[14] = arr[14].split(",");
                    cell.mib.PHICH_duration = arr[14][0];
                    cell.mib.PHICH_duration = arr[17].slice(0, -4);
                } else if (line.match("RNTI") && line.match("PDSCH")) {
                    let arr = line.split(/\s+/);
                    arr[4] = arr[4].split(",");
                    cell.PDSCH.RNTI = arr[4][0];
                    arr[6] = arr[6].split(",");
                    cell.PDSCH.Modulation = arr[6][0];
                    cell.PDSCH.Redundancy_Version = arr[9].slice(0, -4);
                } else if (line.match("Decoded transport")) {
                    hex = true;
                } else if (line.match(":")) {
                    hex = false;
                }
                if (hex) {
                    if (!line.match("Decoded transport")) {
                        hexArr.push(line);
                    }
                } else {
                    if (hexArr.length != 0) {
                        let block = "";
                        ltedecode.stdout.unpipe();
                        // console.log(hexArr);
                        for (let line of hexArr) {
                            block = block + line;
                        }
                        block = block.replace(/\s/g, "");
                        block = block.slice(7, -4);
                        cell.PDSCH.TransportBlock = block;
                        ltedecode.kill();
                        hexArr = [];
                    }
                }
            });

            ltedecode.on("close", async (code) => {
                if (!cancel) {
                    clearTimeout(timer);
                    res.push({ resolve: resolve });
                    this.isValid(cell, frequency, attemps, time, res);
                }
            });
        });
    }
    async isValid(cell, frequency, attemps, time, res) {
        console.log(
            `Cell detected on frequency = ${frequency} , Cell ID = ${cell.id}`
        );
        // let decoded = await this.asn1(cell);
        if ((await this.asn1(cell)) == 1) {
            if (!(await this.exist(cell))) {
                this.cells.push(cell);
            }
            if (res.lenght != 0) {
                for (let rs of res) {
                    rs.resolve("decoded");
                }
            }
        } else {
            if (attemps != 0) {
                await this.search(frequency, attemps - 1, time, res);
            } else {
                for (let rs of res) {
                    rs.resolve(
                        `Failed to decode BCCH on frequency= ${frequency} after ${res.length} attemps`
                    );
                }
            }
        }
    }

    exist(cell) {
        return new Promise(async (resolve, reject) => {
            if (this.cells.length == 0) {
                resolve(false);
            } else {
                for (let i = 0; i < this.cells.length; i++) {
                    if (this.cells[i].decodedID == cell.decodedID) {
                        resolve(true);
                    } else if (i == (this.cells.length -1)) {
                        resolve(false);
                    }
                }
            }
        });
    }

    async asn1(cell) {
        return new Promise(async (resolve, reject) => {
            console.log(`Decoding BCCH-DL-SCH-Message ...`);
            try {
                fs.writeFileSync("tmp_sib1.hex", cell.PDSCH.TransportBlock);
            } catch (err) {
                console.log(err);
            }

            exec(
                `xxd -r -p tmp_sib1.hex bin.per`,
                async (err, stdout, stderr) => {}
            );
            exec(
                `asn1_test/LTE-BCCH-DL-SCH-decode/progname bin.per -p BCCH-DL-SCH-Message`,
                async (err, stdout, stderr) => {
                    // if (stderr) {
                    //     console.log(stderr);
                    // }
                    // if (err) {
                    //     console.log(err);
                    // }
                    if (stdout.match("<plmn-Identity>")) {
                        let bcch = await bcchParser(stdout);
                        cell.mcc = bcch["mcc"];
                        cell.mnc = bcch["mnc"];
                        cell.rxPowerLevel = bcch["rx"];
                        cell.decodedID = bcch["id"];
                        console.log(`BCCH-DL-SCH-decode passed !`);
                        resolve(1);
                    } else {
                        console.log(`BCCH-DL-SCH-decode faild`);
                        resolve(0);
                    }
                }
            );
        });
    }

    estimate(frequency, id) {
        if (this.frequencies[`${frequency}`]) {
            if (this.frequencies[`${frequency}`].includes(`${id}`)) {
                return;
            } else {
                this.frequencies[`${frequency}`].push(id);
            }
        } else {
            this.frequencies[`${frequency}`] = [id];
        }
    }
}

module.exports = Scanner;

function bcchParser(result) {
    let data = { mcc: "", mnc: "", id: "", rx: "" };
    return new Promise(async (resolve) => {
        let lines = result.split("\n");
        let arr = [];
        for (let line of lines) {
            if (line.match("<MCC-MNC-Digit>")) {
                arr.push(line.match(/\d+/));
            } else if (line.match("<cellIdentity>")) {
                let id = lines[lines.indexOf(line) + 1].match(/\d+/).toString();
                data.id = parseInt(id, 2);
            } else if (line.match("<q-RxLevMin>")) {
                let arr = line.split(">");
                arr = arr[1].split("<");
                data.rx = arr[0];
            }
        }
        data.mcc = `${arr[0]}${arr[1]}${arr[2]}`;
        data.mnc = `${arr[3]}${arr[4]}`;
        resolve(data);
    });
}
