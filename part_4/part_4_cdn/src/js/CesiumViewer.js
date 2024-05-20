// Fly the camera to San Francisco at the given longitude, latitude, and height.
export function flyToLocation(viewer, coordinate) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(...coordinate),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-15.0),
    },
  });
}
