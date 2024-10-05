import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import axios from "axios";

const apiUrl = "http://0.0.0.0:8000/cesium/polygon/?format=json";

const response = axios
  .get(apiUrl)
  .then(response => console.log(response.data))
  .catch(error => console.log(error));