import {
  Cartesian3,
  Color,
  PointPrimitiveCollection,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
} from "cesium";
import { HeatmapPoint } from "../types";
import { interpolateColor } from "../utils/color";
import tinycolor from "tinycolor2";
import { MutableRefObject } from "react";

export const addHeatmapPoints = (
  viewer: Viewer,
  heatmapPoints: HeatmapPoint[],
  setSelectedPoint: (point: HeatmapPoint | null) => void,
  cartesianPositions: MutableRefObject<
    { position: Cartesian3; point: HeatmapPoint }[]
  >,
) => {
  const pointCollection = new PointPrimitiveCollection();
  viewer.scene.primitives.add(pointCollection);

  const maxPopulation = Math.max(
    ...heatmapPoints.map((point) => point.population),
  );

  const gradientColors = ["blue", "green", "yellow", "red"];

  heatmapPoints.forEach((point) => {
    const normalizedPopulation = point.population / maxPopulation;

    const pixelSize = 5 + normalizedPopulation * 25;

    const interpolatedColor = interpolateColor(
      normalizedPopulation,
      gradientColors,
    );

    const color = tinycolor(interpolatedColor).toRgb();

    const cartesianPosition = Cartesian3.fromDegrees(point.lon, point.lat);
    cartesianPositions.current.push({ position: cartesianPosition, point });
    pointCollection.add({
      position: cartesianPosition,
      color: new Color(color.r / 255, color.g / 255, color.b / 255, 1),
      pixelSize: pixelSize,
    });
  });

  const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction(
    (movement: ScreenSpaceEventHandler.PositionedEvent) => {
      const pickedObject = viewer.scene.pick(movement.position);

      if (pickedObject && pickedObject.primitive) {
        const pickedPosition = pickedObject.primitive.position;
        const matchedPoint = cartesianPositions.current.find((obj) =>
          Cartesian3.equals(obj.position, pickedPosition),
        );
        if (matchedPoint) {
          const { point } = matchedPoint;
          setSelectedPoint(point);

          viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(point.lon, point.lat, 2000),
            duration: 2,
          });
        }
      }
    },
    ScreenSpaceEventType.LEFT_CLICK,
  );
};
