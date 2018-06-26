import React from 'react';
import PropTypes from "prop-types";
import "./Square.css";

const Square = (props) => {
    const {onClick, value, isWarn, pos, isActive, isStatic} = props;
    return (
        <div
            className={
                `sq sq${pos[0] % 3}${pos[1] % 3}
                ${isActive ? "active" : ""}
                ${isWarn ? "warn" : ""}
            `}
            onClick={()=>{
                if (!isStatic) {
                    onClick()
                }
            }}
        >
            <div
                className={`
                    text
                    ${isStatic ? "static" : ""}
                    ${Array.isArray(value) ? "super" : ""}
                `}
            >
                {[...value].join("")}
            </div>
        </div>
    )
}

Square.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
    pos: PropTypes.array,
    isStatic: PropTypes.bool,
    isWarn: PropTypes.bool
}

export default Square;

