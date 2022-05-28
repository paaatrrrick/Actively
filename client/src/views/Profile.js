import React, { useState, useEffect } from 'react';
import "../resources/stylesheets/Profile.css"
import "../resources/stylesheets/default.css"
import fetchChecks from './helperfunctions/fetchChecks';
import Loading from './Loading';
import NavBar from './NavBar';
import fbImg from '../resources/images/fb.png'
import igImg from '../resources/images/ig.png'
import { Widget } from "@uploadcare/react-widget";
import useInputState from './hooks/profileInput'
import { Redirect } from 'react-router-dom';



export default function Profile() {
    const [redirect, changeRedirect] = useState(false);
    const [loading, changeLoading] = useState(true);
    const [navbarData, updateNavBarData] = useState(false);
    const [user, updateUser] = useState();
    const [img, SetImg, updateImg, delImg] = useInputState();
    const [fb, fbSet, fbUpdate, fbDel] = useInputState();
    const [ig, igSet, igUpdate, igDel] = useInputState();
    const [notifcation, notifcationSet, notifcationUpdate, notifcationDel] = useInputState();
    const [publicSocials, publicSocialsSet, publicSocialsUpdate, publicSocialsDel] = useInputState();
    const [age, ageSet, ageUpdate, ageDel] = useInputState(0);
    const [bio, bioSet, bioUpdate, bioDel] = useInputState();
    const checkLogin = async () => {
        const response = await fetch('/profile', { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        changeLoading(false);
        updateNavBarData(data.navbarData);
        updateUser(data.user)
        SetImg(data.user.profileImg);
        fbSet(data.user.facebookLink);
        igSet(data.user.instagramLink);
        notifcationSet(data.user.notifcations);
        ageSet(data.user.age);
        publicSocialsSet(data.user.publicSocials)
        bioSet(data.user.profileBio);
    }

    const post = async (e) => {
        e.preventDefault();
        const data = {
            description: bio,
            instagram: ig,
            facebook: fb,
            age: age,
            shareNumber: publicSocials,
            notifcation: notifcation,
            idUrl: img
        }
        const response = await fetch('/profileinfo', { method: 'POST', headers: { "x-access'token": window.localStorage.getItem('token'), 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        const res = await response.json();
        fetchChecks(res);
        changeRedirect(true);
        delImg();
        fbDel();
        igDel();
        notifcationDel();
        publicSocialsDel();
        ageDel();
        bioDel();
    }

    const notifChange = (e) => {
        if (e.target.checked) {
            notifcationSet(true)

        } else {
            notifcationSet(false)
        }
    }


    const socialChange = (e) => {
        if (e.target.checked) {
            publicSocialsSet(true)

        } else {
            publicSocialsSet(false)
        }
    }

    const imgUpload = (e) => {
        SetImg(e.originalUrl)
    }

    useEffect(() => {
        checkLogin();
    }, [redirect])

    if (loading) {
        return <Loading />
    }
    return (
        <div className="">
            <div className="Profile-body">
                {redirect ? <Redirect to="/dashboard" /> : <h3></h3>}
                <div className="Profile-mainHolder">
                    <div className="Profile-topSection">
                        <div id='parent' className='Profile-parent'>
                            <img src={`${img}/-/format/jpeg/-/scale_crop/500x500/smart/`} alt="" id="Profile-preview" />
                            <Widget publicKey="f4e41243b01f35b47391" onChange={imgUpload} crop='300x300' imagesOnly={true} />
                        </div>
                        <div className="def-column">
                            <div className="Profile-row2Column">
                                <h1 id='first' className="Profile-h1">
                                    {user.firstName}
                                </h1>
                                <h1 className="Profile-h1">
                                    {user.lastName}
                                </h1>
                            </div>
                            <div className="Profile-socialMediaHolder">
                                <div className="def-row def0alignCenter Profile-socialDiv Profile-instagramDiv">
                                    <img src={igImg} alt="ig" className='Profile-social' />
                                    <input type="text" name="instagram" className="Profile-socialInput"
                                        id="instagram" onChange={igUpdate}
                                        value={ig ? ig : 'link your instagram'} />
                                </div>
                                <div className="def-row def-alignCenter Profile-socialDiv Profile-facebookDiv">
                                    <img src={fbImg} alt="facebook" className="Profile-social" />
                                    <input type="text" name="facebook" className="Profile-socialInput"
                                        id="facebook" onChange={fbUpdate}
                                        value={fb ? fb : 'link your facebook'} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="def-column Profile-w100">
                        <h2 className="Profile-inputLabel Profile-h2">Biography:</h2>
                        <textarea name="description" id="description" cols="98" rows="3" value={bio ? bio : 'Share about your sports interests.'} onChange={bioUpdate}
                            className="Profile-input1"></textarea>
                    </div>
                    <div className="Profile-cityAge Profile-w100 Profile-m">
                        <div className="Profile-inputRow">
                            <h2 className="Profile-inputLabel Profile-mr Profile-h2">
                                {user.city}, {user.state}
                            </h2>
                        </div>
                        <div className="Profile-inputRow Profile-ageHolder">
                            <h2 className="Profile-inputLabel Profile-mr Profile-h2">Age:</h2>
                            <input type="number" name="age" id="age" value={age}
                                className="Profile-input1" onChange={ageUpdate} min='0' max='99' style={{ width: "80px" }} />
                        </div>
                    </div>


                    <div className="Profile-sliderDiv">
                        <div className="def-row Profile-sliderRow">
                            <label className='Profile-label'>
                                <input type="checkbox" checked={publicSocials} onChange={socialChange} id='shareNumber'
                                    name='shareNumber' />
                                <span>
                                    <i></i>
                                </span>
                            </label>
                            <h4 className="Profile-h4">Show Phone Number</h4>
                        </div>
                        <div className="def-row def-sliderRow">
                            <label className='Profile-label'>

                                <input type="checkbox" checked={notifcation} onChange={notifChange} id='notifcations'
                                    name='notifcations' />
                                <span>
                                    <i></i>
                                </span>
                            </label>
                            <h4 className="Profile-h4">Get Text Notifications</h4>
                        </div>
                    </div>
                    <div id="btnHolder">
                        <button id='submitBtn' className="def-btn" onClick={post}>Save Changes</button>
                    </div>
                </div>
            </div >
            <NavBar navbar={navbarData} />
        </div >
    )
}
