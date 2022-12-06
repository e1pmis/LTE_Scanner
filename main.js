const express = require("express");
const Scanner = require("./LTE_Scanner");
let scanner = new Scanner();
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.raw());
let BUSY = false;
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

router.get("/", async function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

router.get("/getCells", async function (req, res) {
    res.send(scanner.cells);
});
router.get("/reset", async function (req, res) {
    scanner.cells = [];
    scanner.frequencies = [];
});

router.get("/script.js", async function (req, res) {
    res.sendFile("script.js");
});

router.post("/submit", async function requestHandler(req, res) {
    if (!BUSY) {
        BUSY = true;
        for (let i = 0; i < 3; i++) {
            let cell = new Cell();
            scanner.cells.push(cell)
        }
        console.log(scanner.cells)
        console.log("submit");
        console.log(req.body);
    } else {
        console.log("the server is busy");
    }
    // await scanner.search(req.body.sFreq);
});
// router.get('/sitemap',function(req,res){
//   res.sendFile(path.join(__dirname+'/sitemap.html'));
// });

app.use("/", router);
app.listen(process.env.port || 8080);

console.log("Running at Port 8080");
