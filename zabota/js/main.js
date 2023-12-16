const header = document.querySelector(".header")
const fixedBlocks = document.querySelectorAll(".fixed-block")
const iconMenu = document.querySelector('.icon-menu');
const allPopups = document.querySelectorAll(".modal")
const successPopup = document.querySelector(".success-modal")
const errorPopup = document.querySelector(".error-modal")
const newsFilter = document.querySelector(".news__form")
let animSpd = 400
//enablescroll
function enableScroll() {
  if (document.querySelectorAll('.fixed-block')) {
    document.querySelectorAll('.fixed-block').forEach(block => block.style.paddingRight = '0px')
  }
  document.body.style.paddingRight = '0px'
  document.body.classList.remove("no-scroll")
}
//disable scroll
function disableScroll() {
  let paddingValue = window.innerWidth > 325 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
  if (fixedBlocks) {
    fixedBlocks.forEach(block => block.style.paddingRight = paddingValue)
  }
  document.body.style.paddingRight = paddingValue
  document.body.classList.add("no-scroll");
}
//tabswitch
function tabSwitch(nav,block) {
  nav.forEach((item,idx) => {
    item.addEventListener("click", () => {
      let href = item.getAttribute("data-nav")
      nav.forEach(el => {
        el.classList.remove("active")
      })
      block.forEach(el => {
        el.classList.remove("active")
      })
      item.classList.add("active")
      block[idx].classList.add("active")
      item.style.opacity = "0"
        block[idx].style.opacity = "0"
      setTimeout(() => {
        item.style.opacity = "1"
        block[idx].style.opacity = "1"
      }, 0);
    })
  });
}
let popups = {
  openPopup: function (popup) {
    if (!iconMenu.classList.contains("active")) {
      disableScroll()
    }
    popup.classList.add("open")
    allPopups.forEach(pop => {
      pop.addEventListener("click", e => {
        if (!pop.querySelector(".modal__content").contains(e.target) || pop.querySelector(".modal__close").contains(e.target)) {
          this.closePopup(pop)
        }
      })
    })
  },
  closePopup: function (popup) {
    popup.classList.remove("open")
    setTimeout(() => {
      if (!iconMenu.classList.contains("active")) {
        enableScroll()
      }
    }, animSpd);
  }
}
//form onsubmit
function formSuccess(form) {
  form.querySelectorAll(".item-form").forEach(item => item.classList.remove("error"))
  form.querySelectorAll("input").forEach(inp => {
    if (!["hidden", "checkbox", "radio"].includes(inp.type) ) {
      inp.value = ""      
    }
  })
  if (form.querySelector("textarea")) {
    form.querySelector("textarea").value = ""
  }
  popups.openPopup(successPopup)
}
//menu toggle
iconMenu.addEventListener("click", () => {
  if (!iconMenu.classList.contains("active")) {
    disableScroll()
  } else {
    enableScroll()
  }
  window.scrollTo(0,0)
  iconMenu.classList.toggle("active")
})
//menu item onclick
const itemMenu = document.querySelectorAll(".menu__item")
itemMenu.forEach(item => {
  item.querySelector(".menu__link").addEventListener("click", e => {
    if (window.innerWidth <= 991 && item.querySelector(".menu__link svg")) {
      e.preventDefault()
      if (!item.classList.contains("active")) {
        itemMenu.forEach(el=> el.classList.remove("active"))
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    }
  })
})
// news filter
let setSelect
if (newsFilter) {
  let select = newsFilter.querySelector(".select-custom")
  setSelect = {
    allInp: select.querySelector(".item-checkbox.all input"),
    inputs: Array.from(select.querySelectorAll(".item-checkbox input")).slice(1),
    checkedInpMass: [],
    openSelect: function(select) {
      select.classList.add("open");
      select.setAttribute("aria-expanded", true);
      document.addEventListener("click", function clickOutside(e) {
        if (!select.contains(e.target)) {
          setSelect.closeSelect(select)
          document.removeEventListener('click', clickOutside);
        }
      });
    },
    closeSelect: function(select) {
      select.classList.remove("open");
      select.setAttribute("aria-expanded", false);
    },
    setSelectTxt: function() {
      if ( this.allInp.checked ) {
        this.checkedInpMass = []
        this.inputs.forEach(item => {
          item.checked = true
          this.checkedInpMass.unshift(item.nextElementSibling.textContent)
        })
        select.querySelector(".select-custom__selected span").textContent = "Все"
      } else if ( !this.allInp.checked && this.checkedInpMass.length > 0){
        select.querySelector(".select-custom__selected span").textContent = this.checkedInpMass.join(", ")
      } else {
        select.querySelector(".select-custom__selected span").textContent = "Выберите"
      }
    }
  }
  select.querySelector(".select-custom__selected").addEventListener("click", () => {
    if (!select.classList.contains("open")) {
      setSelect.openSelect(select)
    } else {
      setSelect.closeSelect(select)
    }
  })
  setSelect.inputs.forEach(item => {
    if (item.checked) {
      setSelect.checkedInpMass.unshift(item.nextElementSibling.textContent)
      setSelect.setSelectTxt()
    }
    item.addEventListener("change", () => {
      if (item.checked) {
        setSelect.checkedInpMass.unshift(item.nextElementSibling.textContent)
      } else {
        setSelect.checkedInpMass = setSelect.checkedInpMass.filter(el => el !== item.nextElementSibling.textContent)
      }
      if (setSelect.inputs.every(item => item.checked )) {
        setSelect.allInp.checked = true
      } else {
        setSelect.allInp.checked = false
      }
      select.querySelectorAll("button").forEach(btn => btn.disabled = false)
      setSelect.setSelectTxt()
    })
  })
  setSelect.allInp.addEventListener("change",()=> {
    select.querySelectorAll("button").forEach(btn => btn.disabled = false)
    if (setSelect.inputs.every(item => item.checked )) {
      setSelect.inputs.forEach(item => item.checked = false)
      setSelect.checkedInpMass = []
    }
    setSelect.setSelectTxt()
  })
  newsFilter.addEventListener("reset", ()=> {
    select.querySelectorAll(".item-checkbox input").forEach(item => {
      item.removeAttribute("checked")
      setSelect.checkedInpMass = []
      setSelect.setSelectTxt()
    })
  })
}
//checked options
function newsFormSubmit(form) {
  let select = form.querySelector(".select-custom")
  if (select.querySelector(".item-checkbox.all input").checked) {
    select.querySelectorAll("button").forEach(btn => btn.disabled = true)
  } else {
    select.querySelectorAll("button").forEach(btn => btn.disabled = false)
  }
  setSelect.closeSelect(select)
}
// switch active tab/block
const switchBlock = document.querySelectorAll(".switch-block")
if (switchBlock) {
  switchBlock.forEach(item => {
    tabSwitch(item.querySelectorAll("[data-nav]"), item.querySelectorAll("[data-block]"))
  })
}
//custom fancybox
const fancyItems = document.querySelectorAll("[data-fancy]")
fancyItems.forEach(item => {
  item.addEventListener("click", () => {
    let imgSrc = []
    let objectFit = item.getAttribute("data-fit") ? item.getAttribute("data-fit") : ""
    let val = item.getAttribute("data-fancy")
    fancyItems.forEach(el => {
      if (!el.closest(".swiper-slide-duplicate") && el.getAttribute("data-fancy") === val) {
        imgSrc.push(el.getAttribute("data-src"))
      }
    })
    let initialSl = imgSrc.indexOf(item.getAttribute("data-src"))
    document.querySelector("footer").insertAdjacentHTML('afterend', `
    <div class="modal fancy-modal">
        <div class="modal__overlay">
          <div class="modal__top">
            <div class="container">
              <button class="modal__close" aria-label="Закрыть всплывающее окно">    
                <svg id="icon-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none">
                  <path d="M1.875 28.125L28.3915 1.6085" stroke-width="2" stroke-linecap="round"/>
                  <path d="M1.875 1.875L28.3915 28.3915" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="modal__content">
               <div class="modal__btns">
                  <div class="container">
                    <button class="btn swiper-btn swiper-btn--prev">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 26" fill="none">
                        <path d="M14 1L2 13L14 25" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                    <button class="btn swiper-btn swiper-btn--next">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 26" fill="none">
                        <path d="M0.999999 25L13 13L0.999999 1" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
               </div>
               <div class="swiper fancy-swiper">
                   <div class="swiper-wrapper">
                      ${imgSrc.map(item => `<div class="swiper-slide ${objectFit}">
                            <div class="swiper-img">
                                <img src=${item} alt="">
                            </div>
                        </div>`
    ).join("")}
                   </div>
               </div>
           </div>
        </div>
    </div>
  `);
    let fancySwiper = new Swiper(".fancy-swiper", {
      slidesPerView: 1,
      slidesPerGroup: 1,
      observer: true,
      observeParents: true,
      centeredSlides: true,
      spaceBetween: 10,
      initialSlide: initialSl,
      navigation: {
        prevEl: ".fancy-modal .swiper-btn--prev",
        nextEl: ".fancy-modal .swiper-btn--next"
      },
      breakpoints: {
        1300.98: {
          spaceBetween: 60,
        },
        991.98: {
          spaceBetween: 40,
        },
        767.98: {
          spaceBetween: 20
        }
      },
      speed: 800
    })
    const fancyPopup = document.querySelector(".fancy-modal")
    popups.openPopup(fancyPopup)
    fancyPopup.addEventListener("click", e => {
      if (!fancyPopup.querySelector(".modal__content").contains(e.target) || fancyPopup.querySelector(".modal__close").contains(e.target)) {
        popups.closePopup(fancyPopup)
        setTimeout(() => {
          fancyPopup.remove()
        }, animSpd);
      }
    })
  })

})
//mask input
function maskInput() {
  const inp = document.querySelectorAll('input[type=tel]')
  if (inp) {
    inp.forEach(item => {
      Inputmask({ "mask": "+7 999 999-99-99" }).mask(item);
    })
  }
}
maskInput()
//into-items on mouseneter/mouseleave
const introItems = document.querySelector(".intro__items")
const itemIntro = document.querySelectorAll(".item-intro")
if (introItems) {
  itemIntro.forEach(item => {
    item.querySelector(".btn").addEventListener("mouseenter", () => {
      document.querySelector(".intro__img img").style.opacity = "0"
      itemIntro.forEach(item => {
        item.classList.remove("active")
      })
      item.classList.add("active")
    })
    item.querySelector(".btn").addEventListener("mouseleave", () => {
      document.querySelector(".intro__img img").style.opacity = "1"
      itemIntro.forEach(item => {
        item.classList.remove("active")
      })
    })
  })
  if (introItems.scrollWidth > introItems.clientWidth + 30) {
    let diff = introItems.scrollWidth - introItems.clientWidth
    introItems.scrollLeft = diff/2
  }
}
// init/destroy intro swiper
const introInfoSwiper = document.querySelector(".intro__accordion")
const introInfo = document.querySelectorAll(".intro-info")
if (introInfoSwiper) {
  let initSwiper,
    introSwiper
  function initIntroSwiper() {
    if (window.innerWidth > 991.98 && !initSwiper) {
      initSwiper = true
      introSwiper = new Swiper(introInfoSwiper, {
        slidesPerView: "auto",
        observer: true,
        observeParents: true,
        spaceBetween: 12,
        speed: 800
      })
    } else if (initSwiper) {
      initSwiper = false
      introSwiper.destroy()
    }
  }
  initIntroSwiper()
  window.addEventListener("resize",initIntroSwiper)
  $(".intro-info__header").on("click", (function() {
    if (window.innerWidth < 991.98) {
      $(this).siblings(".intro-info__content").slideToggle().parents(".intro-info").toggleClass("active").siblings(".intro-info").removeClass("active").find(".intro-info__content").slideUp()
    }
  }))
}
// tabscoll scroll to active tab
const tabScroll = document.querySelectorAll(".tabs-scroll")
if (tabScroll) {
  tabScroll.forEach(item => {
    let margin = Math.abs(parseInt(getComputedStyle(item).marginLeft))
    let pos = item.querySelector(".active").getBoundingClientRect().left - item.getBoundingClientRect().left - margin || 0;
    item.scrollLeft = pos
  })
}
//js-anchor
$('.js-anchor').click(function() {
  var elementClick = $(this).attr('href');
  var destination = $(elementClick).offset().top;
  $('html,body').animate({ scrollTop: destination }, 2000);
  return false;
});

  