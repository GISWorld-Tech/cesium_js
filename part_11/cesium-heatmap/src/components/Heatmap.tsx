// src/components/Heatmap.tsx

import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { Button } from '@mui/material';

const Heatmap = () => {
	const viewerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (viewerRef.current) {
			const viewer = new Cesium.Viewer(viewerRef.current, {
				terrainProvider: Cesium.createWorldTerrain(),
				imageryProvider: Cesium.IonImageryProvider.fromUrl(
					'https://maps.googleapis.com/maps/api/staticmap?center=12.9716,77.5946&zoom=12&size=800x800'
				),
				shouldAnimate: true,
			});

			// Example: Add heatmap using Cesium's DataSource
			const points = [
				{ lon: 77.5946, lat: 12.9716, intensity: 100 },
				{ lon: 77.5947, lat: 12.9717, intensity: 90 },
				{ lon: 77.5948, lat: 12.9718, intensity: 80 },
				{ lon: 77.5949, lat: 12.9719, intensity: 70 },
				{ lon: 77.5950, lat: 12.9720, intensity: 60 },
			];

			const pointCollection = new Cesium.PointPrimitiveCollection();
			viewer.scene.primitives.add(pointCollection);

			points.forEach((point) => {
				pointCollection.add({
					position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
					color: Cesium.Color.fromAlpha(Cesium.Color.RED, point.intensity / 100),
					pixelSize: 15,
				});
			});

			return () => {
				viewer.destroy();
			};
		}
	}, []);

	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				onClick={() => {
					alert('Heatmap interaction button!');
				}}
			>
				Interact with Heatmap
			</Button>
			<div
				ref={viewerRef}
				style={{
					width: '100%',
					height: '500px',
					position: 'relative',
				}}
			></div>
		</div>
	);
};

export default Heatmap;
