import React, {Component} from 'react';
import Api from "./Api";

class AffiliatePage extends Component {

    state = {
        codes: []
    };

    componentDidMount() {
        Api.GetCouponCodes((codes) => {
            this.setState({codes});
        }, () => {
            this.openNotification('error', 'Failed to retrieve coupon codes');
        });
    }

    render() {
        const {codes} = this.state;

        return (
            <div style={{backgroundColor: 'white', padding: 20}}>
                <table>
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Owner</th>
                        <th>Steam</th>
                        <th>Used</th>
                        <th>Balance added per time</th>
                        <th>Percentage to owner</th>
                    </tr>
                    </thead>
                    <tbody>
                    {codes.map(code => {
                        let profileUrl = 'https://steamcommunity.com/profiles/' + code.ownerUser.userId;

                        return (
                            <tr>
                                <td>{code.code}</td>
                                <td>{code.ownerUser.name}</td>
                                <td><a href={profileUrl}>{profileUrl}</a></td>
                                <td>{code.uses}x</td>
                                <td>{code.balanceDelta}</td>
                                <td>{code.percentageForOwner}%</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default AffiliatePage;