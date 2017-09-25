const self = "http://localhost:7575"
const payserver = "http://localhost:5000"


function openTopupModal() {
  $('#topupmodal').modal('open');
}

function openSpendModal() {
  $('#spendmodal').modal('open');
}

function topupAmount() {
  var amount = document.getElementById('#topupamount')
  if (amount == "") {
    Materialize.toast('Your amount cannot be empty.', 4000)
    return
  }
  else {

  }

}

function sendPayment() {
  var confirm = document.getElementById('confirm2')

  if (confirm == "confirm") {

  }
  else {
    Materialize.toast('You did not type confirm correctly.', 4000)
  }
}

function fetchToken() {

}

$(document).ready(function () {
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  writeHistory();  
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

          $.post(self + "/payment", { nonce: payload.nonce, amount: amount}, function (data) {
            if (data.includes("Invalid")) {
              Materialize.toast('Error: ' + data, 4000)
            }
            else {
              Materialize.toast(data, 4000)
            }
          })
        }
        else {
          Materialize.toast("Your did not confirm your payment", 4000)
        }
      });
    });
  });

});

function writeHistory() {
  const DashboardRow = () => (
    <tbody>
        {datajson.map((data, i) => (
            <tr key={i}>
                <td className="transactionid">{data.transactionId}</td>
                <td>{data.timestamp}</td>
                <td>{data.amount ? data.amount : data.amount ? data.asset : "--"}</td>
                <td>{data.asset ? data.asset : "--"}</td>
                <td>{data.asset2 ? data.asset2 : "--"}</td>
                <td>{data.$class}</td>
                {/* <td>{data.resources ? data.$class : "--"}</td> */}
            </tr>
        ))}
    </tbody>
)

ReactDOM.render(
    <div>
        <br/>
        <br/>
        <table class="bordered highlight responsive-table">
            <thead>
                <tr>
                    <th><i className="fa fa-info-circle"></i> Transaction ID </th>
                    <th className="hidden-xs"><i className="fa fa-clock"></i> Time </th>
                    <th><i className="fa fa-shopping-cart"></i> Amount </th>
                    <th><i className="fa fa-user"></i> Client ID </th>
                    <th><i className="fa fa-user"></i> Merchant ID </th>
                    <th><i className="fa fa-times"></i> Transaction Type </th>
                </tr>
            </thead>
            <DashboardRow />            
        </table>
      
    </div>,
    document.getElementById("test4"),
    () => {
        console.log("rendererd");
        $("#selectable").selectable({
            filter: 'tr',
            stop: function () {
                var result = ""
                $(".ui-selected", this).each(function () {
                    var index = $(this).find(".transactionid").text();
                    result += ("row " + index + "\n");     
                })
                alert("Selected " + result)
            }
        });
    }
)
}