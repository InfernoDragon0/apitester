const walletServer = 5001
const paymentServer = 'http://localhost:5000'
const cvars = require('./commonvariables.js')

module.exports.BTTokenAuth = BTTokenAuth
module.exports.sendPayment = sendPayment

function BTTokenAuth(token, res,page) {
    cvars.gateway.clientToken.generate({customerId: token}, function (err, response) {
        //console.log("is s" + sess.customer);
        //console.log("test address : "+sess.storageAddress);
        getHistory(res, page, response.clientToken)
    });
}

function getHistory(res, page, clientoken) {
    request.post(paymentServer + '/customerhistory', {
        form: {
            "clientID": 123
        }
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred 
            return;
        }
        console.log(response)
        console.log(body)
        res.render(page,
            {
                clientoken : clientoken,
                history: body
            });
    });
}

function sendPayment(req, res) {
    request.post(paymentServer + '/walletAdd', {
        form: {
            "clientID": 12345,
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