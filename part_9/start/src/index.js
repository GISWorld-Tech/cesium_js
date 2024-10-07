import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import axios from "axios";
import { Cartesian3, Color, Ion, Viewer } from "cesium";
import { accessToken } from "./js/CesiumConfig";

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer");
const apiPolygonUrl = "https://gisworld-tech.com/cesium/polygon/?format=json";
const apiPointUrl = "https://gisworld-tech.com/cesium/point/?format=json";
const apiLinestringUrl = "https://gisworld-tech.com/cesium/linestring/?format=json";

const addCorridors = (features) => {
  features.forEach(feature => {
    viewer.entities.add({
      name: feature.properties.usage,
      corridor: {
        positions: Cartesian3.fromDegreesArray(feature.geometry.coordinates[0].flat()),
        width: 1,
        material: Color.RED
      }
    });
  });
};

const fetchAllData = (update = false) => {
  axios.all([
    axios.get(apiPolygonUrl),
    axios.get(apiPointUrl),
    axios.get(apiLinestringUrl)
  ])
    .then(axios.spread((response1, response2, response3) => {
      update && viewer.entities.removeAll();
      addCorridors(response1.data.features);

      !update && viewer.zoomTo(viewer.entities);
    }))
    .catch(error => console.log(error));
};

fetchAllData();

document.getElementById("fetchDataButton").addEventListener("click", () => fetchAllData(true));
