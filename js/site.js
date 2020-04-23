const menu = document.querySelector(".menu");
if (menu) {
  const addToBasketButtons = menu.querySelectorAll(".add-to-basket");

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
  var categorySelectors = menu.querySelectorAll(".category-selector");
  if (categorySelectors)
    categorySelectors.forEach((categorySelector) => {
      categorySelector.addEventListener("click", function () {
        const categories = menu.querySelectorAll(".category");
        const target = menu.querySelector(this.getAttribute("data-target"));
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
  const collasibleElements = menu.querySelectorAll(
    ".collapsible, .button-collapsible"
  );

  if (collasibleElements)
    collasibleElements.forEach((element) => {
      element.addEventListener("click", function (e) {
        const content = menu.querySelector(
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

  //open basket
  const basketButton = menu.querySelector("#basket");
  basketButton.addEventListener("click", function (e) {
    const target = menu.querySelector(e.currentTarget.dataset.target);
    target.classList.add("active");
  });

  //close basket
  const order = menu.querySelector("#order");
  const closeBasketButton = order.querySelector(".close button");
  closeBasketButton.addEventListener("click", () => {
    order.classList.remove("active");
  });

  //open annotations
  const annotationButton = menu.querySelector("#annotation-button");
  annotationButton.addEventListener("click", function (e) {
    const target = menu.querySelector(e.currentTarget.dataset.target);
    target.classList.add("active");
    console.log(target);
  });

  //close basket
  const annotations = menu.querySelector("#annotation");
  const closeAnnotationButton = annotations.querySelector(".close button");
  closeAnnotationButton.addEventListener("click", () => {
    annotations.classList.remove("active");
  });
}
