export function createSelectElement(options, parentId) {
  const parentElement = document.getElementById(parentId);
  if (!parentElement) {
    console.error(`Element with id ${parentId} not found`);
    return null;
  }

  const selectElement = document.createElement("select");
  selectElement.className = "cesium-button";
  selectElement.id = "dropdown";

  options.forEach((optionData) => {
    const option = document.createElement("option");
    option.value = optionData.value;
    option.textContent = optionData.text;
    selectElement.appendChild(option);
  });

  parentElement.appendChild(selectElement);
  return selectElement;
}
