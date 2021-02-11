import React, {Component,} from 'react';
import OptionsTable from './components/OptionsTable.js';
import StockTable from './components/StockTable.js';
import Navigation from './components/Navbar'
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ExpirationTab from './components/ExpirationTab';
import InfoPanel from './components/InfoPanel';
import {sample} from 'underscore';
import StockChart from './components/StockChart';
import PriceChangeBox from './components/PriceChangeBox';
import axios from 'axios';

import {ThemeProvider} from 'styled-components';
import { GlobalStyles } from "./components/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Themes";

import * as API from './utils/backend_utils';



// eslint-disable-next-line
class App extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      loading: true,

      currentStock: null,
      stockHistory: [],
      stockList: [],

      optionsExpirations: [],
      currentExpiration: null,

      optionsContracts: [],

      currentContract: null,
      contractPriceHistory: [],

      range: "1d",
      theme: 'dark'
    }

    this.handleExpirationUpdate = this.handleExpirationUpdate.bind(this);
    this.handleStockUpdate = this.handleStockUpdate.bind(this)
    this.handleRangeUpdate = this.handleRangeUpdate.bind(this)
    this.handleContractUpdate = this.handleContractUpdate.bind(this);



  }


  async initalizeApp() {
    //Here we perform all intial fetching, as well as selecting random entries
      const stockList = await API.getStockList()

      const currentStock = await sample(stockList);

      const stockHistory = await API.getStockHistory(currentStock.ticker,this.state.range)

      const expirations = await API.getOptionsExpirations(currentStock.ticker)

      const currentExpiration = (expirations) ? expirations[0] : null

      const optionsContracts = await API.getOptionsContractList(currentStock.ticker,currentExpiration)
      const currentContract = await sample(optionsContracts)

      const contractHistory = await API.getOptionsHistory(currentContract.symbol,this.state.range)

      this.setState({
        stockList: stockList,
        currentStock: currentStock,
        stockHistory: stockHistory,
        optionsExpirations: expirations,
        currentExpiration: currentExpiration,
        optionsContracts: optionsContracts,
        currentContract: currentContract,
        contractPriceHistory: contractHistory,
        loading: false
      })
  }

    

  componentDidMount(){
    this.initalizeApp()
    this.timerID = setInterval(
      () => this.refreshData(),
      300000
    );
  }

  componentWillUnmount(){
    clearInterval(this.timerID);
  }

  refreshData(){
    this.getStockData();
    this.handleContractUpdate(this.state.currentContract);
  }


  getStockData() {
    const stock = this.state.currentStock.ticker;

    API.getStockHistory(stock,this.state.range)
    .then(data => {
      this.setState({
        stockHistory: data,
      })
    });

  }

  handleStockUpdate(stock) {
    //Executes on click of stock list
    if (stock === this.state.currentStock) {
      return;
    }
    
    API.getOptionsExpirations(stock.ticker)
    .then(expirations => {
      this.setState({
        currentStock: stock,
        optionsExpirations: expirations
      })
      return sample(expirations);
    })
    .then(random_expiry => {
      this.handleExpirationUpdate(random_expiry)
    })
    .then(() => {
      this.getStockData()
    })
    .catch(() => {
      //If any errors in the stock update chain, simply try again
      //with a random stock
      this.handleStockUpdate(sample(this.state.stockList))
    })
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  handleExpirationUpdate(expiration) {
    if (expiration === this.state.currentExpiration){
      return;
    }
    API.getOptionsContractList(this.state.currentStock.ticker,expiration)
    .then(data => {
      this.setState({
        currentExpiration: expiration,
        optionsContracts: data,
      })
      return data;
    })
    .then(data => {this.handleContractUpdate(sample(data))})
    .catch(()=> {
      this.handleStockUpdate(sample(this.state.stockList));
    })

  }

  handleContractUpdate(contract_obj) {
    API.getOptionsHistory(contract_obj.symbol,this.state.period).then(priceHistory => {
      this.setState({
        currentContract: contract_obj,
        contractPriceHistory: priceHistory
      })
    })
    
  }

  handleRangeUpdate(range) {
    //We are updating chart only, so simply recall current
    //stock with new range from API
    if (range == this.state.range){
      return
    }
    const stock = this.state.currentStock.ticker
    const optionSymbol = this.state.currentContract.symbol

    //TODO Convert this into individual functions
    Promise.all([
      API.getStockHistory(stock,range),
      API.getOptionsHistory(optionSymbol,range)
    ])
    .then(data => {
      this.setState({
        range: range,
        stockHistory: data[0],
        contractPriceHistory: data[1]
      })
    });

  }




  render() {
    if (!this.state.loading & this.state.stockHistory.length > 0){
      const currentPrice = this.state.stockHistory.slice(-1)[0].close
      const start = this.state.stockHistory[0].open
    
      const chartData = [this.state.stockHistory, this.state.contractPriceHistory]
      let width = window.innerWidth;

      if (width > 768){
        return (
          <ThemeProvider theme={this.state.theme === 'light' ? lightTheme : darkTheme}>
            <>
            <GlobalStyles />
  
            <div className="App">
            <Navigation stockList={this.state.stockList} stockUpdateHandler={this.handleStockUpdate}/>
            <Container fluid>
              <Row>
                <Col>
                <StockTable data={this.state.stockList} clickHandler={this.handleStockUpdate}/>
                </Col>
                <Col md={6}>
                  <StockChart data={chartData} rangeUpdater={this.handleRangeUpdate} ticker={this.state.currentStock.ticker}/>
                  <InfoPanel stock={this.state.currentStock} contract={this.state.currentContract}/>
                </Col>
                <Col>
                <ExpirationTab expirations={this.state.optionsExpirations} clickHandler={this.handleExpirationUpdate} />
                <OptionsTable data={this.state.optionsContracts} optionsClickHandler={this.handleContractUpdate}/>
                </Col>
  
              </Row>
            </Container>
            </div>
            </>
            </ThemeProvider>
        )
      }
      else {
        return (
          <ThemeProvider theme={this.state.theme === 'light' ? lightTheme : darkTheme}>
            <>
            <GlobalStyles />
  
            <div className="App">
            <Navigation stockList={this.state.stockList} stockUpdateHandler={this.handleStockUpdate}/>
            <StockChart data={chartData} rangeUpdater={this.handleRangeUpdate} ticker={this.state.currentStock.ticker}/>
            <InfoPanel stock={this.state.currentStock} contract={this.state.currentContract}/>
            <ExpirationTab expirations={this.state.optionsExpirations} clickHandler={this.handleExpirationUpdate} />
            <OptionsTable data={this.state.optionsContracts} optionsClickHandler={this.handleContractUpdate}/>
            <StockTable data={this.state.stockList} clickHandler={this.handleStockUpdate}/>
            </div>
            </>
            </ThemeProvider>
        )
      }
      
    }
    else {
      return (
        <ThemeProvider theme={this.state.theme === 'light' ? lightTheme : darkTheme}>
            <>
            <GlobalStyles />
            <div style={{textAlign: 'center'}}>
            <h1>Fetching Data</h1>
            <br></br>
            <Spinner animation="grow"/>
            </div>
            </>
        </ThemeProvider>
      )
    }
  }

}

export default App;