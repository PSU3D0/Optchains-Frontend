import axios from 'axios';

axios.defaults.baseURL = 'http://52.71.152.103';

export const getStockList = () => (
    axios.get('v1/stocks/list').then(response => response.data)
);

export const getStockHistory = (stock, period) => (
    axios.get(`v1/stocks/${stock}/history`, {
        params: {
          period: period
        }
      }).then(response => response.data)
)

export const getOptionsExpirations = (stock) => (
    axios.get(`v1/options/${stock}/expirations`).then(response => response.data)
)

export const getOptionsContractList = (stock, expiry) => (
    axios.get(`v1/options/${stock}/summary`, {
        params: {
          expiry: expiry
        }
      }).then(response => response.data)
)

export const getOptionsHistory = (symbol,period) => (
    axios.get(`v1/options/history/${symbol}`, {
        params: {
            period: period
        }
    }).then(response => response.data)
);