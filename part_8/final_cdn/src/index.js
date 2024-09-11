import TileStyleManager from "./js/TileStyleManager.js";

import {accessToken, assetIds} from "./js/CesiumConfig.js";

Cesium.Ion.defaultAccessToken = accessToken;

const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: await Cesium.createWorldTerrainAsync(),
});

const tileSetCityGml = await Cesium.Cesium3DTileset.fromIonAssetId(assetIds.cityGml);
const tileSetPointCloud = await Cesium.Cesium3DTileset.fromIonAssetId(assetIds.pointCloud);
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