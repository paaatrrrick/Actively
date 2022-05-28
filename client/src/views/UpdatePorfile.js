import React, { useState } from 'react';
import useInputState from './hooks/useInput'

export default function Input() {
    // const [email, setEmail] = useState("");
    // const handleChange = e => {
    //     setEmail(e.target.value);
    // }
    const [email, updateEmail, resetEmail] = useInputState("");
    return (
        <div className="">
            <h1>Value is.. {email}</h1>
            <input type="text" name="" id="" onChange={updateEmail} value={email} />
            <button></button>
            {/* <input type="text" value={email} onChange={handleChange} /> */}
            {/* <button onClick={() => setEmail("")}>Submit</button> */}
        </div>
    )
}