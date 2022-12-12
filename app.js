const mysql = require('mysql2');
const express = require("express");
const app = express();

const urlencodedParser = express.urlencoded({ extended: false });
// встановлює Handlebars як двигун представлень в Express
app.set("view engine", "hbs");



// зміна, в якій зберігаються дані для підключення до БД 
var bd = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "cm",
  password: "sql1234",
  multipleStatements: true
});

// підключення до БД
bd.connect(function (err) {
  if (err) {
    return console.error("Error-connect: " + err.message);
  }
  else {
    console.log("Connection to MySQL OK!");
  }
});

app.get("/", function (req, res) {

 

  bd.query("SELECT * FROM task3; SELECT * FROM object order by name", function (err, data) {
    if (err) return console.log(err);

    res.render("index.hbs", {
      objects: data[1],
      object_select: data[1],
      substances: [
        { classDeng: "I", tax: 1546.22 },
        { classDeng: "II", tax: 56.32 },
        { classDeng: "III", tax: 14.12 },
        { classDeng: "IV", tax: 5.50 },
        { classDeng: "V", tax: 0.54 },
      ],
      nuclear: [
        { classDeng: "низькоактивних і середньоактивних", tax: 2 },
        { classDeng: "високоактивних", tax: 50 }
      ],
      nuclearStorage: [
        { classDeng: "низькоактивних і середньоактивних", tax: 0.01180740 },
        { classDeng: "високоактивних", tax: 0.63253966 },
        { classDeng: "низькоактивних і середньоактивних, як джерело іонізуючого випромінювання", tax: 4216.92 },
        { classDeng: "високоактивних, як джерело іонізуючого випромінювання", tax: 21084.66 }
      ],
      
    });
  });
});

app.post("/", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const subst = req.body.subst;

  const classDenger = req.body.classDenger;

  const amount = req.body.amount;

  const dengEnv = req.body.dengEnv;

  const nearCity = req.body.nearCity;

  const tax = classDenger * amount * dengEnv * nearCity;
  res.render("index.hbs", {
    result1:tax
    //countTax: 'Вартість розміщення ' + subst + ' у розмірі ' + amount + 'т. становить ' + tax + ' грн.'

  });
});

app.post("/TaxNuclear", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const Obs = req.body.Obs;
  const H = 0.0133;
  const pnc = 2;
  const pv = 50;
  const C1nc = req.body.C1nc;
  const C1v = req.body.C1v;
  const C2nc = req.body.C2nc;
  const C2v = req.body.C2v;
  const V1nc = req.body.V1nc;
  const V1v = req.body.V1v;
  const V2nc = req.body.V2nc;
  const V2v = req.body.V2v;
  const tax = (Obs * H) + (pnc * C1nc * V1nc) + (pv * C1v * V1v) + 0.03125 * ((pnc * C2nc * V2nc) + (pv * C2v * V2v));
  console.log(tax);
  res.render("NuclearCreat.hbs", {

    countTax: 'Вартість розміщення  становить ' + tax + ' грн.'

  });
});


app.post("/TaxNuclearStorage", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);


  const classDenger = req.body.classDenger;

  const amount = req.body.amount;

  const time = req.body.time;

  const tax = classDenger * amount * time;
  res.render("nuclearStorage.hbs", {

    countTax: 'Вартість розміщення становить ' + tax + ' грн.'

  });
});






const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});