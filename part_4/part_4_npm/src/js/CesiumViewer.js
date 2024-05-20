import { Cartesian3, Math } from "cesium";

// Fly the camera to San Francisco at the given longitude, latitude, and height.
export function flyToLocation(viewer, coordinate) {
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(...coordinate),
    orientation: {
      heading: Math.toRadians(0.0),
      pitch: Math.toRadians(-15.0),
    },
  });
}
