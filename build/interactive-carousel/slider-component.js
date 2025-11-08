/******/ (() => { // webpackBootstrap
/*!******************************************************!*\
  !*** ./src/interactive-carousel/slider-component.js ***!
  \******************************************************/
function waitForElement(selector) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      }
    }, 100);
  });
}
class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('.slider');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.carouselCounter = this.querySelector('.interactive-carousel__counter');
    this.currentPageElement = this.querySelector('.interactive-carousel__counter--current');
    this.pageTotalElement = this.querySelector('.interactive-carousel__counter--total');
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');
    if (!this.slider || !this.nextButton) return;
    this.initPages();
    const resizeObserver = new ResizeObserver(entries => this.initPages());
    resizeObserver.observe(this.slider);
    this.slider.addEventListener('scroll', this.update.bind(this));
    this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
    document.querySelectorAll('.wp-block-interactive-carousel-interactive-carousel').forEach(el => {
      el.addEventListener('slider-update', this.resetPages.bind(this));
      el.addEventListener('posts-update', this.resetPages.bind(this));
      el.addEventListener('products-update', this.resetPages.bind(this));
    });
  }
  initPages() {
    this.dotNav = this.querySelector('.interactive-carousel__dots-navigation');
    this.sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
    if (this.sliderItemsToShow.length > 1) {
      this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
      this.slidesPerPage = Math.round((this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset);
      this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    } else if (this.sliderItemsToShow.length = 1) {
      this.totalPages = 1;
    } else return;
    if (this.dotNav) {
      this.processDots();
    }
    this.update();
  }
  resetPages() {
    this.slider = this.querySelector('.slider');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }
  update() {
    if (!this.slider || !this.nextButton) return;
    const previousPage = this.currentPage;
    if (this.slider.scrollLeft > 0 && this.sliderItemOffset > 0) {
      this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;
    } else {
      this.currentPage = 1;
    }
    if (this.dotNav && this.dotNav.children.length > 0) {
      this.dotButtons = this.dotNav.querySelectorAll('button');
    }
    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage.toString();
      this.pageTotalElement.textContent = this.totalPages;
    }
    if (this.currentPage != previousPage) {
      this.dispatchEvent(new CustomEvent('slideChanged', {
        detail: {
          currentPage: this.currentPage,
          currentElement: this.sliderItemsToShow[this.currentPage - 1]
        }
      }));
    }
    if (this.isSlideVisible(this.sliderItemsToShow[0]) && this.slider.scrollLeft === 0) {
      this.prevButton.setAttribute('disabled', 'disabled');
    } else {
      this.prevButton.removeAttribute('disabled');
    }
    if (this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])) {
      this.nextButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
    if (this.dotButtons) {
      this.dotNav.addEventListener('click', this.onButtonClick.bind(this));
      this.dotButtons.forEach((item, index) => {
        item.classList.remove('dot-current');
        if (index + 1 == this.currentPage) {
          item.classList.add('dot-current');
        }
      });
    }
  }
  processDots() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.pageTotalElement.textContent; i++) {
      let dotBtn = document.createElement('button');
      let dotBtnSpan = document.createElement('span');
      dotBtn.classList.add('dot-nav-item');
      dotBtn.setAttribute('name', 'dot');
      dotBtn.setAttribute('data-step', i);
      dotBtnSpan.innerHTML = `Go to Slide ${i + 1}`;
      dotBtnSpan.classList.add('visually-hidden');
      dotBtn.append(dotBtnSpan);
      fragment.appendChild(dotBtn);
    }
    this.dotNav.replaceChildren(fragment);
    this.update();
  }
  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset;
    return element.offsetLeft + element.clientWidth <= lastVisibleSlide && element.offsetLeft >= this.slider.scrollLeft;
  }
  onButtonClick(event) {
    event.preventDefault();
    let step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + step * this.sliderItemOffset : this.slider.scrollLeft - step * this.sliderItemOffset;

    // note that the slides need to be the same width for this functionality
    if (event.target.name === 'dot') {
      step = event.target.dataset.step;
      this.slideScrollPosition = step * this.sliderItemOffset;
    }
    this.slider.scrollTo({
      left: this.slideScrollPosition
    });
  }
}
waitForElement('.slider__slide').then(element => {
  customElements.define('slider-component', SliderComponent);
});
/******/ })()
;
//# sourceMappingURL=slider-component.js.map