import { roofType, terrainHeight } from "./SymbolConditions.js";

class TileStyleManager {
  constructor(tileset) {
    this.tileset = tileset;
  }

  applyStyle = (conditions) => {
    const style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: conditions,
      },
    });

    this.tileset.style = style;
  };

  generateColors = (numColors) => {
    return chroma.scale('Spectral').mode('lab').colors(numColors);
  };

  terrainHeightStyle = () => {
    const numConditions = terrainHeight.conditions.length;
    const colors = this.generateColors(numConditions);

    const terrainConditions = terrainHeight.conditions.map((condition, index) => [
      "${TerrainHeight} > " + condition.height,
      "color('" + colors[index] + "')"
    ]);

    terrainConditions.push(["true", "color('gray')"]);

    this.applyStyle(terrainConditions);
  };

  roofTypeStyle = () => {
    const numFeatures = roofType.features.length;
    const colors = this.generateColors(numFeatures);

    const colorConditions = roofType.features.map((feature, index) => [
      "Number(${RoofType}) === " + feature.value,
      "color('" + colors[index] + "')"
    ]);

    colorConditions.push(["true", "color('gray')"]);

    this.applyStyle(colorConditions);
  };
}

export default TileStyleManager;
