import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ReactDistortableImageOverlayMapLayer from './react-distortable-imageoverlay-maplayer';
import L from 'leaflet';


type Props = {
  url: PropTypes.string,
  corners: [L.latlng, L.latlng, L.latlng, L.latlng],
  editMode: PropTypes.string,
  opacity: PropTypes.number,
  onCornersUpdated: (corners) => void;
  onWellKnownTextUpdated: (corners) => void;
}

// This class acts as a geometry state container for the Leaflet MapLayer component.
// The corners of the ImageOverlay are passed in as props, held as state and changes
// are passed upstream with the `onCornersUpdated` method
export default class ReactDistortableImageOverlay extends React.Component {

  state = {
    corners: [L.latlng, L.latlng, L.latlng, L.latlng],
  }

  constructor(props) {
    super(props);
    this.state = { 
      corners: props.corners
    }
  }

  onUpdate(corners) {
    
    // Prevents leaflet-distortableimage from firing as edits are taking place
    if (corners === undefined || corners[0] === undefined) return
    
    if (this.props.onCornersUpdated !== undefined) {
      this.props.onCornersUpdated(corners);
    }

    if (this.props.onWellKnownTextUpdated !== undefined) {
      
      // WKT needs to close off the polygon, also switch the BR & BL 
      var swappedLatLngs = [ corners[0], corners[1], corners[3], corners[2], corners[0] ];
      var flattenedLatLngs = swappedLatLngs.map(x => x.lng + ' ' + x.lat)
      this.props.onWellKnownTextUpdated('POLYGON((' + flattenedLatLngs.join(', ') + '))');
    }

    this.setState({
      corners: corners
    });
  }

  render() {

    return (
      <ReactDistortableImageOverlayMapLayer 
        url={this.props.url}
        opacity={this.props.opacity}
        corners={this.state.corners}
        editMode={this.props.editMode}
        onUpdate={this.onUpdate.bind(this)}
      />
    )
  }
}