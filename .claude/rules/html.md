# Quy tắc HTML

Phản ánh đúng style đang tồn tại trong các file `.html` ở thư mục gốc (`index.html`, `contact.html`, `introduce.html`...).

## Cấu trúc file

- Mỗi file bắt đầu bằng `<!DOCTYPE html>`, `<html lang="en">` dù nội dung là tiếng Việt — giữ nguyên `lang="en"` như hiện tại, không tự đổi thành `lang="vi"`.
- `<head>` gồm: `meta charset`, `meta http-equiv="X-UA-Compatible"`, `meta viewport`, `<title>`, preconnect Google Fonts, link CDN (Bootstrap CSS, Swiper CSS, Font Awesome CSS), cuối cùng là `<link rel="stylesheet" href="./assets/css/index.css">`.
- Cuối `<body>`: script CDN theo thứ tự jQuery → Popper → Bootstrap JS → Swiper JS → `./assets/js/index.js`.
- Mọi trang đều lặp lại nguyên khối `<header class="header-page">`, `<div class="header-bottom">`, `<div class="header-bottom-mobile">`, `<aside class="menu-aside-page">` và `<footer class="footer-page">`. Khi sửa 1 trong các khối này, sửa lặp lại ở tất cả file HTML.

## Indentation & format

- Thụt lề chủ yếu **2 spaces**, không dùng tab. Giữ nguyên 2 spaces khi thêm code mới.
- Một số block bị lệch thụt lề không đồng nhất (ví dụ khu vực form trong `contact.html` lệch sang 4 spaces cục bộ) — đây là tình trạng có sẵn, không bắt buộc phải đồng bộ lại toàn bộ file khi chỉ sửa 1 phần nhỏ, nhưng code mới nên theo 2-space.
- Thẻ tự đóng dùng `<img ... alt="">` không có `/` cuối (không phải XHTML style), giữ nguyên kiểu này.
- SVG icon được **nhúng inline trực tiếp** trong HTML (không dùng `<img>` cho SVG, trừ một số icon lấy từ `assets/images/icon/*.svg` qua `<img src="...">`). Khi thêm icon mới, ưu tiên tái sử dụng SVG/icon đã có sẵn trong `assets/images/icon/` hoặc trong các trang khác thay vì tạo icon mới.

## Semantic HTML

- Dùng đúng thẻ ngữ nghĩa cơ bản: `<header>`, `<main>`, `<footer>`, `<aside>`, `<nav>`, `<section>` cho từng khối lớn của trang.
- Heading dùng `<h2>`/`<h4>` cho tiêu đề section/card (dự án không dùng `<h1>` một cách nghiêm ngặt — không thấy `<h1>` xuất hiện, không tự thêm nếu không có yêu cầu).
- `<form>` dùng cho khối tìm kiếm và form liên hệ, nhưng không có `action`/thuộc tính validate thực sự (đa số href/action để trống `""` vì chưa nối backend) — đây là site tĩnh chưa có xử lý submit thật, không tự ý thêm logic submit phức tạp.

## Class naming

- Kebab-case thuần túy, không dùng BEM (`__`, `--` gần như không xuất hiện, trừ vài class utility sinh tự động từ SCSS như `w--10`, `count--add`, `count--minus`).
- Tên class mô tả theo khu vực + vai trò, ví dụ: `header-page`, `header-bottom-mobile`, `menu-aside-page`, `content-introduce`, `btn-linear-rounded`, `product-haruco-slider`, `swiper-button-next-cate`.
- Nhiều class Bootstrap utility được dùng trực tiếp trong HTML: `d-flex`, `d-none`, `d-md-block`, `align-items-center`, `justify-content-between`, `container-fluid`, `row`, `col-xl-5`... — ưu tiên dùng lại các utility này thay vì viết CSS mới cho các nhu cầu layout/spacing đơn giản.
- Một section/khối lặp lại nhiều lần (slider, card sản phẩm...) dùng cùng 1 class cho mọi item (không đánh số class kiểu `item-1`, `item-2`) — phân biệt bằng nội dung, không bằng class.
- `id` chỉ dùng khi cần cho JS hook hoặc ARIA (`id="site-navigation"`, `id="btn-hamburger"`, `id="dropdownMenuButton"`), không dùng `id` để style CSS.

## Không có quy ước riêng

- Đặt tên file ảnh: không có quy tắc thống nhất (có nơi dùng `ic-user.svg` (gạch ngang), có nơi dùng `ic_call.png` (gạch dưới)) — khi thêm ảnh/icon mới, giữ theo style hiện có của thư mục đang thêm vào, không tự áp đặt chuẩn mới cho toàn bộ thư mục.
- Không có comment HTML theo chuẩn cố định — chỉ có vài comment ngắn đánh dấu khối (`<!-- header pc -->`, `<!-- header mobile -->`). Giữ ở mức tối thiểu như vậy, không thêm comment giải thích dài dòng.
