import { Cartesian3, Cartographic, sampleTerrainMostDetailed } from "cesium";

const addPoint = async (viewer, features, resource) => {
  const positions = features.map((feature) => {
    const [longitude, latitude] = feature.geometry.coordinates;
    return Cartographic.fromDegrees(longitude, latitude);
  });
  const updatedPositions = await sampleTerrainMostDetailed(
    viewer.terrainProvider,
    positions,
  );
  updatedPositions.forEach((position, index) => {
    const feature = features[index];
    const cartesianPosition = Cartesian3.fromRadians(
      position.longitude,
      position.latitude,
      position.height,
    );
    viewer.entities.add({
      name: feature.properties.usage,
      position: cartesianPosition,
      model: { uri: resource[feature.properties.usage] },
    });
  });
};

export { addPoint };
