import React, {Component} from 'react';
import {isAdmin} from './helpers';
import TradingPage from './TradingPage';
import FaqPage from "./FaqPage";
import AboutUsPage from "./AboutUsPage";
import HowToTradePage from "./HowToTradePage";
import AffiliatePage from "./AffiliatePage";
import BotPage from "./BotPage";
import PricesPage from "./PricesPage";
import InventoryPage from "./InventoryPage";
import TradeHistoryPage from "./TradeHistoryPage";

class Body extends Component {

    render() {
        const {
            user,
            definitions,
            openNotification
        } = this.props;

        if (isAdmin(user)) {
            switch (window.location.pathname) {
                case '/faq':
                    return (
                        <FaqPage/>
                    );
                case '/howtotrade':
                    return (
                        <HowToTradePage/>
                    );
                case '/aboutus':
                    return (
                        <AboutUsPage/>
                    );
                case '/affiliate':
                    return (
                        <AffiliatePage/>
                    );
                case '/inventory':
                    return (
                        <InventoryPage/>
                    );
                case '/trades':
                    return (
                        <TradeHistoryPage/>
                    );
                case '/bot':
                    return (
                        <BotPage/>
                    );
                case '/prices':
                    return (
                        <PricesPage
                            user={user}
                            openNotification={openNotification}
                        />
                    );
                default:  return (
                    <TradingPage
                        definitions={definitions}
                        openNotification={openNotification}
                    />
                );
            }
        }
        else {
            switch (window.location.pathname) {
                case '/faq':
                    return (
                        <FaqPage/>
                    );
                case '/howtotrade':
                    return (
                        <HowToTradePage/>
                    );
                case '/aboutus':
                    return (
                        <AboutUsPage/>
                    );
                case '/affiliate':
                    return (
                        <AffiliatePage/>
                    );
                default:  return (
                    <TradingPage
                        definitions={definitions}
                        openNotification={openNotification}
                    />
                );
            }
        }


    }
}

export default Body;
