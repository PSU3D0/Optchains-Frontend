import React from 'react';
import DataTable from 'react-data-table-component';
import {Tabs, Tab,} from 'react-bootstrap';

const columns = [
    {
        name: "Strike",
        selector: "strike",
        sortable: true,
        format: row => '$'+row.strike
    },
    {
        name: "Latest Price",
        selector: 'last_price',
        sortable: true,
        format: row => '$'+row.last_price
    }
];



function OptionsTable({data,optionsClickHandler}){
    const [contract_type, setContractType] = React.useState("C");
    const filteredData = data.filter(item => item.contract_type == contract_type);

    return (
        <div>
        <Tabs
          onSelect={(k) => setContractType(k)}
        >
            <Tab 
                title={"Calls"}
                eventKey={"C"}
            />
            <Tab 
                title={"Puts"}
                eventKey={"P"}
            />
        </Tabs>
        <DataTable 
                title=""
                columns={columns}
                data={filteredData}
                pagination
                paginationPerPage={15}
                paginationRowsPerPageOptions={[10,15,20]}
                pointerOnHover
                highlightOnHover
                onRowClicked={optionsClickHandler}
                dense
            />
        </div>
    )
}

export default OptionsTable;