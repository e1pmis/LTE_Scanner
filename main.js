const express = require("express");
const logger = require("node-color-log");
let date = new Date();

const Scanner = require("./LTE_Scanner");
let scanner = new Scanner();
const app = express();
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.raw());
let Plot = require("./Plot");
let plt = new Plot();

let BUSY = false;
let PORT = 2250;
let PLOTPORT = null;

async function startPlotter() {
   PLOTPORT = await plt.start();
}
startPlotter();

router.get("/", async function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});
router.get("/bands", async function (req, res) {
    res.sendFile(path.join(__dirname + "/Global Mobile Frequencies Database by Spectrummonitoring.com.html"));
});
router.get("/plot", async function (req, res) {
    res.redirect(`http://localhost:${PLOTPORT}`);
    // res.sendFile(path.join(__dirname + "/index.html"));
});
router.get("/imsi", async function (req, res) {
    res.sendFile(path.join(__dirname + "/IMSI_zug.Bloecke.pdf"));
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
});

router.get("/script.js", async function (req, res) {
    res.sendFile(path.join(__dirname + "/script.js"));
});

router.post("/scan", async function requestHandler(req, res) {
    let date = new Date();

    if (!BUSY) {
        BUSY = true;
        let result = await scanner.scan(req.body);
        if (result == "done") {
            BUSY = false;
            // res.sendFile(path.join(__dirname + "/index.html"));
            res.send(
                '<script>alert("Scaning has been sucessfully completed"); window.location.href = "./"; </script>'
            );
            res.end();
        } else {
            BUSY = false;
            // res.sendFile(path.join(__dirname + "/index.html"));
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
        // res.sendFile(path.join(__dirname + "/index.html"));
        res.send(
            '<script>alert("Scanner is busy!"); window.location.href = "./"; </script>'
        );
        res.end();
    }
    // await scanner.search(req.body.sFreq);
});
// router.get('/sitemap',function(req,res){
//   res.sendFile(path.join(__dirname+'/sitemap.html'));
// });

app.use("/", router);
app.listen(process.env.port || PORT);

logger
    .color("green")
    .log(
        `\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} LTE_Scanner is runing on port: ${PORT}`
    );
