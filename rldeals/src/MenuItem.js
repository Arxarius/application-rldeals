import React, {Component} from "react";
import {withStyles} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

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
    },
    menuButton: {
        float: 'right',
        color: 'white',
        marginTop: 'auto',
        // marginBottom: 'auto',
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 15,
        textTransform: 'uppercase',
        textDecoration: 'none',
        '&:hover': {
            backgroundColor: '#26344b'
        },
        height: 65,
        display: 'flex',
        '& > p': {
            marginTop: 'auto', marginBottom: 'auto'
        },
        borderBottom: '3px solid transparent'
    },
    menuButtonActive: {
        borderBottom: '3px solid #3375ef'
    }
};


class MenuItem extends Component{

    onClickWithoutPopup(url) {
        window.location.pathname = url;
    }

    onClickWithPopup(url) {
        window.open(url);
    }

    render(){
        const {classes, path, text, external, isDrawer} = this.props;

        const onClick = external ? () => this.onClickWithPopup(path) : () => this.onClickWithoutPopup(path);

        if(isDrawer){
            return (
                <ListItem button key={path}>
                    <ListItemText primary={text} onClick={onClick}/>
                </ListItem>
            );
        } else {
            return (
                <div className={classes.menuButton + ' grab ' + (window.location.pathname === path ? classes.menuButtonActive : '')}
                     onClick={onClick}>
                    <p>{text}</p>
                </div>
            );
        }
    }
}

export default withStyles(styles)(MenuItem);