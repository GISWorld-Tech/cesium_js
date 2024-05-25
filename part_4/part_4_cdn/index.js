import { accessToken } from "./js/CesiumConfig.js";
import { locations } from "./js/Location.js";
import { createSelectElement } from "./js/DropDown.js";
import { flyToLocation } from "./js/CeiumViewer.js";

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

const options = Object.keys(locations).map((key) => ({
  value: key,
  textContent: locations[key].cityName,
}));

const dropdown = createSelectElement(options, "toolbar");

flyToLocation(viewer, locations[0].coordinate);

if (dropdown) {
  dropdown.addEventListener("change", (event) => {
    const selectedIndex = event.target.value;
    const selectedLocation = Object.values(locations)[selectedIndex].coordinate;
    flyToLocation(viewer, selectedLocation);
  });
}
