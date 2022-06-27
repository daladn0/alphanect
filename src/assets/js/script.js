document.addEventListener("DOMContentLoaded", function () {
  const productsTabs = document.querySelectorAll("[data-tab].products__button");
  const productsContents = document.querySelectorAll(
    "[data-tab-content].products-img"
  );

  const apiTabs = document.querySelectorAll("[data-tab].api__tab");
  const apiContents = document.querySelectorAll(
    "[data-tab-content].api__image-wrapper"
  );
  const sliderHandle = document.querySelector("#slider-handle");
  // get the margin bottom of the first item and covert it to number ( '32px' turns into 32 )
  const tabsMargin = +window
    .getComputedStyle(apiTabs[0])
    .marginBottom.match(/\d/g)
    .join("");

  const themeBtn = document.querySelector("#theme-swapper");
  const burger = document.querySelector("#burger");
  const header = document.querySelector("#header");
  const headerMobileNav = document.querySelector("#mobile-nav");
  const headerLinks = document.querySelectorAll(".scrolling-link");

  const scrollUp = document.querySelector('#go-up')

  function toggleHeaderState() {
    checkOffset(
      50,
      () => {
        header.classList.add("active");
      },
      () => {
        header.classList.remove("active");
      }
    );
  }

  function checkAndSetTheme() {
    const isThemeExists = localStorage.getItem("theme");

    if (!isThemeExists) {
      localStorage.setItem("theme", "light");
      return;
    }

    if (isThemeExists === "light") {
      document.body.classList.remove("dark");
      return;
    }

    if (isThemeExists === "dark") {
      document.body.classList.add("dark");
      return;
    }
  }

  function checkOffset(offset, callback, callback2) {
    if (window.scrollY > offset) {
      callback();
    } else {
      callback2();
    }
  }

  function toggleTab(tab, content, allTabs, allContents) {
    allTabs.forEach((item) => item.classList.remove("active"));
    allContents.forEach((item) => item.classList.remove("active"));

    tab.classList.add("active");
    content.classList.add("active");
  }

  function toggleScrollUp() {
    if (window.scrollY > 500) {
      scrollUp.classList.add('active')
    } else {
      scrollUp.classList.remove('active')
    }
  }

  function scrollIntoViewWithOffset(selector, offset) {
    window.scrollTo({
      behavior: "smooth",
      top:
        document.querySelector(selector).getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        offset,
    });
  }

  window.addEventListener("scroll", function () {
    toggleHeaderState();
    toggleScrollUp();
  });

  scrollUp.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })

  themeBtn.addEventListener("click", function (e) {
    const isDark = document.body.classList.contains("dark");

    if (isDark) {
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
    } else {
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
    }
  });

  burger.addEventListener("click", function (e) {
    this.classList.toggle("active");
    headerMobileNav.classList.toggle("active");
    header.classList.toggle("active-important");
  });

  productsTabs.forEach((tab) => {
    const tabData = tab.getAttribute("data-tab");
    const content = document.querySelector(`[data-tab-content="${tabData}"]`);
    tab.addEventListener("click", () =>
      toggleTab(tab, content, productsTabs, productsContents)
    );
  });

  apiTabs.forEach((tab, index) => {
    const tabData = tab.getAttribute("data-tab");
    const content = document.querySelector(
      `[data-tab-content="${tabData}"].api__image-wrapper`
    );
    const tabDescription = tab.querySelector(".api__tab-text").textContent;

    tab.addEventListener("click", () => {
      sliderHandle.style.cssText = `
                height:  calc(100% / ${apiTabs.length} - ${tabsMargin / 2}px);
                top: calc((100% / ${apiTabs.length} + ${
        tabsMargin / 4
      }px) * ${index});
            `;

      // show description on small screens
      tab
        .closest(".api__toggle")
        .querySelector(".api__description").textContent = tabDescription;

      toggleTab(tab, content, apiTabs, apiContents);
    });
  });

  headerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // hide mobile nav if link was clicked within it
      const isMobileLink = this.closest(".header__mobile-nav");

      if (!!isMobileLink) {
        headerMobileNav.classList.remove("active");
        burger.classList.remove("active");
      }

      // get section's id withoug '#' char
      const sectionHref = this.getAttribute("href");

      if (!sectionHref) return;

      const section = document.querySelector(sectionHref);

      if (!section) return;

      scrollIntoViewWithOffset(sectionHref, 100);
    });
  });

  sliderHandle.style.cssText = `height:  calc(100% / ${apiTabs.length} - ${
    tabsMargin / 2
  }px);`;

  toggleHeaderState();
  toggleScrollUp();
  checkAndSetTheme();
});
