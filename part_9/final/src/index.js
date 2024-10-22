import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import axios from "axios";
import { Cesium3DTileset, createWorldTerrainAsync, Ion, IonResource, Viewer } from "cesium";
import { accessToken, assetId } from "./js/CesiumConfig";
import { addCorridors, addPoint } from "./js/EntityType";
import TileStyleManager from "./js/TileStyleManager";

Ion.defaultAccessToken = accessToken;

// todo 1: add resources

const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync()
});

const tileSet = await Cesium3DTileset.fromIonAssetId(assetId.cityGml);
viewer.scene.primitives.add(tileSet)
await viewer.zoomTo(tileSet)
const styleManager = new TileStyleManager(tileSet);
styleManager.terrainHeightStyle();

// todo 2: fetch all the data from cesium/polygon/?format=json
// todo 4: adding an option without refreshing page data updated from api
