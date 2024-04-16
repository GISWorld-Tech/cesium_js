import {
    Ion,
    Viewer,
    createWorldTerrain,
    createOsmBuildings,
    Cartesian3,
    Math,
  } from "cesium";
  import "cesium/Widgets/widgets.css";
  import "../src/css/main.css";
  
  // Your access token can be found at: https://cesium.com/ion/tokens.
  // This is the default access token
  Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NzdkNTkwZS03ZjhjLTRmNjEtOWViNS04ODg2MTJiNmFiZDkiLCJpZCI6MTkxNTA0LCJpYXQiOjE3MTMyMTQ4MDR9.x0Ro6OwAYnuaVnble8kzIspyKbGXda7n4xgdrznjEjk";
  
  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  const viewer = new Viewer("cesiumContainer", {
    terrainProvider: createWorldTerrain(),
  });
  
  // Add Cesium OSM Buildings, a global 3D buildings layer.
  viewer.scene.primitives.add(createOsmBuildings());
  
  // Fly the camera to San Francisco at the given longitude, latitude, and height.
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    orientation: {
      heading: Math.toRadians(0.0),
      pitch: Math.toRadians(-15.0),
    },
  });