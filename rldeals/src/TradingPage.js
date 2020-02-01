import React, {Component} from 'react';
import TradingSide from "./TradingSide";
import MiddleSide from "./MiddleSide";
import {Col, Container, Row} from "react-bootstrap";
import Api from "./Api";
import Product from "./Product";

class TradingPage extends Component {

    state = {
        user: null,
        lastTradeRetrieved: 0,
        trade: null,
        selectedPlaceHolderProducts: [],
        productImageSize: 110
    };

    componentDidMount() {
        window.addEventListener("resize", () => {
            this.forceUpdate();
        });

        this.getBotStatus();
        let interval = setInterval(() => {
            this.getBotStatus();
        }, 15 * 1000);
        this.setState({interval});

        Api.GetUser((user) => {
            this.setState({
                user,
                withDiscount: user && user.name.toUpperCase().indexOf('RL.DEALS') >= 0
            });
        }, () => {
            console.info('Failed to get user');
        });

        Api.GetActiveTrade((trade, date) => {
            console.info('Retrieved active trade: ', trade);
            this.updateTrade(trade, date);
        }, (error) => {
            console.log(error);
            console.info('Failed to get active trade');
        });

        Api.GetProductCatalogue((catalogue) => {
            let withDiscount = this.state.withDiscount;
            this.setState({
                catalogue: {
                    userProducts:this.calculateProducts(catalogue.userProducts, 'user', withDiscount),
                    botProducts: this.calculateProducts(catalogue.botProducts, 'bot', withDiscount)
                }
            })
        }, (error) => {
            console.log(error);
            this.props.openNotification('error', 'Failed to retrieve product catalogue');
        });

        setInterval(() => {
            let {trade, lastTradeRetrieved} = this.state;

            let updateNow;
            if (!trade) {
                updateNow = true;
            } else if (trade.partySessionId == null && trade.botProducts.length === 0 && trade.userProducts.length === 0) {
                updateNow = false;
            } else if (trade.partySessionId && new Date().getTime() - lastTradeRetrieved > 1000) {
                updateNow = true;
            } else {
                updateNow = new Date().getTime() - lastTradeRetrieved > 5000;
            }

            if (updateNow) {
                Api.GetActiveTrade((responseTrade, date) => {
                    // Reload page if trade is completed or cancelled
                    if (responseTrade.completedAt || responseTrade.cancelledAt)
                        window.location.reload();

                    this.updateTrade(responseTrade, date);
                }, (error) => {
                    console.error('Failed to update trade');
                    console.error(error);

                    if (trade)
                        window.location.reload();
                });
            }
        }, 1000);
    }

    getBotStatus = () => {
        Api.GetBotStatus((data) => {
            this.setState({botRunning: data.running});
        }, () => {
            this.setState({botRunning: null});
        });
    };

    calculateProducts(products, side, withDiscount){
        let selectedProducts = [];
        products.forEach(product => {
            product.value = Product.CalculateProductPrice(product, side, selectedProducts, withDiscount);
            selectedProducts.push(product);
        });

        return products;
    }

    updateTrade(trade, date) {
        // Method accepts date argument so we only update if the trade date is newer
        // Don't set state if state remains the same
        localStorage.setItem('accessToken', trade.accessToken);

        let user = trade.user || this.state.user;
        let newLastTradeRetrieved = this.state.lastTradeRetrieved > date ? this.state.lastTradeRetrieved : date;
        let newTrade = this.state.lastTradeRetrieved > date ? this.state.trade : trade;
        let withDiscount = user && user.name.toUpperCase().indexOf('RL.DEALS') >= 0;

        this.setState({
            user,
            withDiscount: withDiscount,
            lastTradeRetrieved: newLastTradeRetrieved,
            trade: newTrade,
            selectedUserProducts: this.calculateProducts(trade.userProducts, 'user', withDiscount),
            selectedBotProducts: this.calculateProducts(trade.botProducts, 'bot', withDiscount)
        });
    }

    joinActiveTrade = () => {
        let {trade} = this.state;

        // If we already have a trade with a party session, join that
        if (trade && trade.partySessionId) {
            window.location = "steam://joinlobby/252950/" + trade.partySessionId;
            return;
        }

        this.props.openNotification(null, 'Joining trade...');
        Api.JoinActiveTrade((responseTrade, date) => {
            console.log('JoinActiveTrade');
            this.updateTrade(responseTrade, date);
            window.location = "steam://joinlobby/252950/" + responseTrade.partySessionId;
        }, (error) => {
            this.props.openNotification('error', 'Failed to join trade');
            console.log(error);
        });
    };

    addProduct = (product, side, count = 1) => {
        if (side === 'bot' && this.state.trade) {
            Api.AddProduct(product.id, count, (responseTrade, date) => {
                this.updateTrade(responseTrade, date);
            }, () => {
                this.props.openNotification('error', 'Failed to add item to trade');
            });
        } else if(side === 'user') {
            if(this.state.trade.userProducts.length === 0){
                this.setState({
                    selectedPlaceHolderProducts: this.state.selectedPlaceHolderProducts.concat(Array(count).fill({...product, count: 1}))
                })
            } else {
                this.props.openNotification('error', 'Add product in active trade in-game');
            }
        }
    };

    removeProduct = (product, side, count) => {
        if (side === 'bot' && this.state.trade) {
            Api.RemoveProduct(product.id, count, (responseTrade, date) => {
                this.updateTrade(responseTrade, date);
            }, (error) => {
                this.props.openNotification('error', 'Failed to remove item from trade');
                console.error(error);
            });
        } else {
            let newPlaceHolderProducts = this.state.selectedPlaceHolderProducts;
            let index = newPlaceHolderProducts.findIndex(_ => _.id === product.id);
            if (index >= 0) {
                newPlaceHolderProducts.splice(index, 1);
                this.setState({
                    selectedPlaceHolderProducts: newPlaceHolderProducts
                })
            }
        }
    };

    updateProductImageSize = (delta) => {
        this.setState({
            productImageSize: Math.max(60, Math.min(250, this.state.productImageSize + delta))
        })
    };

    render() {
        const {definitions, openNotification} = this.props;
        const {catalogue, productImageSize, user, withDiscount, trade, selectedPlaceHolderProducts, botRunning} = this.state;

        if (!trade || !catalogue)
            return <div/>;

        let balance;
        let userProductsValue = trade.userProducts.map(_ => _.value).reduce((a, b) => a + b, 0);
        let botProductsValue = trade.botProducts.map(_ => _.value).reduce((a, b) => a + b, 0);
        let placeholderProductsValue = selectedPlaceHolderProducts.map(_ => _.value).reduce((a, b) => a + b, 0);
        if(trade.partySessionId){
            balance = userProductsValue - botProductsValue;
        } else{
            balance = placeholderProductsValue - botProductsValue;
        }

        return (
            <Container style={{maxWidth: '100%'}}>
                <Row>
                    <Col lg={5} style={{padding: 0, paddingTop: 16, paddingBottom: 16}}>
                        <TradingSide
                            withDiscount={withDiscount}
                            side="user"
                            selectableProducts={catalogue.userProducts}
                            selectedProducts={trade.userProducts}
                            selectedPlaceHolderProducts={selectedPlaceHolderProducts}
                            catalogue={catalogue}
                            definitions={definitions}
                            removeProduct={(product, count) => this.removeProduct(product, 'user', count)}
                            addProduct={(product, count) => this.addProduct(product, 'user', count)}
                            productImageSize={productImageSize}
                            showPlaceholderMarks={trade.partySessionId != null}
                        />
                    </Col>

                    <Col lg={2} style={{padding: 0, paddingTop: 16, paddingBottom: 16}}>
                        <MiddleSide
                            balance={balance}
                            user={user}
                            withDiscount={withDiscount}
                            openNotification={openNotification}
                            joinActiveTrade={this.joinActiveTrade}
                            updateProductImageSize={this.updateProductImageSize}
                            botRunning={botRunning}
                        />
                    </Col>

                    <Col lg={5} style={{padding: 0, paddingTop: 16, paddingBottom: 16}}>
                        <TradingSide
                            selectableProducts={catalogue.botProducts}
                            withDiscount={withDiscount}
                            side="bot"
                            selectedProducts={trade.botProducts}
                            selectedPlaceHolderProducts={[]}
                            catalogue={catalogue}
                            definitions={definitions}
                            removeProduct={(product) => this.removeProduct(product, 'bot')}
                            addProduct={(product, count) => this.addProduct(product, 'bot', count)}
                            productImageSize={productImageSize}
                            showPlaceholderMarks={trade.partySessionId != null}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}


export default TradingPage;