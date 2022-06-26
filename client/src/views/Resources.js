import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../resources/stylesheets/Resources.css"



export default class Resources extends Component {
    render() {
        return (
            <div className="Resources">
                <Link to="/home" className="Resources-nav-link" id='a'>Go Back</Link>
                <h1 className='Resources-h1'>Thank you for all of the help with the photos</h1>
                <h3>Check these artists out:</h3>
                <a href="https://storyset.com/people">People illustrations by Storyset</a>

                <a href="https://storyset.com/sport">Sport illustrations by Storyset</a>

                <a href="https://storyset.com/people">People illustrations by Storyset</a>

                <a href="https://storyset.com/team">Team illustrations by Storyset</a>
                <a href='https://www.freepik.com/vectors/icon-pack'>Icon pack vector created by muammark - www.freepik.com</a>
                <a href='https://www.freepik.com/vectors/sports-balls'>Sports balls vector created by macrovector_official - www.freepik.com</a>

                <a href="https://storyset.com/sport">Sport illustrations by Storyset</a>
                <div className="Resources-section"> <a href="https://icons8.com/icon/24533/squash-racquet">Squash Racquet</a> icon
                    by <a href="https://icons8.com">Icons8</a></div>
                <div className="Resources-section"> <a href="https://icons8.com/icon/74343/racket">Racket</a> icon by <a
                    href="https://icons8.com">Icons8</a></div>
                <div className="Resources-section"> <a href="https://icons8.com/icon/a8PyBWawy3IK/football">Football</a> icon by
                    <a href="https://icons8.com">Icons8</a>
                </div>
                <div className="Resources-section"> <a href="https://icons8.com/icon/I9JPWlgmgdyF/soccer">Soccer</a> icon by <a
                    href="https://icons8.com">Icons8</a></div>
                <div className="Resources-section"> <a href="https://icons8.com/icon/u3US_jEMT66g/ping-pong">Ping Pong</a> icon by
                    <a href="https://icons8.com">Icons8</a>
                </div>
                <div className="section"> <a href="https://icons8.com/icon/48881/basketball">Basketball</a> icon by <a
                    href="https://icons8.com">Icons8</a></div>
                <div className="Resources-section"> <a href="https://icons8.com/icon/2865/volleyball">Volleyball</a> icon by <a
                    href="https://icons8.com">Icons8</a></div>
                <div className="Resources-section"> <a href="https://icons8.com/icon/xMbrbPbcPBA6/ball">Ball</a> icon by <a
                    href="https://icons8.com">Icons8</a></div>
                <a href="https://icons8.com/icon/VYZOATN3aG7T/add-friend">Add Friend</a> icon by <a
                    href="https://icons8.com">Icons8</a>
                <a target="_blank" href="https://icons8.com/icon/G01ACMKXfdpJ/trash">Trash</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
            </div>
        )
    }
}