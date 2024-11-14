export const convertLineToPoints = (lineFeature) => {
  const pointFeatures = {
    type: "FeatureCollection",
    name: "bus_points",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [],
  };
  const coordinates = lineFeature.geometry.coordinates;
  coordinates.forEach((coord, index) => {
    const pointFeature = {
      type: "Feature",
      properties: { fid: index + 1 },
      geometry: {
        type: "Point",
        coordinates: coord,
      },
    };
    pointFeatures.features.push(pointFeature);
  });

  return pointFeatures;
};
