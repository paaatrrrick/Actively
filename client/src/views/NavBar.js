import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../resources/stylesheets/NavBar.css";
import "../resources/stylesheets/default.css";
import fetchChecks from './helperfunctions/fetchChecks';
import logout from './helperfunctions/logout';
import addFriend from '../resources/images/addFriend.png';
import csc from "country-state-city";



export default class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userSports: [],
            userState: 'Select',
            stateId: false,
            userCity: '',
            stateUpdate: false,
            statesMap: []
        }
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.toggleSportCard = this.toggleSportCard.bind(this);
        this.callUpdate = this.callUpdate.bind(this);
        this.logoutLink = this.logoutLink.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateCity = this.updateCity.bind(this);
    }
    updateState(e) {
        for (var i = 0; i < this.state.statesMap.length; i++) {
            if (this.state.statesMap[i].name === e.target.value) {
                this.setState({
                    userState: e.target.value,
                    stateId: this.state.statesMap[i].id,
                    stateUpdate: true
                })
                break;
            }
        }
    }
    updateCity(e) {
        this.setState({
            userCity: e.target.value,
            stateUpdate: true
        })

    }
    async logoutLink() {
        await this.callUpdate();
        logout()
    }

    async callUpdate() {
        if (this.state.stateUpdate) {
            const data = {
                desiredSports: this.state.userSports,
                state: this.state.userState,
                city: this.state.userCity
            };
            const response = await fetch('/api/updateSportInterests', {
                method: 'POST',
                headers: {
                    "x-access'token": window.localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const res = await response.json();
            fetchChecks(res);
        }
    }

    async toggleSideBar(shouldUpdate) {
        const navMenu = document.querySelector(".bp-nav-menu");
        navMenu.classList.toggle('active');
        if (shouldUpdate) {
            await this.callUpdate()
            if (this.props.callBackFunction) {
                this.props.callBackFunction();
            }
            this.setState({
                stateUpdate: false
            });
        }
    }

    toggleSportCard(sport) {
        const currentCard = document.getElementById(sport)
        currentCard.classList.toggle("bp-check")
        var tempUserSports = this.state.userSports;
        const index = tempUserSports.indexOf(sport);
        if (index === -1) {
            tempUserSports.push(sport);
        } else {
            tempUserSports.splice(index, 1);
        }
        this.setState({
            userSports: tempUserSports,
            stateUpdate: true
        })
    }

    componentDidMount() {
        const { userCity, userState, userSports } = this.props.navbar
        const statesMap = csc.getStatesOfCountry('231')
        var id = '3918'
        for (var i = 0; i < statesMap.length; i++) {
            if (statesMap[i].name === userState) {
                id = statesMap[i].id;
                break;
            }
        }
        this.setState({
            userSports: userSports,
            userCity: userCity,
            stateId: id,
            userState: userState,
            stateUpdate: false,
            statesMap: statesMap
        })
    }
    render() {
        const sports = ['PingPong', 'Tennis', 'Pickleball', 'Basketball', 'Soccer', 'Football', 'Spikeball'];
        const states = csc.getStatesOfCountry('231').map((state) => (
            <option key={state.id} value={state.name}>{state.name}</option>
        ));
        var cities = <option value="Select">Select...</option>

        if (this.state.stateId) {
            cities = csc.getCitiesOfState(this.state.stateId).map((city) => (
                <option key={city.id} value={city.name}>{city.name}</option>
            ));
        }
        return (
            <div className="BoilerPlate">
                <div className="bp-boilerplate-body">
                    <div className="bp-headerStuff">
                        <a href="/profile">
                            <img src={`${this.props.navbar.userImg}/-/format/jpeg/-/scale_crop/100x100/smart/`} id='profileImg' />
                        </a>
                        <div className="bp-row">
                            <Link to="/groups" className="bp-btn1">My Groups</Link>
                            <Link to="/create" className="bp-btn1">New Event +</Link>
                            <div className="bp-hamburger" onClick={() => this.toggleSideBar(false)}>
                                <span className="bp-bar"></span>
                                <span className="bp-bar"></span>
                                <span className="bp-bar"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bpHeader">
                    <div className="bp-nav-menu">
                        <div className="bp-rightSideNav">
                            <div className="bp-header-row">
                                <h5 className="bph5">Sport Selection</h5>
                                <div className="bp-hamburger active" onClick={() => this.toggleSideBar(true)}>
                                    <span className="bp-bar"></span>
                                    <span className="bp-bar"></span>
                                    <span className="bp-bar"></span>
                                </div>
                            </div>
                            <div className="bp-sports-row">
                                {sports.map(sport => (
                                    <button id={sport} key={sport} onClick={() => this.toggleSportCard(sport)}
                                        className={this.state.userSports.includes(sport) ? "bp-nav-item bp-check" : "bp-nav-item"}>
                                        <img src={`/images/${sport}.png`} alt="" className="bp-cardImg" />
                                        <h4 className="bp-h4">{sport}</h4>
                                    </button>
                                ))}
                            </div>
                            <div className="bp-column">
                                <div className="bp-state-selectDiv">
                                    <h5 className="bph2">Set Location</h5>
                                    <select type="text" value={this.state.userState} onChange={this.updateState} name="skill" className="bp-states states order-alpha" id="stateId">
                                        <option value="Select">Select State</option>
                                        {states}
                                    </select>
                                    <select type="text" value={this.state.userCity} onChange={this.updateCity} name="skill" className="bp-states states order-alpha" id="cityId">
                                        {cities}
                                    </select>
                                </div>
                                <h6 className="bph6">Showing Results for {this.props.navbar.userCity}, {this.props.navbar.userState}</h6>
                            </div>
                            <div className="bp-row2">
                                <Link to="/friends" className="bp-addFriends" onClick={this.callUpdate}>
                                    <div onClick={this.callUpdate} className="bpFriendsDiv">
                                        <img src={addFriend} alt="Add Friends" />
                                        <h3>Find Friends
                                        </h3>
                                    </div>
                                </Link>
                                <Link to="/dashboard" className="bp-home" onClick={this.callUpdate}>Home</Link>
                                <div className="bp-home" onClick={this.logoutLink}>Logout</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
}