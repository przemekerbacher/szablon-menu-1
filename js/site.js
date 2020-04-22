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
