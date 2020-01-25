import React, { useState, useEffect } from "react";
import ClearSky from '../weathericons/01d.png';
import Thunderstorm from '../weathericons/11d.png';
import ShowerRain from '../weathericons/09d.png';
import Rain from '../weathericons/10d.png';
import Snow from '../weathericons/13d.png';
import Mist from '../weathericons/50d.png';
import FewClouds from '../weathericons/02d.png';
import ScatteredClouds from '../weathericons/03d.png';
import BrokenClouds from '../weathericons/04d.png';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    icon: {
        height: '70px',
        width: '70px',
        backgroundColor: 'rgb(200,200,200)',
        borderRadius: '50px',
    },
}));


//returns an image based in the id input
export default function WeatherIcon(props) {
    const [icon, setIcon] = useState('');
    const classes = useStyles();
    const weatherIconValues = [
      [200, 201, 202, 210, 211, 212, 221, 230, 231, 232], // 11d thunderstorm
      [300, 301, 302, 310, 311, 312, 313, 314, 321, 520, 521, 522, 531], // 09d shower rain
      [500, 501, 502, 503, 504], // 10d rain
      [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622], // 13d snow
      [701, 711, 721, 731, 741, 751, 761, 762, 771, 781], // 50d mist
      [800], // 01d / 01n clear sky
      [801], // 02d / 02n few clouds
      [802], // 03d / 03n scattered clouds
      [803, 804], // 04d / 04n broken clouds
    ];
  
    const weatherIconTypes = [
      Thunderstorm,
      ShowerRain,
      Rain,
      Snow,
      Mist,
      ClearSky,
      FewClouds,
      ScatteredClouds,
      BrokenClouds,
    ];
  
    const getIcon = id => {
      let arrayIndex;
      for (let i = 0; i < weatherIconValues.length; i ++) {
        if (weatherIconValues[i].indexOf(id) !== -1) {
          arrayIndex = i;
          break;
        }
      }
      setIcon(weatherIconTypes[arrayIndex]);
    };
  
    useEffect(() => {
      const { weatherID } = props;
      if (weatherID) {
        getIcon(weatherID);
      }
    });
  
    return <img src={icon} alt="" className={classes.icon} />
}
  