import React from 'react';

export default function Flash(props) {

    const disapearG = () => {
        const element = document.getElementById('holderG')
        element.classList.add('def-vanish')
    }

    return (
        <div className="">
            {props.bad
                ?
                <div className="def-flashHolder" id='holderG'>
                    <div className="def-innerFlash def-innerR">
                        <p className="def-flashText def-textR">
                            {props.text}
                        </p>
                        <button className="def-flashBtn def-btnR" onClick={disapearG}>X</button>
                    </div>
                </div>
                :
                <div className="def-flashHolder" id='def-holderG'>
                    <div className="def-innerFlash def-innerG">
                        <p className="def-flashText def-textG">
                            {props.text}
                        </p>
                        <button className="def-flashBtn def-btnG" onClick={disapearG}>X</button>
                    </div>
                </div>
            }
        </div>
    )
}
