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

  //open login form
  const loginButton = menu.querySelector("#login-button");
  loginButton.addEventListener("click", function (e) {
    const target = menu.querySelector(e.currentTarget.dataset.target);
    target.classList.add("active");
  });

  //close login form
  const login = menu.querySelector("#login");
  const closeAnnotationButton = login.querySelector(".close button");
  closeAnnotationButton.addEventListener("click", () => {
    login.classList.remove("active");
  });

  //show pizza customization
  const pizzaAddButtons = menu.querySelectorAll("#pizzas .add-to-basket");
  pizzaAddButtons.forEach((pizzaButton) => {
    pizzaButton.addEventListener("click", () => {
      $("#customize-pizza").modal("show");
    });
  });

  //navigate to app page
  const appElement = menu.querySelector(".app");
  appElement.addEventListener("click", function (e) {
    window.location.href = e.currentTarget.dataset.url;
  });

  //handle change item count
  const menuItems = menu.querySelectorAll(".menu-item");
  menuItems.forEach((menuItem) => {
    const spanElement = menuItem.querySelector(".count span");
    let spanValue = parseInt(spanElement.innerHTML);

    const operation = (type) => {
      if (type === "add") {
        spanElement.innerHTML = ++spanValue;
      }
      if (type === "remove") {
        if (spanValue > 0) spanElement.innerHTML = --spanValue;
      }
    };
    menuItem.querySelector(".count .add").addEventListener("click", () => {
      operation("add");
    });

    menuItem.querySelector(".count .remove").addEventListener("click", () => {
      operation("remove");
    });
  });

  menuItems.forEach((menuItem) => {
    const clickables = menuItem.querySelectorAll(".image, .price, .info");
    clickables.forEach((clickable) => {
      clickable.addEventListener("click", (e) => {
        // addToBasket();
      });
    });
  });

  const customizable = menu.querySelector(".customizable");
  const customizeButtons = customizable.querySelectorAll(
    ".menu-item .basket .add"
  );

  customizeButtons.forEach((customizeButton) => {
    customizeButton.addEventListener("click", () => {
      $("#customize-pizza").modal("show");
      // const title = ;
      // const count;

      // const titleBox;
      // const countBox;
    });
  });

  //customize-pizza
  class Group {
    constructor(groupId) {
      this.id = groupId;
      this.groupElement = document.querySelector(groupId);
      this.getValues();
      this.addEventListeners();
      this.toggleAllButtonsEnabled();
    }

    total = 0;
    max = 1;
    min = 0;
    items = [];
    currentAddons = [];

    getItems = () => {
      const addons = this.groupElement.querySelectorAll(".addon");
      addons.forEach((addon) => {
        const { name, price, max, min, current } = addon.dataset;
        this.items = [...this.items, { name, price, max, min, current }];
      });
    };

    updateCurrentAddons = () => {
      this.currentAddons = [];

      this.items.forEach((item) => {
        if (item.current > 0) {
          this.currentAddons.push(item);
        }
      });

      window.dispatchEvent(
        new CustomEvent("update-current-addons", {
          detail: { currentAddons: this.currentAddons, groupId: this.id },
          bubbles: true,
        })
      );
    };

    getValues = () => {
      this.getItems();

      //getTotal
      this.updateTotal();

      //getMax
      this.max = parseInt(this.groupElement.dataset.max);

      //getMin
      this.min = parseInt(this.groupElement.dataset.min);

      //getCurrentAddons
      this.updateCurrentAddons();
    };

    toggleAllButtonsEnabled = () => {
      const buttons = this.groupElement.querySelectorAll(".edit button");
      buttons.forEach((button) => {
        const { addon: name, operation } = button.dataset;
        const currentItem = this.items.find((i) => i.name === name);
        const current = parseInt(currentItem.current);
        const max = parseInt(currentItem.max);
        const min = parseInt(currentItem.min);

        if (operation === "add") {
          if (current === max || this.total === this.max) {
            button.disabled = true;
          } else {
            button.disabled = false;
          }
        }

        if (operation === "remove") {
          if (current === min || this.total === this.min) {
            button.disabled = true;
          } else {
            button.disabled = false;
          }
        }
      });
    };

    updateTotal = () => {
      this.total = 0;
      this.items.forEach((item) => {
        this.total += parseInt(item.current);
      });

      window.dispatchEvent(
        new CustomEvent("update-total", {
          detail: { total: this.total, groupId: this.id },
          bubbles: true,
        })
      );
    };

    increaseItemCount = (name) => {
      const currentItem = this.items.find((i) => i.name === name);

      currentItem.current++;

      this.updateAddon(name);
    };

    decreaseItemCount = (name) => {
      const currentItem = this.items.find((i) => i.name === name);

      currentItem.current--;

      this.updateAddon(name);
    };

    updateAddon = (name) => {
      const addonElement = this.groupElement.querySelector(
        `.addon[data-name="${name}"]`
      );
      const currentItem = this.items.find((i) => i.name === name);
      addonElement.dataset.current = currentItem.current;
      addonElement.querySelector(".count").innerText = currentItem.current;

      this.updateCurrentAddons();
    };

    addEventListeners() {
      const addonButtons = this.groupElement.querySelectorAll(".edit button");
      addonButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const { addon, operation } = e.currentTarget.dataset;
          if (operation === "add") this.increaseItemCount(addon);
          if (operation === "remove") this.decreaseItemCount(addon);

          this.updateTotal();
          this.toggleAllButtonsEnabled();
        });
      });
    }
  }

  //Create groups
  let groups = [];
  const addonsGroups = menu.querySelectorAll(".addons");
  addonsGroups.forEach((addonsGroup) => {
    const id = addonsGroup.id;
    const group = new Group(`#${id}`);
    groups.push(group);
  });

  //handle update-total
  window.addEventListener("update-total", (e) => {
    e.currentTarget.innerHtml = e.detail.total;
    const updateTarget = menu.querySelector(
      `button[data-target="${e.detail.groupId}"] .total`
    );
    updateTarget.innerHTML = e.detail.total;
  });

  //handle update-addons
  window.addEventListener("update-current-addons", (e) => {
    const getAllChanges = () => {
      let changes = [];

      groups.forEach((group) => {
        changes.push(...group.currentAddons);
      });

      return changes;
    };

    const changesSpan = menu.querySelector("#customize-pizza .changes");
    const changes = getAllChanges();
    changesSpan.innerHTML = "";

    changes.forEach((addon, index) => {
      if (index === changes.length - 1) {
        changesSpan.innerHTML += `${addon.current} x ${addon.name}`;
      } else {
        changesSpan.innerHTML += `${addon.current} x ${addon.name}, `;
      }
    });
  });

  //handle change pizza size
  const sizeButtons = menu.querySelectorAll(".size-button");
  sizeButtons.forEach((sizeButton) => {
    sizeButton.addEventListener("click", () => {
      moveActiveClass(sizeButton, sizeButtons);
    });
  });

  //handle change pizza amount
  const customizePizzaAmountButton = menu.querySelectorAll(
    "#customize-pizza .amount button"
  );

  customizePizzaAmountButton.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.target);
      const { operation } = button.dataset;

      let value = parseInt(target.innerHTML);

      if (operation === "add") {
        target.innerHTML = ++value;
      }

      if (operation === "remove") {
        if (value > 0) {
          target.innerHTML = --value;
        }
      }
    });
  });
}
