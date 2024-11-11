export const convertLineToPoints = (lineFeature) => {
  const pointFeatures = {
    type: "FeatureCollection",
    name: "points",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [],
  };

  // TODO 5.1: Convert line to point

  return pointFeatures;
};
