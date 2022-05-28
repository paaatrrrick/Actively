import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Loading from './Loading';
import "../resources/stylesheets/Friends.css";
import fetchChecks from './helperfunctions/fetchChecks';

export default class Friends extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            navbarData: {},
            firstInput: '',
            lastInput: '',
            friendsShowing: false,
            showingFriends: []
        }
        this.checkLogin = this.checkLogin.bind(this)
        this.updateFirst = this.updateFirst.bind(this)
        this.updateLast = this.updateLast.bind(this)
        this.friendUpdate = this.friendUpdate.bind(this)
        this.searchFriend = this.searchFriend.bind(this)
    }

    async checkLogin() {
        const response = await fetch('/isLoggedIn', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        this.setState({
            loading: false,
            navbarData: data
        })
    }
    componentDidMount() {
        this.checkLogin()
    }

    updateFirst(e) {
        this.setState({
            firstInput: e.target.value
        })
    }

    async friendUpdate(id, index, isFriend) {
        var location = (isFriend ? 'removeFriend' : 'addFriend');
        const response = await fetch(`/${location}`, {
            method: 'POST',
            headers: {
                "x-access'token": window.localStorage.getItem('token'), 'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            }),
        })
        var duplicate = this.state.showingFriends;
        duplicate[index].isFriend = !this.state.showingFriends[index].isFriend;
        this.setState({
            showingFriends: duplicate
        })
    }

    async searchFriend() {
        const response = await fetch('/findFriends', {
            method: 'POST', headers: {
                "x-access'token": window.localStorage.getItem('token'), 'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first: this.state.firstInput,
                last: this.state.lastInput
            }),
        })
        const data = await response.json();
        fetchChecks(data);
        this.setState({
            firstInput: '',
            lastInput: '',
            friendsShowing: true,
            showingFriends: data
        })
    }
    updateLast(e) {
        this.setState({
            lastInput: e.target.value
        })
    }
    render() {
        if (this.state.loading) {
            return <Loading />
        }
        var tab = <div className=""></div>
        if (this.state.friendsShowing) {
            if (this.state.showingFriends.length === 0) {
                tab = <div className="Friend-friendDiv">
                    <h4 className='Friend-noOneH4'>Sorry no one was found</h4>
                </div>
            } else {
                tab = this.state.showingFriends.map((friendTab, index) => (
                    <div className="Friend-friendDiv" key={`Friend-${friendTab}`}>
                        <Link to={`/profile/${friendTab.id}`} className='Friend-leftside'>
                            <img src={`${friendTab.icon}/-/format/jpeg/-/scale_crop/500x500/smart/`} alt="Profile Img" />
                            <h3>{friendTab.first} {friendTab.last}</h3>
                        </Link>
                        <button
                            onClick={() => this.friendUpdate(friendTab.id, index, friendTab.isFriend)}
                            className={(friendTab.isFriend ? 'Friend-friend Friend-remove' : 'Friend-friend Friend-add')}>
                            {(friendTab.isFriend ? 'Unfriend' : 'Friend')}
                        </button>
                    </div>
                ))
            }
        }
        return (
            <div className="">
                <div className="Friend-body">
                    <div className="Friend-container" id='Friend-container'>
                        <div className="Friend-rowToColomn">
                            <h1 className="Friend-h1">Find Friends:</h1>
                            <div className="Friend-inputsDiv">
                                <input type="text" onChange={this.updateFirst} value={this.state.firstInput} className="Friend-input1" id="first" placeholder='First' />
                                <input type="text" onChange={this.updateLast} value={this.state.lastInput} className="Friend-input1" id="last" placeholder='Last' />
                                <button className="Friend-btn1" onClick={this.searchFriend} id='search'>Search</button>
                            </div>
                        </div>
                        {tab}
                    </div>
                </div>
                <NavBar navbar={this.state.navbarData} />
            </div>
        )
    }
}