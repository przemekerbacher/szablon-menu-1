const addToBasketButtons = document.querySelectorAll(".add-to-basket");

if (addToBasketButtons) {
  addToBasketButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const iconAdd = button.querySelector(".add");
      const iconOk = button.querySelector(".ok");

      button.classList.toggle("active");
      if (iconAdd) iconAdd.classList.toggle("hide");
      if (iconOk) iconOk.classList.toggle("hide");
    });
  });
}

//display-category
var categorySelectors = document.querySelectorAll(".category-selector");
if (categorySelectors)
  categorySelectors.forEach((categorySelector) => {
    categorySelector.addEventListener("click", function () {
      const categories = document.querySelectorAll(".category");
      const target = document.querySelector(this.getAttribute("data-target"));
      moveActiveClass(categorySelector, categorySelectors);
      moveActiveClass(target, categories);
    });
  });

moveActiveClass = (selected, all) => {
  all.forEach((element) => {
    if (element === selected) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  });
};

//add collapsible effect
const collasibleElements = document.querySelectorAll(
  ".collapsible, .button-collapsible"
);

if (collasibleElements)
  collasibleElements.forEach((element) => {
    element.addEventListener("click", function (e) {
      const content = document.querySelector(
        e.currentTarget.getAttribute("data-target")
      );

      e.currentTarget.classList.toggle("active");
      toggleDisplay(content);
    });
  });

const toggleDisplay = (content) => {
  if (content)
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      content.classList.remove("active");
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("active");
    }
};
