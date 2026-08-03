# Quy tắc JavaScript

Phản ánh đúng style đang tồn tại trong `assets/js/index.js` — file JS duy nhất của dự án.

## Coding style

- Toàn bộ code nằm trong 1 khối `$(function () { ... });` (jQuery ready handler), không có IIFE riêng, không có `'use strict'`, không chia file/module.
- Khai báo biến bằng `var` cho các instance Swiper (`var swiper2 = new Swiper(...)`), và `const` cho biến local trong từng handler (`const input = ...`). Không thấy dùng `let`. Khi thêm code mới, theo đúng 2 kiểu này tuỳ ngữ cảnh (biến Swiper cấp ngoài dùng `var`, biến tạm trong callback dùng `const`).
- Không có type checking (TypeScript/JSDoc), không có linter config (`.eslintrc` không tồn tại).
- Có vài dòng code bị comment lại để tắt tính năng (ví dụ khối `.box-menu-content-news h4` bị comment) — đây là cách tạm tắt code hiện tại của dự án, có thể tiếp tục dùng cách này khi cần tắt tạm 1 đoạn.

## Ưu tiên jQuery

- **Mọi thao tác DOM, event, animation, Ajax đều dùng jQuery**, không dùng `document.querySelector`, `addEventListener`, `fetch` thuần trong file này.
- Chỉ dùng JavaScript thuần khi jQuery không đáp ứng được hoặc API bắt buộc phải thuần (ví dụ `parseInt()` để xử lý giá trị số).
- Khi cần thêm tương tác mới, viết bằng jQuery theo đúng pattern đã có, không chuyển sang Vanilla JS hay thư viện khác.

## Event binding

- Dự án dùng lẫn cả 2 cách bind event, không có quy tắc phân biệt rõ ràng — chọn 1 trong 2 khi thêm mới đều chấp nhận được:
  - `$(selector).click(function (e) { ... });` — dùng phổ biến hơn cho click đơn giản.
  - `$(selector).on('click', function (e) { ... });` — dùng khi cần rõ ràng hơn hoặc kết hợp nhiều sự kiện (`.on('mouseover', ...).on('mouseout', ...)`).
- Khi cần chặn hành vi mặc định/nổi bọt sự kiện, dùng `e.preventDefault()` và `e.stopPropagation()` (không dùng `return false` để thay thế cả 2, trừ 1 trường hợp `return false` đơn lẻ ở cuối handler scroll).
- Selector luôn là class/id đã tồn tại sẵn trong HTML (ví dụ `$("#btn-hamburger")`, `$(".btn-search-m button")`) — không tạo class/id riêng chỉ để phục vụ JS nếu đã có class mô tả UI sẵn dùng được.

## Module / file organization

- Không tách file theo trang hay theo tính năng — **tất cả code, kể cả code chỉ dùng cho 1 trang cụ thể, đều nằm chung trong `index.js`** và được load ở mọi trang qua `<script src="./assets/js/index.js">`.
- Do dùng chung 1 file cho mọi trang, các selector jQuery phải đủ cụ thể để không ảnh hưởng nhầm sang trang khác (ví dụ dùng `.product-gallery-h .slider-thumb-child` thay vì chỉ `.slider-thumb-child` khi selector đó có thể trùng ở nhiều trang).
- Khi thêm chức năng mới, thêm trực tiếp vào cuối khối `$(function(){...})` hiện có, không tạo file `.js` mới.

## Cách sử dụng thư viện Swiper

- Mỗi carousel là 1 instance `new Swiper(selector, { options })` riêng biệt, đặt tên biến tuần tự `swiper2`, `swiper3`, `swiper4`... (không có `swiper1`, không có quy tắc đặt tên theo ý nghĩa).
- Option phổ biến dùng lại nhiều lần: `slidesPerView`, `spaceBetween`, `loop`, `navigation: { nextEl, prevEl }`, `pagination: { el, clickable: true }`, `breakpoints: { <px>: {...} }`.
- Class điều hướng (`swiper-button-next-*`, `swiper-button-prev-*`, `swiper-pagination-*`) được đánh số/hậu tố theo từng slider cụ thể để tránh trùng giữa nhiều slider trên cùng 1 trang — khi thêm slider mới, đặt hậu tố mới tương tự (ví dụ `-cate`, `-small`, `-6`, `-9`) thay vì dùng lại tên chung `swiper-button-next`.
- Thumbnail slider dùng option `thumbs: { swiper: <instance khác> }` để liên kết 2 slider với nhau (xem cặp `swiper2`/`swiper3`, `swiper7`/`swiper8`).

## Cách viết function

- Hầu hết logic viết bằng callback ẩn danh trực tiếp trong `.on()`/`.click()`, không đặt tên hàm riêng, không có hàm helper/utility tái sử dụng.
- Không dùng arrow function — toàn bộ callback viết bằng `function () {}` / `function (e) {}` truyền thống (quan trọng vì nhiều chỗ dùng `this` bên trong callback jQuery, ví dụ `$(this).addClass(...)`).
- Không có comment JSDoc hay giải thích hàm — giữ code ngắn gọn, không thêm comment nếu không thực sự cần thiết.

## Không có quy ước riêng

- Không có xử lý lỗi (`try/catch`), không có validate input phía JS cho form (vì form chưa nối submit thật) — không tự thêm validate/xử lý lỗi phức tạp nếu task không yêu cầu.
