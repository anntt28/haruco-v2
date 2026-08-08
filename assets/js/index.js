$(function () {
  $(".sale-countdown").each(function () {
    var $countdown = $(this);
    var days = parseInt($countdown.data("countdown-days"), 10) || 0;
    var endTime = new Date().getTime() + days * 24 * 60 * 60 * 1000;
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }
    function updateCountdown() {
      var distance = endTime - new Date().getTime();
      if (distance < 0) {
        distance = 0;
      }
      var hours = Math.floor(distance / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      $countdown.find(".cd-hours").text(pad(hours));
      $countdown.find(".cd-minutes").text(pad(minutes));
      $countdown.find(".cd-seconds").text(pad(seconds));
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
  $(".play-video-slider").click(function () {
    $(this).siblings(".video-slider").get(0).play();
    $(this).addClass("active");
  });
  var swiper1 = new Swiper(".banner-top-slider", {
    loop: true,
    slidesPerView: 1,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: ".swiper-pagination-banner",
      clickable: true,
    },
  });
  var swiper2 = new Swiper(".product-category-h .slider-tab-p", {
    loop: true,
    loopedSlides: 1,
    slidesPerView: 2,
    slidesPerGroup: 1,
    spaceBetween: 5,
    freeMode: true,
    watchSlidesProgress: true,
    spaceBetween: 10,
    slideToClickedSlide: true,
    navigation: {
      nextEl: ".swiper-button-next-1",
      prevEl: ".swiper-button-prev-1",
    },
    breakpoints: {
      470: {
        slidesPerView: 3,
        spaceBetween: 8,
      },
      768: {
        slidesPerView: 5,
        spaceBetween: 8,
      },
      1200: {
        slidesPerView: 7,
        spaceBetween: 8,
      },
    },
  });
  var swiper3 = new Swiper(".product-category-h .slider-product-p", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    navigation: {
      nextEl: ".swiper-button-next-2",
      prevEl: ".swiper-button-prev-2",
    },
    pagination: {
      el: ".swiper-pagination-2",
      clickable: true,
    },
    thumbs: {
      swiper: swiper2,
    },
  });
  // Product Slider Section component: 1 config dùng chung cho mọi section reuse
  // (Đai lưng chống gù / Trị liệu / Tập luyện / Combo / Sản phẩm phù hợp / Sale / Best seller).
  // Mỗi instance chỉ khác nhau ở navigation (nextEl/prevEl phải riêng để không xung đột).
  var productSliderOptions = {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 14,
    breakpoints: {
      567: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 24,
      },
    },
  };
  [1, 2, 3, 4, 5, "sale", "bestseller"].forEach(function (i) {
    new Swiper(
      ".product-slider-" + i,
      $.extend({}, productSliderOptions, {
        navigation: {
          nextEl: ".product-slider-next-" + i,
          prevEl: ".product-slider-prev-" + i,
        },
      })
    );
  });
  new Swiper(".gift-solution-slider", {
    loop: false,
    slidesPerView: 1.3,
    spaceBetween: 20,
    breakpoints: {
      567: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
    navigation: {
      nextEl: ".gift-solution-next",
      prevEl: ".gift-solution-prev",
    },
  });
  new Swiper(".press-logos-list", {
    loop: false,
    slidesPerView: 2.3,
    spaceBetween: 22,
    breakpoints: {
      576: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
    },
  });
  new Swiper(".feedback-slider", {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: ".feedback-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".feedback-next",
      prevEl: ".feedback-prev",
    },
    breakpoints: {
      1024: {
        slidesPerView: 2,
        spaceBetween: 30,
        grid: {
          rows: 2,
          fill: "row",
        },
      },
    },
  });
  new Swiper(".video-slider", {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: ".video-next",
      prevEl: ".video-prev",
    },
    breakpoints: {
      567: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
  $(".video-wrap").on("click", ".btn-play-video", function () {
    const thumb = $(this).closest(".video-card-thumb");
    $(".video-card-thumb")
      .not(thumb)
      .each(function () {
        const otherThumb = $(this);
        const originalHtml = otherThumb.data("original-html");
        if (originalHtml) {
          otherThumb.html(originalHtml);
        }
      });
    if (!thumb.data("original-html")) {
      thumb.data("original-html", thumb.html());
    }
    const youtubeId = thumb.data("youtube-id");
    const iframe = $(
      '<iframe src="https://www.youtube.com/embed/' +
        youtubeId +
        '?autoplay=1&si=ZaA9g4tCLphjGlbE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    );
    thumb.empty().append(iframe);
  });
  var swiper7 = new Swiper(".product-gallery-h .slider-thumb-child", {
    loop: false,
    slidesPerView: 3,
    slidesPerGroup: 1,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next-6",
      prevEl: ".swiper-button-prev-6",
    },
    breakpoints: {
      1200: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
    },
  });
  var swiper8 = new Swiper(".product-gallery-h .slider-images-main", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    thumbs: {
      swiper: swiper7,
    },
  });
  var swiper9 = new Swiper(".slider-image-from-customer", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      nextEl: ".swiper-button-next-9",
      prevEl: ".swiper-button-prev-9",
    },
    breakpoints: {
      1024: {
        slidesPerView: 5,
        spaceBetween: 9,
      },
      576: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
  $(".list-item-bo span").on("click", function (e) {
      $(this).siblings('span').removeClass('active');
      $(this).addClass('active'); 
    });
    $('.qty-count').on('click', function () {
      const input = $(this).siblings('.product-qty') // lấy input cùng nhóm
      const currentVal = parseInt(input.val());
      const min = parseInt(input.attr('min'));
      const max = parseInt(input.attr('max'));
    
      if ($(this).data('action') === 'add') {
        if (currentVal < max) {
          input.val(currentVal + 1);
        }
      } else if ($(this).data('action') === 'minus') {
        if (currentVal > min) {
          input.val(currentVal - 1);
        }
      }
    });
    
  $('.content-page-cate-pr .woocommerce-ordering input[type="radio"]').each(
    function (index) {
      $(this).next("label").addBack().wrapAll("<div class='button-box'></div>");
    }
  );
  $(".dropdown-submenu .sub-m .btn-open").on("click", function (e) {
    $(this).parent(".sub-m").next("ul").toggle();
    $(this).toggleClass("active");
    e.stopPropagation();
    e.preventDefault();
  });
  $(".btn-feature .btn-orange-bo").on("click", function (e) {
    $(this).parents(".list-comment").find(".comment-h").toggle("active");
    $(this).toggleClass("active");
    e.stopPropagation();
    e.preventDefault();
  });
  $(".btn-search-m button").click(function () {
    $(".header-bottom-mobile, .btn-search-m input").toggleClass(
      "active-search"
    );
    $(".btn-search-m input").focus();
  });
  // $('.box-menu-content-news h4').click(function(){
  //   $('.box-menu-content-news').toggleClass('active');
  // });
  $(".table-of-content li a").click(function () {
    $("html, body").animate(
      {
        scrollTop: $($(this).attr("href")).offset().top - 100,
      },
      "linear"
    );
    return false;
  });
  const paragraphs = $(".content-shop-readmore p");
  paragraphs.slice(2).hide();

  $(".btn-content-shop-readmore").click(function (e) {
    e.preventDefault();
    paragraphs.show();
    $(this).addClass("d-none");
    $(".btn-content-shop-collapse").removeClass("d-none");
  });
  $(".btn-content-shop-collapse").click(function (e) {
    e.preventDefault();
    paragraphs.slice(2).hide();
    $(this).addClass("d-none");
    $(".btn-content-shop-readmore").removeClass("d-none");
  });
  $(".grid-view-button").click(function () {
    $(".list-product-page-child")
      .removeClass("list-view")
      .addClass("grid-view");
    $(this).addClass("active");
    $(".list-view-button").removeClass("active");
  });
  $(".list-view-button").click(function () {
    $(".list-product-page-child")
      .removeClass("grid-view")
      .addClass("list-view");
    $(this).addClass("active");
    $(".grid-view-button").removeClass("active");
  });
  $(".menu-item-has-children")
    .on("mouseenter", function () {
      $(this).children(".sub-menu").addClass("active");
    })
    .on("mouseleave", function () {
      $(this).children(".sub-menu").removeClass("active");
    });

  $(".menu-aside .menu-item-has-children:not(:has(.icon-caret))").append(
    '<div class="icon"><img src="/wp-content/themes/nwstheme/assets/images/arrow-down-s-fill.svg" alt=""></div>'
  );
  $(".menu-aside .menu-item-has-children .icon").on("click", function () {
    $(this).siblings(".sub-menu").slideToggle();
  });

  $("#btn-hamburger").on("click", function () {
    $(".menu-aside-page").toggleClass("show");
    $("body").addClass("overflow-hidden");
  });

  function setMobileMenuNewOpen(isOpen) {
    if (isOpen) {
      const headerHeight = $(".header-page-new-mobile").outerHeight();
      $(".menu-mobile-new .menu-aside").css({
        top: headerHeight,
        maxHeight: "calc(100vh - " + headerHeight + "px)",
      });
    } else {
      $(".menu-mobile-new .menu-aside").css({ top: "", maxHeight: "" });
    }
    $(".menu-aside-page").toggleClass("show", isOpen);
    $("#btn-hamburger-new")
      .toggleClass("active", isOpen)
      .attr("aria-expanded", isOpen);
    $("body").toggleClass("overflow-hidden", isOpen);
    if (!isOpen) {
      $(".menu-mobile-new .menu-item-has-children").removeClass("active");
      $(".menu-mobile-new .sub-menu").slideUp(200);
    }
  }

  $("#btn-hamburger-new").on("click", function () {
    setMobileMenuNewOpen(!$(".menu-aside-page").hasClass("show"));
  });

  $(".menu-mobile-new .menu-item-has-children > .menu-item-toggle").on(
    "click",
    function (e) {
      e.preventDefault();
      const $item = $(this).parent(".menu-item-has-children");
      const willOpen = !$item.hasClass("active");
      $item
        .siblings(".menu-item-has-children")
        .removeClass("active")
        .children(".sub-menu")
        .slideUp(250);
      $item.toggleClass("active", willOpen);
      $item.children(".sub-menu").slideToggle(250);
    }
  );

  // menu sp
  $(".menu-aside-page .sub-menu").hide();
  $(".menu-aside-page .icon").on("click", function () {
    $(this).parents(".has-child").siblings(".sub-menu").slideToggle();
  });

  $(".backdrop , .menu-aside-close, .menu-aside-page a:not(.menu-item-toggle)").on(
    "click",
    function () {
      $(".menu-aside-page").removeClass("show");
      $("body").removeClass("overflow-hidden");
      $(".menu-aside-page .sub-menu").hide();
      $("#btn-hamburger-new")
        .removeClass("active")
        .attr("aria-expanded", "false");
      $(".menu-mobile-new .menu-item-has-children").removeClass("active");
      $(".menu-mobile-new .menu-aside").css({ top: "", maxHeight: "" });
    }
  );

  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $(".menu-aside-page").hasClass("show")) {
      setMobileMenuNewOpen(false);
    }
  });
  $(".item__guide").on("click", function () {
    $("body").addClass("overflow-hidden");
    $("#guideModal").addClass("show");
  });

  $(".item__initiative").on("click", function () {
    $("body").addClass("overflow-hidden");
    $("#initiativeModal").addClass("show");
  });

  $(".item__topic").on("click", function () {
    $("body").addClass("overflow-hidden");
    $("#topicModal").addClass("show");
  });

  $("#questionModal .btn").on("click", function () {
    $("body").addClass("overflow-hidden");
    $("#sendSuccess").addClass("show");
  });

  $(".popup-backdrop, .popup-child .close, btn-done").on("click", function () {
    $("body").removeClass("overflow-hidden");
    $("#guideModal").removeClass("show");
    $("#initiativeModal").removeClass("show");
    $("#topicModal").removeClass("show");
    $("#sendSuccess").removeClass("show");
  });
  $("#chooseFile").bind("change", function () {
    var filename = $("#chooseFile").val();
    if (/^\s*$/.test(filename)) {
      $(".file-upload").removeClass("active");
      $("#noFile").text("No file chosen...");
    } else {
      $(".file-upload").addClass("active");
      $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
    }
  });

  var swiper10 = new Swiper(".introduce-team-slider", {
    loop: false,
    slidesPerView: 1.2,
    spaceBetween: 20,
    navigation: {
      nextEl: ".swiper-button-next-team",
      prevEl: ".swiper-button-prev-team",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });

  var swiper11 = new Swiper(".introduce-certs-section .introduce-certs", {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 16,
    navigation: {
      nextEl: ".swiper-button-next-certs",
      prevEl: ".swiper-button-prev-certs",
    },
    breakpoints: {
      576: {
        slidesPerView: 3,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
    },
  });

  // Slider ảnh trong accordion "Từ thiện" (introduce.html) — mỗi item có 1
  // swiper riêng. Item đang mở sẵn (.collapse.show) init ngay; các item còn
  // lại chỉ init lần đầu khi mở (shown.bs.collapse) để tránh Swiper đo được
  // width:0 do nằm trong .collapse đang display:none.
  $(".charity-accordion-item").each(function () {
    var $item = $(this);
    var $collapse = $item.find(".collapse");
    var sliderEl = $item.find(".charity-slider")[0];
    var nextEl = $item.find(".swiper-button-next-charity")[0];
    var prevEl = $item.find(".swiper-button-prev-charity")[0];

    if ($collapse.hasClass("show")) {
      new Swiper(sliderEl, {
        loop: false,
        slidesPerView: 2,
        spaceBetween: 12,
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        },
      });
    } else {
      $collapse.one("shown.bs.collapse", function () {
        new Swiper(sliderEl, {
          loop: false,
          slidesPerView: 2,
          spaceBetween: 12,
          navigation: {
            nextEl: nextEl,
            prevEl: prevEl,
          },
          breakpoints: {
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          },
        });
      });
    }
  });
});
