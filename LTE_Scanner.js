const fs = require("fs");
const hexToBinary = require("hex-to-binary");
const { spawn, exec } = require("child_process");
const { ReadlineParser } = require("@serialport/parser-readline");
const { connected } = require("process");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const logger = require("node-color-log");
const Cell = class Cell {
    constructor() {
        this.id;
        this.frequency;
        this.type = "FDD";
        this.rxPowerLevel;
        this.mcc = "N/A";
        this.mnc = "N/A";
        this.provider = "";
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
    async scan(scanObj) {
        return new Promise(async (resolve, reject) => {
            if (scanObj["eFreq"] == -1) {
                await this.search(
                    scanObj["noa"],
                    scanObj["rxgain"],
                    scanObj["sFreq"],
                    scanObj["attemps"],
                    scanObj["time"],
                    []
                );
                resolve("done");
            } else {
                let total =
                    Math.abs(
                        Number(scanObj["sFreq"]) - Number(scanObj["eFreq"])
                    ) / Number(scanObj["step"]);
                for (let i = 0; i <= total; i++) {
                    let x = i * Number(scanObj["step"]);
                    let f = Number(scanObj["sFreq"]) + x;
                    await this.search(
                        scanObj["noa"],
                        scanObj["rxgain"],
                        f,
                        scanObj["attemps"],
                        scanObj["time"],
                        []
                    );
                }
                resolve("done");
            }
        });
    }

    search(noa, rxgain, frequency, attemps, time, res) {
        let cell = new Cell();
        let hex = false;
        let hexArr = [];
        let cancel = false;
        let ready = true;
        cell.frequency = frequency;
        let date = new Date();
        logger
            .color("cyan")
            .log(
                `\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} Scaning ... frequency = ${frequency} Mhz`
            );

        return new Promise(async (resolve, reject) => {
            const ltedecode = spawn("ltedecode", [
                // `-r internal`,
                `-c ${noa}`,
                `-f ${frequency}e6`,
                `-g ${rxgain}`,
            ]);
            let timer = setTimeout(() => {
                // console.log(`No cells detected on frequeny = ${frequency}`);
                let date = new Date();
                logger
                    .color("yellow")
                    .log(
                        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} No cells detected on frequeny = ${frequency} Mhz`
                    );

                cancel = true;
                ltedecode.kill();
                if (res.length != 0) {
                    for (let rs of res) {
                        rs.resolve();
                    }
                } else {
                    resolve();
                }
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
                    this.isValid(
                        cell,
                        noa,
                        rxgain,
                        frequency,
                        attemps,
                        time,
                        res
                    );
                }
            });
        });
    }
    async isValid(cell, noa, rxgain, frequency, attemps, time, res) {
        // console.log(
        //     `Cell detected on frequency = ${frequency} , Cell ID = ${cell.id}`
        // );
        let date = new Date();
        logger
            .color("green")
            .log(
                `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} Cell detected on frequency = ${frequency} , Cell ID = ${
                    cell.id
                }`
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
                await this.search(
                    noa,
                    rxgain,
                    frequency,
                    attemps - 1,
                    time,
                    res
                );
            } else {
                let date = new Date();

                logger
                    .color("red")
                    .log(
                        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} Failed to decode BCCH on frequency= ${frequency} Mhz after ${
                            res.length
                        } attemps`
                    );
                for (let rs of res) {
                    rs.resolve();
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
                    } else if (i == this.cells.length - 1) {
                        resolve(false);
                    }
                }
            }
        });
    }

    async asn1(cell) {
        return new Promise(async (resolve, reject) => {
            let date = new Date();

            logger
                .color("green")
                .log(
                    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} Decoding BCCH-DL-SCH-Message ...`
                );

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

                    let date = new Date();
                    if (stdout.match("<plmn-Identity>")) {
                        let bcch = await bcchParser(stdout);
                        cell.mcc = bcch["mcc"];
                        cell.mnc = bcch["mnc"];
                        cell.rxPowerLevel = bcch["rx"];
                        cell.decodedID = bcch["id"];
                        if (cell.mnc == '01') {
                            cell.provider = "Telekom";
                        } else if (cell.mnc == '02') {
                            cell.provider = "Vodafone";
                        } else if (cell.mnc == '03') {
                            cell.provider = "O2";
                        }
                        logger
                            .color("green")
                            .log(
                                `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} BCCH-DL-SCH-decode passed! `
                            );
                        resolve(1);
                    } else {
                        logger
                            .color("red")
                            .log(
                                `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} BCCH-DL-SCH-decode faild! `
                            );

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
