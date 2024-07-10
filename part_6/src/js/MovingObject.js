export class MovingObject {
  constructor(viewer, flightData, timeStepInSeconds, height = 0, speed = 2) {
    // new 1
    this.viewer = viewer;
    this.height = height;
    this.speed = speed;
    this.flightData = flightData;
    this.timeStepInSeconds = timeStepInSeconds;
    this.start = Cesium.JulianDate.fromIso8601("2024-07-03T23:10:00Z");
    this.stop = Cesium.JulianDate.addSeconds(
      this.start,
      this.flightData.features.length * this.timeStepInSeconds,
      new Cesium.JulianDate()
    );
    this._configTime();
    // new 2
    this.positionProperty = new Cesium.SampledPositionProperty();
    this._computeTimePositionAdjustment();
  }

  _configTime = () => {
    this.viewer.clock.startTime = this.start.clone();
    this.viewer.clock.stopTime = this.stop.clone();
    this.viewer.clock.currentTime = this.start.clone();
    this.viewer.timeline.zoomTo(this.start, this.stop);
    this.viewer.clock.multiplier = this.speed;
    this.viewer.clock.shouldAnimate = true;
  };

  _computeTimePositionAdjustment = async () => {
    const positions = this.flightData.features.map((feature) => {
      const lon = feature.geometry.coordinates[0];
      const lat = feature.geometry.coordinates[1];
      return Cesium.Cartographic.fromDegrees(lon, lat);
    });

    // Sample the terrain to get the heights
    const updatedPositions = await Cesium.sampleTerrainMostDetailed(
      this.viewer.terrainProvider,
      positions
    );

    updatedPositions.forEach((cartographic, i) => {
      const time = Cesium.JulianDate.addSeconds(
        this.start,
        i * this.timeStepInSeconds,
        new Cesium.JulianDate()
      );
      const position = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height + this.height
      );
      this.positionProperty.addSample(time, position);

      this.viewer.entities.add({
        description: `Location: (${cartographic.longitude}, ${cartographic.latitude}, ${cartographic.height} + this.height)`,
        position: position,
        point: { pixelSize: 5, color: Cesium.Color.RED },
      });
    });
  };

  addMovableEntityToViewer = (uri) => {
    const airplaneEntity = this.viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({ start: this.start, stop: this.stop }),
      ]),
      position: this.positionProperty,
      model: { uri: uri },
      orientation: new Cesium.VelocityOrientationProperty(
        this.positionProperty
      ),
      path: new Cesium.PathGraphics({ width: 1 }),
      viewFrom: new Cesium.Cartesian3(0, 30, 30),
    });

    this.viewer.trackedEntity = airplaneEntity;
  };
}
