writeHistory();

function writeHistory() {
  historyBody = JSON.parse(historyBody.replace(/&#34;/g, '"'))
  console.log(historyBody)

  const DashboardRow = () => (
    <tbody>
      {historyBody.map((data, i) => (
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
      <br />
      <br />
      <table className="bordered highlight responsive-table">
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
    document.getElementById("test4")
  )
}