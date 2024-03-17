const createModel = (viewer, url, x, y, height) => {
  const position = Cesium.Cartesian3.fromDegrees(x, y, height);
  viewer.entities.add({
    name: url,
    position: position,
    model: {
      uri: url,
    },
  });
};

export {
    createModel
}
