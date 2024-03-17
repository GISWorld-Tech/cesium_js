import { cesiumAccessToken, targetLocation, url } from "./cesiumConfig.js";
import { trees } from "./coordinates.js";
import { createModel } from "./CesiumFun.js";

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account
Cesium.Ion.defaultAccessToken = cesiumAccessToken;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer("cesiumContainer");

trees.features.forEach((feature) => {
  createModel(
    viewer,
    url.treeGlb,
    feature.geometry.coordinates[0],
    feature.geometry.coordinates[1],
    0
  );
});

// Fly the camera to San Francisco at the given longitude, latitude, and height.
viewer.camera.flyTo(targetLocation);
