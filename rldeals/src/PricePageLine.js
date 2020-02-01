import React, {Component} from 'react';
import Utils from "./Utils";

class PricesPageLine extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    calculateExamplePrice = (price) => {
        let {inventoryCount} = this.props;
        let lowPrice = price.overwriteLowPrice != null ? price.overwriteLowPrice : price.insiderLowPrice;
        let highPrice = price.overwriteHighPrice != null ? price.overwriteHighPrice : price.insiderHighPrice;
        let x = price.overwriteX != null ? price.overwriteX : price.presetX;
        let step = price.overwriteStep ? price.overwriteStep : price.presetStep;
        let steps = Math.floor(inventoryCount / x);
        let finalPrice = highPrice - (steps * step);
        finalPrice = Math.max(0, lowPrice, finalPrice);
        return Utils.roundNumber(finalPrice, 4);
    };

    incorrectPrice = (price) => {
        let lowPrice = price.overwriteLowPrice != null ? price.overwriteLowPrice : price.insiderLowPrice;
        let highPrice = price.overwriteHighPrice != null ? price.overwriteHighPrice : price.insiderHighPrice;

        return lowPrice > highPrice;
    };

    render() {
        let {price} = this.props;
        let priceLastModifiedAt = new Date(price.modifiedAt || price.createdAt);
        let product = price.product;
        let fullName = product.name;
        for (let attribute of product.attributes) {
            fullName += ' ' + attribute.definition.name;
        }

        let modifiedInThisSession = priceLastModifiedAt > this.props.lastModified;

        let examplePrice = this.calculateExamplePrice(price);

        let incorrectPrice = this.incorrectPrice(price);

        return (
            <tr style={{backgroundColor: incorrectPrice ? 'red' : modifiedInThisSession ? '#9cff96' : 'white'}}>
                <td>{Utils.serializeDate(priceLastModifiedAt)}</td>
                <td>{fullName}</td>

                <td>{price.insiderLowPrice}</td>
                <td>{price.insiderHighPrice}</td>
                <td>{price.presetLimit}</td>
                <td>{price.presetMargin}</td>
                <td>{price.presetStep}</td>
                <td>{price.presetX}</td>

                <td>
                    <input type="number" defaultValue={price.overwriteLowPrice}
                           onChange={(event) => {
                               let newValue = parseFloat(event.target.value);
                               if (isNaN(newValue)) {
                                   newValue = null;
                               }
                               this.props.updatePrices([{...price, overwriteLowPrice: newValue}]);
                           }}
                           style={{backgroundColor: price.overwriteLowPrice != null && isNaN(parseFloat(price.overwriteLowPrice)) ? 'red' : 'white'}}
                    />
                </td>
                <td>
                    <input type="number" defaultValue={price.overwriteHighPrice}
                           onChange={(event) => {
                               let newValue = parseFloat(event.target.value);
                               if (isNaN(newValue)) {
                                   newValue = null;
                               }
                               this.props.updatePrices([{...price, overwriteHighPrice: newValue}]);
                           }}
                           style={{backgroundColor: price.overwriteHighPrice != null && isNaN(parseFloat(price.overwriteHighPrice)) ? 'red' : 'white'}}
                    />
                </td>
                <td>
                    <input type="number" defaultValue={price.overwriteLimit}
                           onChange={(event) => {
                               let newValue = parseFloat(event.target.value);
                               if (isNaN(newValue)) {
                                   newValue = null;
                               }
                               this.props.updatePrices([{...price, overwriteLimit: newValue}]);
                           }}
                           style={{backgroundColor: price.overwriteLimit != null && isNaN(parseFloat(price.overwriteLimit)) ? 'red' : 'white'}}
                    />
                </td>
                <td>
                    <input type="number" defaultValue={price.overwriteMargin}
                           onChange={(event) => {
                               let newValue = parseFloat(event.target.value);
                               if (isNaN(newValue)) {
                                   newValue = null;
                               }
                               this.props.updatePrices([{...price, overwriteMargin: newValue}]);
                           }}
                           style={{backgroundColor: price.overwriteMargin != null && isNaN(parseFloat(price.overwriteMargin)) ? 'red' : 'white'}}
                    />
                </td>
                <td>
                    <input type="number" defaultValue={price.overwriteStep}
                           onChange={(event) => {
                               let newValue = parseFloat(event.target.value);
                               if (isNaN(newValue)) {
                                   newValue = null;
                               }
                               this.props.updatePrices([{...price, overwriteStep: newValue}]);
                           }}
                           style={{backgroundColor: price.overwriteStep != null && isNaN(parseFloat(price.overwriteStep)) ? 'red' : 'white'}}
                    />
                </td>
                <td>
                    <input type="number" defaultValue={price.overwriteX}
                           onChange={(event) => {
                               let newValue = parseFloat(event.target.value);
                               if (isNaN(newValue)) {
                                   newValue = null;
                               }
                               this.props.updatePrices([{...price, overwriteX: newValue}]);
                           }}
                           style={{backgroundColor: price.overwriteX != null && isNaN(parseFloat(price.overwriteX)) ? 'red' : 'white'}}
                    />
                </td>

                <td>{price.highPriceConfiguration}</td>
                <td>
                    <select defaultValue={price.disabled} onChange={(event) => {
                        let newValue = event.target.value === 'true';
                        this.props.updatePrices([{...price, disabled: newValue}]);
                    }}>
                        <option value="false">NO</option>
                        <option value="true">YES</option>
                    </select>
                </td>
                <td>{examplePrice}</td>
            </tr>
        );
    }
}

export default PricesPageLine;