const express = require("express");
const Scanner = require("./LTE_Scanner");
let scanner = new Scanner();
const app = express();
const path = require("path");
const router = express.Router();
//var userid = require('userid');
//r sudoUserId = userid.uid(process.env.SUDO_USER);
//ocess.seteuid(sudoUserId);
// Do things
router.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));

  //__dirname : It will resolve to your project folder.
});

router.get("/search", async function (req, res) {
  // let output = await scanner.octo(req , res);
  let cell = { mcc: '206', mnc: '01' }
  res.send(cell);
});
router.get("/script.js", async function (req, res) {
  res.sendFile("/home/ibra/kimo/java/script.js");
});

// router.get('/sitemap',function(req,res){
//   res.sendFile(path.join(__dirname+'/sitemap.html'));
// });

app.use("/", router);
app.listen(process.env.port || 8080);

console.log("Running at Port 8080");
