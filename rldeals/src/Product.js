import React, {Component} from 'react';
import Tooltip from "@material-ui/core/Tooltip";
import KeyImagePng from './images/key.png';
import Popover, {ArrowContainer} from "react-tiny-popover";
import Utils from "./Utils";
import Col from "react-bootstrap/Col";

const productImageBaseUrl = window.location.hostname !== 'rl.deals' ? 'http://142.93.231.167' : 'https://rl.deals/';

const specialEditionMap = {
    3338: 3899,
    3365: 3897,
    3620: 3898,
    3369: 3900,
    3314: 3901,
    3317: 4000,
    3438: 4001,
    4032: 4112
};

class Product extends Component {

    styles = (productImageSize) => {
        return {
            product: {
                backgroundColor: 'black'
            },
            imageOverlayBottomLeft: {
                fontFamily: 'Metropolis, Arial',
                fontSize: productImageSize / 9,
                position: 'absolute',
                bottom: '5px',
                left: '5px',
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '0px 2px 0px 2px'
            },
            imageOverlayBottomCenter: {
                fontFamily: 'Metropolis, Arial',
                lineHeight: 1,
                fontWeight: 400,
                fontSize: productImageSize / 9,
                position: 'absolute',
                textAlign: 'center',
                bottom: '4px',
                left: '4px',
                right: '4px',
                padding: 4,
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                // margin: '4px 0px 4px 0px'
            },
            imageOverlayTopRight: {
                fontFamily: 'Metropolis, Arial',
                fontWeight: 300,
                fontSize: productImageSize / 9,
                position: 'absolute',
                top: '7px',
                right: '7px',
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '0px 2px 0px 2px'
            },
            imageOverlayTopLeft: {
                fontFamily: 'Metropolis, Arial',
                fontWeight: 300,
                fontSize: this.props.productImageSize / 9,
                position: 'absolute',
                top: '7px',
                left: '7px',
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '0px 2px 0px 2px'
            },
            imageOverlayTopLeftLower: {
                fontFamily: 'Metropolis, Arial',
                fontWeight: 500,
                fontSize: productImageSize / 9,
                position: 'absolute',
                top: '7px',
                left: '7px',
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '0px 2px 0px 2px',
                opacity: 1
            },
            addProductButton: {
                cursor: 'pointer',
                marginRight: 5
            }
        };
    };

    state = {
        isPopoverOpen: false
    };

    static ProductsEqualsForPrice(product1, product2){
        return product1.productId === product2.productId &&
            product1.paintId === product2.paintId &&
            product1.specialEditionId === product2.specialEditionId;
    }

    static CalculateProductPrice(product, side, selectedProducts, withDiscount) {
        if (side === 'user') {
            if (product.preCalculatedProductPrice) {
                let price = product.preCalculatedProductPrice;
                let x = price.x;
                let step = price.step;

                let itemsAlreadyInTrade = selectedProducts.filter(
                    _ => Product.ProductsEqualsForPrice(_, product)
                ).length;
                let itemsCurrentlyInInventory = product.count;
                let afterItemsInInventory = itemsAlreadyInTrade + itemsCurrentlyInInventory;

                let basePrice = price.lowPrice;
                let steps = Math.floor(afterItemsInInventory / x);
                let finalPrice = basePrice - (steps * step);
                return Math.max(0, Utils.roundNumber(finalPrice, 4));
            } else {
                return 0;
            }
        } else if (side === 'bot') {
            let price = product.preCalculatedProductPrice;
            let x = price.x;
            let step = price.step;

            let itemsAlreadyInTrade = selectedProducts.filter(
                _ => Product.ProductsEqualsForPrice(_, product)
            ).length;
            let itemsCurrentlyInInventory = product.count;
            let afterItemsInInventory = itemsAlreadyInTrade + itemsCurrentlyInInventory;

            let basePrice = price.highPrice;
            let steps = Math.floor(afterItemsInInventory / x);
            let finalPrice = basePrice - (steps * step);
            finalPrice = Math.max(0, product.preCalculatedProductPrice.lowPrice, finalPrice);
            // console.log('price', price, 'x', x, 'itemsAlreadyInTrade', itemsAlreadyInTrade, 'itemsCurrentlyInInventory', itemsCurrentlyInInventory, 'afterItemsInInventory', afterItemsInInventory);
            if(withDiscount){
                finalPrice *= 0.98;
            }
            return Utils.roundNumber(finalPrice, 4);
        }
    }

    static getImageUrl(product, isDefaultColor) {
        let paintId = product.paintId;
        let productId = product.productId;
        let type = product.type;
        if (product.specialEditionId)
            productId = specialEditionMap[productId];

        if (type === 'Engine Audio' || type === 'engine')
            paintId = 0;

        return productImageBaseUrl + `/images/products/${productId}.${isDefaultColor ? 0 : (paintId || 0)}.png`;
    }

    popOverChange = (newState) => {
        if (this.state.isPopoverOpen !== newState) {
            this.setState({isPopoverOpen: newState});
            document.activeElement.blur();
        }
    };

    render() {
        // eslint-disable-next-line
        const {product, onClick, addProduct, showCount, productImageSize, placeholder} = this.props;
        const count = product.count - product.selectedProductCount;
        const styles = this.styles(productImageSize);

        let isBlackMarket = product.quality === 'BlackMarket';
        let isDecal = product.type === 'Decal';
        let isBoost = product.type === 'RocketBoost';

        let productImage = Product.getImageUrl(product, isBlackMarket || isDecal || isBoost);

        let productName = product.name;
        let attributeNames = [product.paint, product.specialEdition, product.certification].filter(_ => _ && _ !== 'None');

        return (
            <Col className={placeholder === true ? '' : placeholder === false ? 'greenProduct' : ''} style={{
                padding: 0,
                flex: 0,
                flexGrow: 0
            }}>
                <div style={{
                    backgroundColor: 'black',
                    width: productImageSize,
                    height: productImageSize,
                    margin: 4
                }}
                >
                    <div style={styles.product}
                         onMouseLeave={() => this.popOverChange(false)}
                        //onMouseUp={() => this.popOverChange(false)}
                         onTouchEnd={() => this.popOverChange(false)}
                         onMouseEnter={() => this.popOverChange(true)}
                         onMouseMove={() => this.popOverChange(true)}
                         onMouseDown={() => this.popOverChange(true)}
                         onTouchStart={() => this.popOverChange(true)}
                         onClick={(event) => {
                             event.stopPropagation();
                             onClick(event);
                         }}
                    >
                        <Popover
                            isOpen={this.state.isPopoverOpen}
                            // position={['top', 'right', 'left', 'bottom']}
                            padding={10}
                            onClickOutside={() => this.popOverChange(false)}
                            content={({position, targetRect, popoverRect}) => (
                                <ArrowContainer
                                    position={position}
                                    targetRect={targetRect}
                                    popoverRect={popoverRect}
                                    arrowColor={'white'}
                                    arrowSize={10}
                                    arrowStyle={{}}
                                >
                                    <div
                                        style={{backgroundColor: 'white', padding: 16, zIndex: 100}}
                                    >
                                        {productName}
                                        {product.paintId > 0 ? <span><br/>Paint: {product.paint}</span> : null}
                                        {product.specialEditionId > 0 ? <span><br/>SpecialEdition: {product.specialEdition}</span> : null}
                                        {product.seriesId < 999
                                            ? <span><br/>Series: {product.series}</span> : null}
                                        {product.qualityId > 0 ? <span><br/>Rarity: {product.quality}</span> : null}
                                        {product.type ? <span><br/>Type: {product.type}</span> : null}
                                        {showCount && count ? (
                                            <span><br/>Remaining items: {count}</span>
                                        ) : null}
                                        <br/>Price: {product.value}
                                    </div>
                                </ArrowContainer>
                            )}
                        >
                            {/*Product image*/}
                            <img alt="" src={productImage} className="grab" onError={
                                (e) => e.target.src = `./images/products/default.png`
                            } style={{width: '100%'}}
                            />

                            {/*Black market overlay, with click because this is overlayed and can't click on layer below*/}
                            {isBlackMarket ?
                                (
                                    <div className="blackMarketImage grab"/>
                                ) : null
                            }
                            {isDecal && !isBlackMarket ?
                                (
                                    <div className="decalImage grab"/>
                                ) : null
                            }
                            {isBoost ?
                                (
                                    <div className="boostImage grab"/>
                                ) : null
                            }

                            {/*Price in keys*/}
                            {product.value != null ?
                                (
                                    <div style={styles.imageOverlayTopLeft} className="hideOnHover">
                                        {product.value}
                                        <img alt="key" align="top" src={KeyImagePng}
                                             style={{width: productImageSize / 8}}/>
                                    </div>
                                ) : null
                            }
                            {(product.type.indexOf('Crate') === 0 || product.productId === 1353) && addProduct ?
                                (
                                    <React.Fragment>
                                        <div className="notHideOnHover">
                                            <div style={styles.imageOverlayTopLeftLower}>
                                                <Tooltip title="Add 5 of this type" aria-label="Add">
                                                <span onClick={(event) => {
                                                    addProduct(5);
                                                    event.stopPropagation();
                                                }}
                                                      style={styles.addProductButton}>
                                                    5
                                                </span>
                                                </Tooltip>
                                                <Tooltip title="Add 24 of this type" aria-label="Add">
                                                <span onClick={(event) => {
                                                    addProduct(24);
                                                    event.stopPropagation();
                                                }}
                                                      style={styles.addProductButton}>
                                                    24
                                                </span>
                                                </Tooltip>
                                                {product.productId === 1353 ? (
                                                    <Tooltip title="Add 200 of this type" aria-label="Add">
                                                    <span onClick={(event) => {
                                                        addProduct(200);
                                                        event.stopPropagation();
                                                    }}
                                                          style={styles.addProductButton}>
                                                        200
                                                    </span>
                                                    </Tooltip>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ) : null
                            }

                            {/*Count of item*/}
                            {showCount && count ? (
                                <Tooltip className="hideOnHover" title="Number of items" aria-label="Add">
                                    <div style={styles.imageOverlayTopRight}>
                                        {count + 'x'}
                                    </div>
                                </Tooltip>
                            ) : null}

                            {/*Product name and properties such as paint*/}
                            <div className="hideOnHover" style={styles.imageOverlayBottomCenter}>
                                <span>{productName}</span>
                                {attributeNames.map((_, index) => (
                                    <span key={index}><br/>{_}</span>
                                ))}
                            </div>
                        </Popover>
                    </div>
                </div>
            </Col>
        );
    }
}


export default Product;