const express = require("express");
const upload = require("express-fileupload");
const _ = require("lodash");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.use(upload());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const files = [];
let components = [];
const allComponents = [
  "Placi video",
  "Display",
  "Baterii1",
  "Bateriimari",
  "baterii mici",
];
app.get("/components", function (req, res) {
  if (components.length == 0) {
    res.render("index", { components: allComponents });
  } else {
    res.render("index", { components: components });
    components = [];
  }
});
app.post("/components", function (req, res) {
  const comp = _.lowerCase(req.body.item);
  allComponents.forEach((component) => {
    if (_.lowerCase(component).match(comp)) {
      components.push(component);
      console.log(component);
    }
  });
  res.redirect("/components");
});
app.get("/documents", function (req, res) {
  res.render("documents", { files: files });
});
app.post("/documents", function (req, res) {
  const file = req.files.file;
  const fileName = file.name;
  files.push(fileName);
  file.mv("./uploads/" + fileName, function (e) {
    if (e) {
      console.log(e);
      res.send(e);
    } else {
      //res.send("success");
      res.redirect("/documents");
    }
  });
});
app.get("/uploads/:filename", function (req, res) {
  const fileName = req.params.filename;
  res.sendFile(__dirname + "/uploads/" + fileName);
});
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
