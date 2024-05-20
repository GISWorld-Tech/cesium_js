import { cesiumAccessToken } from "./js/CesiumConfig";
import { locations } from "./js/Locations";
import {
  Ion,
  Viewer,
  Terrain,
  createOsmBuildingsAsync,
  Cartesian3,
  Math,
} from "cesium";
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

// Fly the camera to San Francisco at the given longitude, latitude, and height.
function flyToLocation(location) {
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(...location.coordinate),
    orientation: {
      heading: Math.toRadians(0.0),
      pitch: Math.toRadians(-15.0),
    },
  });
}

flyToLocation(locations[0]);

// Connect the locations to dropdown and flyTo
const dropdown = document.getElementById("dropdown");
console.log(dropdown.value);

dropdown.addEventListener("change", () => {
  const selectedIndex = dropdown.value;
  console.log(selectedIndex);
  const selectedLocation = locations[selectedIndex];
  flyToLocation(selectedLocation);
});
