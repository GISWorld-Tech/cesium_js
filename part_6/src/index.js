import { accessToken, uriPath } from "./js/CesiumConfig.js";
import { flightData } from "./js/Coordinates.js";
import { MovingObject } from "./js/MovingObject.js";

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account

Cesium.Ion.defaultAccessToken = accessToken;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);

const movingObject = new MovingObject(viewer, flightData, 1);
movingObject.addMovableEntityToViewer(uriPath["automobile"]);

const addMovableEntity = (type, height, speed) => {
  viewer.entities.removeAll();
  const movingObject = new MovingObject(viewer, flightData, 1, height, speed);
  movingObject.addMovableEntityToViewer(uriPath[type]);
};

document
  .getElementById("btnautomobile")
  .addEventListener("click", () => addMovableEntity("automobile"));

document
  .getElementById("btnaircraft")
  .addEventListener("click", () => addMovableEntity("aircraft", 50, 10));
