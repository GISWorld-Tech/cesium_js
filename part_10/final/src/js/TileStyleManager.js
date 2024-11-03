import chroma from "chroma-js";

import { roofType, terrainHeight } from "./SymbolConditions.js";

import { Cesium3DTileStyle } from "cesium";

export default class TileStyleManager {
  constructor(tileSetCityGml, tileSetPointCloud) {
    this.tileSetCityGml = tileSetCityGml;
    this.tileSetPointCloud = tileSetPointCloud;
  }

  applyStyle = (tileSet, conditions, show = "true") => {
    tileSet.style = new Cesium3DTileStyle({
      color: {
        conditions: conditions,
      },
      show: show,
    });
  };

  generateColors = (numColors) => {
    return chroma.scale("Spectral").mode("lab").colors(numColors);
  };

  terrainHeightStyle = () => {
    const numConditions = terrainHeight.conditions.length;
    const colors = this.generateColors(numConditions);

    const colorConditions = terrainHeight.conditions.map((condition, index) => [
      "${TerrainHeight} > " + condition.value,
      "color('" + colors[index] + "')",
    ]);

    colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
    this.applyStyle(this.tileSetCityGml, colorConditions);
  };

  roofTypeStyle = () => {
    const numConditions = roofType.conditions.length;
    const colors = this.generateColors(numConditions);

    const colorConditions = roofType.conditions.map((condition, index) => [
      "Number(${RoofType}) === " + condition.value,
      "color('" + colors[index] + "')",
    ]);

    colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
    this.applyStyle(this.tileSetCityGml, colorConditions);
  };

  pointCloudStyle = () => {
    const colorCondition = [
      ["${Classification} === 1", "color('green')"],
      ["${Classification} === 9", "color('lightblue')"],
    ];
    const showQuery =
      "${feature['Classification']} === 1 || ${feature['Classification']} === 9";
    this.applyStyle(this.tileSetPointCloud, colorCondition, showQuery);
  };
}
