import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import axios from "axios";
import { Cartesian3, Color, Ion, Viewer } from "cesium";
import { accessToken } from "./js/CesiumConfig";

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer");
const apiUrl = "http://0.0.0.0:8000/cesium/polygon/?format=json";

function fetchData(update = false) {
  axios
    .get(apiUrl)
    .then(response => {
      update && viewer.entities.removeAll();
      response.data.features.forEach(feature => {
        viewer.entities.add({
          name: feature.properties.usage,
          corridor: {
            positions: Cartesian3.fromDegreesArray(feature.geometry.coordinates[0].flat()),
            width: 1,
            material: Color.RED.withAlpha(0.5)
          }
        });
      });
      !update && viewer.zoomTo(viewer.entities);
    })
    .catch(error => console.log(error));
}
fetchData();

document.getElementById("fetchDataButton").addEventListener("click", () => fetchData(true));
