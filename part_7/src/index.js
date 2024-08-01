import { accessToken, assetId } from "./js/CesiumConfig.js";
import TileStyleManager from "./js/TileStyleManager.js";

Cesium.Ion.defaultAccessToken = accessToken;

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: await Cesium.createWorldTerrainAsync(),
});

const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);
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
