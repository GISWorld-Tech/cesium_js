const cesiumAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYjk3YjExMi1kOTNiLTRlZTEtYjViYi1jYzBlZmEyNDc2M2EiLCJpZCI6MTkxNTA0LCJpYXQiOjE3MTA2NzE0OTR9.wsqpfLYl8M3mNIw3j__yiru6cEUXno_EyXq8Cyt7jLU";

const targetLocation = {
  destination: Cesium.Cartesian3.fromDegrees(9.041914842288406, 48.833119059728752, 20),
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-15.0),
  },
};

const url = {
    'treeGlb' : './glbData/tree.glb'
}

export { cesiumAccessToken, targetLocation, url };