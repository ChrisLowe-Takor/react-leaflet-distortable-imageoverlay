import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Map, TileLayer, ImageOverlay, Marker } from 'react-leaflet'
import L from 'leaflet'

import ReactDistortableImageOverlay from 'react-leaflet-distortable-imageoverlay';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import './index.css'

export default class App extends React.Component {

  state = {
    opacity: PropTypes.number,
    editMode: PropTypes.string,
    latLngString: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = { 
      opacity: 0.75,
      editMode: 'none',
      latLngString: ''
    }
  }

  clickRotate() {
    this.setState({ editMode: 'rotate' });
  }

  clickDistort() {
    this.setState({ editMode: 'distort' });
  }

  clickTranslate() {
    this.setState({ editMode: 'translate' });
  }

  clickScale() {
    this.setState({ editMode: 'scale' });
  }

  clickClose() {
    this.setState({ editMode: 'none' });
  }

  onCornersUpdate(corners) {
    this.setState({ latLngString: corners.toString()});
  }

  handleOpacityChange(value) {
    this.setState({
      opacity: value / 100.0
    })
  };

  render() {

    return (
      <div className="map">

        <a className="btn" href="#" onClick={this.clickRotate.bind(this)}><i className="fa fa-refresh"></i>&nbsp;&nbsp;Rotate</a>
        <a className="btn" href="#" onClick={this.clickDistort.bind(this)}>Distort</a>
        <a className="btn" href="#" onClick={this.clickTranslate.bind(this)}><i className="fa fa-arrows"></i>&nbsp;&nbsp;Translate</a>
        <a className="btn" href="#" onClick={this.clickScale.bind(this)}><i className="fa fa-expand"></i>&nbsp;&nbsp;Scale</a>
        <a className="btn" href="#" onClick={this.clickClose.bind(this)}>Lock</a>
        <p>{this.state.latLngString}</p>

        <div style={{width: '400px'}}>
        <Slider
          min={0}
          max={100}
          value={this.state.opacity * 100.0}
          onChange={this.handleOpacityChange.bind(this)}
        />
        </div>

        <Map
          bounds={[[43.786293, 15.647650,0],[43.686293, 15.547650,0]]}
        >
          <TileLayer
            noWrap={true}
            attribution=""
            url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"/>

          <ReactDistortableImageOverlay 
          	url="https://i.imgur.com/jaRqxHa.jpg"
            corners={[
              new L.latLng(43.78710550492949,15.647438805314396),
              new L.latLng(43.78710550492949,15.655914504316957),
              new L.latLng(43.78098644922989,15.647438805314396),
              new L.latLng(43.78098644922989,15.655914504316957)
            ]}
            
            onWellKnownTextUpdated={this.onCornersUpdate.bind(this)}
            opacity={this.state.opacity}
            editMode={this.state.editMode}
          />


        </Map>
      </div>
    )
  }
}