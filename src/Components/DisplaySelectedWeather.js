import React from "react";
import Paper from "@material-ui/core/Paper";
import WeatherIcon from "./WeatherIcon";
import WindDeg from "../weathericons/wind-deg.svg";
import Sunrise from "../weathericons/sunrise.svg";
import Raindrop from "../weathericons/raindrop.svg";
import DisplayIcon from "./DisplayIcon";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        marginTop: '20px',
        borderRadius: '15px 15px 0 0'
    },
    container: {
        padding: '20px',
    },
    align_center: {
        textAlign: 'center'
    },
    bottom: {
        marginTop: '30px'
    },
    bottom_middle: {
        borderRight: '1px solid gray',
        borderLeft: '1px solid gray'
    },
    align_right: {
        textAlign: 'right'
    },
    align_v_center: {
        display: 'flex',
        alignItems: 'center'
    },
  }));


export default function DisplaySelectedWeather(props) {
    const classes = useStyles();
    
  return (
    <Paper className={classes.root}>
        <Grid container className={classes.container}>
            <Grid item xs={9} className={classes.align_v_center}>
                <Typography variant="h4"> {props.selectedCity}, {props.selectedCountry} </Typography>
            </Grid>
            <Grid item xs={3} className={classes.align_center}>
                <WeatherIcon weatherID={props.selectedData.weatherId} />     
            </Grid>
            <Grid item xs={6} >
                <Typography variant="h5"> {props.selectedData.date} </Typography>
                <Typography variant="h6"> {props.selectedData.weatherMain} </Typography>
                <Typography variant="body1"> Feels like: {props.selectedData.tempFeel}{props.selectedUnit}</Typography>
            </Grid>
            <Grid item xs={3} className={classes.align_center}>
            </Grid>
            <Grid item xs={3} className={classes.align_center}>
                <Typography variant="h6"> {props.selectedData.temp}{props.selectedUnit} </Typography>
                <Typography variant="body1"> Low: {props.selectedData.tempLow}{props.selectedUnit}</Typography>
                <Typography variant="body1"> High: {props.selectedData.tempHigh}{props.selectedUnit}</Typography>
            </Grid>
            <Grid item xs={4} className={`${classes.bottom} ${classes.align_center}`}>
                <DisplayIcon icon={WindDeg} rotation={-props.selectedData.windDegree}/>
                <Typography variant="body1">{props.selectedData.windSpeed} ms/s</Typography>
            </Grid>
            
            <Grid item xs={4} className={`${classes.bottom} ${classes.align_center} ${classes.bottom_middle}`}>
                <DisplayIcon icon={Raindrop} rotation={0}/>
                <Typography variant="body1">{props.selectedData.humidity}%</Typography>
                <Typography variant="body1">{props.selectedData.weatherDownfall}mm</Typography>
            </Grid>
            
            <Grid item xs={4} className={`${classes.bottom} ${classes.align_center}`}>
                <DisplayIcon icon={Sunrise} rotation={0}/>
                <Typography variant="body1">{props.selectedSun.rise}</Typography>
                <Typography variant="body1">{props.selectedSun.set}</Typography>
            </Grid>
        </Grid>
    </Paper>
  );
}
