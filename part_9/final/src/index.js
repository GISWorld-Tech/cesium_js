import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { Cesium3DTileset, createWorldTerrainAsync, Ion, IonResource, Viewer } from "cesium";
import { accessToken, assetId } from "./js/CesiumConfig";
import TileStyleManager from "./js/TileStyleManager";
import axios from "axios";
import { addCorridors, addPoint } from "./js/EntityType";

Ion.defaultAccessToken = accessToken;

const resources = {
  car: await IonResource.fromAssetId(2780316),
  tree: await IonResource.fromAssetId(2780318)
};

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync()
});

const tileSet = await Cesium3DTileset.fromIonAssetId(assetId.cityGml);
viewer.scene.primitives.add(tileSet);
await viewer.zoomTo(tileSet);
const styleManager = new TileStyleManager(tileSet);
styleManager.terrainHeightStyle();

const apiPolygonUrl = "https://gisworld-tech.com/cesium/polygon/?format=json";
const apiPointUrl = "https://gisworld-tech.com/cesium/point/?format=json";

const fetchAllData = (update = false) => {
  axios.all([
    axios.get(apiPolygonUrl),
    axios.get(apiPointUrl)
  ]).then(
    axios.spread((response1, response2) => {
      update && viewer.entities.removeAll();
      addCorridors(viewer, response1.data.features);
      addPoint(viewer, response2.data.features, resources);
      !update && viewer.zoomTo(viewer.entities);
    })
  ).catch(error => console.log(error));
};

fetchAllData();

document.getElementById("fetchDataButton").addEventListener("click", () => fetchAllData(true));