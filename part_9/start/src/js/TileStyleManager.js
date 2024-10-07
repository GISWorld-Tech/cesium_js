import { terrainHeight } from "./SymbolConditions.js";
import chroma from "chroma-js";
import { Cesium3DTileStyle } from "cesium";

export default class TileStyleManager {
  constructor(tileSetCityGml) {
    this.tileSetCityGml = tileSetCityGml;
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
    const numConditions = terrainHeight.conditions.length + 1;
    const colors = this.generateColors(numConditions);

    const colorConditions = terrainHeight.conditions.map((condition, index) =>
      ["${TerrainHeight} > " + condition.value, "color('" + colors[index] + "')"]);
    console.log(colorConditions);

    // colorConditions.push(["true", "color('" + colors[numConditions] + "')"]);
    this.applyStyle(this.tileSetCityGml, colorConditions);
  };
}
