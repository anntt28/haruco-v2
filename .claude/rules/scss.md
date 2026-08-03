# Quy tắc SCSS

Phản ánh đúng style đang tồn tại trong `assets/scss/`.

## Folder structure

- Tất cả file SCSS nằm phẳng trong 1 thư mục `assets/scss/` (không chia sub-folder theo `components/`, `layout/`, `pages/`...).
- File partial đặt tên với tiền tố `_` và kebab-case: `_button.scss`, `_menu-header.scss`, `_detail-product.scss`...
- `index.scss` là entry point duy nhất, **chỉ chứa các dòng `@import`**, không viết CSS trực tiếp trong file này.
- File được biên dịch ra `assets/css/index.css` — không sửa tay file `.css` này.

## Import

- Thứ tự import trong `index.scss` hiện tại:
  1. Font ngoài (`@import url(...)` — Google Fonts, cdnfonts, font `.otf` local)
  2. `_variable`, `_mixin` (biến và mixin phải import trước tiên)
  3. `_custom-bootstrap` (override Bootstrap)
  4. `_layout`, `_common`, `_space`, `_transition` (nền tảng chung)
  5. `_color`, `_button`, `_text`, `_input`, `_link`, `_flex`, `_grid` (utility dùng chung)
  6. Các file theo khu vực/trang cụ thể: `_menu-header`, `_menu-footer`, `_menu-aside`, `_slick`, `_step`, `_home`, `_introduce`, `_product-category`, `_news`, `_detail-news`, `_detail-product`, `_contact`.
- Khi thêm 1 khu vực/trang mới, thêm file `_ten-khu-vuc.scss` và `@import` nó vào **cuối danh sách** (sau các khu vực trang đã có), giữ nguyên nhóm biến/mixin/bootstrap/common ở đầu.
- Không tạo thêm cấp import lồng nhau (partial import partial khác) — mọi `@import` chỉ diễn ra ở `index.scss`.

## Variables

- Khai báo phẳng trong `_variable.scss`, không dùng SCSS map, không dùng CSS custom properties cho màu (trừ vài biến `--n`, `--t`, `--d` xuất hiện ở `:root` trong output biên dịch, không phải do SCSS ở đây định nghĩa).
- Đặt tên biến theo 2 kiểu đang tồn tại song song:
  - Tên theo ngữ nghĩa: `$primary`, `$light`, `$dark`, `$grey-1`, `$main-01`, `$sub-main-error`...
  - Tên theo mã hex khi không có ngữ nghĩa rõ ràng: `$color-FF5959`, `$color-6F6F6F`, `$color-D9D9D9`...
- Khi thêm màu mới: nếu màu đã có biến tương ứng, **dùng lại biến cũ**, không tạo biến trùng giá trị. Nếu là màu mới, đặt tên theo 1 trong 2 kiểu trên tuỳ trường hợp có ngữ nghĩa rõ hay không.

## Mixin

- Toàn bộ mixin khai báo trong `_mixin.scss`, dùng cho transition và responsive breakpoint:
  - `trans`, `trans-fast`, `trans-slow` — transition dùng chung.
  - `minWidth($value)`, `maxWidth($value)`, `minmaxWidth($value, $valuemax)` — bọc `@media` với giá trị breakpoint truyền trực tiếp (px), không dùng biến breakpoint cố định kiểu `$screen-md`.
- **Luôn dùng mixin để viết responsive, không viết `@media` trực tiếp** trong các file khác — đây là quy tắc nhất quán 100% trong toàn bộ codebase hiện tại.

## Responsive

- Breakpoint dùng trực tiếp bằng số (px) khi gọi mixin, phổ biến nhất: `768px`, `992px`, `1024px`, `1200px`, `1440px`. Không có danh sách biến breakpoint đặt tên sẵn — khi cần, gọi thẳng `@include minWidth(768px) { ... }`.
- Cách viết phổ biến là mobile-first: viết style mặc định (mobile) trước, rồi `@include minWidth(...)` để override cho màn lớn hơn. `@include maxWidth(...)` dùng khi cần override riêng cho mobile bên trong 1 selector đã có style desktop.

## Nesting

- Nest theo đúng cấu trúc HTML lồng nhau, dùng `&` cho pseudo-class/modifier (`&:hover`, `&:not(:last-child)`, `&::after`).
- Độ sâu nesting theo cấu trúc thật của HTML (thường 2-4 cấp), không giới hạn cứng nhưng không nest quá sâu không cần thiết.
- Mỗi block CSS lớn thường bọc ngoài cùng bằng class của section/khối cha (ví dụ `.homepage { section {...} .products-by-category {...} }`, `.introduce { .text { h2 {...} p {...} } }`).
- Responsive luôn đặt **bên trong** selector đang style (nest `@include minWidth(){}` bên trong rule đó), không tách riêng 1 block media query ở cuối file.

## Naming

- Class trong SCSS khớp 1-1 với class dùng trong HTML (kebab-case) — không style qua `id`, không dùng attribute selector cho mục đích style thông thường.
- Không dùng BEM. Không dùng CSS Modules / scoped naming.
- File `_space.scss` sinh utility class bằng vòng lặp `@for` (`w--{n}`, `h--{n}`, `mw--{n}`, `mh--{n}`, có biến thể theo breakpoint `w-md--`, `w-lg--`, `w-xxl--`) — đây là cách duy nhất trong dự án dùng class sinh tự động, giữ nguyên cách này nếu cần thêm spacing utility, không tạo thêm utility generator kiểu khác.

## Không có quy ước riêng

- Không có style lint (`.stylelintrc`), không có comment convention bắt buộc trong SCSS — giữ theo style hiện có (hầu như không có comment trong file SCSS).
