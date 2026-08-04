# Homepage — Implementation Guide (Design Update)

Tài liệu này mô tả cách implement Homepage (`index.html`) theo design Figma mới, và đóng vai trò tài liệu implement chính thức cho Homepage. Chỉ mô tả **phần cần thay đổi** so với source hiện tại — phần nào không được nhắc tới trong tài liệu này thì giữ nguyên 100% như đang có.

- Figma Desktop: https://www.figma.com/design/9gs86RHUuUaBoyVUj8Oc4W/Haruco--Copy-?node-id=1-4820
- Figma Mobile: https://www.figma.com/design/9gs86RHUuUaBoyVUj8Oc4W/Haruco--Copy-?node-id=1-6362

## Overview

- Nguyên tắc chung khi implement: **ưu tiên chỉ sửa CSS, chỉ sửa/thêm HTML khi thực sự cần** (Banner và section "Trị liệu" — reuse Product Slider — là 2 trường hợp bắt buộc phải đổi HTML/JS).
- Không refactor lại cấu trúc DOM của các phần đang chạy tốt (header, product card, footer...) chỉ vì muốn "làm sạch code" — task này là cập nhật theo design, không phải rewrite.
- Toàn bộ section sản phẩm dạng slider trên Homepage (`.products-by-category` lặp lại 4 lần trong `index.html` hiện tại) đã là cùng 1 component — coi đây là "Product Slider Component" cần chuẩn hoá theo Figma rồi tái sử dụng, không viết riêng cho từng danh mục.

## Implementation Summary

Bảng tóm tắt mức độ thay đổi của từng section, để nhìn nhanh biết phần nào giữ nguyên HTML, phần nào chỉ sửa CSS, phần nào cần bổ sung JS, phần nào cần component mới.

| Section | HTML | CSS | JS | Notes |
|---|---|---|---|---|
| Header (tổng thể) | Giữ nguyên | Update | Giữ nguyên | Không đổi DOM/id đang được `index.js` bind |
| Search | Giữ nguyên | Update | Giữ nguyên | `.search-product-category` |
| Navigation | Giữ nguyên | Update | Giữ nguyên | `.menu-category-product`, `.primary-navigation` |
| Banner | Thay đổi | Update | Bổ sung | Chuyển từ `<img>` tĩnh sang Swiper — bắt buộc thêm HTML + JS |
| Product Slider | Bổ sung (khi thêm section mới) | Update | Bổ sung (nếu thêm instance) | Base Component, reuse cho mọi danh mục + "Trị liệu" |
| Footer | Giữ nguyên | Update | Giữ nguyên | Không đổi cấu trúc, chỉ chỉnh style nếu Figma khác |

Quy ước đọc bảng:
- **Giữ nguyên** = không đổi DOM.
- **Update** = chỉnh CSS/SCSS cho khớp Figma, không đổi HTML.
- **Bổ sung** = có HTML/JS mới thực sự cần thiết.

## Header

Giữ nguyên toàn bộ HTML/DOM hiện tại của header: `.header-page`, `.header-top`, `.header-middle`, `.header-bottom`, `.header-bottom-mobile`, `.menu-aside-page`.

**Search** (`.search-product-category`)
- Giữ nguyên DOM (`form`, `.dropdown.dropdown-search`, `input`, `button.btn-search`).
- Chỉ update CSS (spacing, màu, border-radius, font) cho khớp design mới.

**Navigation** (`.menu-category-product`, `.primary-navigation`)
- Giữ nguyên DOM (`#primary-menu-list`, `.menu-item`, dropdown danh mục sản phẩm).
- Chỉ update style (màu chữ, hover/active state, khoảng cách item).

Checklist:
- [ ] Không thêm/bớt element nào trong header.
- [ ] Không đổi `id`/class đang được `assets/js/index.js` bind vào (`site-navigation`, `dropdownMenuButton`, `btn-hamburger`, `menu-category-product`...).
- [ ] Mọi thay đổi chỉ nằm trong SCSS liên quan (`_menu-header.scss`).

## Banner

**Hiện trạng:** `.banner-top` hiện chỉ là 2 thẻ `<img>` tĩnh (1 bản desktop `d-md-block d-none`, 1 bản mobile `d-md-none`) — **chưa** phải slider.

**Yêu cầu mới:** chuyển `.banner-top` thành Swiper slider, theo các quy tắc sau:

- Banner chuyển **hoàn toàn** sang Swiper — không giữ lại `<img>` tĩnh song song.
- Desktop và Mobile dùng **chung một Banner Slider component** (chung `.swiper-container`/`.swiper-wrapper`/`.swiper-slide`), không tách thành 2 component/2 khối HTML riêng cho desktop và mobile.
- Không duplicate HTML giữa Desktop và Mobile: mỗi `.swiper-slide` chỉ chứa **1 phần tử ảnh responsive** (`<picture>` với `<source media>` cho breakpoint mobile + ảnh mặc định cho desktop — xem thêm mục Image Rules), thay vì lặp lại 2 thẻ `<img>` ẩn/hiện như cách banner cũ đang làm.
- Pagination dots của Swiper chính là các ellipse tròn trong Figma → dùng `pagination` kiểu bullet mặc định (`clickable: true`), **không** dùng kiểu fraction/progressbar.
- **Chỉ thêm Navigation (nút prev/next)** nếu Figma thực sự có — không mặc định thêm nút mũi tên nếu design chỉ có dots.
- Banner là **component duy nhất trên Homepage bắt buộc thay đổi HTML** ngoài Product Slider (khi Product Slider được nhân bản cho section mới "Trị liệu").

HTML structure:
- Giữ class `.banner-top` làm wrapper ngoài cùng.
- Bên trong: `.swiper-container` > `.swiper-wrapper` > nhiều `.swiper-slide` (mỗi slide là 1 banner, dùng `<picture>` responsive).
- Thêm 1 element pagination riêng, ví dụ `.swiper-pagination-banner`, đặt trong `.banner-top` (theo đúng convention đặt hậu tố riêng cho từng slider mà project đang dùng — xem các hậu tố `-cate`, `-small`, `-1`...`-9` trong `assets/js/index.js`).

Swiper structure & pagination:
- Khởi tạo 1 instance `new Swiper(...)` mới trong `assets/js/index.js`, đặt cạnh các block Swiper khác đã có, theo đúng convention đặt tên biến tuần tự (`swiperN`).
- Xem thêm quy tắc chung về cấu hình Swiper ở mục **Swiper Usage**.

Responsive:
- 1 slide/view ở mọi breakpoint (banner full-width, không hiển thị nhiều slide cùng lúc).
- Ảnh banner đổi giữa desktop/mobile qua `<picture>`/`<source media>`; dots hiển thị ở cả desktop và mobile.

Checklist:
- [ ] `.banner-top` chuyển từ `<img>` tĩnh sang cấu trúc Swiper đầy đủ (wrapper/slide/pagination).
- [ ] Mỗi slide dùng 1 phần tử `<picture>` duy nhất, không duplicate `<img>` desktop/mobile.
- [ ] Pagination dạng dot tròn giống Figma; navigation (nếu có) chỉ thêm khi Figma yêu cầu.
- [ ] Không tạo thêm file JS riêng — thêm vào `assets/js/index.js` hiện có.

## Product Slider Component

Đây là **Base Component** của Homepage — dùng lại nhiều lần, chuẩn hoá 1 lần duy nhất rồi áp dụng cho mọi nơi dùng lại. Trong HTML hiện tại, component này đã tồn tại sẵn dưới dạng section `.products-by-category` (đang lặp lại y hệt cấu trúc ở 4 nơi khác nhau, chỉ khác tiêu đề và data sản phẩm).

Cấu trúc component (giữ nguyên phần khung khi cập nhật CSS):

| Phần | Class hiện tại | Vai trò |
|---|---|---|
| Wrapper | `section.products-by-category` > `.container-fluid` | Khung ngoài của section |
| Heading | `.heading-type-2` (`<h2>` + `<a>` "Xem tất cả") | Tiêu đề danh mục + link xem tất cả |
| Product list/Swiper | `.slider-product-by-category.swiper-container` > `.swiper-wrapper` > nhiều `.swiper-slide` | Danh sách sản phẩm dạng slider |
| Product Card | `.item-best-seller` (`.img`, `.info` gồm `<h4>` tên sản phẩm, `.price` với `.sale`/`.cost`, `a.btn-border-rounded` "Mua hàng") | Card sản phẩm trong mỗi slide |
| Navigation | `.swiper-button-prev` / `.swiper-button-next` (đặt hậu tố riêng nếu cần phân biệt nhiều slider trên cùng trang) | Điều hướng slider |

Việc cần làm:
- Update CSS (spacing, màu, bo góc, typography, hover state) cho heading, card, nút CTA theo Figma.
- Giữ nguyên toàn bộ class/cấu trúc HTML của bảng trên — không đổi tên class, không đổi thứ tự element.
- Không viết tài liệu/CSS riêng cho từng danh mục sản phẩm vì chúng dùng chung 1 component, chỉ khác nội dung.

**Các section reuse component này** (chỉ khác title + product data):
- Đai lưng chống gù
- Đai lưng cột sống
- Thiết bị chăm sóc sức khỏe
- Gối Y tế
- **Trị liệu** (section mới theo design) — bắt buộc reuse, không tạo component mới

Ghi chú riêng: section **Best Seller** (`.product-best-seller`) dùng chung Product Card (`.item-best-seller`) và cơ chế Swiper, nhưng có thêm banner nền riêng (`.banner`/`.box-text`) bao ngoài — đây là **reuse một phần** (Product Card + Swiper), không phải bản sao y hệt toàn bộ wrapper như nhóm 5 section ở trên.

## Swiper Usage

Quy tắc chung khi dùng Swiper trên Homepage (áp dụng cho cả Banner và Product Slider):

- Banner dùng Swiper. Product Slider dùng Swiper. Không dùng thư viện slider khác.
- Ưu tiên dùng chung cách khởi tạo: nếu nhiều instance Product Slider (5 section) dùng chung `breakpoints`/`slidesPerView`/`spaceBetween`, khai báo **1 object option dùng chung** rồi truyền vào từng `new Swiper()`, thay vì copy nguyên khối option 5 lần. Vẫn giữ đúng style hiện tại của `assets/js/index.js` (không cần tạo function/module/helper file riêng — chỉ cần 1 biến object dùng chung khai báo trong cùng file).
- Không duplicate cấu hình giữa nhiều slider nếu giá trị giống nhau (breakpoints, spaceBetween mặc định...).
- Mỗi slider chỉ khác option khi thực sự cần khác (selector `nextEl`/`prevEl`/`pagination.el` bắt buộc phải khác nhau giữa các instance để tránh xung đột; các option còn lại nếu giống nhau thì dùng chung).

## Image Rules

- Toàn bộ ảnh sử dụng `aspect-ratio` để giữ tỉ lệ; không fix `height` bằng pixel nếu không thực sự bắt buộc (tránh vỡ ảnh khi responsive).
- Nếu Desktop và Mobile dùng ảnh khác nhau, ưu tiên dùng `<picture>` (với `<source media>`) thay vì tạo 2 thẻ `<img>` ẩn/hiện bằng class (áp dụng rõ nhất ở Banner — xem mục Banner).
- Áp dụng cho mọi ảnh trong Homepage: banner, sản phẩm, blog, review...
- Toàn bộ asset sau khi export từ Figma đặt tại `/assets/images/` — đây là nơi chứa toàn bộ ảnh của project, không để ảnh nằm rải rác ở thư mục khác.
- Ưu tiên giữ nguyên tên file ảnh theo tên layer/tên export trong Figma để dễ đối chiếu ngược lại thiết kế khi cần.

## CSS Rules

- Không đổi tên class hiện có nếu không thực sự cần thiết.
- Không đổi `id` hiện có.
- Không sửa CSS theo cách làm ảnh hưởng tới selector mà `assets/js/index.js` đang bind vào (kiểm tra lại `index.js` trước khi đổi class/id của bất kỳ element nào có khả năng được dùng làm JS hook).
- Chỉ thêm class mới khi thật sự phục vụ component mới (ví dụ Banner Slider, section "Trị liệu" nếu cần class riêng cho phần khác biệt thật sự).
- Ưu tiên tái sử dụng CSS/biến/mixin hiện có (`_variable.scss`, `_mixin.scss`, các class utility có sẵn) trước khi viết style mới.

## Component Reuse Rules

Quy tắc áp dụng cho mọi cặp section trên Homepage: nếu 2 section chỉ khác nhau về **title**, **image**, hoặc **data**, thì bắt buộc:

- Reuse cùng 1 component (cùng HTML structure, cùng class).
- Không duplicate HTML cho từng section.
- Không duplicate SCSS cho từng section.
- Không tạo component mới.

Đây là quy tắc nền cho mục **Product Slider Component** ở trên và cho bất kỳ section reuse nào phát sinh thêm sau này.

## Global Styles

Các thay đổi dưới đây là **global** (áp dụng cho toàn site qua `assets/scss/index.scss`), không riêng Homepage — cần lưu ý khi biên dịch lại SCSS vì sẽ ảnh hưởng mọi trang khác.

**Font**
- Body toàn site đổi sang `"Lexend", sans-serif`, load qua Google Fonts (`preconnect` + `<link>` như trong yêu cầu thiết kế).
- Nếu 1 vị trí cụ thể theo Figma dùng font khác Lexend, chỉ override `font-family` tại chính element/class đó — không đổi giá trị global.

**Container**
- `.container-fluid` đổi `max-width: 1400px`.

**Mobile Padding**
- **Giữ nguyên** padding mobile hiện tại của project trong đợt update này — không chỉnh sửa.
- Việc cập nhật padding mobile sẽ nằm trong 1 task riêng sau, không thuộc phạm vi lần cập nhật Homepage này.

## Responsive

Mô tả theo hướng Desktop → Tablet → Mobile, chỉ nêu phần thay đổi:

- **Header**: Desktop hiển thị `.header-middle` + `.header-bottom` (`d-xl-block`); Tablet/Mobile chuyển sang `.header-bottom-mobile` + `.menu-aside-page` — cơ chế ẩn/hiện giữ nguyên như hiện tại, chỉ cập nhật style theo Figma cho từng breakpoint.
- **Banner**: 1 slide/view ở cả 3 kích thước; chỉ khác ảnh banner (qua `<picture>`) và chiều cao co giãn theo `aspect-ratio`, không fix chiều cao cứng.
- **Product Slider Component**: số card hiển thị/lần giảm dần theo breakpoint (Desktop nhiều card hơn Tablet, Tablet nhiều hơn Mobile) — dùng option `breakpoints` của Swiper đúng theo pattern đang có ở các slider khác trong `assets/js/index.js`, chỉ chỉnh lại số `slidesPerView`/`spaceBetween` cho khớp Figma từng breakpoint.
- **Container**: `max-width: 1400px` chỉ có tác dụng ở màn hình desktop rộng; ở Tablet/Mobile bố cục vẫn theo padding hiện tại (xem mục Global Styles — Mobile Padding).

## Assets

- Toàn bộ ảnh export từ Figma cho Homepage lưu tại `/assets/images/`.
- Không tạo thư mục con riêng theo section/component — giữ 1 nơi chứa ảnh duy nhất đúng cấu trúc hiện tại của project.

## Out of Scope

Các phần sau **không** thuộc phạm vi implement của tài liệu này:

- Mobile spacing/padding refinement (sẽ có task riêng sau).
- Animation ngoài phạm vi Swiper (transition/scroll effect khác nếu không có trong Figma).
- Backend/API.
- Business logic (validate form, xử lý submit, tính giá...).
- Nội dung sản phẩm thật (copy, giá, ảnh sản phẩm chính thức).
- Các thay đổi ở trang khác ngoài Homepage (`introduce.html`, `product-list.html`...), trừ ảnh hưởng gián tiếp từ Global Styles.

## Notes

- Banner là phần **bắt buộc đổi HTML + JS** (từ `<img>` tĩnh sang Swiper) — mọi phần khác trên Homepage ưu tiên chỉ đổi CSS.
- Section "Trị liệu" là section mới nhưng **không** cần component mới — bắt buộc tái sử dụng Product Slider Component đã chuẩn hoá.
- Font Lexend và `.container-fluid { max-width: 1400px }` là thay đổi **global**, ảnh hưởng tất cả các trang khác dùng chung `assets/scss/index.scss`, không chỉ Homepage — cần test lại các trang khác sau khi đổi.
- Mobile padding **chưa** được cập nhật trong lần này — sẽ có yêu cầu riêng sau, không tự ý chỉnh khi implement design này.
