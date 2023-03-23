import React from "react"
import { Component } from "react"

import { controlsProps } from "./types";


class Controls extends Component {
    props;

    constructor(props: controlsProps) {
        super(props);
        this.props = props;

        this.onChange = this.onChange.bind(this);
    }

    onChange(index: number) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const val = parseFloat( event.currentTarget.value )
            this.props.setParams(val, index);
        }
    }

    createInput(val: number, n: number) {
        return (
            <div className="input_row" key={`row_${n}`}>
                <input
                    step="0.01"
                    type="range"
                    min="-6"
                    max="6"
                    value={val}
                    onChange={this.onChange(n)}
                    onDoubleClick={() => this.props.setParams(0, n)}
                    />
                <input
                    step="0.01"
                    type="number"
                    min="-6"
                    max="6"
                    value={val}
                    onChange={this.onChange(n)}
                    onDoubleClick={() => this.props.setParams(0, n)}
                />
            </div>
        )
    }

    render() {
        return (
            <div className="control_panel">
                { this.props.controls_hidden? null : 
                    <div className="body">
                        {this.props.params.map((val: number, index: number) => this.createInput(val, index))}
                        <div className="input_row">
                            <button onClick={() => this.props.setColorScheme(0)}>1</button>
                            <button onClick={() => this.props.setColorScheme(1)}>2</button>
                            <button onClick={() => this.props.setColorScheme(2)}>3</button>
                            <button onClick={() => this.props.setColorScheme(3)}>4</button>
                            <button onClick={() => this.props.setColorScheme(4)}>5</button>
                        </div>
                    </div>
                }
                <div className="close" onClick={this.props.toggleControls}></div>
            </div>
        )
    };
}

export default Controls;
