// mapFeature.js

import L from 'leaflet';

class MapFeature {
  constructor(mapElementId) {
    this.map = null;
    this.mapElementId = mapElementId;
    this.marker = null;
    this.polyline = null;
  }

  init(center, zoom = 11) {
    this.map = L.map(this.mapElementId).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  setMarker(position, popupContent) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker(position).addTo(this.map);
    if (popupContent) {
      this.marker.bindPopup(popupContent);
    }
  }

  updateTrafficData(trafficData) {
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }
    if (trafficData && trafficData.route) {
      const color = this.getTrafficColor(trafficData.congestion);
      this.polyline = L.polyline(trafficData.route, {
        color: color,
        weight: 5,
        opacity: 0.7
      }).addTo(this.map);
      this.polyline.bindPopup(`Traffic congestion: ${trafficData.congestion}`);
      this.map.fitBounds(this.polyline.getBounds());
    }
  }

  getTrafficColor(congestion) {
    switch (congestion) {
      case 'low':
        return 'green';
      case 'moderate':
        return 'yellow';
      case 'high':
        return 'red';
      default:
        return 'blue';
    }
  }
}

export default MapFeature;
