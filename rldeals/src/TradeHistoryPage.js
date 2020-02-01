import React, {Component} from 'react';
import Api from "./Api";
// eslint-disable-next-line
import Product from "./Product";
import Utils from "./Utils";


class TradeHistoryPage extends Component {

    state = {
        tradeHistory: [],
        page: parseInt(new URLSearchParams(window.location.search).get('page') || 0),
        completed: (new URLSearchParams(window.location.search).get('completed') || 'true') === 'true',
        userId: new URLSearchParams(window.location.search).get('userId') || ''
    };

    componentDidMount() {
        const {page, completed, userId} = this.state;

        Api.GetTradeHistory(page, completed, userId,(tradeHistory) => {
            this.setState({tradeHistory});
        }, () => {
            this.openNotification('error', 'Failed to retrieve coupon codes');
        });
    }

    aggregateProducts(products){
        let aggregatedProducts = [];

        for(let product of products){
            let equalProductIndex = aggregatedProducts.findIndex(_ => _.queryText === product.queryText);
            if(equalProductIndex >= 0){
                aggregatedProducts[equalProductIndex].count++;
            } else {
                aggregatedProducts.push({...product, count: 1});
            }
        }

        return aggregatedProducts;
    }

    render() {
        const {tradeHistory, page, completed, userId} = this.state;

        return (
            <div style={{backgroundColor: 'white', padding: 20}} className={'black tradeHistory'}>
                <p>Page {page}</p>
                {userId ? (
                    <span>
                        <p>Viewing trades for user #{userId}</p>
                        <a href={`/trades?page=${page}&completed=${completed}&userId=`}>View trades for all users</a>
                        <br/>
                    </span>
                ) : (
                    <p>Viewing trades for all users</p>
                )}
                {page > 0 ? (
                    <span>
                        <a href={`/trades?page=0&completed=${completed}&userId=${userId}`}>First page</a>
                        <br/>
                        <a href={`/trades?page=${page - 1}&completed=${completed}&userId=${userId}`}>Previous page</a>
                        <br/>
                    </span>
                ) : null}
                <a href={`/trades?page=${page + 1}&completed=${completed}&userId=${userId}`}>Next page</a>
                <br/>
                {completed ? (
                    <a href={`/trades?page=${page}&completed=false&userId=${userId}`}>Show uncompleted</a>
                ) : (
                    <a href={`/trades?page=${page}&completed=true&userId=${userId}`}>Show completed</a>
                )}
                <br/>
                <br/>
                <table border={1}>
                    <thead>
                    <tr>
                        <th>Trade #</th>
                        <th>Status</th>
                        <th>Steam</th>
                        <th>User</th>
                        <th>User value</th>
                        <th>Bot value</th>
                        <th>User products</th>
                        <th>Bot products</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tradeHistory.map((trade, index) => {
                        let createdAt = Utils.serializeDate(new Date(trade.createdAt));
                        let joinedAt = Utils.serializeDate(new Date(trade.joinedAt));
                        let completedAt = Utils.serializeDate(new Date(trade.completedAt));

                        let userProducts = trade.userProducts;
                        let botProducts = trade.botProducts;

                        return (
                            <tr key={index}>
                                <td>{trade.id}</td>
                                <td>
                                    Created at: {createdAt}<br/>
                                    {trade.joinedAt ? <span>Joined at: {joinedAt}<br/></span> : null}
                                    {trade.completedAt ? <span>Completed at: {completedAt}</span> : null}
                                </td>
                                <td>
                                    {trade.user ? (
                                        <a href={'https://steamcommunity.com/profiles/' + trade.user.userId}>Profile</a>) : '-'}
                                </td>
                                <td>{trade.user ? (<a href={`/trades?page=${page}&completed=${completed}&userId=${trade.userId}`}>{trade.user.name}</a>) : ''}</td>
                                {trade.userProductsValue === 0 && trade.botProductsValue === 0 ? (
                                    <React.Fragment>
                                        <td/>
                                        <td/>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <td>{trade.userProductsValue}</td>
                                        <td>{trade.botProductsValue}</td>
                                    </React.Fragment>
                                )}
                                <td>{userProducts.map((_, index) => <span key={index}>{_.queryText} {_.count > 1 ? '(' + _.count + 'x)' : ''}<br/></span>)}</td>
                                <td>{botProducts.map((_, index) => <span key={index}>{_.queryText} {_.count > 1 ? '(' + _.count + 'x)' : ''}<br/></span>)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TradeHistoryPage;