import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';
import discordLogo from './images/discord.svg';
import steamLogo from './images/steam.svg';
import twitterLogo from './images/twitter.svg';

const styles = {
    content: {
        color: 'white',
        height: 25,
        fontSize: 12
    },
    icon: {
        width: 40,
        height: 40,
        paddingLeft: 15
    }
};

class Footer extends Component {

    state = {};

    render() {
        const { classes } = this.props;

        return (
            <div style={{textAlign: 'center'}}>
                <p style={{filter: 'invert(100%)'}}>
                    <a href='https://discord.gg/4bNYPTE' rel='noopener noreferrer' target='_blank'>
                        <img alt='Discord logo' src={discordLogo} className={classes.icon}/>
                    </a>
                    <a href='http://steamcommunity.com/groups/RocketLeagueDeals' rel='noopener noreferrer'
                       target='_blank'>
                        <img alt='Steam logo' src={steamLogo} className={classes.icon}/>
                    </a>
                    <a href='https://twitter.com/RLDeals' rel='noopener noreferrer' target='_blank'>
                        <img alt='Twitter logo' src={twitterLogo} className={classes.icon}/>
                    </a>
                </p>
                <p className={classes.content}>© {new Date().getFullYear()} RL.Deals. Not affiliated with Psyonix. All rights reserved to their respective owners.</p>
            </div>
        );
    }
}

export default withStyles(styles)(Footer);