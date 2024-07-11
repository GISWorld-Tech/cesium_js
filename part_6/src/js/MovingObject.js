export class MovingObject {
  constructor(viewer, filghtData, timeStepInSeconds, height = 0, speed = 10) {
    this.viewer = viewer;
    this.filghtData = filghtData;
    this.timeStepInSeconds = timeStepInSeconds;
    this.height = height;
    this.speed = speed;
    this.start = Cesium.JulianDate.fromIso8601("2024-06-10T23:10:00Z");
    this.stop = Cesium.JulianDate.addSeconds(
      this.start,
      this.filghtData.features.length * this.timeStepInSeconds,
      new Cesium.JulianDate()
    );
    this._confingTime();
    this.positionProperty = new Cesium.SampledPositionProperty();
    this._computeTimePositionAdjastment();
  }

  _confingTime = () => {
    this.viewer.clock.startTime = this.start.clone();
    this.viewer.clock.stopTime = this.stop.clone();
    this.viewer.clock.currentTime = this.start.clone();
    this.viewer.timeline.zoomTo(this.start, this.stop);
    this.viewer.clock.multiplier = 2;
    this.viewer.clock.shouldAnimate = true;
  };

  _computeTimePositionAdjastment = async () => {
    const positions = this.filghtData.features.map((feature) => {
      const lon = feature.geometry.coordinates[0];
      const lat = feature.geometry.coordinates[1];
      return Cesium.Cartographic.fromDegrees(lon, lat);
    });

    const updatedPostions = await Cesium.sampleTerrainMostDetailed(
      this.viewer.terrainProvider,
      positions
    );

    updatedPostions.forEach((cartographic, i) => {
      // Declare the time for this individual sample and store it in a new JulianDate instance.
      const time = Cesium.JulianDate.addSeconds(
        this.start,
        i * this.timeStepInSeconds,
        new Cesium.JulianDate()
      );
      const position = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
      );
      // Store the position along with its timestamp.
      // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
      this.positionProperty.addSample(time, position);

      this.viewer.entities.add({
        description: `Location: (${cartographic.longitude}, ${cartographic.latitude}, ${cartographic.height})`,
        position: position,
        point: { pixelSize: 5, color: Cesium.Color.RED },
      });
    });
  };

  addMovableEntityToViewer = (uri) => {
    // Load the glTF model from Cesium ion.
    const airplaneEntity = this.viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({ start: this.start, stop: this.stop }),
      ]),
      position: this.positionProperty,
      // Attach the 3D model instead of the green point.
      model: { uri: uri },
      // Automatically compute the orientation from the position.
      orientation: new Cesium.VelocityOrientationProperty(
        this.positionProperty
      ),
      //   path: new Cesium.PathGraphics({ width: 3 }),
      viewFrom: new Cesium.Cartesian3(-100, 0, 100),
    });

    this.viewer.trackedEntity = airplaneEntity;
  };
}
