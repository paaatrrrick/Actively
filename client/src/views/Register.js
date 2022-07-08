import React, { useState, useEffect } from 'react';
import "../resources/stylesheets/Register.css"
import "flatpickr/dist/themes/material_green.css";
import useInputState from './hooks/useInput';
import csc from "country-state-city";
import hockeyImg from '../resources/images/hockey.gif';
import { Redirect } from 'react-router-dom';
import Flash from './Flash'
import oppositeFetchChecks from './helperfunctions/oppositeFetchChecks';
import { Link } from 'react-router-dom';
import logo from '../resources/images/activelyLogo.jpg'
import PP from '../resources/images/OnlinePrivacyPolicy.pdf'
import TC from '../resources/images/OnlineTermsandConditions.pdf'





export default function Register() {
    const [flash, setFlash] = useState(false);

    const [redirect, setRedirect] = useState(false);
    const [view, updateView] = useState(0);
    const [state123, setState123] = useState(0);
    const [stateId, updateStateId] = useState(false);
    const [stateUpdate, setStateUpdate] = useState(false)
    const [state, setState] = useState("select");
    const [city, setCity] = useState("select");
    const [sportType, setSportType] = useState([]);

    const [first, setFirst] = useInputState("");
    const [last, setLast] = useInputState("");
    const [email, setEmail] = useInputState("");
    const [password, setPassword] = useInputState("");
    const [phone, setPhone] = useInputState("");
    const [age, setAge] = useInputState("");
    const [ppTc, setPpTc] = useState(false);

    const [groups, setGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);

    const join = async () => {
        const response = await fetch(`/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                state: state,
                city: city,
                sports: sportType,
                first: first,
                last: last,
                email: email,
                password: password,
                phone: phone,
                age: age,
                groups: userGroups
            }),
        });
        const res = await response.json();
        if (res === 'taken') {
            setFlash(true);
        } else {
            window.localStorage.setItem('token', res.token);
            setRedirect(true);
        }
    }

    const checkLogin = async () => {
        const response = await fetch('/api/isLoggedIn', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        oppositeFetchChecks(data);
    }

    useEffect(() => {
        checkLogin();
    }, [redirect])

    const addToSports = () => {
        if (checkIfInfo()) {
            updateView(view + 1);
        } else {
            highLightRed()
        }
    }

    const findGroups = async () => {
        const response = await fetch(`/api/register/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sports: sportType
            }),
        });
        const res = await response.json();
        setGroups(res.groups)
    }

    const checkIfInfo = () => {
        switch (view) {
            case 0:
                if (state !== "select" && city !== "select") {
                    return true;
                }
                break;
            case 1:
                if (sportType.length > 0) {
                    return true
                }
                break;
            case 2:
                if (first !== "" && last !== "" && email !== "" && password !== "" && phone !== "" && age !== "" && ppTc) {
                    findGroups()
                    return true;
                }
                break;
            case 3:
                return true

        }
        return false;
    }

    const highLightRed = () => {
        const elements = document.getElementsByClassName('Register-inputClass')
        for (const element of elements) {
            if (element.value == "") {
                element.classList.add('def-badInput')
            } else {
                element.classList.add('def-goodInput')
            }
        };
    }

    const changeSports = (e) => {
        var tempArr = sportType;
        if (!tempArr.includes(e.target.value)) {

            tempArr.push(e.target.value);
        } else {
            var index = tempArr.indexOf(e.target.value);
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        }
        setSportType(tempArr)
        setState123(state123 + 1000)
    }

    const changeGroups = (e) => {
        var tempArr = userGroups;
        if (!tempArr.includes(e.target.value)) {

            tempArr.push(e.target.value);
        } else {
            var index = tempArr.indexOf(e.target.value);
            if (index !== -1) {
                tempArr.splice(index, 1);
            }
        }
        setUserGroups(tempArr)
        setState123(state123 + 1000)
    }

    const openPrivacyPolicy = () => {
        window.open(PP);
    }
    const openTermsandConditions = () => {
        window.open(TC);
    }


    const updateState = (e) => {
        const states = csc.getStatesOfCountry('231')
        const val = e.target.value;
        for (var i = 0; i < states.length; i++) {
            if (states[i].name === val) {
                setState(val);
                updateStateId(states[i].id);
                setStateUpdate(true)
                break;
            }
        }
    }

    const updateCity = (e) => {
        setCity(e.target.value);
    }


    if (redirect) {
        return <Redirect to={'/dashboard'} />
    }
    return (
        <div className="Register">
            <Link to="/login" id="login">Log in</Link>
            <Link to="/home" className='def-btn' id="register">Back Home</Link>
            {flash ? <Flash text="Email already taken" bad={true} /> : <p></p>}
            <div className="Register-main">
                {/* <span id='Register-logo'>Actively</span> */}
                <div className="register-flexrow">
                    <h1 className='Register-h1'>Sign Up for</h1>
                    <img src={logo} id='register-logoImg' alt="Actively Logo" />
                </div>
                <div className="Register-row2Col">
                    <div className="Register-currentSlide">
                        {view === 0
                            ?
                            <div className="Register-view">
                                <h4 className='Register-h4'>Select your Location to get Started</h4>
                                <div className="Register-View-Content">
                                    <div className="def-row ViewContent-stateCitySelectors">
                                        <select type="text" value={state} onChange={updateState} name="skill" className="Register-inputClass NewEvent-input Register-dropdown">
                                            <option value="Select">Select State</option>
                                            {csc.getStatesOfCountry('231').map((state1) => (
                                                <option key={state1.id} value={state1.name}>{state1.name}</option>
                                            ))}
                                        </select>
                                        <select type="text" value={city} onChange={updateCity} name="skill" className="Register-inputClass NewEvent-input Register-dropdown">
                                            <option value="Select">Select City</option>
                                            {csc.getCitiesOfState(stateId).map((city1) => (
                                                <option key={city1.id} value={city1.name}>{city1.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            :
                            view === 1
                                ?
                                <div className="Register-view">
                                    <h4 className='Register-h4'>What Sports Interest Your?</h4>
                                    <div className="Register-radio-button def-row">`
                                        {['PingPong', 'Tennis', 'Pickleball', 'Basketball', 'Soccer', 'Football', 'Spikeball'].map(sport => (
                                            <div key={`${sport}-Register123`}>
                                                <input
                                                    type="checkbox"
                                                    id={`Register-${sport}`}
                                                    className="Register-inputClass"
                                                    name="type" value={sport}
                                                    onChange={changeSports}
                                                    checked={sportType.includes(sport) ? true : false} />
                                                <label htmlFor={`Register-${sport}`}>
                                                    <div className="def-column def-alignCenter"><img className="Register-cardImg" src={`/images/${sport}.png`} alt={sport} />
                                                        <h4 className="Register-sporth4">{sport}</h4>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                :
                                view === 2
                                    ?
                                    <div className="Register-view">
                                        <h4 className='Register-h4'>Enter your basic info</h4>
                                        <div className="Register-View-Content3">
                                            <div className="def-row">
                                                <input type="text" name="email" value={email} onChange={setEmail} placeholder="Email" className="Register-inputClass NewEvent-input Register-mid" />
                                                <input type="password" name="password" value={password} onChange={setPassword} placeholder="Password" className="Register-inputClass NewEvent-input Register-mid" />
                                            </div>
                                            <div className="def-row">
                                                <input type="text" name="first" value={first} onChange={setFirst} placeholder="First Name" className="Register-inputClass NewEvent-input Register-mid" />
                                                <input type="text" name="last" value={last} onChange={setLast} placeholder="Last Name" className="Register-inputClass NewEvent-input Register-mid" />
                                            </div>
                                            <div className="def-row">
                                                <input type="tel" name="phone" value={phone} onChange={setPhone} placeholder="Phone Number" className="Register-inputClass NewEvent-input Register-mid" />
                                                <input type="number" name="age" value={age} onChange={setAge} placeholder="Age" className="Register-inputClass NewEvent-input Register-mid" min='18' max='99' />
                                            </div>
                                            <div className="Register-checkbox-row">
                                                <input type="checkbox" id="PP-checkbox" onClick={() => setPpTc(!ppTc)} checked={ppTc} />
                                                <p className='register-paragraph'>I agree to the <span className='register-link-underline' onClick={openPrivacyPolicy}>Privay Policy</span>, <span className='register-link-underline' onClick={openTermsandConditions}>Terms, and Conditions</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="Register-view">
                                        <h4 className='Register-h4'>Optionally, join some groups in your area</h4>
                                        <div className="Register-radio-button Register-flexwrap">
                                            {groups.map(group => (
                                                <div key={`${group.id}-Register1234`} className="Register-w22">
                                                    <input
                                                        type="checkbox"
                                                        id={`Register123-${group.id}`}
                                                        name="type"
                                                        value={group.id}
                                                        onChange={changeGroups}
                                                        checked={userGroups.includes(group.id) ? true : false}
                                                    />
                                                    <label htmlFor={`Register123-${group.id}`}>
                                                        <div className="def-row def-alignCenter">
                                                            <img className="Register-groupImg" src={`${group.icon}/-/format/jpeg/-/scale_crop/500x500/smart/`} alt={group.name} />
                                                            <div className="Register-cardRightSide">
                                                                <h4 className="Register-grouph4">{group.name} - {group.sport}</h4>
                                                                <h5 className="Register-grouph5">Usually meets at {group.location} in {group.city}, {group.state}</h5>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                        }
                        <div className="Register-bottomBtn">
                            {view === 0 ? <div className='CreateGroup-filler'></div> : <button className='Register-btn Register-back' onClick={() => updateView(view - 1)}>Back</button>}

                            {view === 3 ? <button className='Register-btn Register-next' onClick={() => join()}>Join!</button> : <button className='Register-btn Register-next' onClick={() => addToSports()}>Next</button>}

                        </div>
                    </div>

                    <div className="Register-Information">
                        <h4 className='Home-h4'>Find local sport players</h4>
                        <ul className='Reigster-ul'>
                            <li>Connect with other local players playing your favorite sport</li>
                            <li>Quickly create events or join others</li>
                            <li>Set your desired skill level</li>
                            <li>Feel safe by knowing your upcoming partner's information</li>
                            <li>Stay notified on your friends matches</li>
                            <li>Stop the groupchats, and start a local group</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
