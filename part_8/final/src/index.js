import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js"
import './css/main.css'
import 'cesium/Build/Cesium/Widgets/widgets.css';

import TileStyleManager from "./js/TileStyleManager.js";

import {accessToken, assetIds} from "./js/CesiumConfig.js";

import {Cesium3DTileset, createWorldTerrainAsync, Ion, Viewer} from "cesium";

Ion.defaultAccessToken = accessToken;

const viewer = new Viewer("cesiumContainer", {
    terrainProvider: await createWorldTerrainAsync(),
});

const tileSetCityGml = await Cesium3DTileset.fromIonAssetId(assetIds.cityGml);
const tileSetPointCloud = await Cesium3DTileset.fromIonAssetId(assetIds.pointCloud);

viewer.scene.primitives.add(tileSetCityGml);

await viewer.zoomTo(tileSetCityGml);

const styleManager = new TileStyleManager(tileSetCityGml);
styleManager.terrainHeightStyle();

const uncheckAllRadioButtons = () => {
    document.querySelectorAll('input[name="classification"]').forEach((radio) => {
        radio.checked = false;
    });
};

document
    .getElementById("btn-terrain")
    .addEventListener("click", () => {
        tileSetPointCloud.show = false;
        uncheckAllRadioButtons()
        styleManager.terrainHeightStyle()
    });

document
    .getElementById("btn-roof")
    .addEventListener("click", () => {
        tileSetPointCloud.show = false;
        uncheckAllRadioButtons()
        styleManager.roofTypeStyle()
    });

document.querySelectorAll('input[name="classification"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        // Add the point cloud tileset when any of the radio buttons are selected
        viewer.scene.primitives.add(tileSetPointCloud);
        tileSetPointCloud.show = true;

        if (event.target.id === "radioTree") {
            styleManager.pointCloudlStyle('radioTree');
            console.log('tree')
        } else if (event.target.id === "radioBuilding") {
            console.log('building')
            styleManager.pointCloudlStyle('radioBuilding');
        } else if (event.target.id === "radioAll") {
            console.log('all')
            styleManager.pointCloudlStyle('radioAll');

        }
    });
});