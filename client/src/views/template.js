import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Loading from './Loading';
import "../resources/stylesheets/Template.css";
import fetchChecks from './helperfunctions/fetchChecks';



export default class Template extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            navbarData: {},
        }
        this.checkLogin = this.checkLogin.bind(this);
    }

    async checkLogin() {
        const response = await fetch('/api/isLoggedIn', { headers: { "x-access'token": window.localStorage.getItem('token') } })
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
    render() {
        if (this.state.loading) {
            return <Loading />
        }
        return (
            <div className="">
                <div class="body">
                    <h1>Yo</h1>
                </div>
                <NavBar navbar={this.state.navbarData} />
            </div>
        )
    }
}