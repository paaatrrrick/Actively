import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../resources/stylesheets/Login.css"
import "../resources/stylesheets/default.css"
import oppositeFetchChecks from './helperfunctions/oppositeFetchChecks';
import Flash from './Flash'



import CoachBro from '../resources/images/Coach-bro.svg'

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            flash: false
        }
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.redirect = this.redirect.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
    }
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }
    redirect(res) {
        if (res.data.user) {
            this.setState({
                email: '',
                password: ''
            })
            window.localStorage.setItem('token', res.data.token)
            window.location.href = `${(window.location.href.substring(0, (window.location.href.length - window.location.pathname.length)))}/dashboard`;
        } else {
            console.log('bad information')
            this.setState({
                flash: true
            })
        };
    }

    async checkLogin() {
        const response = await fetch('/api/isLoggedIn', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        oppositeFetchChecks(data);
    }

    componentDidMount() {
        this.checkLogin()
    }
    onSubmit(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password
        }
        if (this.state.email && this.state.password) {
            axios.post('/api//login', user)
                .then(res => this.redirect(res))
        }
    }

    render() {
        return (
            <div className="Login">
                <Link to="/Home" className="Login-btn1" id='logout'>Home</Link>
                {this.state.flash ? <Flash text="Incorrect Email or Password" bad={true} /> : <p></p>}
                <div id='all'>
                    <form id='formForm' onSubmit={this.onSubmit}>
                        <h1 className='Login-h1'>Login</h1>
                        <div id='form0'>
                            <div className="Login-inputBox">
                                <input
                                    type="text"
                                    name='user[email]'
                                    value={this.state.email}
                                    placeholder="Email"
                                    className="Login-checkr Login-input"
                                    onChange={this.onChangeEmail}
                                />
                            </div>
                        </div>
                        <div id='form2'>
                            <div className="Login-inputBox">
                                <input
                                    type="password"
                                    name='user[password]'
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                    placeholder="Password"
                                    className="Login-checkr Login-input"
                                />
                            </div>
                        </div>
                        <button className='Login-btn2'>Log In</button>
                        <h5 className='Login-h5'>Don't Have an Account Yet?
                            <Link to="../" className="Login-btn1">Join</Link></h5>
                    </form>
                </div>
                <img className='Login-img' src={CoachBro} alt="" />
            </div>
        )
    }
}