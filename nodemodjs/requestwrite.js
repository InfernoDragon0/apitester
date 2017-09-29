const walletServer = 5001
const paymentServer = 'https://nodepaymentmodule.herokuapp.com'
//const paymentServer = 'http://localhost:5000'
const request = require('request')
const cvars = require('./commonvariables.js')

module.exports.BTTokenAuth = BTTokenAuth
module.exports.sendPayment = sendPayment
module.exports.retrieveBTToken = retrieveBTToken
module.exports.spendMoney = spendMoney

function BTTokenAuth(token,req, res,page) {
    cvars.gateway.clientToken.generate({customerId: token}, function (err, response) {
        //console.log("is s" + sess.customer);
        //console.log("test address : "+sess.storageAddress);
        getHistory(req,res, page, response.clientToken)
    });
}

function getHistory(req,res, page, clientoken) {
    request.post(paymentServer + '/customerhistory', {
        form: {
            "clientID": req.session.userid
        }
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred 
            return;
        }
        // console.log(body)
        // console.log(body)
        // body=JSON.parse(body)
        // body=JSON.stringify(body)
        console.log('Body :'+ body)
        // console.log(req.session.amount)
        console.log("id is "+req.session.userid)
        res.render(page,
            {
                clientoken : clientoken,
                historyBody: body,
                userid: req.session.userid
                // userid : testUserID
            });
    });
}

function sendPayment(req, res) {
    console.log("the id is " + req.session.userid)
    request.post(paymentServer + '/walletAdd', {
        form: {
            "clientID": req.session.userid,
            "amount": req.body.amount,
            "nonce": req.body.nonce
        }
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred 
            return;
        }
        console.log(response)
        res.send(body)
    });
}

function spendMoney(req, res) {
    console.log("the id is " + req.session.userid)
    request.post(paymentServer + '/walletPay', {
        form: {
            "clientid": req.session.userid,
            "merchantid": req.body.merchantid,
            "amount": req.body.amount,
            "branchid": req.body.branchid
        }
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred 
            return;
        }
        console.log(body)
        res.send(body)
    });
}


function retrieveBTToken(req, res) {
    return new Promise((resolve, reject) => {
        request.post(paymentServer + '/find/customerBTToken', {
            form: {
                "clientid": req.session.userid
            }
        }, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred 
                return;
            }
            console.log(body)
            resolve(body)
        });
    })
    
}