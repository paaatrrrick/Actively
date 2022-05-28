import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../resources/stylesheets/PopUpCard.css"


export default class PopUpCard extends Component {
    constructor(props) {
        super(props)
        this.closePopUp = this.closePopUp.bind(this);

    }
    closePopUp() {
        this.props.closeFunction();
    }
    render() {
        const arr = this.props.popUpData;
        const cards = arr.map(cardInfo => (
            <div className="popUpDiv-card" key={`popUpDiv-${cardInfo}`}>
                <img className='popUpDiv-img' src={`${cardInfo[0]}/-/format/jpeg/-/scale_crop/100x100/smart/`} alt="" />
                <Link className='popUpDiv-link' to={`../profile/${cardInfo[1]}`}>{cardInfo[2] + " " + cardInfo[3]}</Link>
            </div>
        ))
        return (
            <div className="popUpDiv-PopUpDiv">
                <div className="popUpDiv-headerDiv">
                    <h4 className='popUpDiv-h4'>
                        {arr[arr.length - 1][4] + ' Roster'}
                    </h4>
                    <button className={'popUpDiv-button'} onClick={this.closePopUp}>x</button>
                </div>
                <div className="popUpDiv-cardHolder">
                    {cards}
                </div>
            </div>
        )
    }
}