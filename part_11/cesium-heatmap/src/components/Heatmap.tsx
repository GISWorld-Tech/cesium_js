import { MutableRefObject, useEffect, useRef, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  BoundingSphere,
  Cartesian3,
  Color,
  createOsmBuildingsAsync,
  createWorldTerrainAsync,
  EllipsoidTerrainProvider,
  Ion,
  PointPrimitiveCollection,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
} from "cesium";
import { accessToken } from "../app/AssetsConfig.ts";
import Grid from "@mui/material/Grid2";
import { heatmapPoints } from "../app/pointHeatMap.ts";
import tinycolor from "tinycolor2";
import { Button, Card, CardContent, Fade, Typography } from "@mui/material";

export interface HeatmapPoint {
  city: string;
  lon: number;
  lat: number;
  population: number;
  state: string;
}

// Function to interpolate multiple colors using tinycolor
const interpolateColor = (
  normalizedValue: number,
  colors: string[],
): string => {
  const steps = colors.length - 1; // Number of gradient segments
  const step = Math.floor(normalizedValue * steps); // Determine which color segment we're in (0-indexed)
  const remainder = normalizedValue * steps - step; // Calculate position within the segment (0-1 range)

  // Blend between two adjacent colors in the gradient
  const startColor = colors[step];
  const endColor = colors[Math.min(step + 1, steps)]; // Ensure it doesn't exceed the array
  return tinycolor.mix(startColor, endColor, remainder * 100).toRgbString();
};

const addHeatmapPoints = (
  viewer: Viewer,
  heatmapPoints: HeatmapPoint[],
  setSelectedPoint: (point: HeatmapPoint | null) => void,
  cartesianPositions: MutableRefObject<
    { position: Cartesian3; point: HeatmapPoint }[]
  >,
) => {
  const pointCollection = new PointPrimitiveCollection();
  viewer.scene.primitives.add(pointCollection);

  // Find the maximum population to normalize sizes and colors
  const maxPopulation = Math.max(
    ...heatmapPoints.map((point) => point.population),
  );

  // Define gradient colors (blue → green → yellow → red)
  const gradientColors = ["blue", "green", "yellow", "red"];

  // Iterate through heatmap points and add them to the collection
  heatmapPoints.forEach((point) => {
    const normalizedPopulation = point.population / maxPopulation; // Normalize the population (0-1)

    // Scale the point size between 5 and 20 based on population
    const pixelSize = 5 + normalizedPopulation * 25;

    // Get color from the gradient
    const interpolatedColor = interpolateColor(
      normalizedPopulation,
      gradientColors,
    );

    // Convert the color to RGB format
    const color = tinycolor(interpolatedColor).toRgb();

    // Add the point to the heatmap
    const cartesianPosition = Cartesian3.fromDegrees(point.lon, point.lat);
    cartesianPositions.current.push({ position: cartesianPosition, point }); // Store the position for interaction
    pointCollection.add({
      position: cartesianPosition,
      color: new Color(color.r / 255, color.g / 255, color.b / 255, 1), // Scale RGB to Cesium's Color format
      pixelSize: pixelSize,
    });
  });

  // Add a ScreenSpaceEventHandler to detect clicks on points
  const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction(
    (movement: ScreenSpaceEventHandler.PositionedEvent) => {
      // Get the picked object
      const pickedObject = viewer.scene.pick(movement.position);

      if (pickedObject && pickedObject.primitive) {
        // Find the Cartesian position
        const pickedPosition = pickedObject.primitive.position;
        const matchedPoint = cartesianPositions.current.find(
          (obj) => Cartesian3.equals(obj.position, pickedPosition), // Compare positions
        );
        if (matchedPoint) {
          const { point } = matchedPoint; // Extract the heatmap point
          setSelectedPoint(point); // Update popup state

          // Fly to the city location
          viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(point.lon, point.lat, 2000), // Zoom to the point at a height of 15,000 meters
            duration: 2, // Duration of the zoom animation (2 seconds)
          });
        }
      }
    },
    ScreenSpaceEventType.LEFT_CLICK,
  );
};

const HeatmapViewer = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const cesiumViewerRef = useRef<Viewer | null>(null);

  // Ref to store Cartesian positions of heatmap points
  const cartesianPositions = useRef<
    { position: Cartesian3; point: HeatmapPoint }[]
  >([]);

  // State for selected point
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (viewerRef.current && !cesiumViewerRef.current) {
      const initViewer = async () => {
        let viewerInstance: Viewer | null = null;

        try {
          Ion.defaultAccessToken = accessToken;

          // Initialize the Cesium Viewer
          viewerInstance = new Viewer(viewerRef.current!, {
            terrainProvider: await createWorldTerrainAsync(),
            shouldAnimate: true,
          });

          if (controller.signal.aborted) {
            viewerInstance.destroy();
            return;
          }

          // Add OpenStreetMap Buildings
          const osmBuildings = await createOsmBuildingsAsync();
          viewerInstance.scene.primitives.add(osmBuildings);

          // Add heatmap points
          addHeatmapPoints(
            viewerInstance,
            heatmapPoints,
            setSelectedPoint,
            cartesianPositions,
          );

          cesiumViewerRef.current = viewerInstance;

          // Trigger fly to bounding sphere AFTER points are added
          if (cartesianPositions.current.length > 0) {
            const boundingSphere = BoundingSphere.fromPoints(
              cartesianPositions.current.map((entry) => entry.position),
            );
            viewerInstance.camera.flyToBoundingSphere(boundingSphere, {
              duration: 3, // Duration of the fly animation
            });
          }
        } catch (error) {
          console.error(
            "Error initializing viewer with terrain or buildings. Falling back to EllipsoidTerrainProvider.",
            error,
          );

          viewerInstance = new Viewer(viewerRef.current!, {
            terrainProvider: new EllipsoidTerrainProvider(),
            shouldAnimate: true,
          });

          cesiumViewerRef.current = viewerInstance;

          // Trigger fly to bounding sphere AFTER points are added
          if (cartesianPositions.current.length > 0) {
            const boundingSphere = BoundingSphere.fromPoints(
              cartesianPositions.current.map((entry) => entry.position),
            );
            viewerInstance.camera.flyToBoundingSphere(boundingSphere, {
              duration: 3, // Duration of the fly animation
            });
          }
        }
      };

      initViewer();
    }

    return () => {
      controller.abort();
      if (cesiumViewerRef.current) {
        cesiumViewerRef.current.destroy();
        cesiumViewerRef.current = null;
      }
    };
  }, []);

  // Function to fly to bounding sphere containing all heatmap points
  const handleFlyToBoundingSphere = () => {
    if (cesiumViewerRef.current && cartesianPositions.current.length > 0) {
      const boundingSphere = BoundingSphere.fromPoints(
        cartesianPositions.current.map((entry) => entry.position),
      );
      cesiumViewerRef.current.camera.flyToBoundingSphere(boundingSphere, {
        duration: 3, // Duration of the zoom animation in seconds
      });
    }
  };

  return (
    <div>
      {/* Add Fly To Button */}
      <Button
        variant="contained"
        color="primary"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
        }}
        onClick={handleFlyToBoundingSphere}
      >
        <AutorenewIcon />
      </Button>

      {/* Map Container */}
      <Grid
        container
        ref={viewerRef}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      ></Grid>

      {/* Popup for the selected point */}
      <Fade in={!!selectedPoint} timeout={500}>
        <Card
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "250px",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            {selectedPoint ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedPoint.city}
                </Typography>
                <Typography variant="body1">
                  Population: {selectedPoint.population}
                </Typography>
              </>
            ) : null}
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
};

export default HeatmapViewer;
