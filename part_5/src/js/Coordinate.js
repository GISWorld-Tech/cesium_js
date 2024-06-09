export const coordinates = {
  type: "FeatureCollection",
  name: "flightPath",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [
    {
      type: "Feature",
      properties: { fid: 4, location: "start" },
      geometry: {
        type: "Point",
        coordinates: [9.145062766012417, 48.784498155804265],
      },
    },
    {
      type: "Feature",
      properties: { fid: 5, location: "middle" },
      geometry: {
        type: "Point",
        coordinates: [9.178487526403863, 48.778389761882927],
      },
    },
    {
      type: "Feature",
      properties: { fid: 6, location: "end" },
      geometry: {
        type: "Point",
        coordinates: [9.225547966629279, 48.792936855159496],
      },
    },
  ],
};
