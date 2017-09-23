const walletServer = "http://localhost:5001"
var webAuth = new auth0.WebAuth({
	domain: 'mushroom.auth0.com',
	clientID: 'EtHOvCUbD2F6s46WjSx0inahQV673bq9'
});
var contactno = 0

var fakeData = {
	customer_id: 12345,
	pin_6digit: 123456,
	contact_No: 87777751
}

function doLogin() {
	$.post(walletServer + "/authenticate", { user: document.getElementById("username").value, pin: document.getElementById("password").value }, function (data) {
		if (data.includes("Invalid")) {
		Materialize.toast('Error: ' + data, 4000)
		}
		else {
			alert("success, " + data)
		}

		//FAKE DATA REMOVE WHEN DONE
		contactno = fakeData.contact_No;
		Materialize.toast('2FA One time password has been sent to your phone number, please verify.', 4000)
		$('#modal1').modal('open');
		call2FA();
	});
}

function call2FA() {

	if (contactno == 0) {
		alert("the user does not have a contact number")
		return
	}

	webAuth.passwordlessStart({
		connection: 'sms',
		send: 'code',
		phoneNumber: '+65' + contactno


	}, function (err, res) {
		console.log(err);
		console.log(res);
		// handle errors or continue
	}
	);

}

function verify2FA() {
	if (contactno == 0) {
		return
	}

	webAuth.passwordlessVerify({
		connection: 'sms',
		phoneNumber: '+65' + contactno,
		verificationCode: document.getElementById('2FAcode').value,
		response_type: "code",
		redirect_uri: "http://localhost:7575/"
	}, function (err, res) {
		console.log(err);
		console.log(res);
		// handle errors or continue
	}
	);
}

 $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });