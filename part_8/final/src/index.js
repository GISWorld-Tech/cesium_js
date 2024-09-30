import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";

import { Cesium3DTileset, createWorldTerrainAsync, Ion, Viewer } from "cesium";

import TileStyleManager from "./js/TileStyleManager.js";

import { accessToken, assetIds } from "./js/CesiumConfig.js";

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync()
});

const tileSetCityGml = await Cesium3DTileset.fromIonAssetId(assetIds.cityGml);
const tileSetPointCloud = await Cesium3DTileset.fromIonAssetId(assetIds.pointCloud);
viewer.scene.primitives.add(tileSetCityGml);
viewer.scene.primitives.add(tileSetPointCloud);
tileSetPointCloud.show = false;

await viewer.zoomTo(tileSetCityGml);

const styleManager = new TileStyleManager(tileSetCityGml, tileSetPointCloud);
styleManager.terrainHeightStyle();

const unCheckedRadioButtons = () => {
  document.querySelectorAll("input[name='classification']").forEach(radio => radio.checked = false);
};

document
  .getElementById("btn-terrain")
  .addEventListener("click", () => {
    tileSetPointCloud.show = false;
    unCheckedRadioButtons();
    styleManager.terrainHeightStyle();
  });

document
  .getElementById("btn-roof")
  .addEventListener("click", () => {
    tileSetPointCloud.show = false;
    unCheckedRadioButtons();
    styleManager.roofTypeStyle();
  });

document.querySelectorAll("input[name='classification']").forEach((radio) => {
  radio.addEventListener("change", (event) => {
    tileSetPointCloud.show = true;
    if (event.target.id === "radioTree") {
      styleManager.pointCloudStyle("radioTree", 1, "green");
    } else if (event.target.id === "radioWater") {
      styleManager.pointCloudStyle("radioWater", 9, "blue");
    } else if (event.target.id === "radioBridge") {
      styleManager.pointCloudStyle("radioBridge", 17, "brown");
    } else {
      styleManager.pointCloudStyle("radioAll");
    }
  });
});