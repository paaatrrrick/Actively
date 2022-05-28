import React, { Component } from 'react';
import EventCard from "./EventCard"
import NavBar from './NavBar';
import Loading from './Loading';
import PopUpCard from './PopUpCard';
import fetchChecks from './helperfunctions/fetchChecks';
import "../resources/stylesheets/Dashboard.css"
import "../resources/stylesheets/default.css"



export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentContent: [],
            userId: '',
            navbarData: '',
            cardShowing: false,
            cardInfo: [],
            loading: true

        }
        this.fetchDashboard = this.fetchDashboard.bind(this);
        this.popUpCard = this.popUpCard.bind(this);
        this.closePopUp = this.closePopUp.bind(this);

    }
    closePopUp() {
        this.setState({
            cardShowing: false,
            cardInfo: []
        })
    }
    async fetchDashboard() {
        const response = await fetch('/dashboard', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        this.setState({
            currentContent: data.content,
            userId: data.userId,
            navbarData: data.navbarData,
            loading: false
        });
    }

    popUpCard(id) {
        fetch('/getProfiles', {
            method: 'POST',
            headers: {
                "x-access'token": window.localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
            .then(res => res.json())
            .then(data => {
                fetchChecks(data);
                this.setState({
                    cardShowing: true,
                    cardInfo: data.key
                })
            })
            .catch((error) => { console.log(error); })
    }

    componentDidMount() {
        this.fetchDashboard();
    }
    render() {
        const { currentContent, userId } = this.state;
        var cEvents = []
        for (var i = 0; i < currentContent.length; i++) {
            cEvents.push(
                <EventCard
                    hostName={currentContent[i][0]}
                    eventDetails={currentContent[i][1]}
                    eventTime={currentContent[i][2]}
                    hostImg={currentContent[i][3]}
                    canJoin={true}
                    key={currentContent[i][1]._id}
                    userId={userId}
                    callBack={this.popUpCard}
                />
            )
        }
        if (this.state.loading) {
            return <Loading />
        } else if (cEvents.length === 0) {
            return <div className="">
                <NavBar navbar={this.state.navbarData} callBackFunction={this.fetchDashboard} />
                <h3 className="Dashboard-h3 Dashboard-marginTop" id='firstDashboardh3'>No matches found, try other sports or create your own</h3>
                <hr className="Dashboard-hr" />
            </div>
        }
        return (
            <div>
                <NavBar navbar={this.state.navbarData} callBackFunction={this.fetchDashboard} />
                {this.state.cardShowing ? <PopUpCard popUpData={this.state.cardInfo} closeFunction={this.closePopUp} /> : <div></div>}
                <div className="Dashboard">
                    <div className="">
                        <h3 className="Dashboard-h3" id='firstDashboardh3'>Matches in {this.state.navbarData.userCity}</h3>
                        <hr className="Dashboard-hr" />
                        {cEvents}
                    </div>
                </div>
            </div>
        )
    }
}