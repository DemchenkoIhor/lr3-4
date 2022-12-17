const mysql = require('mysql');
const express = require("express");
const app = express();

const urlencodedParser = express.urlencoded({ extended: false });
// встановлює Handlebars як двигун представлень в Express
app.set("view engine", "hbs");


// зміна, в якій зберігаються дані для підключення до БД 
var bd = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ecomon",
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
  res.render("index.hbs");
});


app.get("/carcin", function(req, res){
  bd.query("Select * from carcin;", function (err, data) {
    if (err) return console.log(err);
    res.render("carcin.hbs", {
      select_substances: data    });

    //console.log(data);
    
  });
})

app.post("/carcinAmount", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  //console.log(req.body);
  //console.log((((req.body.Ca * req.body.Tout * req.body.Vout)+(req.body.Ch * req.body.Tin * req.body.Vin))* req.body.EF * req.body.ED)/(req.body.BM*req.body.AT*365)*req.body.form_select_nameSubs);
 const status_emiss =Number((((req.body.Ca * req.body.Tout * req.body.Vout)+(req.body.Ch * req.body.Tin * req.body.Vin))* req.body.EF * req.body.ED)/(req.body.BM*req.body.AT*365)*req.body.form_select_nameSubs);
 var data1, data2, data3, data4;
 console.log(status_emiss);
 data1={ text: "", visibility: "none"};
 data2={ text: "", visibility: "none"};
 data3={ text: "", visibility: "none"};
 data4={ text: "", visibility: "none"};
 if(status_emiss>0.001){
   data1.text = "Високий (De Manifestis) - не прийнятний для виробничих умов і населення. Необхідне здійснення заходів з усунення або зниження ризику ";
   data1.visibility = "block";
 }
 else if(status_emiss>=0.001 && status_emiss <=0.0001){
  data2.text = "Середній - припустимий для виробничих умов; за впливу на все населення необхідний динамічний контроль і поглиблене вивчення джерел і можливих наслідків шкідливих впливів для вирішення питання про заходи з управління ризиком";
  data2.visibility = "block";
 }
 else if(status_emiss >=0.0001 && status_emiss <=0.000001){
  data3.text = "Низький - припустимий ризик (рівень, на якому, як правило, встановлюються гігієнічні нормативи для населення)   ";
  data3.visibility = "block";
 }
 else{
  data4.text = "Мінімальний - бажана (цільова) величина ризику при проведенні оздоровчих і природоохоронних заходів";
  data4.visibility = "block";
 }
  res.render("CarcinAmount.hbs", {
    koef: status_emiss.toFixed(3),
    data1: data1,
    data2: data2,
    data3: data3,
    data4: data4
    
  });

});

app.get("/noncarcin", function(req, res){
  bd.query("Select * from noncarcin;", function (err, data) {
    if (err) return console.log(err);
    res.render("noncarcin.hbs", {
      select_substances: data    });

    //console.log(data);
    
  });
})

app.post("/nonCarcinAmount", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  //console.log(req.body);
  //console.log(req.body.C/req.body.form_select_nameSubs);
 const status_emiss =Number(req.body.C/req.body.form_select_nameSubs);
 let data1, data2, data3;
 data1={ text: "", visibility: "none"};
 data2={ text: "", visibility: "none"};
 data3={ text: "", visibility: "none"};
 if(status_emiss<1){
   data1.text = "Ризик виникнення шкідливих ефектів розглядають як зневажливо малий";
   data1.visibility = "block";
 }
 else if(status_emiss==0.001){
  data2.text = "Гранична величина, що не потребує термінових заходів, однак не може розглядатися як досить прийнятна";
  data2.visibility = "block";
 }
 else if(status_emiss >1 ){
  data3.text = "Висока імовірність розвитку шкідливих ефектів, потрібно негайно вжити заходів з усунення або зниження ризику";
  data3.visibility = "block";
 }
 
  res.render("nonCarcinAmount.hbs", {
    koef: status_emiss.toFixed(3),
    data1: data1,
    data2: data2,
    data3: data3
  });

});

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});