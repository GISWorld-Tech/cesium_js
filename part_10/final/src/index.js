import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";

import { Cesium3DTileset, createWorldTerrainAsync, Ion, Viewer } from "cesium";

import TileStyleManager from "./js/TileStyleManager.js";

import { accessToken, assetIds } from "./js/CesiumConfig.js";

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync(),
});

const tileSetCityGml = await Cesium3DTileset.fromIonAssetId(assetIds.cityGml);
const tileSetPointCloud = await Cesium3DTileset.fromIonAssetId(
  assetIds.pointCloud,
);
viewer.scene.primitives.add(tileSetCityGml);
viewer.scene.primitives.add(tileSetPointCloud);
tileSetPointCloud.show = false;

await viewer.zoomTo(tileSetCityGml);

const styleManager = new TileStyleManager(tileSetCityGml, tileSetPointCloud);
styleManager.terrainHeightStyle();

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

document
  .getElementById("activePointCloud")
  .addEventListener("change", (event) => {
    if (event.target.checked) {
      tileSetPointCloud.show = true;
      styleManager.pointCloudStyle();
    } else {
      tileSetPointCloud.show = false;
    }
  });