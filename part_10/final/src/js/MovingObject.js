import {
  Cartesian3,
  Cartographic,
  Color,
  HeadingPitchRange,
  JulianDate,
  Math,
  SampledPositionProperty,
  sampleTerrainMostDetailed,
  TimeInterval,
  TimeIntervalCollection,
  VelocityOrientationProperty,
} from "cesium";

export class MovingObject {
  constructor(
    viewer,
    flightData,
    timeStepInSeconds,
    objType = "aircraft",
    height = 0,
    speed = 2,
  ) {
    this.viewer = viewer;
    this.filghtData = flightData;
    this.timeStepInSeconds = timeStepInSeconds;
    this.height = height;
    this.objType = objType;
    this.speed = speed;
    this.start = JulianDate.fromIso8601("2024-06-10T23:10:00Z");
    this.stop = JulianDate.addSeconds(
      this.start,
      this.filghtData.features.length * this.timeStepInSeconds,
      new JulianDate(),
    );
    this._confingTime();
    this.positionProperty = new SampledPositionProperty();
    this._computeTimePositionAdjustment();
  }

  _confingTime = () => {
    this.viewer.clock.startTime = this.start.clone();
    this.viewer.clock.stopTime = this.stop.clone();
    this.viewer.clock.currentTime = this.start.clone();
    this.viewer.timeline.zoomTo(this.start, this.stop);
    this.viewer.clock.multiplier = this.speed;
    this.viewer.clock.shouldAnimate = true;
  };

  _computeTimePositionAdjustment = async () => {
    const positions = this.filghtData.features.map((feature) => {
      const lon = feature.geometry.coordinates[0];
      const lat = feature.geometry.coordinates[1];
      this.height = feature.properties.height;
      return Cartographic.fromDegrees(lon, lat);
    });
    const updatedPositions = await sampleTerrainMostDetailed(
      this.viewer.terrainProvider,
      positions,
    );
    updatedPositions.forEach((cartographic, i) => {
      const time = JulianDate.addSeconds(
        this.start,
        i * this.timeStepInSeconds,
        new JulianDate(),
      );
      const position = Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        this.objType === "aircraft"
          ? cartographic.height + i * 0.9
          : cartographic.height,
      );
      this.positionProperty.addSample(time, position);
      const pointEntity = this.viewer.entities.add({
        description: `Location: (${cartographic.longitude}, ${cartographic.latitude}, ${cartographic.height})`,
        position: position,
        point: { pixelSize: 5, color: Color.RED },
      });

      this.viewer.flyTo(pointEntity, {
        offset: new HeadingPitchRange(
          Math.toRadians(0), // Heading
          Math.toRadians(-30), // Pitch
          250, // Distance
        ),
      });
    });
  };

  addMovableEntityToViewer = (uri) => {
    this.viewer.entities.add({
      availability: new TimeIntervalCollection([
        new TimeInterval({ start: this.start, stop: this.stop }),
      ]),
      position: this.positionProperty,
      model: { uri: uri },
      orientation: new VelocityOrientationProperty(this.positionProperty),
      viewFrom: new Cartesian3(-100, 0, 100),
    });
  };
}