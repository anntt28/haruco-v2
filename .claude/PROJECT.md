# PROJECT.md — Chi tiết cấu trúc & quy trình

## Mô tả các thư mục chính

### `/` (thư mục gốc)
Chứa toàn bộ file `.html` của các trang. Mỗi file là 1 trang hoàn chỉnh (có đầy đủ `<head>`, header, footer, script riêng) — không có layout/template dùng chung, không có include HTML nào (không PHP, không Nunjucks/Handlebars...). Header, menu, footer được **copy-paste giống nhau** giữa các trang.

Danh sách trang hiện có: `index.html`, `introduce.html`, `product-category.html`, `product-list.html`, `product-detail.html`, `list-news.html`, `news-detail.html`, `contact.html`.

### `assets/css/`
- `index.css`: file CSS được biên dịch (compiled output) từ toàn bộ `assets/scss/`. **Không sửa tay file này** — mọi thay đổi style phải sửa ở SCSS rồi biên dịch lại.
- `product-cateogory.css`: file CSS phụ riêng cho trang product-category (không đi qua SCSS, tên file có lỗi chính tả nhưng đang được dùng nên giữ nguyên tên khi tham chiếu).

### `assets/scss/`
Các partial SCSS chia theo tính năng/khu vực trang, tất cả được `@import` vào `index.scss`. Xem chi tiết quy tắc ở `rules/scss.md`.

### `assets/js/`
Chỉ có 1 file `index.js`, chứa toàn bộ logic JS/jQuery cho mọi trang (slider Swiper, toggle menu, modal, dropdown...). Không tách file theo trang.

### `assets/images/`
Ảnh banner, background, sản phẩm... đặt trực tiếp trong `assets/images/`. Icon SVG dùng nhiều nơi được gom vào `assets/images/icon/`.

### `assets/fonts/`
Font `.otf` local (SVN-Drainwood, SVN-Peristiwa), được khai báo qua `@import url(...)` trong `index.scss`.

## Thư viện đang sử dụng

Tất cả load qua CDN trong `<head>`/cuối `<body>` của từng file HTML (xem `index.html` làm chuẩn):

| Thư viện | Version | Dùng để làm gì |
|---|---|---|
| Bootstrap | 4.6.2 | Grid (`container-fluid`, `row`, `col-*`), utility class (`d-flex`, `d-none`, `d-md-block`...), dropdown |
| Swiper | 8.0.0 | Tất cả slider/carousel (sản phẩm, banner, review...) |
| Font Awesome | 6.5.0 | Icon font (một số icon dùng font, phần lớn icon dùng SVG inline) |
| jQuery | 3.6.0 | Toàn bộ JS tương tác trong `index.js` |
| Popper.js | 1.16.1 | Phụ thuộc bắt buộc của Bootstrap dropdown |
| Google Fonts | — | Plus Jakarta Sans, Roboto Flex |

Khi thêm 1 trang mới, phải copy đủ các thẻ `<link>`/`<script>` này từ 1 trang có sẵn (ví dụ `index.html`) — không được thiếu, không được thêm thư viện khác thay thế.

## Quy trình thêm một page mới

1. Copy nguyên 1 file `.html` gần giống nhất về cấu trúc (ví dụ copy `contact.html` nếu trang mới cũng có form + banner đơn giản).
2. Đổi `<title>` trong `<head>`.
3. Giữ nguyên toàn bộ header (`header-page`, `header-bottom`, `header-bottom-mobile`, `menu-aside-page`) và footer (`footer-page`) — đây là phần lặp lại bắt buộc ở mọi trang.
4. Chỉ thay nội dung bên trong `<main>`.
5. Nếu trang cần class SCSS riêng chưa có, thêm section CSS tương ứng vào SCSS partial phù hợp (xem `rules/scss.md`) — đặt tên section theo tên trang/khu vực, ví dụ `.contact-page { ... }`.
6. Biên dịch lại SCSS sang `assets/css/index.css`.
7. Thêm đường dẫn `<script src="./assets/js/index.js">` ở cuối `<body>` (giữ nguyên vị trí sau các script CDN) nếu trang có tương tác JS (slider, toggle...).

## Quy trình thêm SCSS mới

1. Tạo file `assets/scss/_ten-khu-vuc.scss` (tiền tố `_`, kebab-case, đặt tên theo khu vực/trang — ví dụ `_step.scss`, `_detail-news.scss`).
2. Thêm dòng `@import './ten-khu-vuc';` vào cuối danh sách import trong `assets/scss/index.scss` (thứ tự import hiện tại: biến/mixin → bootstrap override → layout/common → màu/button/text/input/link/flex/grid → từng khu vực trang cụ thể).
3. Trong file mới, dùng lại biến đã khai báo ở `_variable.scss` (màu, không hardcode hex trùng lặp nếu đã có biến tương ứng) và mixin responsive ở `_mixin.scss` (`minWidth`, `maxWidth`, `minmaxWidth`) — không viết `@media` trực tiếp.
4. Nest selector theo đúng cấu trúc HTML tương ứng (xem `rules/scss.md`).
5. Biên dịch lại để cập nhật `assets/css/index.css`.

## Quy trình thêm JavaScript mới

1. Viết thêm trực tiếp vào trong `$(function () { ... });` ở cuối `assets/js/index.js` — không tạo file JS mới, không tách module.
2. Dùng jQuery selector theo class/id đã có trong HTML (ví dụ `$(".btn-hamburger")`), bind event bằng `.on('click', function(){...})` hoặc `.click(function(){...})` (project dùng cả 2 cách, xem `rules/javascript.md`).
3. Nếu cần thêm slider mới bằng Swiper, copy 1 block `new Swiper(...)` gần giống nhất và chỉnh lại selector/breakpoints.
4. Không import thêm thư viện JS khác nếu jQuery/Swiper/Bootstrap JS đã đáp ứng được nhu cầu.
