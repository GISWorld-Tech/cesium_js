import { Cartesian3, Color } from "cesium";

const addCorridors = (viewer, features) => {
  features.forEach(feature => {
    viewer.entities.add({
      name: feature.properties.usage,
      corridor: {
        positions: Cartesian3.fromDegreesArray(feature.geometry.coordinates[0].flat()),
        width: 1,
        material: Color.RED
      }
    });
  });
};

const addWall = (viewer, features) => {
  features.forEach(feature => {
    viewer.entities.add({
      name: feature.properties.usage,
      wall: {
        positions: Cartesian3.fromDegreesArrayHeights(feature.geometry.coordinates.map(coord => {
          return [...coord, feature.properties.height];
        }).flat()),
        material: Color.GREEN,
        outline: true
      }
    });
  });
};

const addPoint = (viewer, features, resource) => {
  features.forEach(feature => {
    console.log(...feature.geometry.coordinates);
    viewer.entities.add({
      name: feature.properties.usage,
      position: Cartesian3.fromDegrees(...feature.geometry.coordinates),
      model: { uri: resource[feature.properties.usage] }
    });
  });
};

export { addCorridors, addPoint, addWall };