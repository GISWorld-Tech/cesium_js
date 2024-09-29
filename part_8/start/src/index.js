import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import './css/main.css'
import 'cesium/Build/Cesium/Widgets/widgets.css';

import {Cesium3DTileset, createWorldTerrainAsync, Ion, Viewer} from "cesium";

import TileStyleManager from "./js/TileStyleManager.js";

import {accessToken, assetId} from "./js/CesiumConfig.js";

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync(),
});

// TODO 1: adding point clout to viewer; not visualize point cloud in the start
const tileSet = await Cesium3DTileset.fromIonAssetId(assetId);
viewer.scene.primitives.add(tileSet);

await viewer.zoomTo(tileSet);

const styleManager = new TileStyleManager(tileSet);
styleManager.terrainHeightStyle();

// TODO 3: if these buttons is clicked, point cloud should not be shown
//         and all the radio buttons should be uncheck
document
  .getElementById("btn-terrain")
  .addEventListener("click", () => styleManager.terrainHeightStyle());

document
  .getElementById("btn-roof")
  .addEventListener("click", () => styleManager.roofTypeStyle());

// TODO 2: classifying the point cloud in 4 category: tree, water, bridge and all;
//         assign the green color to class=1, blue to class=9 and brown to class=17