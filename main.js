/**
 * App start point.
 * This is the http server app for LTE Scanner:
 * It handels the http protocol Get/Post requests.
 * Turns server on/off.
 * Uses the main classes LTE_Scanner.js and Plot.js
 */

const express = require("express");
const logger = require("node-color-log");
let date = new Date();
const cp = require("child_process");
const cellsTest = require("./saves.json");
const Scanner = require("./src/LTE_Scanner");
let scanner = new Scanner();
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let Plot = require("./src/Plot");
const { loadavg } = require("os");
let plt = new Plot();

let cells = cellsTest;

let BUSY = false;
let PORT = 2250;
let LOAD = null;

async function startPlotter() {
    PLOTPORT = await plt.start();
}
startPlotter();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get("/", async function (req, res) {
    res.sendFile(path.join(__dirname + "/src/index.html"));
});
router.get("/style.css", async function (req, res) {
    res.sendFile(path.join(__dirname + "/src/style.css"));
});
router.get("/img/Vodafone.gif", async function (req, res) {
    res.sendFile(path.join(__dirname + "/img/Vodafone.gif"));
});
router.get("/img/O2.gif", async function (req, res) {
    res.sendFile(path.join(__dirname + "/img/O2.gif"));
});
router.get("/img/Telekom.gif", async function (req, res) {
    res.sendFile(path.join(__dirname + "/img/Telekom.gif"));
});
router.get("/img/D.gif", async function (req, res) {
    res.sendFile(path.join(__dirname + "/img/D.gif"));
});
router.get("/img/smta.gif", async function (req, res) {
    res.sendFile(path.join(__dirname + "/img/smta.gif"));
});
router.get("/img/smta.css", async function (req, res) {
    res.sendFile(path.join(__dirname + "/img/smta.css"));
});

router.get("/bands", async function (req, res) {
    res.sendFile(path.join(__dirname + "/src/LTE-Bands.html"));
});
router.get("/plot", async function (req, res) {
    res.send(
        `<script>
        alert("Node plot is active on new tap"); window.location.href = "./"; 
        function NewTab() {
            window.open(
                "http://localhost:${plt.port}", "_blank");
            }
            NewTab();
            </script>`
    );
});
router.get("/imsi", async function (req, res) {
    res.sendFile(path.join(__dirname + "/src/IMSI_zug.Bloecke.pdf"));
});
router.get("/doc", async function (req, res) {
    res.sendFile(path.join(__dirname + "/LTE_Scanner_Documentatiton.pdf"));
});

router.get("/getCells", async function (req, res) {
    res.send(scanner.cells);
});
router.get("/info", async function (req, res) {
    res.send(scanner.frequencies);
});
router.get("/reset", async function (req, res) {
    scanner.cells = [];
    scanner.frequencies = [];
    LOAD = null;
});

router.get("/script.js", async function (req, res) {
    res.sendFile(path.join(__dirname + "/src/script.js"));
});
router.get("/saves", async function (req, res) {
    res.sendFile(path.join(__dirname + "/saves.json"));
});

router.post("/load", async function requestHandler(req, res) {
    if (req.body["load"]) {
        if (!cells[req.body["load"]]) {
            res.send(
                '<script>alert("Unknown loading id"); window.location.href = "./"; </script>'
            );
            res.end();
        } else {
            LOAD = req.body["load"];
            for (let cl of cells[req.body["load"]]) {
                // await delay(2000);
                scanner.cells.push(cl);
            }
            res.send(
                '<script>alert("Loading has been sucessfully completed"); window.location.href = "./"; </script>'
            );
            res.end();
        }
    } else if (req.body["save"]) {
        cells[`${req.body["save"]}`] = scanner.cells;
        var fs = require("fs");
        fs.writeFile("./saves.json", JSON.stringify(cells), "utf8", () => {});

        res.send(
            '<script>alert("Saving has been sucessfully completed"); window.location.href = "./"; </script>'
        );
        res.end();
    } else if (req.body["delete"]) {
        delete cells[`${LOAD}`];
        var fs = require("fs");
        fs.writeFile("./saves.json", JSON.stringify(cells), "utf8", () => {});
        res.send(
            '<script>alert("Deleting has been sucessfully completed"); window.location.href = "./"; </script>'
        );
        res.end();
    }
});

router.post("/scan", async function requestHandler(req, res) {
    let date = new Date();
    if (!BUSY) {
        BUSY = true;
        let result = await scanner.scan(req.body);
        if (result == "done") {
            BUSY = false;
            res.send(
                '<script>alert("Scaning has been sucessfully completed"); window.location.href = "./"; </script>'
            );
            res.end();
        } else {
            BUSY = false;
            res.send(
                '<script>alert("Something went wrong!!"); window.location.href = "./"; </script>'
            );
            res.end();
        }
    } else {
        logger
            .color("red")
            .log(
                `\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} The scanner is busy!`
            );
        res.send(
            '<script>alert("Scanner is busy!"); window.location.href = "./"; </script>'
        );
        res.end();
    }
});

app.use("/", router);
app.listen(process.env.port || PORT);

logger
    .color("green")
    .log(
        `\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} LTE_Scanner is runing on port: http://localhost:${PORT}`
    );
