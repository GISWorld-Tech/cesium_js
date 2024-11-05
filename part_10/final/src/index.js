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

import { flightData } from "./js/FlightData";
import { MovingObject } from "./js/MovingObject.js";

import TileStyleManager from "./js/TileStyleManager.js";

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync(),
});

const resources = {
  aircraft: await IonResource.fromAssetId(assetIds.aircraft),
  bus: await IonResource.fromAssetId(assetIds.bus),
  car: await IonResource.fromAssetId(assetIds.car),
};

const tileSet = {
  cityGml: await Cesium3DTileset.fromIonAssetId(assetIds.cityGml),
  pointCloud: await Cesium3DTileset.fromIonAssetId(assetIds.pointCloud),
  bim: await Cesium3DTileset.fromIonAssetId(assetIds.bim),
  googlePhotorealistic: await Cesium3DTileset.fromIonAssetId(
    assetIds.googlePhotorealistic,
  ),
};

[tileSet.cityGml, tileSet.pointCloud, tileSet.googlePhotorealistic].forEach(
  (tileSet) => viewer.scene.primitives.add(tileSet),
);
tileSet.pointCloud.show = false;
tileSet.googlePhotorealistic.show = false;

await viewer.zoomTo(tileSet.cityGml);

const styleManager = new TileStyleManager(tileSet.cityGml, tileSet.pointCloud);
styleManager.terrainHeightStyle();

const apiLineStringUrl =
  "https://gisworld-tech.com/cesium/linestring/?project_id=part_10";

const fetchAllData = (update = false) => {
  axios
    .get(apiLineStringUrl)
    .then((response) => {
      viewer.entities.removeAll();
      response.data.features.forEach((feature) => {
        const busPath = convertLineToPoints(feature);
        const movingObject = new MovingObject(viewer, busPath, 10, "bus");
        movingObject.addMovableEntityToViewer(
          resources[feature.properties.usage],
          "car",
          feature.id,
        );
      });
      !update && viewer.zoomTo(viewer.entities);
    })
    .catch((error) => console.log(error));
};

document
  .getElementById("fetchData")
  .addEventListener("click", () => fetchAllData(true));

const unCheckedRadioButtons = () => {
  document
    .querySelectorAll("input[name='classification']")
    .forEach((radio) => (radio.checked = false));
};

document.getElementById("btn-terrain").addEventListener("click", () => {
  tileSet.pointCloud.show = false;
  unCheckedRadioButtons();
  styleManager.terrainHeightStyle();
});

document.getElementById("btn-roof").addEventListener("click", () => {
  tileSet.pointCloud.show = false;
  unCheckedRadioButtons();
  styleManager.roofTypeStyle();
});

document.getElementById("isPointCloud").addEventListener("change", (event) => {
  if (event.target.checked) {
    tileSet.pointCloud.show = true;
    styleManager.pointCloudStyle();
  } else {
    tileSet.pointCloud.show = false;
  }
});

document.getElementById("zoomToBIM").addEventListener("click", () => {
  viewer.zoomTo(tileSet.bim);
});

document.getElementById("isBIMData").addEventListener("change", (event) => {
  viewer.scene.primitives.add(tileSet.bim);
  tileSet.bim.show = !!event.target.checked;
});

document
  .getElementById("isGooglePhotorealistic")
  .addEventListener("change", (event) => {
    if (event.target.checked) {
      tileSet.googlePhotorealistic.show = true;
      tileSet.cityGml.show = false;
    } else {
      tileSet.googlePhotorealistic.show = false;
      tileSet.cityGml.show = true;
    }
  });

document.getElementById("zoomToAircraft").addEventListener("click", () => {
  const movingObject = new MovingObject(viewer, flightData, 1, "aircraft");
  movingObject.addMovableEntityToViewer(resources.aircraft);
});
