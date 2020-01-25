import React from "react";
import DisplaySelectedWeather from "./DisplaySelectedWeather";
import { Container } from "@material-ui/core";

export default class DisplayWeather extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            city: props.weatherData.city,
            country: props.weatherData.country,
            sun: props.weatherData.sun,
            data: props.weatherData.days,
            unit: props.unit,

        };
    }

    componentDidUpdate(prevProps) {
        if(this.props.data !== prevProps.data ) {
            this.setState({ 
                data: this.props.weatherData.days
            });  
        }
        else if(this.props.unit !== prevProps.unit) {
            this.setState({ 
                unit: this.props.unit
            }); 
        }
      }

    render() {
        return (
            <Container>
                <DisplaySelectedWeather
                    selectedCity = {this.state.city}
                    selectedCountry = {this.state.country}
                    selectedSun = {this.state.sun}  
                    selectedData = {this.state.data[this.state.day][this.state.timeOfDay]}
                    selectedUnit = {this.state.unit}
                />
            </Container>
        )
    }
}