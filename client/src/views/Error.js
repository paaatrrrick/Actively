
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../resources/stylesheets/Error.css"



export default class Error extends Component {
    render() {
        return (
            <div className="Error-body">
                <div class="Error-main">
                    <h1 id='Error-h1'>Uh Oh, we had an error 🤭</h1>
                    <h3 className='Error-h3'>Sorry that we suck at coding</h3>
                    <Link to="/login" id="Error-btn">Click to go back</Link>
                </div >
            </div>
        )
    }
}