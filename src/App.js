import React, { Component, Fragment } from 'react';
import './App.css';

import Square from "./components/Square/Square";
import {boards} from "./boards/boards";

class App extends Component {
    constructor() {
        super();
        this.gridSize = 9;
        this.state = {
            start: false,
            active: [-1, -1],
            values: boards[0],
            staticSet: [],
            warn: []
        };
    }

    reset = () => {
        this.setState({
            start: false,
            gameEnd: false,
            warn: [],
            active: [-1, -1]
        })
    }

    newGame = (puzzle) => {
        const newBoard = boards[puzzle].map(row=>[...row])
        const staticSet = newBoard.reduce(
            (staticArr, row, iRow) => {
                return staticArr.concat(
                    row.reduce(
                        (set, ele, iCol)=>ele ? [...set, `${iRow}${iCol}`] : set, []
                    )
                )
            },
            []
        )
        this.setState({
            staticSet: staticSet,
            values: newBoard,
            start: true,
            gameEnd: false
        });
    }

    activateSquare = (row, col) => {
        this.setState({
            active: [row, col]
        });
    }

    mapValuesToSquares = () => {
        const {values, warn, active, staticSet} = this.state;
        return values.map((row, rNum)=>{
            return (
                <div key={`r${rNum}`}className="Row">
                    {
                        row.map((val, cNum)=> {
                            return (
                                <Square
                                    key={`${rNum}${cNum}`}
                                    value={val}
                                    onClick={()=>this.activateSquare(rNum, cNum)}
                                    isStatic={staticSet.includes(`${rNum}${cNum}`)}
                                    isActive={rNum === active[0] && cNum === active[1]}
                                    pos={[cNum, rNum]}
                                    isWarn={warn.includes(`${rNum}${cNum}`)}
                                />
                            )
                        })
                    }
                </div>
            )
        })
    }

    changeValue = (val) => {
        const {values, active} = this.state
        const [row, col] = active
        const newValues = values
        let activeAsArray = [...newValues[row][col]]
        if (activeAsArray.includes(val)) {
            activeAsArray = activeAsArray.filter(oneValue=>val !== oneValue)
        } else {
            activeAsArray.push(val)
        }
        newValues[row][col] = activeAsArray.length <= 1
            ? activeAsArray.join("")
            : activeAsArray
        if (newValues[row][col].length === 9) {
            newValues[row][col] = []
        }
        const finalNewWarnings = this.verifySection(row, col, val, newValues)
        let gameEnd = false
        if (finalNewWarnings.length === 0) {
            gameEnd = this.checkGameWin()
        }
        this.setState({
            values: newValues,
            warn: finalNewWarnings,
            gameEnd: gameEnd
        });
    }

    verifySquare = (row, col, values = this.state.values) => {
        if ([...values[row][col]].length !== 1) {
            return false
        }
        let curValue = values[row][col]
        const warnRow = values[row].reduce(
            (err, ele, iCol)=> {
                if ((!(ele.length > 1) && ele === curValue) && col !== iCol) {
                    return true
                }
                return err
            },
            false
        )
        if (warnRow) {
            return true
        }
        const warnCol = values.reduce(
            (err, ele, iRow)=> {
                if ((!(ele[col].length > 1) && ele[col] === curValue) && row !== iRow) {
                    return true
                }
                return err
            },
            false
        )
        if (warnCol) {
            return true
        }
        const boxX = (col) - (col) % 3
        const boxY = (row) - (row) % 3
        let warnBox = false
        for (let j = boxY; j < boxY + 3; j++) {
            for (let i = boxX; i < boxX + 3; i++) {
                if (
                    (!(values[j][i].length > 1) && values[j][i] === curValue)
                    && (i !== col && j !== row)
                ) {
                    warnBox = true
                }
            }
        }
        if (warnBox) {
            return true
        }
        return false
    }

    verifySection = (row, col, value, values = this.state.values) => {
        let newWarn = this.state.warn.slice(0);
        const checkSquares = []
        for (let i = 0; i < 9; i++) {
            checkSquares.push([row, i])
            checkSquares.push([i, col])
        }
        const boxX = (col) - (col) % 3
        const boxY = (row) - (row) % 3
        for (let j = boxY; j < boxY + 3; j++) {
            for (let i = boxX; i < boxX + 3; i++) {
                checkSquares.push([j, i])
            }
        }
        const warnings = checkSquares.reduce(
            (warns, coords) => {
                const stringedCoords = `${coords[0]}${coords[1]}`
                warns = warns.filter((oldWarn)=>oldWarn !== stringedCoords) // eslint-disable-line
                if (this.verifySquare(coords[0], coords[1], values)) {
                    warns.push(stringedCoords)
                }
                return warns
            },
            newWarn
        )
        return warnings
    }

    getValueSelectors = () => {
        const {values, active} = this.state;
        const [row, col] = active
        const squareValuesArray = [...values[row][col]]
        let selectors = []
        for (let i = 1; i <= 9; i++) {
            const strI = String(i)
            const pos = [(i - 1) % 3, Math.floor((i - 1) / 3)]
            selectors.push(
                <Square
                    key={`v${pos[0]}${pos[1]}`}
                    value={strI}
                    onClick={()=>{ // eslint-disable-line no-loop-func
                        this.changeValue(strI)
                    }}
                    pos={pos}
                    isActive={squareValuesArray.includes(strI)}
                />
            )
        }
        return (
            <Fragment>
                <div>
                    {selectors[0]}
                    {selectors[1]}
                    {selectors[2]}
                </div>
                <div>
                    {selectors[3]}
                    {selectors[4]}
                    {selectors[5]}
                </div>
                <div>
                    {selectors[6]}
                    {selectors[7]}
                    {selectors[8]}
                </div>
            </Fragment>
        )
    }

    checkGameWin = () => {
        const {values} = this.state
        let end = true
        values.forEach(row=>{
            row.forEach(val=>{
                if ([...val].length !== 1) {
                    end = false
                }
            })
        })
        return end
    }

    render() {
        if (this.state.start && !this.state.gameEnd) {
            return (
                <Fragment>
                    <div className="container centeredHorz">
                        <div className="board">
                            {this.mapValuesToSquares()}
                        </div>
                        {this.state.active.includes(-1) ||
                            <div className="selector">
                                {this.getValueSelectors()}
                            </div>
                        }
                    </div>
                    <button onClick={this.reset}> Reset </button>
                </Fragment>
            )
        }
        return (
            <div className="centeredHorz">
                {this.state.gameEnd &&
                        <h1> You Win! </h1>
                }
                {boards.map((board, i)=>{
                    return (
                        <button
                            key={i}
                            onClick={()=>this.newGame(i)}
                        >
                            Start Puzzle {i}
                        </button>
                    )
                })}
            </div>
        )
    }
}

export default App;
