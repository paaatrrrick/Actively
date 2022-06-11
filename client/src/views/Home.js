import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../resources/stylesheets/Home.css"
import "../resources/stylesheets/default.css"

import tennisBroImg from '../resources/images/Tennis-bro.svg'
import volleyballImg from '../resources/images/volleyball.gif'
import hockeyImg from '../resources/images/hockey.gif'
import pingImg from '../resources/images/ping.gif'
import finishSvg from '../resources/images/finish.svg'
import oppositeFetchChecks from './helperfunctions/oppositeFetchChecks';





export default class Home extends Component {
    constructor(props) {
        super(props)
        this.checkLogin = this.checkLogin.bind(this);
    }


    async checkLogin() {
        const response = await fetch('/api/isLoggedIn', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        oppositeFetchChecks(data);
    }

    componentDidMount() {
        this.checkLogin()
    }
    render() {
        return (
            // <a href="/logout" id='login'>Logout</a>
            // <a href="/dashboard" class='btn' id='register'>Dashboard</a>
            //     <a href="/login" id='login'>Log in</a>
            //     <a href="/" class='btn' id='register'>Join Actively</a>
            <div className="Home">
                <Link to="/login" id="login">Log in</Link>
                <Link to="/" className='def-btn' id="register">Join Actively</Link>
                <section className='Home-section'>
                    <div className="Home-topSection">
                        <div className="Home-topSectionText">
                            <h1 id='toph1'>Hate Playing Group <br />
                                Sports Alone?</h1>
                            <h3 className='Home-h3'>We just found your next partner</h3>
                        </div>
                        <img src={tennisBroImg} id='tennisImg' alt="TennisBroImg" />
                    </div>
                    <div>
                        <div className="Home-wave" id='wave1'></div>
                        <div className="Home-wave" id='wave2'></div>
                        <div className="Home-wave" id='wave3'></div>
                        <div className="Home-wave" id='wave4'></div>
                    </div>
                </section>
                <div className="Home-sec">
                    <h2 className='Home-h2'><span id='logo'>Actively </span>How Modern Athletes Find Partners</h2>
                    <hr className='Home-hr' />
                    <div className="Home-cHolder">
                        <div className="Home-c" id='c1'>
                            <img src={volleyballImg} alt="volleyball" className='Home-cImage' />
                            <h4 className='Home-h4'>Find Partners</h4>
                            <p className='Home-cp'>
                                Finding partners for group sports like Football or Tennis is hard. Either
                                you have to plan days in advance to meet with your friends or join costly
                                leagues. Neither option is appealing. Actively offers a solution. Players
                                can simply post their matches for others to join.
                            </p>
                        </div>
                        <div className="Home-c" id='c2'>
                            <img src={hockeyImg} alt="Hockey" className='Home-cImage' />
                            <h4 className='Home-h4'>Compete at Any Level</h4>
                            <p className='cp'>Worried about playing players that aren't at your skill level?
                                Actively lets you set the skill level of your event. That way participants
                                showing up are the perfect fit for great competition.
                            </p>
                        </div>
                        <div className="Home-c" id='c3'>
                            <img src={pingImg} alt="Ping Pong" className='Home-cImage' />
                            <h4 className='Home-h4'>Name Your Sport</h4>
                            <p className='Home-cp'>Actively isn't just for single sports athletes. We
                                currently serve seven sports: Tennis, PingPong, Volleyball, Pickleball,
                                Football, Spikeball, and Soccer. And we're just getting started. Actively
                                allows any athletes with any sport to find perfect partners!
                            </p>
                        </div>
                    </div>

                    <div className="custom-shape-divider-bottom-1646760192">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                            preserveAspectRatio="none">
                            <path
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                opacity=".25" className="shape-fill"></path>
                            <path
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                                opacity=".5" className="shape-fill"></path>
                            <path
                                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                                className="shape-fill"></path>
                        </svg>
                    </div>
                </div>
                <div className="Home-bBottom">
                    <div className="Home-bottom">
                        <img src={finishSvg} alt="finish Line" id='bImg' />
                        <div className="Home-bottomText">
                            <h1 id='bH1'>Now Go Finish What you Started</h1>
                            <h3 className='Home-h3'>With a partner from Actively</h3>
                        </div>
                    </div>

                    <div className="Home-footer">
                        <Link to="/resources" className="Home-nav-link">Picture Creators</Link>
                    </div>
                </div>
            </div>
        )
    }
}