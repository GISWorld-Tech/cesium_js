import {pointCould, roofType, terrainHeight} from "./SymbolConditions.js";
import {Cesium3DTileStyle} from "cesium";
import chroma from "chroma-js";

export default class TileStyleManager {
    constructor(tileSet) {
        this.tileSet = tileSet;
    }

    applyStyle = (conditions) => {
        this.tileSet.style = new Cesium3DTileStyle({
            color: {
                conditions: conditions,
            },
        });
    };

    generateColors = (numColors) => {
        return chroma.scale('Spectral').mode('lab').colors(numColors)
    };

    terrainHeightStyle = () => {
        const numConditions = terrainHeight.conditions.length;
        const colors = this.generateColors(numConditions);

        const colorConditions = terrainHeight.conditions.map((condition, index) =>
            ["${TerrainHeight} > " + condition.value, "color('" + colors[index] + "')"]);

        colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
        this.applyStyle(colorConditions);
    };

    roofTypeStyle = () => {
        const numConditions = roofType.conditions.length;
        const colors = this.generateColors(numConditions);

        const colorConditions = roofType.conditions.map((condition, index) =>
            ["Number(${RoofType}) === " + condition.value, "color('" + colors[index] + "')"]
        );

        colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
        this.applyStyle(colorConditions);
    };

    pointCloudlStyle = (className) => {
        const numFeatures = className !== 'radioAll' ? pointCould.conditions.length : 1;
        const colors = this.generateColors(numFeatures);

        const colorConditions = pointCould.conditions.map((condition, index) =>
            ["${Classification} === " + condition.value, "color('" + colors[index] + "')"]
        )

        colorConditions.push(["true", "color('" + colors[numFeatures] + "')"]);
        this.applyStyle(colorConditions);
    }
}
