import React from "react";
import Container from "@material-ui/core/Container";
import SearchBar from "./SearchBar";
import DisplayWeather from "./DisplayWeather";
import moment from 'moment';
import ErrorNotification from './ErrorNotification';
import ChangeUnitButton from "./ChangeUnitButton";
import LoadingNotification from './LoadingNotification';

export default class WeatherApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      requestError: false,
      searchInput: '',
      loading: false,
      parsedResult: {
        city: '',
        country: '',
        sun: {
          rise: '',
          set: ''
        },
        days: [],
      },
      unit: '℃'
    };
    
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.disableError = this.disableError.bind(this);
    this.handleChangeUnit = this.handleChangeUnit.bind(this);
  }

  //Takes an offset(Seconds) and an Unix time stamp and returns HH:mm
  getTimeFormated = (timeIn, offset) => {
    return moment.unix(timeIn).utcOffset(offset/60).format('HH:mm');
  };

  
  initialTempConvert(temp){
    if(this.state.unit === '℃') {
      return Math.round(temp - 273.15);
    }
    if(this.state.unit === '℉') {
      return Math.round(((temp - 273.15) * 9) / 5 + 32);
    }
  }

  //Fetch API data based on user input and return if successfull
  async fetchWeatherData(input) {
    const res = await fetch (
      `https://api.openweathermap.org/data/2.5/forecast?q=${input}&mode=JSON&APPID=3090f6281aeed0bbf2ecc5d48ccd80db`, 
      {mode: 'cors'}
    );
    if (res.status === 200) {
      return res.json();
    }
  };

  //Updates states after user submits input
  async handleSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
      dataLoaded: false
    });
    try {
      
      const weatherData =  await this.fetchWeatherData(this.state.searchInput);
      const list = weatherData.list;

      //Parses list data sorts it by day
      //Outputs an array of arrays where days[0] holds the data for currentday days[1] holds the data for tomorrow etc.
      //EXAMPLE: days[0][0] contains the data for the first entry of the current day
      //EXAMPLE: days[1][2] contains the third entry for tomorrows forecast
      //Each entry is an object which contains the following attributes:
      //  date: YYYY-MM-DD, time: HH:MM, temp(K), tempLow(K), tempHigh(K), tempFeel(K), humidity(%), 
      //  weatherMain, weatherDesc, weatherId, weatherDownfall(mm),
      //  windSpeed(m/s), windDeg. 
      //EXAMPLE: days[0][0].temp contains the temprature for the first entry
      //EXAMPLE: days[1][2].weatherDownfall contains the downfall amount of the third entry for tomorrows forecast.
      let lastDay = 0;
      let days = [];
      for(let i = 0; i < list.length; i++) {
        let day = list[i].dt_txt.slice(8, 10)

        if(lastDay !== day) {
          days.push([]);
        }
        days[days.length-1].push({
          date: list[i].dt_txt.slice(0,10),
          time: list[i].dt_txt.slice(11, 16),
          temp: this.initialTempConvert(list[i].main.temp),
          tempLow: this.initialTempConvert(list[i].main.temp_min),
          tempHigh: this.initialTempConvert(list[i].main.temp_max),
          tempFeel: this.initialTempConvert(list[i].main.feels_like),
          humidity: list[i].main.humidity,
          weatherMain: list[i].weather[0].main,
          weatherDesc: list[i].weather[0].description,
          weatherId: list[i].weather[0].id,
          weatherDownfall: (list[i].rain ? list[i].rain['3h'] : 0) || (list[i].snow ? list[i].snow['3h'] : 0),
          windSpeed: list[i].wind.speed,
          windDegree: list[i].wind.deg
        });
        lastDay = day;
      }

      this.setState({
        parsedResult: {
          city: weatherData.city.name,
          country: weatherData.city.country,
          days: days,
          sun: {
            rise: this.getTimeFormated(weatherData.city.sunrise, weatherData.city.timezone),
            set: this.getTimeFormated(weatherData.city.sunset, weatherData.city.timezone)
          }
        },
        loading: false,
        dataLoaded: true,
      });
    }
    catch(err) {
      this.setState({
        loading: false,
        requestError: true
      });
    }
    
  }

  //Update state of searchInput when user updates input field 
  handleInput(input) {
    this.setState({searchInput: input});
  }

  //Disable error box
  disableError() {
    this.setState({requestError: false});
  }

  //Changes unit and updates temp data.
  handleChangeUnit() {
    (this.state.unit === '℃') ? this.setState({unit: '℉'}) : this.setState({unit: '℃'});
    let tempDays = this.state.parsedResult.days;
    if (this.state.unit === '℃') {
      for(let i = 0; i < this.state.parsedResult.days.length; i++) {
        for(let j = 0; j < this.state.parsedResult.days[i].length; j++) {
          tempDays[i][j].temp = this.convertFromC(tempDays[i][j].temp);
          tempDays[i][j].tempLow = this.convertFromC(tempDays[i][j].tempLow);
          tempDays[i][j].tempHigh = this.convertFromC(tempDays[i][j].tempHigh);
          tempDays[i][j].tempFeel = this.convertFromC(tempDays[i][j].tempFeel);
        }
      }
    } else {
      for(let i = 0; i < this.state.parsedResult.days.length; i++) {
        for(let j = 0; j < this.state.parsedResult.days[i].length; j++) {
          tempDays[i][j].temp = this.convertFromF(tempDays[i][j].temp);
          tempDays[i][j].tempLow = this.convertFromF(tempDays[i][j].tempLow);
          tempDays[i][j].tempHigh = this.convertFromF(tempDays[i][j].tempHigh);
          tempDays[i][j].tempFeel = this.convertFromF(tempDays[i][j].tempFeel);
        }
      }
    }
    this.setState({
      parsedResult: {
        days: tempDays
      }
    });
  }

  convertFromC (input) {
    return Math.round((input*(9/5))+32);
  }
  convertFromF (input) {
    return Math.round((input-32)/(9/5));
  }

  render() {
    return (
      <Container maxWidth="sm">
        <SearchBar 
        handleSubmit = {this.handleSubmit}
        handleInput = {this.handleInput}
        />
        {this.state.dataLoaded ? 
          <DisplayWeather 
            weatherData = {this.state.parsedResult}
            unit = {this.state.unit}
          />
          : null}
        <ErrorNotification
        errorStatus = {this.state.requestError} 
        disableError = {this.disableError}
        />
        <LoadingNotification 
          loadingStatus = {this.state.loading}
        /> 
        <ChangeUnitButton
        unit = {this.state.unit}
        handleClick = {this.handleChangeUnit} 
        />
      </Container>
    );
  }
}