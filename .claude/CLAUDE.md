# Haruco — Ghi chú cho Claude Code

## Giới thiệu

Đây là website giới thiệu/bán hàng của **Haruco** (Công ty TNHH Rezkin Việt Nam) — các sản phẩm chăm sóc sức khỏe (đai lưng, gối, chườm thảo dược...). Đây là **project frontend tĩnh, quy mô nhỏ**, không có backend, không có API, không dùng framework JS nào (React/Vue/Angular đều không có).

## Công nghệ sử dụng

- **HTML** thuần (mỗi trang là 1 file `.html` độc lập ở thư mục gốc, không có template engine, không có include/partial).
- **SCSS** biên dịch thủ công sang `assets/css/index.css` (không có `package.json`, không có Gulp/Webpack/Vite — dùng công cụ biên dịch của IDE, ví dụ JetBrains File Watcher hoặc extension Live Sass Compiler).
- **JavaScript** thuần + **jQuery** (viết trong 1 file `assets/js/index.js`, tất cả code nằm trong `$(function(){ ... })`).
- Thư viện load qua **CDN** trong từng file HTML (không cài qua npm):
  - Bootstrap 4.6.2 (CSS + JS, dùng cho grid, dropdown, utility class)
  - Swiper 8.0.0 (slider/carousel)
  - Font Awesome 6.5.0 (icon font)
  - jQuery 3.6.0
  - Popper.js 1.16.1 (phụ thuộc của Bootstrap dropdown)
  - Google Fonts (Plus Jakarta Sans, Roboto Flex) + 2 font custom `.otf` local (SVN-Drainwood, SVN-Peristiwa)

## Cấu trúc thư mục

```
/
├── *.html                  # Mỗi trang 1 file HTML riêng, đặt tên ở thư mục gốc
│   ├── index.html          # Trang chủ
│   ├── introduce.html      # Giới thiệu
│   ├── product-category.html
│   ├── product-list.html
│   ├── product-detail.html
│   ├── list-news.html
│   ├── news-detail.html
│   └── contact.html
├── assets/
│   ├── css/
│   │   ├── index.css       # File CSS biên dịch từ SCSS, dùng chung cho mọi trang
│   │   └── product-cateogory.css  # File CSS phụ, riêng (lưu ý tên có lỗi chính tả "cateogory")
│   ├── scss/
│   │   ├── index.scss      # Entry point, chỉ chứa @import theo thứ tự
│   │   └── _*.scss         # Các partial theo tính năng/khu vực (xem rules/scss.md)
│   ├── js/
│   │   └── index.js        # Toàn bộ JS của site, dùng chung cho mọi trang
│   ├── images/              # Ảnh + icon (thư mục con images/icon/ chứa icon SVG)
│   └── fonts/                # Font .otf local
└── .idea/                    # Project JetBrains IDE (WebStorm/PhpStorm)
```

## Cách build/run

Không có bước build. Đây là site tĩnh thuần:

1. Sửa file `.scss` trong `assets/scss/`.
2. Biên dịch sang `assets/css/index.css` bằng công cụ SCSS compiler của IDE (không có script `npm run build`, không có CLI sass config sẵn trong repo).
3. Mở trực tiếp file `.html` bằng trình duyệt (hoặc dùng extension "Live Server" của VSCode) để xem kết quả — không cần server riêng.

## Quy tắc chung khi sửa code

- **Không thêm framework hay build tool mới** (không Webpack/Vite/React/Vue...). Giữ nguyên mô hình HTML + SCSS + JS thuần như hiện tại.
- **Không thêm thư viện mới** nếu đã có thư viện tương đương (đã có jQuery, Bootstrap, Swiper — ưu tiên dùng lại).
- **Ưu tiên jQuery** cho mọi thao tác DOM/event/animation/Ajax; chỉ dùng JS thuần khi jQuery không đáp ứng được.
- Khi thêm code mới, giữ đúng style hiện có (xem chi tiết trong `PROJECT.md` và các file trong `rules/`) thay vì áp đặt best practice hiện đại.
- Không refactor sang ES6 module, không tạo kiến trúc phức tạp (component system, MVC, v.v.) — project này không cần và không dùng các mô hình đó.
- Mỗi trang HTML là độc lập (copy nguyên khối header/footer) — khi sửa header/footer/menu, phải sửa lặp lại ở **tất cả** file HTML liên quan vì không có cơ chế include.
