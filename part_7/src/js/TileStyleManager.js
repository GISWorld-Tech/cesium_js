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

  terrainHeightStyle = () => {
    const terrainConditions = terrainHeight.conditions.map((condition) => [
      "${TerrainHeight} > " + condition.height,
      "color('" + condition.color + "')",
    ]);

    terrainConditions.push(["true", "color('gray')"]);

    this.applyStyle(terrainConditions);
  };

  roofTypeStyle = () => {
    const colorConditions = roofType.features.map((feature) => [
      "Number(${RoofType}) === " + feature.value,
      "color('" + feature.color + "')",
    ]);

    colorConditions.push(["true", "color('gray')"]);

    this.applyStyle(colorConditions);
  };
}

export default TileStyleManager;
