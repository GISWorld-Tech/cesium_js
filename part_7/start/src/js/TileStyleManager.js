import { Cesium3DTileStyle } from "cesium";
import chroma from "chroma-js";
import { roofType, terrainHeight } from "./SymbolConditions";

export default class TileStyleManager {
  constructor(tileset) {
    this.tileset = tileset;
  }

  applyStyle = (conditions) => {
    const style = new Cesium3DTileStyle({
      color: {
        conditions: conditions,
      },
    });

    this.tileset.style = style;
  };

  generateColors = (numColors) =>
    chroma.scale("Spectral").mode("lab").colors(numColors);

  terrainHeightStyle = () => {
    const numConditions = terrainHeight.conditions.length;
    const colors = this.generateColors(numConditions);

    const terrainConditions = terrainHeight.conditions.map(
      (condition, index) => [
        "${TerrainHeight} > " + condition.height,
        "color('" + colors[index] + "')",
      ]
    );

    terrainConditions.push(["true", "color('white')"]);

    this.applyStyle(terrainConditions);
  };

  roofTypeStyle = () => {
    const numFeatures = roofType.features.length;
    const colors = this.generateColors(numFeatures);

    const featureConditions = roofType.features.map((feature, index) => [
      "Number(${RoofType}) === " + feature.value,
      "color('" + colors[index] + "')",
    ]);
    featureConditions.push(["true", "color('white')"]);
    this.applyStyle(featureConditions);
  };
}
