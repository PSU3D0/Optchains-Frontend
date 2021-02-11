import {Table} from 'react-bootstrap';

function InfoPanel({stock,contract}) {
    const verboseOptionName = `${stock.ticker} ${contract.expiration} $${contract.strike}${contract.contract_type}`
    return (
    <div className="infoPanel">

        <Table size="sm" borderless>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Industry</th>
                        <th>52 Week Change</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{stock.name}</td>
                        <td>{stock.category}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>Contract</th>
                        <th>Strike</th>
                        <th>Expiration</th>
                        <th>Last Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{verboseOptionName}</td>
                        <td>${contract.strike}</td>
                        <td>{contract.expiration}</td>
                        <td>${contract.last_price}</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>Last Bid</th>
                        <th>Last Ask</th>
                        <th>Volume</th>
                        <th>Open Interest</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${contract.bid}</td>
                        <td>${contract.ask}</td>
                        <td>{contract.volume}</td>
                        <td>{contract.open_interest}</td>
                    </tr>
                </tbody>
            </Table>
    </div>
    )
}

export default InfoPanel;