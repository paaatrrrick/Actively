import React, { Component } from 'react';
import NavBar from './NavBar';
import Loading from './Loading';
import ig from '../resources/images/ig.png'
import fb from '../resources/images/fb.png'
import fetchChecks from './helperfunctions/fetchChecks';
import "../resources/stylesheets/ViewProfile.css"
import "../resources/stylesheets/default.css"


export default class ViewProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navbarData: '',
            isFriend: true,
            loading: true,
            user: '',
        }
        this.friendUpdate = this.friendUpdate.bind(this);
        this.fetchProfile = this.fetchProfile.bind(this);
    }
    friendUpdate() {
        console.log('at friend update')
        var location = 'addFriend';
        if (this.state.isFriend) {
            location = 'removeFriend';
        }
        fetch(`/api/${location}`, {
            method: 'POST',
            headers: {
                "x-access'token": window.localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.props.match.params.id,
            })
        })
            .then(res => res.json())
            .then(data => {
                fetchChecks(data);
                const antiFriend = !this.state.isFriend;
                this.setState({
                    isFriend: antiFriend
                })
            })
            .catch((error) => {
                console.log("Error");
                console.log(error);
            })
    }

    async fetchProfile() {
        const response = await fetch(`/api/profile/${this.props.match.params.id}`, { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        this.setState({
            user: data.user,
            isFriend: data.isFriend,
            navbarData: data.navbarData,
            loading: false
        });
    }
    componentDidMount() {
        this.fetchProfile();
    }

    render() {
        return (
            <div>
                {this.state.loading ? (
                    <Loading />
                ) : (
                    <div className="">
                        <NavBar navbar={this.state.navbarData} />
                        <div className="ViewProfile-body">
                            <div className="ViewProfile-mainHolder">
                                <div className="ViewProfile-topSection">
                                    <div id='parent'>
                                        <img src={`${this.state.user.profileImg}/-/format/jpeg/-/scale_crop/300x300/smart/`} alt="sfaf" id="preview" style={{ width: "300", height: "300" }} />
                                    </div>
                                    <div className="def-column">
                                        <div className="def-row">
                                            <div className="ViewProfile-row2Column def-alignCenter">
                                                <h1 className="ViewProfile-h1" id='first'>
                                                    {this.state.user.firstName}
                                                </h1>
                                                <h1 className="ViewProfile-h1">
                                                    {this.state.user.lastName}
                                                </h1>
                                                {this.state.isFriend
                                                    ?
                                                    <button id="removeFriend"
                                                        onClick={this.friendUpdate}
                                                        className="ViewProfile-friendBtn ViewProfile-removeFriend">
                                                        Unfriend
                                                    </button>
                                                    :
                                                    <button
                                                        id="addFriend"
                                                        onClick={this.friendUpdate}
                                                        className="ViewProfile-friendBtn ViewProfile-addFriend">
                                                        Friend+
                                                    </button>
                                                }
                                            </div>
                                        </div>

                                        <div className="ViewProfile-socialMediaHolder">
                                            <div className="def-row def-alignCenter ViewProfile-socialDiv ViewProfile-instagramDiv">
                                                <img src={ig} alt="facebook" className='ViewProfile-social' />
                                                <h6 className="ViewProfile-socialInput" id="instagram">
                                                    {(this.state.user.instagramLink && this.state.user.instagramLink != 'link your facebook') ?
                                                        this.state.user.instagramLink : 'No link shared'}
                                                </h6>
                                            </div>
                                            <div className="def-row def-alignCenter ViewProfile-socialDiv ViewProfile-facebookDiv">
                                                <img src={fb} alt="facebook" className="ViewProfile-social" />
                                                <h6 className="ViewProfile-socialInput" id="facebook">
                                                    {(this.state.user.facebookLink && this.state.user.facebookLink != 'link your facebook') ? this.state.user.facebookLink
                                                        : 'No link shared'}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="def-column ViewProfile-w100">
                                    <h2 className="ViewProfile-inputLabel ViewProfile-h2">Biography</h2>
                                    <h6 id="description" cols="8" rows="3" className="ViewProfile-input1">
                                        {(this.state.user.profileBio) ? this.state.user.profileBio : 'Share about your sports interests.'}
                                    </h6>
                                </div>
                                <div className="ViewProfile-cityAge ViewProfile-w100 ViewProfile-m">
                                    <div className="ViewProfile-inputRow">
                                        <h2 className="ViewProfile-inputLabel ViewProfile-mr ViewProfile-h2">
                                            {this.state.user.city}, {this.state.user.state}
                                        </h2>
                                    </div>
                                    <div className="ViewProfile-inputRow">
                                        <h2 className="ViewProfile-inputLabel ViewProfile-mr ViewProfile-h2">Age:</h2>
                                        <h6 className="ViewProfile-input1 ViewProfile-pr" id="age">
                                            {this.state.user.age}
                                        </h6>
                                    </div>
                                    {(this.state.user.publicSocials) ?
                                        <div className="def-row">
                                            <h2 className="ViewProfile-inputLabel ViewProfile-mr ViewProfile-h2">Number:</h2>
                                            <h6 className="ViewProfile-input1 ViewProfile-pr">
                                                {this.state.user.phoneNumber}
                                            </h6>
                                        </div>
                                        :
                                        <h1></h1>
                                    }

                                </div>
                            </div>
                        </div>

                    </div>

                )}
            </div>
        )
    }
}


