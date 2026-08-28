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
  // "combo" / "related" — Combo Sản Phẩm và Sản Phẩm liên quan ở Product
  // Detail, tái dùng đúng productSliderOptions (Đai hỗ trợ) theo Design
  // Document mục 3, không viết config Swiper riêng. "expert" — "Chuyên
  // gia khuyên dùng" ở List News, cùng lý do (tái dùng nguyên slider
  // Sản phẩm liên quan, chỉ đổi tên suffix để không trùng "related").
  // "cart" — "Có thể bạn cũng thích" ở trang Giỏ hàng, cùng lý do.
  // "gift-featured" — LD Quà tặng SK ("Sản phẩm nổi bật" tái dùng nguyên
  // section Combo Sản Phẩm của Homepage), cùng lý do tái dùng
  // productSliderOptions, không viết config Swiper riêng.
  [1, 2, 3, 4, 5, "sale", "bestseller", "combo", "related", "expert", "cart", "gift-featured"].forEach(function (i) {
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
  // "gift-budget-N" — LD Quà tặng SK ("Quà theo ngân sách", 4 slider theo
  // từng mốc giá): 2 item/hàng từ 1199px trở xuống, 3 item/hàng từ 1200px
  // theo yêu cầu design, khác productSliderOptions (2/3/5) nên viết config
  // riêng, cùng cách làm với ".product-slider-post" ở trên.
  var giftBudgetSliderOptions = {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 14,
    breakpoints: {
      1200: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  };
  ["gift-budget-1", "gift-budget-2", "gift-budget-3", "gift-budget-4"].forEach(function (i) {
    new Swiper(
      ".product-slider-" + i,
      $.extend({}, giftBudgetSliderOptions, {
        navigation: {
          nextEl: ".product-slider-next-" + i,
          prevEl: ".product-slider-prev-" + i,
        },
      })
    );
  });
  // ".ld-gift-product-grid" — LD Quà tặng SK ("Lựa chọn quà tặng" và "Combo
  // quà tặng"): mỗi tab-pane giờ là 1 slider riêng. Khác các slider khác ở
  // trên, các slider này nằm trong Bootstrap tab-pane đang ẩn (display:none)
  // lúc trang tải — Swiper tính chiều rộng slide bằng 0 nếu khởi tạo khi
  // container đang ẩn. Lưu lại instance qua data("swiper") của jQuery rồi
  // gọi .update() ở handler "shown.bs.tab" bên dưới khi tab-pane chứa nó
  // thực sự hiển thị (thử observer/observeParents của Swiper trước nhưng bị
  // treo trang do vòng lặp MutationObserver, nên chuyển sang cách này).
  // "Lựa chọn quà tặng Haruco" — 2 item/hàng mobile, 4 item/hàng từ
  // 1024-1199px, 5 item/hàng từ 1200px trở lên theo yêu cầu design (khác
  // "Combo quà tặng" bên dưới nên tách config riêng thay vì dùng chung).
  var giftChooseSliderOptions = {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 14,
    breakpoints: {
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 24,
      },
    },
  };
  ["gift-choose-doanh-nghiep", "gift-choose-bo-me", "gift-choose-nguoi-lon-tuoi", "gift-choose-phuc-hoi"].forEach(function (i) {
    new Swiper(
      ".product-slider-" + i,
      $.extend({}, giftChooseSliderOptions, {
        navigation: {
          nextEl: ".product-slider-next-" + i,
          prevEl: ".product-slider-prev-" + i,
        },
      })
    );
  });
  // "Combo quà tặng" — 2 item/hàng mobile, 5 item/hàng PC, giữ nguyên như cũ.
  var giftComboSliderOptions = {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 14,
    breakpoints: {
      1024: {
        slidesPerView: 5,
        spaceBetween: 24,
      },
    },
  };
  ["gift-combo-nhan-vien", "gift-combo-bo-me", "gift-combo-xuong-khop", "gift-combo-premium"].forEach(function (i) {
    new Swiper(
      ".product-slider-" + i,
      $.extend({}, giftComboSliderOptions, {
        navigation: {
          nextEl: ".product-slider-next-" + i,
          prevEl: ".product-slider-prev-" + i,
        },
      })
    );
  });
  $('[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    var target = $($(e.target).attr("href"));
    target.find(".swiper-container").each(function () {
      if (this.swiper) {
        this.swiper.update();
      }
    });
  });
  // "Đối tác doanh nghiệp" (LD Quà tặng SK) — logo đối tác hiển thị 3
  // hàng/trang, dùng module Grid của Swiper (fill:"row" để lấp theo hàng
  // trước, đúng thứ tự logo trong HTML) kèm dots pagination khi có nhiều
  // hơn 1 trang.
  new Swiper(".ld-gift-partners-grid", {
    loop: false,
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 13,
    grid: {
      rows: 3,
      fill: "row",
    },
    pagination: {
      el: ".swiper-pagination-gift-partners",
      clickable: true,
    },
    navigation: {
      nextEl: ".product-slider-next-gift-partners",
      prevEl: ".product-slider-prev-gift-partners",
    },
    breakpoints: {
      1024: {
        spaceBetween: 20,
      },
    },
  });
  // "post" — "Tham khảo thêm các dòng sản phẩm khác" trong post-detail (News
  // Detail): số item/hàng riêng (2 mobile / 4 PC) theo yêu cầu design, khác
  // productSliderOptions (2/3/5) nên viết config riêng thay vì dùng chung ở
  // vòng lặp trên — card/product-card giữ nguyên, chỉ đổi slidesPerView.
  new Swiper(".product-slider-post", {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 14,
    navigation: {
      nextEl: ".product-slider-next-post",
      prevEl: ".product-slider-prev-post",
    },
    breakpoints: {
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  });
  // "Mã giảm giá" (News Detail, dưới .product-slider-expert) — slider
  // voucher, theo đúng pattern nav-arrow-only (không pagination) đã dùng ở
  // .gift-solution-slider/.introduce-team-slider: 1 voucher/view mobile, 3
  // voucher/view PC (≥1024px, cùng breakpoint Desktop đã dùng cho News Detail).
  new Swiper(".voucher-slider", {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 16,
    navigation: {
      nextEl: ".voucher-next",
      prevEl: ".voucher-prev",
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
  // List News — ".list-news-tabs" KHÔNG phải tab component (không có
  // switching/active state/content ẩn-hiện) — chỉ là 1 slider danh sách
  // link điều hướng (mỗi slide chứa 1 thẻ <a>). slidesPerView:"auto" ở
  // MỌI breakpoint (mỗi item rộng theo content, không chia đều cột) —
  // slidesPerGroup:1 để Next/Prev mỗi lần chỉ dịch đúng 1 item,
  // slideToClickedSlide để click thẳng vào 1 slide cũng chuyển tới đó.
  // Dùng .each() + navigation tìm trong closest .list-news-tabs__wrap
  // (giống pattern .product-gallery-h) để nếu trang có nhiều instance
  // .list-news-tabs__slider, mỗi slider tự bind đúng cặp nút prev/next
  // của chính nó, không conflict lẫn nhau.
  $(".list-news-tabs__slider").each(function () {
    var $wrap = $(this).closest(".list-news-tabs__wrap");
    new Swiper(this, {
      loop: false,
      slidesPerView: "auto",
      spaceBetween: 10,
      slidesPerGroup: 1,
      slideToClickedSlide: true,
      navigation: {
        nextEl: $wrap.find(".list-news-tabs-next")[0],
        prevEl: $wrap.find(".list-news-tabs-prev")[0],
      },
    });
  });
  // Anchor Navigation (Group 633028, Product Detail) — cuộn mượt tới
  // section tương ứng. Item "Check hành chính hãng" cố tình không dùng
  // thẻ <a> (xem product-detail.html) nên không bị handler này bắt phải.
  // Toggle .active theo item vừa click (chỉ 1 item active tại 1 thời
  // điểm) — Product Detail hiện không có CSS nào đọc .active nên phần
  // này không đổi hành vi/giao diện của Product Detail, chỉ có hiệu lực
  // ở Doctor Profile (.doctor-profile-anchor).
  $(".detail-product-anchor a").on("click", function (e) {
    e.preventDefault();
    $(this).closest("ul").find("a").removeClass("active");
    $(this).addClass("active");
    var target = $($(this).attr("href"));
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 100,
        },
        "linear"
      );
    }
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
  // "Video sản phẩm" — dùng chung 1 component (.video-wrap/.video-slider/
  // .video-card) cho cả Homepage và Product Detail, chỉ khác breakpoints
  // (Product Detail cần slidesPerView:2 ở Desktop thay vì 3 như Homepage).
  new Swiper(
    ".video-slider",
    $(".product-detail-page").length
      ? {
          loop: false,
          slidesPerView: 1,
          spaceBetween: 20,
          navigation: {
            nextEl: ".video-next",
            prevEl: ".video-prev",
          },
          breakpoints: {
            1024: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
          },
        }
      : {
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
        }
  );
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
  // .product-gallery-h có thể xuất hiện nhiều hơn 1 lần trên cùng 1 trang
  // (ví dụ Product Detail: 1 bản cho Desktop, 1 bản cho Mobile, ẩn/hiện
  // bằng CSS) — dùng .each() + phần tử DOM cụ thể cho nextEl/prevEl/thumbs
  // thay vì selector class dùng chung, để MỌI instance đều được khởi tạo
  // đúng thay vì chỉ instance đầu tiên.
  $(".product-gallery-h").each(function () {
    var $gallery = $(this);
    var thumbEl = $gallery.find(".slider-thumb-child")[0];
    var mainEl = $gallery.find(".slider-images-main")[0];
    if (!thumbEl || !mainEl) {
      return;
    }
    var thumbSwiper = new Swiper(thumbEl, {
      loop: false,
      slidesPerView: 3,
      slidesPerGroup: 1,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      spaceBetween: 10,
      breakpoints: {
        1200: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
      },
    });
    new Swiper(mainEl, {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 24,
      thumbs: {
        swiper: thumbSwiper,
      },
    });
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
      $(this).closest(".list-item-bo").find("span").removeClass('active');
      $(this).addClass('active');
    });
    // "Kích thước chữ" — đổi biến CSS --dp-font-scale để scale font-size của
    // content đọc (h3/h4/p/feature-list) theo hệ số var(--dp-font-scale) đã
    // khai báo trong _detail-product.scss (Product Detail,
    // .detail-product-description-main) và _detail-news.scss (News Detail,
    // .content.post-detail) — dùng chung 1 handler cho cả 2 trang, không
    // đụng tới style của chính nút bấm.
    $(".detail-product-fontsize-options button").on("click", function () {
      const $btn = $(this);
      $btn.siblings().removeClass("active");
      $btn.addClass("active");
      const scale = $btn.data("fontsize-scale") || 1;
      const mainEl = $btn.closest(".detail-product-description-main, .content.post-detail").get(0);
      if (mainEl) {
        mainEl.style.setProperty("--dp-font-scale", scale);
      }
    });
    // Voucher slider (News Detail) — click ảnh voucher để copy mã giảm giá
    // (data-code) vào clipboard, hiện tạm ".copied-label" (CSS overlay) 1.5s
    // rồi tự ẩn, không cần thư viện toast/notification riêng.
    $(".voucher-code").on("click", function () {
      const $btn = $(this);
      const code = $btn.data("code");
      if (navigator.clipboard && code) {
        navigator.clipboard.writeText(code);
      }
      $btn.addClass("copied");
      setTimeout(function () {
        $btn.removeClass("copied");
      }, 1500);
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

  new Swiper(".product-category-bestseller-slider", {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 16,
    navigation: {
      nextEl: ".swiper-button-next-pc-bestseller",
      prevEl: ".swiper-button-prev-pc-bestseller",
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });

  $(".product-category-sort .sort-chip").on("click", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
  });

  $(".product-category-pagination .pagination-list li:not(.pagination-next)").on("click", function (e) {
    e.preventDefault();
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
  });

  $(".btn-seo-toggle").on("click", function () {
    var $section = $(this).closest(".product-category-seo");
    var $btn = $(this);
    var expanded = $section.hasClass("expanded");
    $section.toggleClass("expanded");
    $btn.contents().first().replaceWith(expanded ? "Xem thêm" : $btn.data("toggle-text"));
  });

  $(".detail-product-reviews-card .progress-wrap").each(function () {
    const $wrap = $(this);
    const barWidth = $wrap.find(".h-review-progress").outerWidth();
    const fgWidth = $wrap.find(".h-review-progress .bar.fg").outerWidth();
    const percent = Math.round((fgWidth / barWidth) * 100);
    $wrap.find(".percent").text(percent + "%");
  });

  $(".cart-page .cart-list-header .cart-checkbox input[type='checkbox']").on("change", function () {
    const checked = $(this).prop("checked");
    $(".cart-page .cart-item .cart-checkbox input[type='checkbox']").prop("checked", checked);
  });

  $(".cart-page .cart-item .cart-checkbox input[type='checkbox']").on("change", function () {
    const $itemCheckboxes = $(".cart-page .cart-item .cart-checkbox input[type='checkbox']");
    const allChecked = $itemCheckboxes.length === $itemCheckboxes.filter(":checked").length;
    $(".cart-page .cart-list-header .cart-checkbox input[type='checkbox']").prop("checked", allChecked);
  });
});
