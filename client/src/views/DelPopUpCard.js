import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../resources/stylesheets/PopUpCard.css"


export default class DelPopUpCard extends Component {
    constructor(props) {
        super(props)
        this.closePopUp = this.closePopUp.bind(this);
        this.delEvent = this.delEvent.bind(this);

    }
    closePopUp() {
        this.props.closeFunction();
    }
    async delEvent() {
        console.log('here123')
        this.closePopUp()
        const response = await fetch(`/api/delEvent/${this.props.id}`, {
            method: 'POST',
            headers: {
                "x-access'token": window.localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        window.location.reload(true);
    }

    render() {
        return (
            <div className="popUpDiv-PopUpDiv">
                <div className="popUpDiv-headerDiv">
                    <h4 className='popUpDiv-h4'>
                        Are you sure you want to delete this match?
                    </h4>
                    <button className={'popUpDiv-button'} onClick={this.closePopUp}>x</button>
                </div>
                <div className="popUpDiv-cardHolder" style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <button className="Register-btn Register-next" style={{ marginRight: "25px" }} onClick={this.closePopUp}>No</button>
                    <button className="Register-btn Register-next" style={{ marginLeft: "25px" }} onClick={this.delEvent}>Yes</button>
                </div>
            </div>
        )
    }
}