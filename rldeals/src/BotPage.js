import React, {Component} from 'react';
import Api from "./Api";

class BotPage extends Component {

    state = {
        botRunning: null
    };

    componentDidMount() {
        this.getBotStatus();
        let interval = setInterval(() => {
            this.getBotStatus();
        }, 5 * 1000);
        this.setState({interval});
    }

    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }

    getBotStatus = () => {
        Api.GetBotStatus((data) => {
            this.setState({botRunning: data.running});
        }, () => {
            this.setState({botRunning: null});
        });
    };

    startBot = () => {
        Api.StartBot((data) => {
            this.setState({running: data.running});
        }, () => {
            this.props.openNotification('error', 'Failed to start bot');
        });
    };

    stopBot = () => {
        Api.StopBot((data) => {
            this.setState({running: data.running});
        }, () => {
            this.props.openNotification('error', 'Failed to stop bot');
        });
    };

    render() {
        const {botRunning} = this.state;

        return (
            <div style={{backgroundColor: 'white', padding: 20}}>
                <p style={{color: 'black'}}>Status: {botRunning === true ? 'online' : botRunning === false ? 'offline' : '?'}</p>
                <button onClick={this.startBot}>Start bot</button>
                <button onClick={this.stopBot}>Stop bot</button>
            </div>
        );
    }
}

export default BotPage;