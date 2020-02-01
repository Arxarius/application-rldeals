const apienv = process.env.REACT_APP_API_BASE_URL_ENV;
let baseUrl = 'https://rl.deals/api';

if (apienv === "local") {
    baseUrl = 'https://localhost:5001/api';
} else if (apienv === "development") {
    baseUrl = 'http://142.93.231.167/api';
}

console.log(baseUrl);

class Api {

    static enrichProductWithQueryText(product){
        let queryText = product.name;
        if(product.paintId)
            queryText += ' ' + product.paint;
        if(product.specialEditionId)
            queryText += ' ' + product.specialEdition;
        if(product.certificationId)
            queryText += ' ' + product.certification;
        return {
          ...product,
            queryText: queryText.toLowerCase()
        };
    }

    static GetProductCatalogue(callback, error = () => 1) {
        fetch(`${baseUrl}/product/catalogue`)
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => {
                let sortedData = {
                    ...data,
                    botProducts: data.botProducts.map(this.enrichProductWithQueryText).sort((a, b) => a.queryText.localeCompare(b.queryText)),
                    userProducts: data.userProducts.map(this.enrichProductWithQueryText).sort((a, b) => a.queryText.localeCompare(b.queryText)),
                };
                callback(sortedData);
            })
            .catch(error);
    }

    static GetDefinitions(callback, error = () => 1) {
        fetch(`${baseUrl}/definition`)
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => {
                let mappedData = {};
                for(let element of data){
                    if(mappedData[element.type] == null)
                        mappedData[element.type] = {};
                    mappedData[element.type][element.value] = element.name;
                }

                callback(mappedData);
            })
            .catch(error);
    }

    static GetPreCalculatedPrices(callback, error = () => 1) {
        fetch(`${baseUrl}/productPrice/preCalculatedPrices`)
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error);
    }

    static GetInventory(callback, error = () => 1) {
        fetch(`${baseUrl}/inventory`)
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error);
    }

    static GetActiveTrade(callback, error = () => 1) {
        let requestTime = new Date().getTime();
        let accessToken = localStorage.getItem('accessToken');
        fetch(`${baseUrl}/trade/active`, {
            headers: {
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => callback(data, requestTime))
            .catch(error);
    }

    static JoinActiveTrade(callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        let requestTime = new Date().getTime();
        fetch(`${baseUrl}/trade/active/join`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => callback(data, requestTime))
            .catch(error);
    }

    static AddProduct(productInstanceId, count, callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        let requestTime = new Date().getTime();
        fetch(`${baseUrl}/trade/products/${productInstanceId}?count=${count || 1}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => callback(data, requestTime))
            .catch(error);
    }

    static RemoveProduct( productInstanceId, count, callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        let requestTime = new Date().getTime();
        fetch(`${baseUrl}/trade/products/${productInstanceId}?count=${count || 1}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => callback(data, requestTime))
            .catch(error);
    }

    /*
        Endpoints for logged in users
     */

    static GetUser(callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetch(`${baseUrl}/authentication/user`, {
                headers: {
                    'Authorization': accessToken
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res;
                    } else {
                        throw Error(`Request rejected with status ${res.status}`);
                    }
                })
                .then(response => response.json())
                .then(data => callback(data))
                .catch(error);
        }
    }

    static UseCouponCode(code, callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        fetch(`${baseUrl}/coupon/${code.toUpperCase()}/use`, {
            method: 'post',
            headers: {
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(data => callback(data))
            .catch(error);
    }

    static GetCouponCodes(callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetch(`${baseUrl}/coupon`, {
                headers: {
                    'Authorization': accessToken
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res;
                    } else {
                        throw Error(`Request rejected with status ${res.status}`);
                    }
                })
                .then(response => response.json())
                .then(data => callback(data))
                .catch(error);
        }
    }

    static GetInventorySummary(callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetch(`${baseUrl}/inventory/summary`, {
                headers: {
                    'Authorization': accessToken
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res;
                    } else {
                        throw Error(`Request rejected with status ${res.status}`);
                    }
                })
                .then(response => response.json())
                .then(data => callback(data))
                .catch(error);
        }
    }

    static GetTradeHistory(page, completed, userId, callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetch(`${baseUrl}/trade/everyone?page=${page}&completed=${completed}&userId=${userId}`, {
                headers: {
                    'Authorization': accessToken
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res;
                    } else {
                        throw Error(`Request rejected with status ${res.status}`);
                    }
                })
                .then(response => response.json())
                .then(data => {
                    // let newData = .map(this.enrichProductWithQueryText);
                    console.log(data);
                    let newData = data.map(trade => {
                        return {
                            ...trade,
                            userProducts: trade.userProducts.map(this.enrichProductWithQueryText),
                            botProducts: trade.botProducts.map(this.enrichProductWithQueryText)
                        };
                    });

                    callback(newData);
                })
                .catch(error);
        }
    }

    static GetPrices(callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        fetch(`${baseUrl}/productPrice/prices`, {
            headers: {
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error);
    }

    static SavePrices(prices, callback, error = () => 1) {
        let accessToken = localStorage.getItem('accessToken');
        fetch(`${baseUrl}/productPrice/prices`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body: JSON.stringify(prices),
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(data => callback(data))
            .catch(error);
    }

    static LogoutUser(callback, error) {
        let accessToken = localStorage.getItem('accessToken');
        fetch(`${baseUrl}/authentication/logout`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(data => callback(data))
            .catch(error);
    }

    static GetBotStatus(callback, error = () => 1) {
        fetch(`${baseUrl}/bot/status`)
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error);
    }

    static StartBot(callback, error) {
        let accessToken = localStorage.getItem('accessToken');
        fetch(`${baseUrl}/bot/start`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(data => callback(data))
            .catch(error);
    }

    static StopBot(callback, error) {
        let accessToken = localStorage.getItem('accessToken');
        fetch(`${baseUrl}/bot/stop`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        })
            .then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
            .then(data => callback(data))
            .catch(error);
    }
}


export default Api;