import React, {Component} from 'react';
import './App.css';
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import {withStyles} from "@material-ui/core";
import Api from "./Api";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

const styles = {
    bodyFooterSpacer: {
        height: 16
    },
    error: {
        backgroundColor: 'red'
    }
};

class App extends Component {

    state = {
        user: null,
        open: false,
        snackbarType: null,
        snackbarMessage: null,
        placeholderUserSelectableProducts: null,
        catalogue: null
    };

    componentDidMount() {
        this.GetAllData();

        setInterval(() => {
            this.GetAllData();
        }, 1000 * 60);
    }

    GetAllData() {
        Api.GetUser((user) => {
            this.setState({
                user
            });
        }, () => {
            console.info('Failed to get user');
        });

        Api.GetDefinitions((definitions) => {
            this.setState({
                definitions
            })
        }, () => {
            this.openNotification('error', 'Failed to retrieve product catalogue');
        });
    }

    handleClose = () => {
        this.setState({open: false});
    };

    openNotification = (type, message) => {
        this.setState({open: true, snackbarType: type, snackbarMessage: message});
    };

    render() {
        const {classes} = this.props;
        const {
            snackbarType,
            snackbarMessage,
            user,
            definitions
        } = this.state;

        return (
            <div className="App" style={{margin: 0}}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                        classes: {
                            root: classes[snackbarType]
                        }
                    }}
                    message={<span id="message-id">{snackbarMessage}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />

                <Header
                    user={user}
                />
                <Body
                    user={user}
                    definitions={definitions}
                    openNotification={this.openNotification}
                    enrichProductWithSearchText={this.enrichProductWithSearchText}
                    calculateProducts={this.calculateProducts}
                />
                <div className={classes.bodyFooterSpacer}/>
                <Footer/>
            </div>
        );
    }

}

export default withStyles(styles)(App);