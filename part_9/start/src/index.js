import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import axios from "axios";
import { Ion, IonResource, Viewer } from "cesium";
import { accessToken } from "./js/CesiumConfig";
import { addCorridors, addPoint, addWall } from "./js/EntityType";

Ion.defaultAccessToken = accessToken;

const resources = {
  car: await IonResource.fromAssetId(2656957),
  tree: await IonResource.fromAssetId(2760510)
};

const viewer = new Viewer("cesiumContainer");
const apiPolygonUrl = "https://gisworld-tech.com/cesium/polygon/?format=json";
const apiPointUrl = "https://gisworld-tech.com/cesium/point/?format=json";
const apiLinestringUrl = "https://gisworld-tech.com/cesium/linestring/?format=json";

const fetchAllData = (update = false) => {
  axios.all([
    axios.get(apiPolygonUrl),
    axios.get(apiPointUrl),
    axios.get(apiLinestringUrl)
  ])
    .then(axios.spread((response1, response2, response3) => {
      update && viewer.entities.removeAll();
      addCorridors(viewer, response1.data.features);
      addPoint(viewer, response2.data.features, resources);
      addWall(viewer, response3.data.features);
      !update && viewer.zoomTo(viewer.entities);
    }))
    .catch(error => console.log(error));
};

fetchAllData();

document.getElementById("fetchDataButton").addEventListener("click", () => fetchAllData(true));
