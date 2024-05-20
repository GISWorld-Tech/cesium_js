import { cesiumAccessToken } from "./js/CesiumConfig";
import { locations } from "./js/Locations";
import { flyToLocation } from "./js/CesiumViewer";
import { Ion, Viewer, Terrain, createOsmBuildingsAsync } from "cesium";
import { createSelectElement } from "./js/DropDown";
import "cesium/Widgets/widgets.css";
import "../src/css/main.css";

// Your access token can be found at: https://cesium.com/ion/tokens.
Ion.defaultAccessToken = cesiumAccessToken;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
  terrain: Terrain.fromWorldTerrain(),
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = await createOsmBuildingsAsync();
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
