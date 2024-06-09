import { accessToken } from "./js/CesiumConfig.js";
import { coordinates } from "./js/Coordinate.js";
import { flyToLocation } from "./js/CeiumViewer.js";

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account

Cesium.Ion.defaultAccessToken = accessToken;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer("cesiumContainer");

flyToLocation(viewer, locations[0].coordinate);
