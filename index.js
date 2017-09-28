var ejs = require('ejs'); //ejs is not express, but is a extension to express
var path = require("path"); //pathing system
var bodyParser = require('body-parser'); //parse POST data
var session = require('express-session'); //temporary to store sensitive data, see if theres better way
//const databaseReader = require("./nodemodjs/DatabaseReader.js")
const requestwrite = require("./nodemodjs/requestwrite.js")
const express = require('express'); //express is good
const app = express();
const port = 7575;
const request = require('request')

app.engine('html', require('ejs').renderFile); //can use jsx also
app.set('view engine', 'ejs');
app.use(session({
    secret: 'whatsecretshallweuse kitten',//session secret to sign sessions
    resave: true, //force save
    saveUninitialized: true,
    /*cookie: { secure: true }*/
})); //secure needs HTTPS, cookies will not be stored if running from Hconst database = require("./nodemodjs/DBReader.js");TTP with this option
app.use(bodyParser.json()); // supporting POST data
app.use(bodyParser.urlencoded({ extended: true })); // supportting POST data

app.use(express.static(path.join(__dirname, '/js')));
app.use(express.static(path.join(__dirname, '/css')));
app.use(express.static(path.join(__dirname, '/img')));
app.use(express.static(path.join(__dirname, '/fonts')));

/** /authenticate (user, pin[length 6]) :POST user pin authentication
  * /pay (amount[more than 0.01], customer, merchantid, savedaddress) : POST creates randomized link for use on /payhash
  * /payhash (hash): GET opens a html page to add credit cards / confirm payment
  * /processpayment : POST happens after /payhash, cannot call directly without nonce
  * /autopayment (amount, customer, merchantid) : POST call directly to bypass html page
  * /create/customer (clientid, contact_No, pin): create customer
  * 
**/ 
app.listen(process.env.PORT || port);


app.get('/index', function (req, res) { //base page
    var page = path.join(__dirname + '/html/index.html')
    //req.session.userid = '1'
    if (req.session.userid) {
        requestwrite.retrieveBTToken(req,res).then((value) => {
            console.log("value is " + value)
        })
        requestwrite.BTTokenAuth("127074251",req,res , page)
    }
    else {
        req.session.userid = '0'
        requestwrite.BTTokenAuth("127074251",req, res, page)
    }
//    res.render(path.join(__dirname + '/html/index.html'));
});

app.get('/login', function (req, res) { //base page
    res.render(path.join(__dirname + '/html/login.html'));
});

app.post('/loginok', function (req, res) { //base page
    req.session.userid = req.body.userid
    res.send("Success login")
});

app.get('/register', function (req, res) { //base page
    res.render(path.join(__dirname + '/html/register.html'));
});


app.post('/payment', function (req, res) { //base page
    //res.send("payment values are " + req.body.amount + " and " + req.body.nonce)
    requestwrite.sendPayment(req,res)
});
app.post('/test', function (req, res) { //base page
    res.send("Success login")
});

app.use(function (req, res, next) {
        res.status(404).send("this page does not exist!")
});