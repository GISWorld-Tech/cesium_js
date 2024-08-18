import { Ion, Viewer, createWorldTerrainAsync, Cesium3DTileset } from "cesium";
import TileStyleManager from "./js/TileStyleManager.js";
import { accessToken, assetId } from "./js/CesiumConfig.js";
import 'cesium/Build/Cesium/Widgets/widgets.css';
import "bootstrap/dist/css/bootstrap.css";
import './css/main.css'

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync(),
});

const tileset = await Cesium3DTileset.fromIonAssetId(assetId);
viewer.scene.primitives.add(tileset);

await viewer.zoomTo(tileset);

const styleManager = new TileStyleManager(tileset);
styleManager.terrainHeightStyle();

document
  .getElementById("btnterrain")
  .addEventListener("click", () => styleManager.terrainHeightStyle());

document
  .getElementById("btnroof")
  .addEventListener("click", () => styleManager.roofTypeStyle());
