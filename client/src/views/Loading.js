import React, { Component } from 'react';
import "../resources/stylesheets/Loading.css"



export default class Loading extends Component {
    render() {
        return (
            <div className="loader">
                <div className="tall-stack">
                    <div className="butter falling-element"></div>
                    <div className="pancake falling-element"></div>
                    <div className="pancake falling-element"></div>
                    <div className="pancake falling-element"></div>
                    <div className="pancake falling-element"></div>
                    <div className="pancake falling-element"></div>
                    <div className="pancake falling-element"></div>
                    <div className="plate">
                        <div className="plate-bottom"></div>
                        <div className="shadow"></div>
                    </div>
                </div>
            </div>
            // <div className='Loading'>
            //     <h1 className="loading-title">Loading...</h1>
            //     <div className="rainbow-marker-loader"></div>
            // </div>
        )
    }
}