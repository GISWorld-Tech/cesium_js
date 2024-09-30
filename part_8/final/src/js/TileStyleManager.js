import chroma from "chroma-js";

import { pointCould, roofType, terrainHeight } from "./SymbolConditions.js";

import { Cesium3DTileStyle } from "cesium";

export default class TileStyleManager {
  constructor(tileSetCityGml, tileSetPointCloud) {
    this.tileSetCityGml = tileSetCityGml;
    this.tileSetPointCloud = tileSetPointCloud;
  }

  applyStyle = (tileSet, conditions, show = "true") => {
    tileSet.style = new Cesium3DTileStyle({
      color: {
        conditions: conditions
      },
      show: show
    });
  };

  generateColors = (numColors) => {
    return chroma.scale("Spectral").mode("lab").colors(numColors);
  };

  terrainHeightStyle = () => {
    const numConditions = terrainHeight.conditions.length;
    const colors = this.generateColors(numConditions);

    const colorConditions = terrainHeight.conditions.map((condition, index) =>
      ["${TerrainHeight} > " + condition.value, "color('" + colors[index] + "')"]);

    colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
    this.applyStyle(this.tileSetCityGml, colorConditions);
  };

  roofTypeStyle = () => {
    const numConditions = roofType.conditions.length;
    const colors = this.generateColors(numConditions);

    const colorConditions = roofType.conditions.map((condition, index) =>
      ["Number(${RoofType}) === " + condition.value, "color('" + colors[index] + "')"]
    );

    colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
    this.applyStyle(this.tileSetCityGml, colorConditions);
  };

  pointCloudStyle = (className, classNum = 1, classColor = "green") => {
    if (className === "radioAll") {
      const numConditions = pointCould.conditions.length;
      const colors = this.generateColors(numConditions);

      const colorConditions = pointCould.conditions.map((condition, index) =>
        ["${Classification} ===" + condition.value, "color('" + colors[index] + "')"]
      );

      this.applyStyle(this.tileSetPointCloud, colorConditions);
    } else {
      const colorCondition = [["${Classification} ===" + classNum, "color('" + classColor + "')"]];
      const showQuery = "${feature['Classification']} ===" + classNum;
      this.applyStyle(this.tileSetPointCloud, colorCondition, showQuery);
    }
  };
}
