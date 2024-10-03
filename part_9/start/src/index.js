import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./css/main.css";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Define the API URL
const apiUrl = "http://0.0.0.0:8000/cesium/polygon/?format=json";

// Fetch the data
fetch(apiUrl)
  .then(response => response.json())
  .then(data => console.log("Polygon data:", data))