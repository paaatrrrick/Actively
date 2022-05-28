import { useState } from 'react';

export default initialVal => {
    const [value, setValue] = useState(initialVal);
    const handleChange = e => {
        e.target.classList.add('def-goodInput');
        setValue(e.target.value);
    }
    const reset = () => {
        setValue(initialVal)
    }
    return [value, handleChange, reset]
}