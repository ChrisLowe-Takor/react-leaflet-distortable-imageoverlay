import { MapLayer, withLeaflet } from 'react-leaflet';
import PropTypes from 'prop-types';

import './lib/leaflet-distortableimage';
import './lib/leaflet-path-transform';
import L from 'leaflet';

type Props = { 
	url: PropTypes.string,
	corners: any,
	opacity: PropTypes.number,
	editMode: PropTypes.string,     // 'rotate', 'distort', 'translate' or 'scale'
	onUpdate: (corners) => void;
} & MapLayerProps;

class ReactDistortableImageOverlayMapLayer extends MapLayer<LeafletElement, Props> {

	createLeafletElement(props: Props): LeafletElement {
		this.distortableImage = new L.DistortableImageOverlay(props.url, this.getOptions(props));
		this.originalCorners = props.corners;
		//console.log("Creato Leaflet element")

		L.DomEvent.on(this.distortableImage, 'load', () => {
			this.distortableImage._image.style.opacity = this.props.opacity;
			this.handleEditModeState(props.editMode);
			
		}, this.distortableImage);

		this.distortableImage.on('edit', (update) => {
			this.props.onUpdate(update.sourceTarget._corners);
		}, this.distortableImage);

		return this.distortableImage;
	}

	updateLeafletElement(fromProps, toProps) {

		if (fromProps.corners !== toProps.corners) {
			console.log('Corners changed!')
		} else {
			//console.log('Corners did not change!')
		}


 		// Keep map ref before removing so we can addLayer when the LeafletElement is recreated
		var map = this.distortableImage._map;
		map.removeLayer(this.distortableImage)
		this.distortableImage.onRemove();

		// The translation state behaves differently from the rotate and distort (uses leaflet-path-transform)
		// We hold the translated corners in a local var and wipe it after each translation
		if (this.translateUpdateCorners !== undefined) {
			this.distortableImage = new L.DistortableImageOverlay(toProps.url, { corners: this.translateUpdateCorners });
			this.translateUpdateCorners = undefined;
		} else {
			this.distortableImage = new L.DistortableImageOverlay(toProps.url, this.getOptions(toProps));
		}

		// Apply opacity after the image loads
		L.DomEvent.on(this.distortableImage, 'load', () => {
			this.distortableImage._image.style.opacity = this.props.opacity;
		}, this.distortableImage);

		// Re-add the update listener
		this.distortableImage.on('edit', (update) => {
			this.props.onUpdate(update.sourceTarget._corners);
		}, this.distortableImage);

		map.addLayer(this.distortableImage);

		this.endTranslate();
		this.handleEditModeState(toProps.editMode);
	}

	handleEditModeState(editMode) {
		switch (editMode) {
			case 'rotate':
				this.distortableImage.editing.enable();
				this.distortableImage.editing._toggleRotateDistort();
				this.distortableImage._image.style.opacity = this.props.opacity;
				break;

			case 'distort':
				this.distortableImage.editing.enable();
				this.distortableImage._image.style.opacity = this.props.opacity;
				break;

			case 'translate':
				this.startTranslate();
				break;

			case 'scale':
				this.distortableImage.editing.enable();
				this.distortableImage.editing._toggleScale();
				this.distortableImage._image.style.opacity = this.props.opacity;
				break;

			default:
				this.distortableImage.editing.disable();
				this.distortableImage._image.style.opacity = this.props.opacity;
		}
	}

	startTranslate() {
		var map = this.distortableImage._map;
		var corners = this.distortableImage.getCorners();

		// DistortableImageOverlay corners have different ordering from L.Polygon bounds
		var polygonDragCorners = [ corners[0], corners[1], corners[3], corners[2] ]
	
		this.translatePolygon = new L.Polygon(polygonDragCorners, { draggable: true, transform: true, color: 'red', fill: true });
		this.distortableImage._image.style.opacity = this.props.opacity;
		this.translatePolygon.transform.enable();

		this.translatePolygon.on('dragend', (event) => {
	
			var latlngs = event.target.getLatLngs()[0];
			var newImageCorners = [latlngs[0], latlngs[1], latlngs[3], latlngs[2]];

			// Without this timeout it crashes trying to access the map ref of a removed element.
			// Not sure why..
			setTimeout( () => { this.props.onUpdate(newImageCorners) }, 10);
			map.removeLayer(this.distortableImage);

			this.distortableImage = new L.DistortableImageOverlay(this.props.url, { corners: newImageCorners });
			this.distortableImage.addTo(map);
			this.distortableImage._image.style.opacity = this.props.opacity;

			this.translateUpdateCorners = newImageCorners;
		})

		this.translatePolygon.addTo(map);
	}

	endTranslate() {
		var map = this.distortableImage._map;
		if (this.translatePolygon) {
			map.removeLayer(this.translatePolygon);
		}
	}
}

export default withLeaflet(ReactDistortableImageOverlayMapLayer);