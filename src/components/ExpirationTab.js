import {Tabs, Tab,} from 'react-bootstrap';


const tabStyling = {
    overflowX: 'auto',
    overflowY: 'auto',
    whiteSpace: 'nowrap',
    maxHeight: '100px',
    "::-webkit-scrollbar": { display: "none" },
    msOverflowStyle: "none",
    scrollbarWidth: "none"
}

const ExpirationTab = ({expirations,clickHandler}) => (
    <>
    <h3 style={{textAlign: 'center'}}>Expirations</h3>
    {expirations &&
    <Tabs
      onSelect={clickHandler}
      style={tabStyling}>
        {expirations.map(expiration => (
            <Tab
                title={expiration}
                eventKey={expiration}
            />
        ))}
    </Tabs>
    }
    </>
);

export default ExpirationTab;