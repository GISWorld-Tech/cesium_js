import { accessToken, uriPath } from "./js/CesiumConfig.js";
import { flightData } from "./js/Coordinates.js";
import { MovingObject } from "./js/MovingObject.js";

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account

Cesium.Ion.defaultAccessToken = accessToken;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer("cesiumContainer");

const movingObject = new MovingObject(viewer, flightData, 1);
movingObject.addMovableEntityToViewer(uriPath["aircraft"]);
