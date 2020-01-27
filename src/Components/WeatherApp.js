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
      errorMessage: '',
      searchInput: '',
      loading: false,
      parsedResult: {
        city: '',
        country: '',
        time:'',
        temp: {
          main: '',
          feel: ''
        },
        weather: {
          main: '',
          id: '',
          humidity: '',
          downfall: ''
        },
        wind: {
          speed: '',
          degree: ''
        },
        sun: {
          rise: '',
          set: ''
        },
      },
      unit: 'metric'
    };
    
    this.handleSearchBoxInput = this.handleSearchBoxInput.bind(this);
    this.handleSearchBoxSubmit = this.handleSearchBoxSubmit.bind(this);
    this.disableErrorBox = this.disableErrorBox.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
  }

  getTimeFormatedToHours = (timeIn, offset) => {
    return moment.unix(timeIn).utcOffset(offset/60).format('HH:mm');
  };

  getTimeFormatedToDate = (timeIn, offset) => {
    return moment.unix(timeIn).utcOffset(offset/60).format('YYYY-MM-DD HH:mm');
  };

  async fetchWeatherData(input, unit) {
      const res = await fetch (
          `https://api.openweathermap.org/data/2.5/weather?q=${input}&mode=JSON&APPID=3090f6281aeed0bbf2ecc5d48ccd80db&units=${unit}`, 
          {mode: 'cors'}
      );
      return new Promise((resolve, reject) => {
        if (res.status === 200) {
          resolve(res.json());
        } else {
          reject('City not found');
        }
      }) 
  };

  async handleSearchBoxSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
      dataLoaded: false
    });
    try {
      const weatherData = await this.fetchWeatherData(this.state.searchInput, this.state.unit);

      this.setState({
        parsedResult: {
          city: weatherData.name,
          country: weatherData.sys.country,
          time: this.getTimeFormatedToDate(weatherData.dt, weatherData.timezone),
          temp: {
            main: Math.round(weatherData.main.temp),
            feel: Math.round(weatherData.main.feels_like)
          }, 
          weather: {
            main: weatherData.weather[0].main,
            humidity: weatherData.main.humidity,
            id: weatherData.weather[0].id,
            downfall: (weatherData.rain ? weatherData.rain['3h'] : 0) || (weatherData.snow ? weatherData.snow['3h'] : 0),
          },
          wind: {
            speed: weatherData.wind.speed,
            degree: weatherData.wind.deg,
          },
          sun: {
            rise: this.getTimeFormatedToHours(weatherData.sys.sunrise, weatherData.timezone),
            set: this.getTimeFormatedToHours(weatherData.sys.sunset, weatherData.timezone)
          }
        },
        loading: false,
        dataLoaded: true
      });
    }
    catch(err) {
      console.log(err)
      this.setState({
        loading: false,
        errorMessage: err,
        requestError: true
      });
    }
    
  }

  handleSearchBoxInput(input) {
    this.setState({searchInput: input});
  }

  disableErrorBox() {
    this.setState({requestError: false});
  }

  handleUnitChange() {
    (this.state.unit === 'metric') ? this.setState({unit: 'imperial'}) : this.setState({unit: 'metric'});
    let tempState = this.state.parsedResult; 
    if (this.state.unit === 'metric') {
      tempState.temp.main = this.convertFromMetric(this.state.parsedResult.temp.main);
      tempState.temp.feel = this.convertFromMetric(this.state.parsedResult.temp.feel);
    } else {
      tempState.temp.main = this.convertFromImperial(this.state.parsedResult.temp.main);
      tempState.temp.feel = this.convertFromImperial(this.state.parsedResult.temp.feel);
    }
    this.setState({
      parsedResult: tempState
    });
  }

  convertFromMetric (input) {
    return Math.round((input*(9/5))+32);
  }
  convertFromImperial (input) {
    return Math.round((input-32)/(9/5));
  }

  render() {
    return (
      <Container maxWidth="sm">
        <SearchBar 
        handleSubmit = {this.handleSearchBoxSubmit}
        handleInput = {this.handleSearchBoxInput}
        />
        {this.state.dataLoaded ? 
          <DisplayWeather 
            weatherData = {this.state.parsedResult}
            unit = {this.state.unit === 'metric' ? '℃' : '℉'}
          />
          : null}
        <ErrorNotification
        errorStatus = {this.state.requestError} 
        disableError = {this.disableErrorBox}
        errorMessage = {this.state.errorMessage}
        />
        <LoadingNotification 
          loadingStatus = {this.state.loading}
        /> 
        <ChangeUnitButton
        unit = {this.state.unit === 'metric' ? '℃' : '℉'}
        handleClick = {this.handleUnitChange} 
        />
      </Container>
    );
  }
}