import React, { Component } from "react"
import PropTypes from "prop-types"

class Block extends Component {
    render() {
        return (
            <div>
                <Square
                    blockX=0
                    blocky=0
                />
            </div>
        )
    }
}

Square.propTypes = {
    gridX: PropTypes.number,
    gridY: PropTypes.number,
}

export default Block
