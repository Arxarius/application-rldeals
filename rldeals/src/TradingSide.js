import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import Product from "./Product";

import {Container, Form, InputGroup} from 'react-bootstrap';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Utils from "./Utils";

const styles = {
    spacer: {
        height: 16
    },
    title: {
        margin: 0,
        padding: 0,
        overflowWrap: 'break-word'
    },
    titleBar: {
        margin: 0,
        padding: 0
    },
    grow: {
        flexGrow: 1
    },
    textField: {
        backgroundColor: 'white'
    },
    formControl: {
        backgroundColor: 'white'
    },
    formField: {
        minWidth: 225,
        padding: 8,
        paddingBottom: 0,
        paddingTop: 0
    }
};

let prefetchedUrls = [];

class TradingSide extends Component {

    state = {
        filters: {
            query: '',
            sortBy: 'name',
            paint: 'all',
            tag: 'all',
            type: 'all',
            certification: 'all',
            quality: 'all'
        },
        defaultAmountOfItems: 60,
        amountOfItems: 60
    };

    constructor(props) {
        super(props);
        this.scrollPane = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("resize", () => {
            this.forceUpdate();
        });
    }

    getItemsValue(selectedProducts) {
        let sum = selectedProducts.map(_ => _.value).reduce((a, b) => a + b, 0);
        return Utils.roundNumber(sum, 4);
    }

    onScroll = (event) => {
        if ((event.target.offsetHeight + event.target.scrollTop) / event.target.scrollHeight === 1.0) {
            this.setState({
                amountOfItems: this.state.amountOfItems + this.state.defaultAmountOfItems
            })
        }
    };

    setNewFilters(filters) {
        this.setState({
            filters,
            amountOfItems: this.state.defaultAmountOfItems
        });
        this.scrollPane.current.scrollTop = 0;
    }

    render() {
        const {classes, selectedProducts, side, showPlaceholderMarks, selectableProducts, definitions, addProduct, removeProduct, productImageSize, selectedPlaceHolderProducts} = this.props;
        const {filters, amountOfItems} = this.state;

        // console.log('filters', side, filters);

        // Put keys as first product
        let cappedSelectableProducts = selectableProducts;
        let keyProduct = cappedSelectableProducts.filter(_ => _.productId === 1353)
            .sort((a, b) => a.seriesId < b.seriesId ? -1 : a.seriesId > b.seriesId ? 1 : 0)[0];
        cappedSelectableProducts = [keyProduct].concat(cappedSelectableProducts.filter(_ => _.productId !== 1353));

        cappedSelectableProducts = cappedSelectableProducts.filter(product => {
            if (product.value <= 0)
                return false;

            if (filters.query.length > 0 && product.queryText.indexOf(filters.query) < 0)
                return false;

            if (filters.minPrice && product.value < filters.minPrice)
                return false;

            if (filters.maxPrice && product.value > filters.maxPrice)
                return false;

            // TODO
            let selectedProductCount = selectedProducts.filter(_ => Product.ProductsEqualsForPrice(product, _)).length;
            if (selectedProductCount && selectedProductCount >= product.count)
                return false;
            product.selectedProductCount = selectedProductCount;

            if (filters.paint !== 'all') {
                if (filters.paint === 'painted') {
                    if (product.paintId === 0)
                        return false;
                } else if (filters.paint === 'unpainted') {
                    if(product.paintId !== 0)
                        return false;
                } else if (filters.paint !== product.paintId.toString())
                    return false;
            }
            if (filters.certification !== 'all') {
                if (filters.certification === 'certified') {
                    if (product.certificationId === 0)
                        return false;
                } else if (filters.certification === 'uncertified') {
                    if (product.certificationId !== 0)
                        return false;
                } else if (filters.certification !== product.certificationId.toString())
                    return false;
            }
            if (filters.quality !== 'all') {
                if (filters.quality !== product.qualityId.toString())
                    return false;
            }

            if (filters.type !== 'all' && filters.type !== product.type)
                return false;

            return true;
        });

        // Sort products
        if (filters.sortBy !== 'name') {
            cappedSelectableProducts = cappedSelectableProducts.sort((a, b) => {
                if (filters.sortBy === 'priceDesc') {
                    return a.value > b.value ? -1 : a.value < b.value ? 1 : 0;
                } else if (filters.sortBy === 'priceAsc') {
                    return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
                }

                throw Error('Unknown sorting method: ' + filters.sortBy);
            })
        }

        // Cap the amount of items we show and preload next 60
        cappedSelectableProducts = cappedSelectableProducts.slice(0, amountOfItems + this.state.defaultAmountOfItems);
        let preloadProducts = cappedSelectableProducts.slice(amountOfItems, amountOfItems + this.state.defaultAmountOfItems);
        cappedSelectableProducts = cappedSelectableProducts.slice(0, amountOfItems);

        let unmatchedSelectedPlaceHolderProducts = selectedPlaceHolderProducts.concat([]); // clone
        for(let product of selectedProducts){
            let index = unmatchedSelectedPlaceHolderProducts.findIndex(_ =>
                _.productId === product.productId &&
                _.paintId === product.paintId &&
                _.specialEditionId === product.specialEditionId
            );
            if(index >= 0){
                unmatchedSelectedPlaceHolderProducts.splice(index, 1);
            }
        }

        setTimeout(() => {
            preloadProducts.forEach((product) => {
                let isBlackMarket = product.quality === 'BlackMarket';
                let isDecal = product.type === 'Decal';
                let isBoost = product.type === 'RocketBoost';

                let url = Product.getImageUrl(product, isBlackMarket || isDecal || isBoost);
                if (prefetchedUrls.indexOf(url) < 0) {
                    const img = new Image();
                    img.src = url;
                    preloadProducts.push(url);
                }
            });
        }, 250);

        const sideText = (
            <h4 style={{color: 'white'}} className={side === 'user' ? classes.grow : null}>
                <strong>YOU</strong> {side === 'user' ? 'Offer' : 'Receive'}
            </h4>
        );

        let itemCount = selectedProducts.length;
        let itemsValue = itemCount > 0 ? this.getItemsValue(selectedProducts) : this.getItemsValue(unmatchedSelectedPlaceHolderProducts);
        const keyText = (
            <React.Fragment>
                <div className={(side === 'bot' ? classes.grow : null)}>
                    {side === 'user' ? (
                        <h6 style={{color: 'grey', display: 'inline-block', marginRight: 8, fontWeight: 200}}>
                            ({itemCount} Items)
                        </h6>
                    ) : null}

                    <h3 style={{color: 'white', display: 'inline-block', fontWeight: 300}}>
                        {itemsValue} Keys
                    </h3>

                    {side === 'bot' ? (
                        <h6 style={{color: 'grey', display: 'inline-block', marginLeft: 8, fontWeight: 200}}>
                            ({itemCount} Items)
                        </h6>
                    ) : null}
                </div>
            </React.Fragment>
        );

        return (
            <div style={{padding: 16, paddingBottom: 0, paddingTop: 0}} className="unselectable">
                {/*Selected products area*/}
                <div>
                    <div style={{
                        height: 65,
                        backgroundColor: '#26354e',
                        display: 'flex',
                        padding: 16
                    }}>
                        {side === 'user' ? (
                            <React.Fragment>
                                {sideText}
                                {keyText}
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {keyText}
                                {sideText}
                            </React.Fragment>
                        )}
                    </div>
                    <div style={{
                        backgroundColor: '#1b2536',
                        height: 225,
                        padding: 4,
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}>
                        <Container style={{
                            maxWidth: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Row style={{
                                justifyContent: 'center'
                            }}>
                                {selectedProducts.map((product, index) =>

                                    <Product key={index}
                                             side={side}
                                             product={product}
                                             showCount={side === 'bot'}
                                             productImageSize={productImageSize}
                                             onClick={() => removeProduct(product, 1)}
                                             placeholder={showPlaceholderMarks ? false : null}
                                    />
                                )}
                                {unmatchedSelectedPlaceHolderProducts.map((product, index) =>

                                    <Product key={index}
                                             side={side}
                                             product={product}
                                             showCount={side === 'bot'}
                                             productImageSize={productImageSize}
                                             onClick={() => removeProduct(product, 1)}
                                             placeholder={showPlaceholderMarks ? true : null}
                                    />
                                )}
                            </Row>
                        </Container>
                    </div>
                </div>


                {/*Spacer between selected and selectable products*/}
                <div className={classes.spacer}/>

                {/*Selectable products area*/}
                <div>
                    <Container style={{
                        backgroundColor: '#26354e',
                        paddingTop: 8,
                        paddingBottom: 0,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignContent: 'stretch',
                        maxWidth: '100%'
                    }}>
                        <Row>
                            <Col style={styles.formField}>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Control size="sm" type="text" placeholder="Search..."
                                                  style={{width: '100%'}} onChange={(event) => this.setNewFilters(
                                        {
                                            ...filters,
                                            query: event.target.value.toLowerCase()
                                        }
                                    )}/>
                                </Form.Group>
                            </Col>
                            <Col style={styles.formField}>
                                <InputGroup size="sm" className="mb-3" style={{width: '100%'}}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">Sort by</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" onChange={(event) => this.setNewFilters({
                                        ...filters,
                                        sortBy: event.target.value
                                    })}>
                                        <option value="name">Name</option>
                                        <option value="priceAsc">Lowest price</option>
                                        <option value="priceDesc">Highest price</option>
                                    </Form.Control>
                                </InputGroup>

                            </Col>
                            <Col style={styles.formField}>
                                <InputGroup size="sm" className="mb-3" style={{width: '100%'}}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">Paint</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" onChange={(event) => this.setNewFilters({
                                            ...filters,
                                            paint: event.target.value
                                        }
                                    )}>
                                        <option value="all">All</option>
                                        <option value="painted">Painted-only</option>
                                        <option value="unpainted">Unpainted</option>
                                        {Object.keys(definitions['Paint']).map((key) =>
                                            <option key={key} value={key}>{definitions['Paint'][key]}</option>
                                        )}
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                            <Col style={styles.formField}>
                                <InputGroup size="sm" className="mb-3" style={{width: '100%'}}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">Product Type</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" onChange={(event) => this.setNewFilters(
                                        {
                                            ...filters,
                                            type: event.target.value
                                        }
                                    )}>
                                        <option value="all">All</option>
                                        {Object.keys(definitions['Type']).map((key) =>
                                            <option key={definitions['Type'][key]} value={definitions['Type'][key]}>{definitions['Type'][key]}</option>
                                        )}
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                            {
                                side === 'bot' ? (
                                    <Col style={styles.formField}>
                                        <InputGroup size="sm" className="mb-3" style={{width: '100%'}}>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="basic-addon1">Rarity</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control as="select" onChange={(event) => this.setNewFilters({
                                                    ...filters,
                                                    quality: event.target.value
                                                }
                                            )}>
                                                <option value="all">All</option>
                                                {Object.keys(definitions['Quality']).map((key) =>
                                                    <option key={key} value={key}>{definitions['Quality'][key]}</option>
                                                )}
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                ) : null
                            }
                            {
                                side === 'bot' ? (
                                    <Col style={styles.formField}>
                                        <InputGroup size="sm" className="mb-3" style={{width: '100%'}}>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="basic-addon1">Certification</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control as="select" onChange={(event) => this.setNewFilters(
                                                {
                                                    ...filters,
                                                    certification: event.target.value
                                                }
                                            )}>
                                                <option value="all">All</option>
                                                <option value="certified">Certified-only</option>
                                                <option value="uncertified">Uncertified</option>
                                                {Object.keys(definitions['Certification']).map((key) =>
                                                    <option key={key} value={key}>{definitions['Certification'][key]}</option>
                                                )}
                                            </Form.Control>
                                        </InputGroup>
                                    </Col>
                                ) : null
                            }
                        </Row>
                        <Row>
                            <Col style={styles.formField}>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Control size="sm" type="number" placeholder="Min price"
                                                  style={{width: '100%'}} onChange={(event) =>
                                        this.setNewFilters({
                                                ...filters,
                                                minPrice: !isNaN(parseFloat(event.target.value)) ? parseFloat(event.target.value) : null
                                            }
                                        )
                                    }/>
                                </Form.Group>
                            </Col>
                            <Col style={styles.formField}>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Control size="sm" type="number" placeholder="Max price"
                                                  style={{width: '100%'}} onChange={(event) =>
                                        this.setNewFilters({
                                                ...filters,
                                                maxPrice: !isNaN(parseFloat(event.target.value)) ? parseFloat(event.target.value) : null
                                            }
                                        )
                                    }/>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    <div style={{
                        backgroundColor: '#1b2536',
                        height: 425,
                        padding: 4,
                        overflowY: 'auto',
                        // overflowX: 'hidden'
                    }} onScroll={this.onScroll} ref={this.scrollPane}>
                        <Container style={{
                            maxWidth: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Row style={{
                                justifyContent: 'center'
                            }}>
                                {cappedSelectableProducts.map((product, index) => {
                                        return (
                                            <Product key={index}
                                                     side={side}
                                                     product={product}
                                                     showCount={side === 'bot'}
                                                     productImageSize={productImageSize}
                                                     addProduct={(count) => addProduct(product, count)}
                                                     onClick={() => addProduct(product, 1)}
                                            />
                                        );
                                    }
                                )}
                            </Row>
                        </Container>
                    </div>

                </div>
            </div>
        );
    }
}


export default withStyles(styles)(TradingSide);