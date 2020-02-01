import React, {Component} from 'react';
import Api from "./Api";

class InventoryPage extends Component {

    state = {
        inventorySummary: {
            inventoryValue: null,
            balanceValue: null
        }
    };

    componentDidMount() {
        Api.GetInventorySummary((inventorySummary) => {
            this.setState({inventorySummary});
        }, () => {
            this.openNotification('error', 'Failed to retrieve coupon codes');
        });
    }

    render() {
        const {inventorySummary} = this.state;

        const inventoryValueAfterBalance = Math.round(1000 * (inventorySummary.inventoryValue - inventorySummary.balanceValue)) / 1000;

        return (
            <div style={{backgroundColor: 'white', padding: 20}} className={'black'}>
                <p><strong>Sum inventory:</strong> {inventorySummary.inventoryValue}</p>
                <p><strong>Sum balances:</strong> {inventorySummary.balanceValue}</p>
                <p><strong>Sum inventory after balance:</strong> {inventoryValueAfterBalance}</p>
            </div>
        );
    }
}

export default InventoryPage;