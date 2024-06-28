export function createSelectElement(options, parentId) {
  const parentElement = document.getElementById(parentId);
  const selectElement = document.createElement("select");
  selectElement.className = "cesium-button";
  selectElement.id = "dropdown";

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.textContent;
    selectElement.appendChild(optionElement)
  });

  parentElement.appendChild(selectElement);
  return selectElement;
}
