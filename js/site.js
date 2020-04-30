const menu = document.querySelector(".menu");
if (menu) {
  //display-category on click

  //get buttons
  var categorySelectors = menu.querySelectorAll(".category-selector");
  if (categorySelectors)
    categorySelectors.forEach((categorySelector) => {
      categorySelector.addEventListener("click", function () {
        //get all containers
        const categories = menu.querySelectorAll(".category");

        //get current container
        const target = menu.querySelector(this.getAttribute("data-target"));

        //set active clas only for selected element
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

  //get collapsible elements
  const collasibleElements = menu.querySelectorAll(
    ".collapsible, .button-collapsible"
  );

  if (collasibleElements)
    collasibleElements.forEach((element) => {
      element.addEventListener("click", function (e) {
        //get target to expand
        const content = menu.querySelector(
          e.currentTarget.getAttribute("data-target")
        );

        //toggle collapsible element active class
        e.currentTarget.classList.toggle("active");

        //expand or collapse target
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

  //handle show window
  const showWindowButtons = menu.querySelectorAll(".show-window");
  if (showWindowButtons) {
    showWindowButtons.forEach((button) => {
      const hideTarget = (e) => {
        e.preventDefault();

        const target = menu.querySelector(e.currentTarget.dataset.target);
        target.classList.add("active");
      };
      button.addEventListener("click", hideTarget);
    });
  }
  //handle close hidden windows
  const hideWindowButtons = menu.querySelectorAll(".hide-window");
  if (hideWindowButtons) {
    hideWindowButtons.forEach((button) => {
      const hideTarget = (e) => {
        e.preventDefault();

        const target = menu.querySelector(e.currentTarget.dataset.target);
        target.classList.remove("active");
      };
      button.addEventListener("click", hideTarget);
    });
  }

  //show pizza customization
  const pizzaAddButtons = menu.querySelectorAll("#pizzas .add-to-basket");
  if (pizzaAddButtons)
    pizzaAddButtons.forEach((pizzaButton) => {
      pizzaButton.addEventListener("click", () => {
        $("#customize-pizza").modal("show");
      });
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

  //handle counter
  const counters = menu.querySelectorAll(".counter");
  if (counters)
    counters.forEach((counter) => {
      const calculate = (type, target) => {
        let currentValue = parseInt(target.innerHTML);
        if (type === "add") {
          target.innerHTML = ++currentValue;
        }
        if (type === "remove") {
          if (currentValue > 0) target.innerHTML = --currentValue;
        }
      };

      const handleClick = (e) => {
        const target = counter.querySelector(e.currentTarget.dataset.target);
        const operation = e.currentTarget.dataset.operation;

        calculate(operation, target);
      };

      const add = counter.querySelector(".add");
      const remove = counter.querySelector(".remove");

      add.addEventListener("click", handleClick);
      remove.addEventListener("click", handleClick);
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

    const updateChanges = () => {
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
    };

    updateChanges();
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
