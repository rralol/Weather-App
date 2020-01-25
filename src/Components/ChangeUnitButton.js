import React from 'react';
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    button: {
        bottom: '60px',
        right: '5%',
        position: 'fixed'
    },
}));


export default function ChangeUnitButton(props) {

    const classes = useStyles();
    
    return (
        <Fab size="large" className={classes.button} onClick ={props.handleClick}>
            <p>{props.unit}</p>
        </Fab>
    );
}