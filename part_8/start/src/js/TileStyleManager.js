import chroma from "chroma-js";

import {roofType, terrainHeight} from "./SymbolConditions.js";

import {Cesium3DTileStyle} from "cesium";

export default class TileStyleManager {
  constructor(tileSet) {
    this.tileSet = tileSet;
  }

  applyStyle = (tileSet, conditions) => {
    tileSet.style = new Cesium3DTileStyle({
      color: {
        conditions: conditions,
      },
    });
  };

  generateColors = (numColors) => {
    return chroma.scale('Spectral').mode('lab').colors(numColors);
  };

  terrainHeightStyle = () => {
    const numConditions = terrainHeight.conditions.length;
    const colors = this.generateColors(numConditions);

    const colorConditions = terrainHeight.conditions.map((condition, index) =>
      ["${TerrainHeight} > " + condition.value, "color('" + colors[index] + "')"]);

    colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
    this.applyStyle(this.tileSet, colorConditions);
  };

  roofTypeStyle = () => {
    const numConditions = roofType.conditions.length;
    const colors = this.generateColors(numConditions);

    const colorConditions = roofType.conditions.map((condition, index) =>
      ["Number(${RoofType}) === " + condition.value, "color('" + colors[index] + "')"]
    );

    colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
    this.applyStyle(this.tileSet, colorConditions);
  };
}
