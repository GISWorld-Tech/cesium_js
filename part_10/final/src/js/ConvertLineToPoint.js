export const convertLineToPoints = (lineFeature) => {
  // Create a new FeatureCollection to hold the Point features
  console.log(lineFeature);
  const pointFeatures = {
    type: "FeatureCollection",
    name: "bus_points",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [],
  };

  // Extract coordinates from the LineString geometry
  const coordinates = lineFeature.geometry.coordinates;

  // Loop through each coordinate and create a Point feature for it
  coordinates.forEach((coord, index) => {
    const pointFeature = {
      type: "Feature",
      properties: { fid: index + 1 }, // Assign an fid property based on index
      geometry: {
        type: "Point",
        coordinates: coord,
      },
    };
    // Add the new Point feature to the FeatureCollection
    pointFeatures.features.push(pointFeature);
  });

  console.log(pointFeatures);

  return pointFeatures;
};
