import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import "../resources/stylesheets/CreateGroup.css"
import fetchChecks from './helperfunctions/fetchChecks';
import Loading from './Loading';
import NavBar from './NavBar';

import useInputState from './hooks/useInput'
import { Widget } from "@uploadcare/react-widget";


export default function CreateGroup() {
    const [redirect, changeRedirect] = useState(false);
    const [loading, changeLoading] = useState(true);
    const [navbarData, updateNavBarData] = useState(false);
    const [view, updateView] = useState(1);
    const [maxView] = useState(6);
    const [name, setName] = useInputState("");
    const [location, seLocation] = useInputState("");
    const [sportType, updateSportType] = useInputState("Pickleball");
    const [description, setDescription] = useInputState("");
    const [profileImg, SetProfileImg] = useState("https://ucarecdn.com/3d8947a6-2f21-426b-8a24-82e38a284d07/");
    const [bannerImg, setBanner] = useState("https://ucarecdn.com/573c9553-615e-4ec9-a9e7-8f90ea43f0ad/");



    const checkLogin = async () => {
        const response = await fetch('/api/isLoggedIn', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        changeLoading(false);
        updateNavBarData(data)
    }

    const submit = async () => {
        const data = {
            name: name,
            description: description,
            sportType: sportType,
            bannerImg: bannerImg,
            iconImg: profileImg,
            usualLocation: location
        }
        const response = await fetch('/api/creategroup', {
            method: 'POST',
            headers: {
                "x-access'token": window.localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const res = await response.json();
        console.log(res)
        fetchChecks(res);
        changeRedirect(`/group/${res.id}`)
    }

    const imgUpload = (e) => {
        SetProfileImg(e.originalUrl)
    }

    const imgUpload2 = (e) => {
        setBanner(e.originalUrl)
    }

    useEffect(() => {
        checkLogin();
    }, [redirect])

    const checkIfInfo = () => {
        console.log('checking info')
        console.log(view)
        switch (view) {
            case 1:
                if (name === "") {
                    return false;
                }
                break;
            case 2:
                return true
            case 3:
                if (location === "") {
                    return false;
                }
                break;
            case 4:
                if (description === "") {
                    return false;
                }
                break;
            case 5:
                return true;

        }
        return true;
    }

    const nextClick = () => {
        if (checkIfInfo()) {
            updateView(view + 1);
        } else {
            highLightRed()
        }
    }

    const highLightRed = () => {
        const elements = document.getElementsByClassName('CreateGroup-textInput')
        for (const element of elements) {
            if (element.value === "") {
                element.classList.add('def-badInput')
            } else {
                element.classList.add('def-goodInput')
            }
        };
    }

    var currentComponent = <div className="CreateGroup-View1">
        <h3 className="CreateGroup-h3">What's your groups name?</h3>
        <input type="text" value={name} onChange={setName} className="CreateGroup-textInput" cols="88" rows="5" placeholder='i.e: the free range chickens' />
    </div>
    switch (view) {
        case 2:
            currentComponent = <div className="CreateGroup-View2">
                <h3 className="CreateGroup-h3">What's the main sport</h3>
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
            </div>
            break;
        case 3:
            currentComponent = <div className="CreateGroup-View3">
                <h3 className="CreateGroup-h3">Where's your normal location</h3>
                <input type="text" value={location} onChange={seLocation} className="CreateGroup-textInput" placeholder='i:e. Mercer Park' />
            </div>
            break;
        case 4:
            currentComponent = <div className="CreateGroup-View3">
                <h3 className="CreateGroup-h3">Tell others a bit more about it</h3>
                <textarea type="text" value={description} onChange={setDescription} className="CreateGroup-textInput" id="CreateGroup-textarea" placeholder='i:e: Suburban club that meets every wednesday and friday at the courts. We love any skill level :)'></textarea>
            </div>
            break;
        case 5:
            currentComponent = <div className="CreateGroup-View4">
                <h3 className="CreateGroup-h3">Optionally, add a profile photo</h3>
                <div className="def-row">
                    <img src={`${profileImg}/-/format/jpeg/-/scale_crop/500x500/smart/`} alt="ProfileImg" className="CreateGroup-profileImg" />
                    <Widget publicKey="f4e41243b01f35b47391" onChange={imgUpload} crop='500x500' imagesOnly={true} />
                </div>
            </div>
            break;
        case 6:
            currentComponent = <div className="CreateGroup-View4">
                <h3 className="CreateGroup-h3">Optionally, add a banner img</h3>
                <div className="def-column">
                    <img src={`${bannerImg}/-/format/jpeg/-/scale_crop/1000x250/smart/`} alt="BannerImg" className="CreateGroup-bannerImg" />
                    <Widget publicKey="f4e41243b01f35b47391" onChange={imgUpload2} crop='1000x250' imagesOnly={true} />
                </div>
            </div>
            break;
    }
    if (loading) {
        return <Loading />
    }
    if (redirect) {
        return <Redirect to={redirect} />
    }
    return (
        <div className="">
            <div className="CreateGroup-body">
                <div className="CreateGroup-mainHolder">
                    <div className="CreateGroup-CurrentView">
                        {currentComponent}
                    </div>
                    <div className="Register-bottomBtn">
                        {view === 1 ? <div className='CreateGroup-filler'></div> : <button className='CreateGroup-btn CreateGroup-back' onClick={() => updateView(view - 1)}>Back</button>}
                        {view === maxView ?
                            <button className='CreateGroup-btn CreateGroup-next' onClick={submit}>Submit</button>
                            :
                            <button className={`CreateGroup-btn CreateGroup-next`} onClick={nextClick}>Next</button>
                        }
                    </div>
                </div>
            </div>
            <NavBar navbar={navbarData} />
        </div>
    )
}
