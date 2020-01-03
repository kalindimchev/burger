import React from 'react';
import classes from './Input.css';

const input = props => {
    let inputElement = null;
    const inputClassesArr = [classes.InputElement];
    if (props.invalid && props.shouldValidate && props.touched) {
        inputClassesArr.push(classes.Invalid);
    }

    const inputClasses = inputClassesArr.join(' ');
    switch (props.elementType) {
        case ('input'): 
            inputElement = <input 
                    className={inputClasses} 
                    {...props.elementConfig} 
                    value={props.value}
                    onChange={props.changed}/>;
            break;
        case ('textarea'): 
            inputElement = <textarea 
                    className={inputClasses} 
                    {...props.elementConfig} 
                    value={props.value}
                    onChange={props.changed}/>;
            break;
        case ('select'): 
            inputElement = (
                <select 
                    className={inputClasses}
                    value={props.value}
                    onChange={props.changed}>
                    {props.elementConfig.options.map(op => {
                        return <option
                            key={op.value} 
                            value={op.value}>
                                {op.displayValue}
                            </option>
                    })}
                </select>
            )
            break;
        default: 
            inputElement = <input className={classes.InputElement}/>
            break;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    )
}

export default input;