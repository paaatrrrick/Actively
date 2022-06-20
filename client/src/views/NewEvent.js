import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import "../resources/stylesheets/NewEvent.css"
import "../resources/stylesheets/default.css"
import fetchChecks from './helperfunctions/fetchChecks';
import Loading from './Loading';
import NavBar from './NavBar';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';


import useInputState from './hooks/useInput'
import Groups from './Groups';

export default function NewEvent() {
    const [redirect, changeRedirect] = useState(false);
    const [loading, changeLoading] = useState(true);
    const [navbarData, updateNavBarData] = useState(false);
    const [groups, setGroups] = useState();
    const [selectedGroups, setSelectedGroups] = useState();
    const [time, updateTime] = useState("");
    const [sportType, updateSportType, resetSportType] = useInputState("Pickleball");
    const [skill, updateSkill, resetSkill] = useInputState("Anyone");
    const [location, updateLocation, resetLocation] = useInputState("");
    const [groupSize, updateGroupSize, resetGroupSize] = useInputState("");
    const [description, updateDescription, resetDescription] = useInputState("");

    const selectChange = (e) => {
        setSelectedGroups(e);
    }

    const checkLogin = async () => {
        const response = await fetch('/api/newevent', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        changeLoading(false);
        updateNavBarData(data.navbarData)
        setGroups(data.groups)
        setSelectedGroups(data.groups[0])
    }

    useEffect(() => {
        checkLogin();
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();
        var returnVar = false
        const flatpickers = document.getElementsByClassName('NewEvent-input-FlatPickr')
        for (const p of flatpickers) {
            if (p.value) {
                returnVar = true
            } else {
                p.classList.add('def-badInput')
            }
        }
        const elements = document.getElementsByClassName('NewEvent-input')
        for (const element of elements) {
            if (element.value == "") {
                element.classList.add('def-badInput')
                returnVar = false
            } else {
                element.classList.add('def-goodInput')
            }
        };

        if (returnVar) {
            function helper(date1) {
                var hours = date1.getHours()
                var minutes = date1.getMinutes()
                if (String(minutes).length === 1) {
                    minutes = String(`${minutes}0`)
                }
                var amPm = 'AM'
                if (hours > 11) {
                    amPm = 'PM'
                    hours = hours - 12
                }
                if (hours === 0) {
                    hours = 12
                }
                return String(date1.toString().slice(0, 10)) + ' at ' + String(hours) + ":" + String(minutes) + " " + amPm
            }
            console.log('here123')
            const d = new Date(time);
            var weekOut = new Date();
            console.log(weekOut)
            weekOut.setDate(weekOut.getDate() + 7);
            console.log(weekOut)
            let notifcation;
            d < weekOut ? notifcation = helper(d) : notifcation = 'nothing'
            console.log(notifcation)

            const data = {
                type: sportType,
                location: location,
                time: time,
                skill: skill,
                description: description,
                turnout: groupSize,
                notifcation: notifcation,
                groups: selectedGroups
            }
            fetch('/api/newEvent', {
                method: 'POST',
                headers: {
                    "x-access'token": window.localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    fetchChecks(data);
                    resetSportType();
                    resetSkill();
                    resetLocation();
                    resetGroupSize();
                    resetDescription();
                    changeRedirect(true)
                    updateTime("")
                })
                .catch((error) => {
                    console.log("Error");
                })
        }
    }
    const animatedComponents = makeAnimated();

    if (loading) {
        return <Loading />
    }
    return (
        <div className="">
            <div className="NewEvent-body">
                {redirect ? <Redirect to="/dashboard" /> : <h3></h3>}
                <div className="def-column NewEvent-alignStartToCenter NewEvent-main">
                    <div id="formForm">
                        <div className="def-column">
                            <h1 className="NewEvent-h1">Create Event</h1>
                            <div className="NewEvent-radio-button def-row">`
                                {['PingPong', 'Tennis', 'Pickleball', 'Basketball', 'Soccer', 'Football', 'Spikeball'].map(sport => (
                                    <div key={`${sport}-NewEvent123`}>
                                        <input type="radio" id={`NewEvent-${sport}`} name="type" value={sport} onChange={updateSportType} checked={sport === sportType ? true : false} />
                                        <label htmlFor={`NewEvent-${sport}`}>
                                            <div className="def-column def-alignCenter"><img className="NewEvent-cardImg" src={`/images/${sport}.png`} alt={sport} />
                                                <h4 className="NewEvent-h4">{sport}</h4>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="NewEvent-row1">
                                <div className="def-row">
                                    <Flatpickr
                                        id='NewEvent-Flatpickr'
                                        data-enable-time
                                        options={{
                                            allowInput: true,
                                            enableTime: true,
                                            dateFormat: "Y-m-d H:i"
                                        }}
                                        value={""}
                                        onChange={(date, dateStr) => {
                                            updateTime(date[0])
                                        }}
                                        className='form-control NewEvent-input-FlatPickr NewEvent-mid'
                                        placeholder='Date and Time'
                                    />
                                    <select type="text" value={skill} onChange={updateSkill} name="skill" id="skill" className="NewEvent-input NewEvent-small">
                                        <option value="Anyone">Anyone</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Recreational">Recreational</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="def-row">
                                    <input type="text" name="location" id="location" value={location} onChange={updateLocation} placeholder="Location" className="NewEvent-input NewEvent-mid" />
                                    <input type="number" name="turnout" value={groupSize} onChange={updateGroupSize} id="turnout" placeholder="Group Size"
                                        className="NewEvent-input NewEvent-small" />
                                </div>
                            </div>
                            <textarea name="description" value={description} onChange={updateDescription} id="NewEvent-large" className="NewEvent-input"
                                placeholder="Description"></textarea>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                defaultValue={[groups[0]]}
                                isMulti
                                options={groups}
                                onChange={selectChange}
                                id='NewEvent-select'
                            />
                            <button className='NewEvent-btn NewEvent-createEvent' onClick={onSubmit} id='createEvent'>Create Event</button>
                        </div>
                    </div>
                </div>
            </div>
            <NavBar navbar={navbarData} />
        </div>
    )
}
