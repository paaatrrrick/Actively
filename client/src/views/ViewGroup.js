import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Loading from './Loading';
import "../resources/stylesheets/ViewGroup.css";
import fetchChecks from './helperfunctions/fetchChecks';

export default class ViewGroup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            navbarData: {},
            showingFriends: [],
            group: {},
            inGroup: false
        }
        this.friendUpdate = this.friendUpdate.bind(this)
        this.searchFriend = this.searchFriend.bind(this)
        this.joinGroup = this.joinGroup.bind(this)
    }


    componentDidMount() {
        this.searchFriend()
    }

    async joinGroup() {
        console.log('clicked')
        var location = 'joingroup';
        console.log(this.state.inGroup);
        console.log(this.state.group)
        console.log(this.state.group._id)
        if (this.state.inGroup) {
            location = 'leavegroup';
        }
        const response = await fetch(`/api/${location}`, {
            method: 'POST',
            headers: {
                "x-access'token": window.localStorage.getItem('token'), 'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.group._id
            }),
        })
        console.log('returned1')

        const data = await response.json();
        fetchChecks(data);
        const opposite = !this.state.inGroup;
        this.setState({
            inGroup: opposite
        })
        console.log('returned')
    }

    async friendUpdate(id, index, isFriend) {
        var location = (isFriend ? 'removeFriend' : 'addFriend');
        const response = await fetch(`/api/${location}`, {
            method: 'POST',
            headers: {
                "x-access'token": window.localStorage.getItem('token'), 'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            }),
        })
        const data = await response.json();
        fetchChecks(data);
        var duplicate = this.state.showingFriends;
        duplicate[index].isFriend = !this.state.showingFriends[index].isFriend;
        this.setState({
            showingFriends: duplicate
        })
    }

    async searchFriend() {
        console.log('searching')
        const response = await fetch(`/api/group/${this.props.match.params.id}`, { headers: { "x-access'token": window.localStorage.getItem('token') } })
        const data = await response.json();
        fetchChecks(data);
        this.setState({
            showingFriends: data.returnData,
            group: data.currentGroup,
            navbarData: data.navbarData,
            inGroup: data.currentGroup.participantId.includes(data.currentId),
            loading: false
        })
    }

    render() {
        if (this.state.loading) {
            return <Loading />
        }
        const tab = this.state.showingFriends.map((friendTab, index) => (
            <div className="Friend-friendDiv" key={`Friend-${friendTab}`}>
                <Link to={`/profile/${friendTab.id}`} className='Friend-leftside'>
                    <img src={`${friendTab.icon}/-/format/jpeg/-/scale_crop/200x200/smart/`} alt="Profile Img" className='ViewGroup-FriendImg' />
                    <h3>{friendTab.first} {friendTab.last}</h3>
                </Link>
                <button
                    onClick={() => this.friendUpdate(friendTab.id, index, friendTab.isFriend)}
                    className={(friendTab.isFriend ? 'Friend-friend Friend-remove' : 'Friend-friend Friend-add')}>
                    {(friendTab.isFriend ? 'Unfriend' : 'Friend')}
                </button>
            </div>
        ))
        return (
            <div className="">
                <div className="ViewGroup-highest">
                    <div className="ViewGroup-body">
                        <div className="ViewGroup-container1">
                            <div className="ViewGroup-images">
                                <img src={`${this.state.group.bannerImg}/-/format/jpeg/-/scale_crop/1000x250/smart/`} className="ViewGroup-bannerImg" />
                                <img src={`${this.state.group.iconImg}/-/format/jpeg/-/scale_crop/100x100/smart/`} className="ViewGroup-iconImg" />
                            </div>
                            <div className="ViewGroup-conentholder">
                                <div className="ViewGroup-TopText">
                                    <div className="def-row">
                                        <h1 className='ViewGroup-h1'>{this.state.group.name}</h1>
                                        <button
                                            onClick={() => this.joinGroup()}
                                            className={(this.state.inGroup ? 'Friend-friend Friend-remove ViewGroup-ml' : 'Friend-friend Friend-add ViewGroup-ml')}>
                                            {(this.state.inGroup ? 'Leave' : 'Join')}
                                        </button>
                                    </div>
                                    <h3 className="ViewGroup-h3">{`${this.state.group.sportType} - Usually at ${this.state.group.usualLocation}`}</h3>
                                    <p className="ViewGroup-p">{this.state.group.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="ViewGroup-container2">
                            <div className="ViewGroup-contentholder2">
                                <h1 className='ViewGroup-h1'>Members</h1>
                                <hr className='ViewGroup-hr' />
                                <div className="ViewGroup-membersList">
                                    {tab}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <NavBar navbar={this.state.navbarData} />
            </div >
        )
    }
}