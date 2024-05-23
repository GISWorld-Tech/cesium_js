import { cesiumAccessToken } from "./js/CesiumConfig.js";
import { locations } from "./js/Locations.js";
import { flyToLocation } from "./js/CesiumViewer.js";
import { createSelectElement } from "./js/DropDown.js";

// Your access token can be found at: https://cesium.com/ion/tokens.
Cesium.Ion.defaultAccessToken = cesiumAccessToken;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);

flyToLocation(viewer, locations[0].coordinate);

// Create select options from location keys
const options = Object.keys(locations).map((key) => ({
  value: key,
  text: locations[key].cityName,
}));

// Create the select element in the toolbar and get the reference
const dropdown = createSelectElement(options, "toolbar");

// Add event listener for select change if dropdown was successfully created
if (dropdown) {
  dropdown.addEventListener("change", (event) => {
    const selectedIndex = event.target.value;
    const selectedLocation = Object.values(locations)[selectedIndex].coordinate;
    flyToLocation(viewer, selectedLocation);
  });
}
