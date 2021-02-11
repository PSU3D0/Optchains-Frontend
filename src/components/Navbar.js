import React from 'react';
import { Navbar, Nav, Form,} from 'react-bootstrap';

import {Typeahead, Highlighter} from 'react-bootstrap-typeahead';




  const Navigation = ({stockList, stockUpdateHandler}) => {
      const search_ref = React.createRef();
      

      return (
        <Navbar expand="lg" variant="dark">
        <Navbar.Brand>Optchains</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link href="https://github.com/psu3d0">Github</Nav.Link>
        </Navbar.Collapse>
        <Form>
          <Typeahead 
          options={stockList}
          ref={search_ref}
          id={1}
          labelKey="name"
          placeholder="Search stock here"
          filterBy={['ticker','name']}
          onChange={obj => {
            const stock = obj[0];
            if(stock){
              stockUpdateHandler(stock)
            }
            search_ref.current.clear()
          }}

          renderMenuItemChildren={(option,props, idx) => (
            <Highlighter search={props.text} highlightClassName="search-highlight-text">
              {option[props.labelKey]}
            </Highlighter>
          )}
          />
        </Form>

        </Navbar>
      )
  }
  
  export default Navigation;