const roofType = {
  features: [
    { value: 1000, description: "Flat Roof", color: "#ff0000" }, // Red
    { value: 2100, description: "Shed Roof", color: "#ff4000" }, // Orange-Red
    { value: 2200, description: "Offset Shed Roof", color: "#ff8000" }, // Dark Orange
    { value: 3100, description: "Gabled Roof", color: "#ffbf00" }, // Orange-Yellow
    { value: 3200, description: "Hipped Roof", color: "#ffff00" }, // Yellow
    { value: 3300, description: "Half-Hipped Roof", color: "#ffff80" }, // Light Yellow
    { value: 3400, description: "Mansard Roof", color: "#ffffbf" }, // Very Light Yellow
    { value: 3500, description: "Pyramid Roof", color: "#ffdf80" }, // Light Orange-Yellow
    { value: 3600, description: "Conical Roof", color: "#ffbf40" }, // Orange
    { value: 3700, description: "Dome Roof", color: "#ff9f00" }, // Dark Yellow-Orange
    { value: 3800, description: "Shed Roof", color: "#ff7f00" }, // Orange
    { value: 3900, description: "Arch Roof", color: "#ff5f00" }, // Dark Orange-Red
    { value: 4000, description: "Tower Roof", color: "#ff3f00" }, // Darker Orange-Red
    { value: 5000, description: "Mixed Form", color: "#ff1f00" }, // Dark Red-Orange
    { value: 9999, description: "Other", color: "#ff0000" }, // Red
  ],
};

const terrainHeight = {
  conditions: [
    { height: 340, color: "darkblue" }, // Dark blue for heights above 340
    { height: 330, color: "#00008b" }, // DarkSlateBlue
    { height: 320, color: "#0000ff" }, // Blue
    { height: 310, color: "#1e90ff" }, // DodgerBlue
    { height: 300, color: "#87ceeb" }, // SkyBlue
    { height: 0, color: "#b0e0e6" }, // PowderBlue for heights 300 or below
  ],
};

export { roofType, terrainHeight };
