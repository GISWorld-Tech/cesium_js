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
viewer.scene.primitives.add(tileSetPointCloud)
tileSetPointCloud.show = false;

await viewer.zoomTo(tileSetCityGml);

const styleManager = new TileStyleManager(tileSetCityGml, tileSetPointCloud);
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
        tileSetPointCloud.show = true;
        if (event.target.id === "radioTree") {
            styleManager.pointCloudlStyle('radioTree', 1, 'green');

        } else if (event.target.id === "radioWater") {
            styleManager.pointCloudlStyle('radioWater', 9, 'lightblue');

        } else if (event.target.id === "radioBridge") {
            styleManager.pointCloudlStyle('radioBridge', 17, 'brown');

        } else if (event.target.id === "radioAll") {
            styleManager.pointCloudlStyle('radioAll');

        }
    });
});