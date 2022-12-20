let plt = require("nodeplotlib");
const { ReadlineParser } = require("@serialport/parser-readline");
const { spawn, exec } = require("child_process");

class Plot {
    constructor() {
        this.port = null;
    }
    start() {
        return new Promise(async (resolve, reject) => {
            const plotter = spawn("node", ["pltScript.js"]);
            const parser = plotter.stdout.pipe(
                new ReadlineParser({ delimiter: "\n" })
            );
            parser.on("data", (data) => {
                let line = data.toString();
                if (line.match("Server running")) {
                    this.port = line.match(/(\d+)/)[0];
                    resolve(this.port);
                    console.log(line)
                }
            });
        });
    }
}
module.exports = Plot;
