const express = require("express");
const logger = require("node-color-log");
let date = new Date();
var cp = require("child_process")

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
router.get("/log", async function (req, res) {
    res.sendFile(path.join(__dirname + "/client.html"));
});

router.get("/bands", async function (req, res) {
    res.sendFile(
        path.join(
            __dirname +
                "/Global Mobile Frequencies Database by Spectrummonitoring.com.html"
        )
    );
});
router.get("/plot", async function (req, res) {
    // res.redirect(`http://localhost:${PLOTPORT}`);
    // res.redirect(`http://localhost:${PLOTPORT}`);
    // res.redirect(`http://localhost:${PLOTPORT}`);
    // res.sendFile(path.join(__dirname + "/index.html"));
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
router.get('/msg', function(req, res){
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });

    var spw = cp.spawn('ping', ['-c', '100', '127.0.0.1']),
    str = "";

    process.stdout.on('data', function (data) {
        str += data.toString();

        // just so we can see the server is doing something
        // console.log("data");

        // Flush out line by line.
        var lines = str.split("\n");
        for(var i in lines) {
            if(i == lines.length - 1) {
                str = lines[i];
            } else{
                // Note: The double-newline is *required*
                res.write('data: ' + lines[i] + "\n\n");
            }
        }
    });

    spw.on('close', function (code) {
        res.end(str);
    });

    spw.stderr.on('data', function (data) {
        res.end('stderr: ' + data);
    });
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
