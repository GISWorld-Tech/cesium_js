export class MovingObject {
  constructor(viewer, flightPath) {
    this.viewer = viewer;
    this.flightPath = flightPath;
    this.start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
    this.stop = Cesium.JulianDate.addSeconds(
      this.start,
      this.flightPath.features.length,
      new Cesium.JulianDate()
    );
    console.log(this.start);
    console.log(this.stop);
    this._configTime();
    this.movableObjPosition = this._computeTimePositionadjastment(
      this.flightPath
    );
  }

  _configTime = () => {
    //Make sure viewer is at the desired time.
    this.viewer.clock.startTime = this.start.clone();
    this.viewer.clock.stopTime = this.stop.clone();
    this.viewer.clock.currentTime = this.start.clone();
    //Loop at the end
    this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    this.viewer.clock.multiplier = 4;

    //Set timeline to simulation bounds
    this.viewer.timeline.zoomTo(this.start, this.stop);
  };

  _computeTimePositionadjastment = (coordArray) => {
    const property = new Cesium.SampledPositionProperty();
    for (let i = 0; i <= coordArray.features.length - 1; i += 1) {
      const time = Cesium.JulianDate.addSeconds(
        this.start,
        i,
        new Cesium.JulianDate()
      );
      console.log(time);
      let lon = coordArray.features[i].geometry.coordinates[0];
      let lat = coordArray.features[i].geometry.coordinates[1];
      let alt = 0.0;
      const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
      property.addSample(time, position);
    }
    return property;
  };

  addMovableEntityToViewer = (url) => {
    this.viewer.entities.add({
      //Set the entity availability to the same interval as the simulation time.
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: this.start,
          stop: this.stop,
        }),
      ]),

      //Use our computed positions
      position: this.movableObjPosition,

      //Automatically compute orientation based on position movement.
      orientation: new Cesium.VelocityOrientationProperty(
        this.movableObjPosition
      ),

      //Load the Cesium plane model to represent the entity
      model: {
        uri: url,
        id: "traktor",
      },
    });
  };
}
