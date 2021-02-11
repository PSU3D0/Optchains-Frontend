import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip, Legend} from 'recharts';
import axios from 'axios';

import {ToggleButton, Row, Col, ToggleButtonGroup} from 'react-bootstrap';
import {formatTimeStr} from '../utils/misc_utils';

import PriceChangeBox from './PriceChangeBox';






function StockChart({data, rangeUpdater, ticker}) {

    const [chartDisplay, setChartDisplay] = React.useState(0);

    const dataKey = (!chartDisplay) ? 'high' : 'last_price';
    var dataArr = data[chartDisplay];
    dataArr = dataArr.filter(datum => datum[dataKey] > 0);
    const max = dataArr.reduce((a,b) => Math.max(a,b[dataKey]), dataArr[0][dataKey]);
    const min = dataArr.reduce((a,b) => Math.min(a,b[dataKey]), dataArr[0][dataKey]);
    const start = dataArr[0][dataKey]

    const end = dataArr.slice(-1)[0][dataKey]
    var currentEnd = end
    const colorCode = start > end ? '#c03131': '#21ce99'


    const StockTooltip = ({active, payload,label}) => {
        if (active) {
            const data = payload[0]
            const tooltipItems = payload.map((obj) => {
                return (
                    <>
                    <li style={{listStyleType: 'none'}}>{`${obj.name}: $${obj.value}`}</li>
                    </>
                )
            })
            const time = formatTimeStr((!chartDisplay) ? data.payload.time : data.payload.recorded)

            return (
                <>
                <div className="label">
                    {tooltipItems}
                    <li style={{listStyleType: 'none'}}>{`${time}`}</li>
                </div>
                </>
            )
        }
        return null;
    }
    

    const rangeButtons = ['1D','1Mo','3Mo','1Y','2Y','5Y'].map((range,i) => {
        return <ToggleButton
            value={range}
            variant="dark"
            className="range-button"
            onChange={() => rangeUpdater(range)}
            >
        {range}
        </ToggleButton>
    })

    const updateEndPrice = (payload) => {
        if (payload && payload.activePayload){
            currentEnd = payload.activePayload[0].value
        }
    }



    return (
    <>
    <PriceChangeBox start={start} end={currentEnd} ticker={ticker}/>
    <ToggleButtonGroup type="radio" name="charts" defaultValue="stock">
        <ToggleButton value="stock" variant="dark" onClick={() => setChartDisplay(0)}>Stock History</ToggleButton>
        
        <ToggleButton value="options" variant="dark" onClick={() => setChartDisplay(1)}>Options History</ToggleButton>
    </ToggleButtonGroup>
    <ResponsiveContainer width="100%" height={500}>
    <LineChart data={dataArr} margin={{top:25, bottom:25}}>
        <Line
            name="Price" 
            type="linear"
            dataKey={dataKey}
            strokeWidth={2} stroke={colorCode}
            dot={false}
            isAnimationActive={false}
            
            
        />

        <Line name="Bid" type="linear" dataKey="bid" strokeDasharray="3 3"
        dot={false} stroke="#ffa64d"/>
        <Line name="Ask" type="linear" dataKey="ask" strokeDasharray="3 3"
        dot={false}/>
        {chartDisplay &&
        <Legend />
        }
        <Tooltip content={<StockTooltip />}/>
        <YAxis 
            hide={true}
            allowDecimals={false}
            domain={[min,max]}
        />
    </LineChart>
    </ResponsiveContainer>
    <ToggleButtonGroup type="radio" name="ranges" defaultValue="1D">
        {rangeButtons}
    </ToggleButtonGroup>
    </>
    )
}
export default StockChart;