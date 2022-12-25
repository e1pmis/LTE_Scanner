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
            plotter.stderr.on("data", (data) => console.log(data.toString()));
            parser.on("data", (data) => {
                let line = data.toString();
                if (line.match("Server running")) {
                    console.log(line);
                    this.port = line.match(/(\d+)/)[0];
                    // resolve(this.port);
                } else if (line.match("Server shutting down")) {
                    plotter.kill();
                    resolve();
                    this.start();
                }
            });
        });
    }
}
module.exports = Plot;
