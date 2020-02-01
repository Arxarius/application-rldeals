import React, {Component} from 'react';

class FaqPage extends Component {
    render() {
        return (
            <div style={{backgroundColor: 'white', padding: 20}}>
                <h2 style={{color: 'black'}}>
                    F.A.Q. (Frequently Asked Questions)
                </h2>

                <h5 style={{color: 'black'}}>
                    How does trading with rl.deals work?
                </h5>
                <p style={{color: 'black', fontWeight: 300}}>
                    For trading instructions, please visit: &nbsp;
                    <a href="/howtotrade">
                        https://rl.deals/howtotrade
                    </a>
                </p>

                <h5 style={{color: 'black'}}>
                    Why are my items missing or changing in price?
                </h5>
                <p style={{color: 'black', fontWeight: 300}}>
                    Due to over-stocking and/or market conditions, rl.deals holds sole discretion to disable or
                    update prices on individual items.
                </p>

                <h5 style={{color: 'black'}}>
                    What about certification?
                </h5>
                <p style={{color: 'black', fontWeight: 300}}>
                    All items, regardless of certification, are currently treated equally. We will be working to
                    implement a certification system in the near future.
                </p>

                <h5 style={{color: 'black'}}>
                    Why is there a delay when accepting a trade?
                </h5>
                <p style={{color: 'black', fontWeight: 300}}>
                    Our proprietary bot technology uses verification methods that may take between 5 and 10 seconds
                    ensure that you receive the correct items and prevent fraud.
                </p>

                <h5 style={{color: 'black'}}>
                    What if I make a trade and have extra balance? Do I keep it?
                </h5>
                <p style={{color: 'black', fontWeight: 300}}>
                    Yes! Whenever you make a trade, any and all leftover balance will stay with your account for the
                    next time you decide to use our services.
                </p>

                <h5 style={{color: 'black'}}>
                    How do I trade for more than 24 items or 200 keys?
                </h5>
                <p style={{color: 'black', fontWeight: 300}}>
                    Simply deposit your items onto rl.deals first, which will add the balance to your on site
                    wallet. Once you have enough balance, you’re good to go!
                </p>

                <h5 style={{color: 'black'}}>
                    What is “Name Promotion”?
                </h5>
                <p style={{color: 'black', fontWeight: 300}}>
                    By putting “RL.DEALS” in your steam username, you will have access to a store wide 2% discount.
                    If you do not see the discount after changing your username, make sure to sign out and log in
                    again.
                </p>

                <h5 style={{color: 'black'}}>
                    Are trades completed in-game final?
                </h5>
                <p style={{color: 'black', fontWeight: 300}}>
                    Yes, unfortunately we do not offer refunds on any trades at this time.
                </p>
            </div>
        );
    }
}

export default FaqPage;