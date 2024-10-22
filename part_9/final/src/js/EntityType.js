// todo 3: add point and add corridor function
// todo 3: note: all the geometries have to be clamped on cesium terrain

import { Cartesian3, Cartographic, Color, sampleTerrainMostDetailed } from "cesium";

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

const addPoint = async (viewer, features, resource) => {
  const positions = features.map(feature => {
    const [longitude, latitude] = feature.geometry.coordinates;
    return Cartographic.fromDegrees(longitude, latitude);
  });
  const updatedPositions = await sampleTerrainMostDetailed(viewer.terrainProvider, positions);
  updatedPositions.forEach((position, index) => {
    const feature = features[index];
    const cartesianPosition = Cartesian3.fromRadians(
      position.longitude,
      position.latitude,
      position.height
    );
    viewer.entities.add({
      name: feature.properties.usage,
      position: cartesianPosition,
      model: { url: resource[feature.properties.usage] }
    });
  });
};



export { addCorridors, addPoint };