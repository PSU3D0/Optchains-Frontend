import React from 'react';
import DataTable from 'react-data-table-component';


const columns = [
    {
        name: "Name",
        selector: "name",
        sortable: true,
    },
    {
        name: "Ticker",
        selector: "ticker",
        sortable: true
    },

    {
        name: "Category",
        selector: "category",
        sortable: true
    }
];



const StockTable = ({data, clickHandler}) => {

    return (
        <DataTable 
        title="Stock List"
        columns={columns}
        data={data}
        pagination
        pointerOnHover
        highlightOnHover
        onRowClicked={(row_obj) => clickHandler(row_obj)}
        
    />
    )
}

export default StockTable;