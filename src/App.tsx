import React, { Component } from "react";

import Controls from "./controls";
import Main from "./main";
import './App.css';


class NewtonFractal extends Component {
  state = {
    params: [1, -1, 0, 1, 0, 1],
    color_scheme: 2,
    controls_hidden: false,
    githubIconHighlight: false
  };

  instance: Main;

  // ============ LIFECYCLE ============
  
  componentDidMount() {
    this.instance = new Main(this.state);
  }

  // ========== STATE CONTROL ==========
  
  setParams(value: number, index: number) {
    const newParams = [...this.state.params];
    newParams[index] = value;

    this.setState({params: newParams});

    this.instance.update(newParams);
    this.instance.render();
  }

  setColorScheme(value: number) {
    this.setState({color_scheme: value})

    this.instance.updateColors(value);
    this.instance.render();
  }

  toggleControls() {
    const val = ! this.state.controls_hidden;
    this.setState({controls_hidden: val});
  }

  render() {
    return (
      <>
        <a href="https://github.com/AustereTriceratops/newton-fractals">
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'white',
              margin: '1rem',
              padding: '0.2rem',
              borderRadius: '0.5rem', 
              opacity: this.state.githubIconHighlight ? '100%' : '80%',
              boxShadow: '0px 0px 10px 2px rgba(0.1, 0.05, 0.05, 0.8)'
            }}
            onMouseOver={() => this.setState({githubIconHighlight: true})}
            onMouseLeave={() => this.setState({githubIconHighlight: false})}
          >
            <img src={require('./githubicon.svg').default} width={32} height={32}/>
          </div>
        </a>
        <Controls
          params={this.state.params}
          setParams={this.setParams.bind(this)}
          setColorScheme={this.setColorScheme.bind(this)}
          controls_hidden={this.state.controls_hidden}
          toggleControls={this.toggleControls.bind(this)}
        />
        <div
          className="canvas-wrapper"
          id="canvas"
        />
      </>
    );
  }
}

export default NewtonFractal;
