import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import axios from "axios";

import {
  Cesium3DTileset,
  createWorldTerrainAsync,
  Ion,
  IonResource,
  Viewer,
} from "cesium";

import { accessToken, assetIds } from "./js/CesiumConfig.js";
import { convertLineToPoints } from "./js/ConvertLineToPoint";
import { addPoint } from "./js/EntityType";

import { flightData } from "./js/FlightData";
import { MovingObject } from "./js/MovingObject.js";

import TileStyleManager from "./js/TileStyleManager.js";

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync(),
});

const resources = {
  aircraft: await IonResource.fromAssetId(assetIds.aircraft),
  bus_station: await IonResource.fromAssetId(assetIds.bus_station),
  bus: await IonResource.fromAssetId(assetIds.bus),
  car: await IonResource.fromAssetId(assetIds.car),
  tree: await IonResource.fromAssetId(assetIds.tree),
};

const tileSetCityGml = await Cesium3DTileset.fromIonAssetId(assetIds.cityGml);
const tileSetPointCloud = await Cesium3DTileset.fromIonAssetId(
  assetIds.pointCloud,
);
const tileSetBim = await Cesium3DTileset.fromIonAssetId(assetIds.bim);
const tileSetGoogle = await Cesium3DTileset.fromIonAssetId(
  assetIds.googlePhotorealistic,
);

viewer.scene.primitives.add(tileSetCityGml);
viewer.scene.primitives.add(tileSetPointCloud);
viewer.scene.primitives.add(tileSetBim);
viewer.scene.primitives.add(tileSetGoogle);
tileSetPointCloud.show = false;
tileSetGoogle.show = false;

await viewer.zoomTo(tileSetCityGml);

const styleManager = new TileStyleManager(tileSetCityGml, tileSetPointCloud);
styleManager.terrainHeightStyle();

const apiLineStringUrl =
  "https://gisworld-tech.com/cesium/linestring/?project_id=part_10";
const apiPointUrl =
  "https://gisworld-tech.com/cesium/point/?project_id=part_10";

const fetchAllData = (update = false) => {
  axios
    .all([axios.get(apiLineStringUrl), axios.get(apiPointUrl)])
    .then(
      axios.spread((response1, response2) => {
        // update && viewer.entities.removeAll();
        const busPath = convertLineToPoints(response1.data.features[0]);
        const movingObjectBus = new MovingObject(viewer, busPath, 10, "bus");
        movingObjectBus.addMovableEntityToViewer(resources.bus);
        addPoint(viewer, response2.data.features, resources);
        !update && viewer.zoomTo(viewer.entities);
      }),
    )
    .catch((error) => console.log(error));
};

fetchAllData();

document
  .getElementById("fetchData")
  .addEventListener("click", () => fetchAllData(true));

const unCheckedRadioButtons = () => {
  document
    .querySelectorAll("input[name='classification']")
    .forEach((radio) => (radio.checked = false));
};

document.getElementById("btn-terrain").addEventListener("click", () => {
  tileSetPointCloud.show = false;
  unCheckedRadioButtons();
  styleManager.terrainHeightStyle();
});

document.getElementById("btn-roof").addEventListener("click", () => {
  tileSetPointCloud.show = false;
  unCheckedRadioButtons();
  styleManager.roofTypeStyle();
});

document.getElementById("isPointCloud").addEventListener("change", (event) => {
  if (event.target.checked) {
    tileSetPointCloud.show = true;
    styleManager.pointCloudStyle();
  } else {
    tileSetPointCloud.show = false;
  }
});

document.getElementById("zoomToBIM").addEventListener("click", () => {
  viewer.zoomTo(tileSetBim);
});

document.getElementById("isBIMData").addEventListener("change", (event) => {
  tileSetBim.show = !!event.target.checked;
});

document
  .getElementById("isGooglePhotorealistic")
  .addEventListener("change", (event) => {
    if (event.target.checked) {
      tileSetGoogle.show = true;
      tileSetCityGml.show = false;
    } else {
      tileSetGoogle.show = false;
      tileSetCityGml.show = true;
    }
  });

document.getElementById("zoomToAircraft").addEventListener("click", () => {
  const movingObject = new MovingObject(viewer, flightData, 1, "aircraft");
  movingObject.addMovableEntityToViewer(resources.aircraft);
  viewer.zoomTo(tileSetCityGml);
});
