import { useEffect, useRef, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  BoundingSphere,
  Cartesian3,
  createOsmBuildingsAsync,
  createWorldTerrainAsync,
  EllipsoidTerrainProvider,
  Ion,
  Viewer,
} from "cesium";
import { accessToken } from "../app/AssetsConfig.ts";
import Grid from "@mui/material/Grid2";
import { heatmapPoints } from "../app/pointHeatMap.ts";
import { Button, Card, CardContent, Fade, Typography } from "@mui/material";
import { HeatmapPoint } from "../types";
import { addHeatmapPoints } from "../cesium/addHeatmapPoints.ts";

const HeatmapViewer = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const cesiumViewerRef = useRef<Viewer | null>(null);

  const cartesianPositions = useRef<
    { position: Cartesian3; point: HeatmapPoint }[]
  >([]);

  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (viewerRef.current && !cesiumViewerRef.current) {
      const initViewer = async () => {
        let viewerInstance: Viewer | null = null;

        try {
          Ion.defaultAccessToken = accessToken;

          viewerInstance = new Viewer(viewerRef.current!, {
            terrainProvider: await createWorldTerrainAsync(),
            shouldAnimate: true,
          });

          if (controller.signal.aborted) {
            viewerInstance.destroy();
            return;
          }

          const osmBuildings = await createOsmBuildingsAsync();
          viewerInstance.scene.primitives.add(osmBuildings);

          addHeatmapPoints(
            viewerInstance,
            heatmapPoints,
            setSelectedPoint,
            cartesianPositions,
          );

          cesiumViewerRef.current = viewerInstance;

          if (cartesianPositions.current.length > 0) {
            const boundingSphere = BoundingSphere.fromPoints(
              cartesianPositions.current.map((entry) => entry.position),
            );
            viewerInstance.camera.flyToBoundingSphere(boundingSphere, {
              duration: 3,
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

          if (cartesianPositions.current.length > 0) {
            const boundingSphere = BoundingSphere.fromPoints(
              cartesianPositions.current.map((entry) => entry.position),
            );
            viewerInstance.camera.flyToBoundingSphere(boundingSphere, {
              duration: 3,
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

  const handleFlyToBoundingSphere = () => {
    if (cesiumViewerRef.current && cartesianPositions.current.length > 0) {
      const boundingSphere = BoundingSphere.fromPoints(
        cartesianPositions.current.map((entry) => entry.position),
      );
      cesiumViewerRef.current.camera.flyToBoundingSphere(boundingSphere, {
        duration: 3,
      });
    }
  };

  return (
    <div>
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

      <Grid
        container
        ref={viewerRef}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      ></Grid>

      <Fade in={!!selectedPoint} timeout={500}>
        <Card
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "2rem",
            width: "15rem",
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
