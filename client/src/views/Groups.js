import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Loading from './Loading';
import "../resources/stylesheets/Groups.css";
import fetchChecks from './helperfunctions/fetchChecks';
import { Redirect } from 'react-router-dom';


export default class Groups extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            yourGroups: true,
            navbarData: {},
            groupsShowing: [],
            redirect: false
        }
        this.checkLogin = this.checkLogin.bind(this)
        this.findGroups = this.findGroups.bind(this)
        this.redirect = this.redirect.bind(this)
    }

    redirect() {
        this.setState({
            redirect: true
        })
    }
    async findGroups() {
        const response = await fetch('/api/findgroups', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        this.setState({
            navbarData: data.navbarData,
            groupsShowing: data.returnData,
            yourGroups: false
        })
    }

    async checkLogin() {
        const response = await fetch('/api/grouplist', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        this.setState({
            loading: false,
            navbarData: data.navbarData,
            groupsShowing: data.returnData
        })
    }
    componentDidMount() {
        this.checkLogin()
    }

    render() {
        if (this.state.loading) {
            return <Loading />
        }
        if (this.state.redirect) {
            return <Redirect to={'/creategroup'} />
        }
        var tab = <div className=""></div>
        if (this.state.groupsShowing.length === 0) {
            tab = <div className="Groups-friendDiv">
                <h4 className='Groups-noOneH4'>Click Find Groups to get groups to join</h4>
            </div>
        } else {
            tab = this.state.groupsShowing.map((groupTab, index) => (
                <div className="Groups-friendDiv" key={`Groups-${index}`}>
                    <Link to={`/group/${groupTab.id}`} className='Groups-leftside'>
                        <img src={`${groupTab.icon}/-/format/jpeg/-/scale_crop/100x100/smart/`} alt="Profile Img" />
                        <div className="def-row">
                            <h3>{groupTab.name}</h3>
                            <p className='Groups-p'> - {groupTab.sport}</p>
                        </div>
                    </Link>
                    <Link
                        to={`/group/${groupTab.id}`}
                        className={'Groups-friend Groups-add'}>
                        View
                    </Link>
                </div>
            ))
        }
        return (
            <div className="">
                <div className="Groups-body">
                    <div className="Groups-container" id='Groups-container'>
                        <div className="Groups-rowToColomn">
                            <h1 className="Groups-h1">{this.state.yourGroups ? "Your Groups: " : "Local Groups"}</h1>
                            <div className="Groups-inputsDiv">
                                <button className="Groups-btn1" onClick={this.findGroups}> Find Groups 🔎</button>
                                <button className="Groups-btn1" onClick={this.redirect}>Create Group +</button>
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