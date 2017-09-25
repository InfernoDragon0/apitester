const self = "http://localhost:7575"
const payserver = "http://localhost:5000"

$('.modal').modal();
$('#customerid').html('Your Customer ID is ' + userid)

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
        var clientid = 123

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
