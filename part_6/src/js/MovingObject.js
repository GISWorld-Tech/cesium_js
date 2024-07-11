export class MovingObject {
  constructor(viewer, filghtData, timeStepInSeconds ) {
    this.viewer = viewer;
    this.filghtData = filghtData;
    this.timeStepInSeconds = timeStepInSeconds;
    this.start = Cesium.JulianDate.fromIso8601("2024-06-10T23:10:00Z");
    this.stop = Cesium.JulianDate.addSeconds(
      this.start,
      this.filghtData.features.length * this.timeStepInSeconds,
      new Cesium.JulianDate()
    );
    this._confingTime();
    this.positionProperty = this._computeTimePositionAdjastment();
  }

  _confingTime = () => {
    this.viewer.clock.startTime = this.start.clone();
    this.viewer.clock.stopTime = this.stop.clone();
    this.viewer.clock.currentTime = this.start.clone();
    this.viewer.timeline.zoomTo(this.start, this.stop);
    this.viewer.clock.multiplier = 2;
    this.viewer.clock.shouldAnimate = true;
  };

  _computeTimePositionAdjastment = () => {
    const positionProperty = new Cesium.SampledPositionProperty();
    this.filghtData.features.forEach((feature, i) => {
      // Declare the time for this individual sample and store it in a new JulianDate instance.
      const time = Cesium.JulianDate.addSeconds(
        this.start,
        i * this.timeStepInSeconds,
        new Cesium.JulianDate()
      );
      let lon = feature.geometry.coordinates[0];
      let lat = feature.geometry.coordinates[1];
      let alt = feature.properties.height;
      const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
      // Store the position along with its timestamp.
      // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
      positionProperty.addSample(time, position);

      this.viewer.entities.add({
        description: `Location: (${lon}, ${lat}, ${alt})`,
        position: position,
        point: { pixelSize: 5, color: Cesium.Color.RED },
      });
    });
    return positionProperty;
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
      viewFrom: new Cesium.Cartesian3(-100, 0, 100)
    });

    this.viewer.trackedEntity = airplaneEntity;
  };
}
