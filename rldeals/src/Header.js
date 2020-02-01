import React, {Component} from 'react';
import Logo from './images/logo.png';

import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';

import MenuItem from './MenuItem';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    AppBar: {
        colorPrimary: '#131a27'
    },
    hamburgerIcon: {
        marginTop: 8,
        float: 'right',
        color: 'white'
    }
};

class Header extends Component {

    state = {
        drawer: false
    };

    componentDidMount() {
        window.addEventListener("resize", () => {
            this.forceUpdate();
        });
    }

    toggleDrawer = (open) => () => {
        this.setState({
            drawer: open,
        });
    };

    render() {
        const {classes, user} = this.props;

        const isDrawer = window.innerWidth < window.innerHeight * 1.5;

        const menuList = (
            <React.Fragment>
                {user && user.role === 'Admin' ? (
                    <React.Fragment>
                        <MenuItem text="Prices" path="/prices" isDrawer={isDrawer}/>
                        <MenuItem text="Bot" path="/bot" isDrawer={isDrawer}/>
                        <MenuItem text="Trades" path="/trades" isDrawer={isDrawer}/>
                        <MenuItem text="Inventory" path="/inventory" isDrawer={isDrawer}/>
                        <MenuItem text="Affiliate" path="/affiliate" isDrawer={isDrawer}/>
                    </React.Fragment>
                ) : null}
                <MenuItem text="About us" path="/aboutus" isDrawer={isDrawer}/>
                <MenuItem text="Support" path="https://discord.gg/4bNYPTE" isDrawer={isDrawer} external={true}/>
                <MenuItem text="How to trade" path="/howtotrade" isDrawer={isDrawer}/>
                <MenuItem text="FAQ" path="/faq" isDrawer={isDrawer}/>
                <MenuItem text="Trading" path="/" isDrawer={isDrawer}/>
            </React.Fragment>
        );

        return (
            <div style={{width: '100%', height: 65, backgroundColor: '#131a27'}}>
                <div style={{paddingLeft: 16}}>
                    <div style={{float: 'left', padding: 10, display: 'flex'}}>
                        <img alt="logo" src={Logo} style={{height: 45}}/>
                        <p style={{
                            color: 'white',
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            paddingLeft: 25,
                            fontSize: 20
                        }}>
                            RL.Deals
                        </p>
                    </div>

                    <div style={{float: 'right'}} className={classes.grow}/>

                    <div style={{width: 16, height: 50, float: 'right'}}/>

                    {isDrawer ? (
                        <IconButton className={classes.hamburgerIcon} color="inherit" aria-label="Menu"
                                    onClick={this.toggleDrawer(true)}>
                            <MenuIcon/>
                        </IconButton>
                    ) : menuList
                    }

                    <Drawer anchor="left" open={this.state.drawer} onClose={this.toggleDrawer(false)}>
                        <div
                            tabIndex={0}
                            role="button"
                            onClick={this.toggleDrawer(false)}
                            onKeyDown={this.toggleDrawer(false)}
                        >
                            {menuList}
                        </div>
                    </Drawer>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Header);
