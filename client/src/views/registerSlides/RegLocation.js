import React, { useState, useEffect } from 'react';
import csc from "country-state-city";
import useInputState from './hooks/useInput'

// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_green.css";


export default function RegLocation() {

    // updateState(e) {
    //     for (var i = 0; i < this.state.statesMap.length; i++) {
    //         if (this.state.statesMap[i].name === e.target.value) {
    //             this.setState({
    //                 userState: e.target.value,
    //                 stateId: this.state.statesMap[i].id,
    //                 stateUpdate: true
    //             })
    //             break;
    //         }
    //     }
    // }
    // updateCity(e) {
    //     this.setState({
    //         userCity: e.target.value,
    //         stateUpdate: true
    //     })

    // }

    // const states = csc.getStatesOfCountry('231').map((state) => (
    //     <option key={state.id} value={state.name}>{state.name}</option>
    // ));
    // var cities = <option value="Select">Select...</option>

    // if (this.state.stateId) {
    //     cities = csc.getCitiesOfState(this.state.stateId).map((city) => (
    //         <option key={city.id} value={city.name}>{city.name}</option>
    //     ));
    // }
    return (
        <h1>Yo</h1>
        // <div className="Register-Location">
        //     <h3 className="Register-h3">Find local matches for any sport</h3>
        //     <div className="bp-state-selectDiv">
        //         <h5 className="bph2">Set Location</h5>
        //         <select type="text" value={this.state.userState} onChange={this.updateState} name="skill" className="bp-states states order-alpha" id="stateId">
        //             <option value="Select">Select State</option>
        //             {states}
        //         </select>
        //         <select type="text" value={this.state.userCity} onChange={this.updateCity} name="skill" className="bp-states states order-alpha" id="cityId">
        //             {cities}
        //         </select>
        //     </div>
        // </div>
    );
}
