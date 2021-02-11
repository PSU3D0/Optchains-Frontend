import {Badge} from 'react-bootstrap';

function PriceChangeBox({start,end,ticker}){
    const isPositive = end >= start ? true : false
    const change = Number.parseFloat(((end / start)-1)*100).toFixed(2)
    const diff = (end-start).toFixed(2)
    


    return (
        <h2>
        {ticker}: ${end} &nbsp;
        {isPositive
        ? <Badge variant="success">${diff} ({change}%)</Badge>
        : <Badge variant="danger">${diff} ({change}%)</Badge>
        }
        </h2>
        
    )
};

export default PriceChangeBox;