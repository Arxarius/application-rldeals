import React, {Component} from 'react';
import {Col, Form} from 'react-bootstrap';
import Api from "./Api";
import Button from "react-bootstrap/Button";
import Utils from "./Utils";
import Banner from './images/banner.png';

const styles = {
    content: {
        padding: 16,
        textAlign: 'center',
        align: 'center',
    }
};

class MiddleSide extends Component {

    state = {
        coupon: ''
    };

    useCouponCode(code){
        Api.UseCouponCode(code, () => {
            this.props.openNotification('success', 'Used code successfully');

            setTimeout(() => {
                window.location.reload();
            }, 5000);
        }, () => {
            this.props.openNotification('error', `Failed to use coupon code: ${code}`);
        })
    }

    logoutUser = () => {
        if(this.props.user){
            Api.LogoutUser(() => {
                localStorage.clear();
                window.location.reload();
            }, () => {
                this.props.openNotification('error', `Failed to logout user`);
                window.location.reload();
            });
        } else {
            localStorage.clear();
            window.location.reload();
        }
    };

    render() {
        let {user, joinActiveTrade, balance, botRunning} = this.props;

        let currentBalance = user ? Utils.roundNumber(user.balance, 4) : 0;
        let balanceAfterTrade = Utils.roundNumber(currentBalance + balance, 4);

        return (
            <div style={{backgroundColor: '#1b2536', height: '100%', margin: window.innerWidth < 960 ? 16 : 0}}>
                <div style={styles.content}>

                    {botRunning === false ? (
                        <h4 style={{color: 'orange'}}>Bot status: maintenance mode</h4>
                    ) : null}

                    <h4>Balance after trade: <span style={{fontWeight: 200, color: balanceAfterTrade >= 0 ? 'white' : 'red'}}>{balanceAfterTrade}</span></h4>
                    {currentBalance ? (
                        <h6>Current balance: <span style={{fontWeight: 200}}>{currentBalance}</span></h6>
                    ) : null}

                    <br/>
                    { user ? (
                        <React.Fragment>
                            <h6>Logged in as: {user.name}</h6>
                            <Button size="sm" variant="light" onClick={this.logoutUser}>Logout</Button>
                            <br/>
                            <br/>
                        </React.Fragment>
                    ) : (
                        // Move this to a not so prominent place
                        <React.Fragment>
                        <Button size="sm" variant="light" onClick={this.logoutUser}>Reset</Button>
                        <br/>
                        <br/>
                        </React.Fragment>
                    )
                    }

                    {user && user.name.toUpperCase().indexOf('RL.DEALS') >= 0 ? (
                        <p style={{fontSize: 12}}>2% RL.DEALS Name Discount <span style={{color: '#28a745', fontSize: 12}}>Active</span></p>
                    ) : (
                        <p style={{fontSize: 12}}>Put RL.DEALS in your Steam Name for 2% Store Wide Discount</p>
                    )}

                    <Form onSubmit={(event) => {
                        this.useCouponCode(this.state.coupon);
                        event.preventDefault();
                    }}>
                        <Form.Control placeholder="Coupon code" onChange={(event) => this.setState({coupon: event.target.value})}/>
                    </Form>
                    <br/>
                    <Button variant="success" onClick={joinActiveTrade}>Join trade</Button>
                    {/*<br/>*/}
                    {/*<br/>*/}
                    {/*<Button variant="light" onClick={clearProducts}>Clear items</Button>*/}

                    <br/>
                    <br/>

                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label style={{fontSize: 15, color: 'white'}}>Size</Form.Label>
                                <Button variant="light" size="sm" style={{marginLeft: 10}}
                                        onClick={() => this.props.updateProductImageSize(10)}>
                                    +
                                </Button>
                                <Button variant="light" size="sm" style={{marginLeft: 10}}
                                        onClick={() => this.props.updateProductImageSize(-10)}>
                                    -
                                </Button>
                            </Form.Group>
                        </Form.Row>
                    </Form>

                    <br/>
                    <br/>

                    <a href="https://discord.gg/r4kwpGH" rel="noopener noreferrer" target="_blank">
                        <img src={Banner} alt="" style={{width: '100%'}}/>
                    </a>

                </div>
            </div>
        );
    }

}

export default MiddleSide;