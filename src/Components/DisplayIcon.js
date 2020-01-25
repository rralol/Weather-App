import React from 'react';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
      padding: 0,
      margin: 0,
      width: '100%',
      textAlign: 'center',
    },
    icon: {
      height: '45px',
      width: '45px',
    },
  }));

export default function DisplayIcon(props) {
    const {icon, rotation} = props;
    const classes = useStyles();
    return (
        <img src={icon} className={classes.icon} alt="" style={{transform: `rotate(${rotation}deg)`}}/>
    );
};