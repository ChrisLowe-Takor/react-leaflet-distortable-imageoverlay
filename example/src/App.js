import React from 'react'
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet'
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
    console.log(corners);
  }

  onWellKnownTextUpdated(wkt) {
    console.log(wkt);
  }

  handleOpacityChange(value) {
    this.setState({
      opacity: value / 100.0
    })
  };

  render() {

    return (
      <div className="map">

        <div className="center logo-container">
          <img className="logo" src="https://chrislowe-takor.github.io/react-leaflet-distortable-imageoverlay/soar_logo.png"></img>
          <p>How well can you place this drone image on the Soar supermap?<br></br>  Use the rotate, scale, translate and distort tools to find out.</p>
        </div>

        <div className="center tool-container">
          <button className={this.state.editMode === 'rotate' ? 'btn enabled' : 'btn' } href="#" onClick={this.clickRotate.bind(this)}><i className="fa fa-refresh"></i><span class="tool-text">Rotate</span></button>
          <button className={this.state.editMode === 'distort' ? 'btn enabled' : 'btn' } href="#" onClick={this.clickDistort.bind(this)}><i className="fa fa-object-group"></i><span class="tool-text">Distort</span></button>
          <button className={this.state.editMode === 'translate' ? 'btn enabled' : 'btn' } href="#" onClick={this.clickTranslate.bind(this)}><i className="fa fa-arrows"></i><span class="tool-text">Translate</span></button>
          <button className={this.state.editMode === 'scale' ? 'btn enabled' : 'btn' } href="#" onClick={this.clickScale.bind(this)}><i className="fa fa-expand"></i><span class="tool-text">Scale</span></button>
          <button className="btn" href="#" onClick={this.clickClose.bind(this)}><i className="fa fa-lock"></i><span class="tool-text">Lock</span></button>

          <div className="opacity-container">
          <h4>Opacity:</h4>
          <Slider
            min={0}
            max={100}
            value={this.state.opacity * 100.0}
            onChange={this.handleOpacityChange.bind(this)}
          />
          </div>

        </div>

        <Map
          bounds={[[43.788434, 15.644610,0],[43.775297, 15.660593,0]]}
        >
          <TileLayer
            noWrap={true}
            attribution=""
            url="https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"/>

          <ReactDistortableImageOverlay 
          	url="https://i.imgur.com/jaRqxHa.jpg"
            corners={[
              new L.latLng(43.78710550492949,15.647438805314396),
              new L.latLng(43.78710550492949,15.655914504316957),
              new L.latLng(43.78098644922989,15.647438805314396),
              new L.latLng(43.78098644922989,15.655914504316957)
            ]}
            
            onCornersUpdate={this.onCornersUpdate.bind(this)}
            onWellKnownTextUpdated={this.onWellKnownTextUpdated.bind(this)}
            opacity={this.state.opacity}
            editMode={this.state.editMode}
          />


        </Map>
      </div>
    )
  }
}