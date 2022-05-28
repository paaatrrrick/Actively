import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../resources/stylesheets/EventCard.css"
import "../resources/stylesheets/default.css"



export default class EventCard extends Component {
    constructor(props) {
        super(props)
        this.joinEvent = this.joinEvent.bind(this);
        this.makeTimePretty = this.makeTimePretty.bind(this);
        this.callBackPopUp = this.callBackPopUp.bind(this);
    }
    callBackPopUp() {
        this.props.callBack(this.props.eventDetails._id);
    }
    async joinEvent(e) {
        console.log(`/event/${this.props.eventDetails._id}`)
        const response = await fetch(`/event/${this.props.eventDetails._id}/${this.props.eventDetails.hostId}`, {
            method: 'POST',
            headers: {
                "x-access'token": window.localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        window.location.reload(true);
    }
    makeTimePretty(date1) {
        var date = new Date(date1)
        var hours = date.getHours(); var str = 'AM'; if (hours > 11) {
            str = 'PM';
            hours = hours - 12;
        }
        if (hours == 0) {
            hours = 12;
        }
        var minutes = String(date.getMinutes());
        if (String(minutes).length === 1) {
            minutes = '0' + minutes;
        }
        return String(String(hours) + ':' + minutes + ' ' + str + ' on ' + String(date.toDateString()).slice(0, 10));
    }
    render() {
        const { hostName, eventDetails, eventTime, hostImg, userId } = this.props;
        var followUpText = '';
        var joinBtn = '';
        if (eventDetails.hostId === userId) {
            followUpText = "- your event"
        } else if (eventDetails.participantId.includes(userId)) {
            followUpText = "- joined"
        } else {
            joinBtn = <button
                id='joinBtn'
                onClick={this.joinEvent}
                className='Event-everyThingElse Event-divBottomItem'>Join +
            </button>
        }
        return (
            <div className="Event">
                <div className="Event-personalInfoDiv">
                    <Link to={`profile/${eventDetails.hostId}`}>
                        <img src={`${hostImg}/-/format/jpeg/-/scale_crop/500x500/smart/`} alt="here123"
                            className="Event-profileIcon" />
                    </Link>
                    <div className="def-column def-justifyconentCenter">
                        <h5 id='nameText'>
                            {hostName}
                            {followUpText}
                        </h5>

                        <div>
                            <span className='Event-textSpan'>
                                {eventDetails.location} in {eventDetails.city}, {eventDetails.state}  at {this.makeTimePretty(eventTime)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="def-row">

                    <img src={`/images/${eventDetails.sportType}.png`} alt="icon img"
                        className="Event-sportIconImg" />
                    <h4 className="Event-h4">
                        {eventDetails.sportType}
                    </h4>

                    <div className='Event-groupsize def-row def-alignCenter' id={eventDetails.id}>
                        <p className="Event-p" onClick={this.callBackPopUp}>
                            {eventDetails.participantId.length + 1} / {eventDetails.groupSize} Players
                        </p>

                    </div>
                </div>
                <p className='Event-insideHolder Event-p'>
                    {eventDetails.description}
                </p>
                <div className="Event-insideHolder def-row def-alignCenter">
                    <p className={`Event-${eventDetails.level} Event-levelBtn Event-divBottomItem Event-p`}>
                        Skill:
                        {eventDetails.level}
                    </p>
                    {joinBtn}
                </div>
            </div >
        )
    }
}