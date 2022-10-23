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
  res.sendFile("/home/ibra/kimo/java/script.js");
});

router.post("/submit", async function requestHandler(req, res) {
  console.log("submit");
  console.log(req.body);
  await scanner.search(req.body.sFreq);
});
// router.get('/sitemap',function(req,res){
//   res.sendFile(path.join(__dirname+'/sitemap.html'));
// });

app.use("/", router);
app.listen(process.env.port || 8080);

console.log("Running at Port 8080");
