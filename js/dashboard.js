const self = "http://localhost:7575"
const payserver = "https://nodepaymentmodule.herokuapp.com"

var currentval = 0
$('.modal').modal();
$('#customerid').html('Your Customer ID is ' + userid);
getWalletAmount();

function openTopupModal() {
    $('#topupmodal').modal('open');
}

function openSpendModal() {
    $('#spendmodal').modal('open');
}

function topupAmount() {
    var amount = $('#topupamount').val();
    if (amount == "") {
        Materialize.toast('Your amount cannot be empty.', 4000)
        return
    }
    else {

    }

}

function sendPayment() {
    var confirm = $('#confirm2').val();

    if (confirm == "confirm") {

        var amount = $('#sendamount').val();
        var merchantid = $('#merchantid').val();
        var branchid = $('#branchid').val();
        var clientid = userid

        if (amount == "" || merchantid == "" || branchid == "") {
            Materialize.toast("Please input an amount, merchantid and branchid", 4000)
            return
        }

        $.post(payserver + "/walletPay", { clientid: clientid, merchantid: merchantid, branchid: branchid, amount: amount }, function (data) {
            if (data.includes("Invalid")) {
                Materialize.toast('Error: ' + data, 4000)
            }
            else {
                Materialize.toast(data, 4000)
            }
        })
    }
    else {
        Materialize.toast('You did not confirm your payment.', 4000)
    }
}

function getWalletAmount() {
    $.post(payserver + "/getwalletamount", { clientid: userid }, function (data) {
        if (data.includes("No Data Available")) {
            Materialize.toast('Error: ' + data, 4000)
        }
        else {
            var jsondata = JSON.parse(data.replace(/&#34;/g, '"'))
            currentval = jsondata.value;
            $('#amountwallet').html("$" + jsondata.value)
            $('#customerid').html('Your Customer ID is ' + userid + ' (' + jsondata.clientWalletID + ')');

        }
    })
}

var button = document.querySelector('#topupbutton');
braintree.dropin.create({
    authorization: clientoken,
    container: '#dropin-container'
}, function (createErr, instance) {
    button.addEventListener('click', function () {
        instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {
            // Submit payload.nonce to your server
            console.log("payload is " + payload.nonce);
            var amount = $('#topupamount').val()

            var confirm = $('#confirm1').val();

            if (confirm == "confirm") {
                if (amount == "") {
                    Materialize.toast('You did not enter an amount', 4000)

                }

                $.post(self + "/payment", { nonce: payload.nonce, amount: amount }, function (data) {
                    if (data.includes("Invalid")) {
                        Materialize.toast('Error: ' + data, 4000)
                    }
                    else if (data.includes("successfully")) {
                        var decimal_places = 2;
                        var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);
                        $('#amountwallet').prop('number',parseInt(currentval)).animateNumber({
                            number: (parseInt(currentval) + parseInt(amount)) * decimal_factor,
                            numberStep: function (now, tween) {
                                var floored_number = Math.floor(now) / decimal_factor
                                if (decimal_places > 0) {
                                    // force decimal places even if they are 0
                                    floored_number = floored_number.toFixed(decimal_places);
                                }
                                target = $(tween.elem);
                                target.text('$' + floored_number);
                                currentval = parseInt(currentval) + parseInt(amount)
                            }
                        },
                            7000
                        );
                    }
                    else {
                        Materialize.toast(data, 4000)
                    }
                })
            }
            else {
                Materialize.toast("You did not confirm your payment", 4000)
            }
        });
    });
});
