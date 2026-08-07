---
name: git-workflow
description: Git branch strategy, commit message convention, and merge-request/hotfix process for this Shopify theme repo. Use when creating a branch, writing a commit message, opening a Merge Request, or handling a hotfix.
---

# Git Workflow

> Quy trình này được thiết kế cho team nhỏ (2–5 developers) làm việc với Shopify theme.

---

## Branch Strategy

Project dùng **một branch chính duy nhất** — không có `develop`, không có môi trường staging.

```
main
  │
  ├── feature/<slug>        ← Tính năng mới
  ├── fix/<slug>            ← Bug fix
  ├── hotfix/<slug>         ← Khẩn cấp, từ main
  └── chore/<slug>          ← Config, tooling, dọn dẹp
```

Luồng làm việc:
1. Tạo branch mới từ `main`
2. Phát triển trên branch cá nhân
3. Push lên GitLab
4. Tạo Merge Request vào `main`
5. Sau khi merge → xóa branch

### Protected branches

| Branch | Protection | Deploy |
|---|---|---|
| `main` | Push bị block — chỉ merge qua Merge Request | Development Theme / Production theo pipeline hiện tại — xem [`developer-docs/DEPLOYMENT.md`](../../../developer-docs/DEPLOYMENT.md) |

### Feature branch lifetime

```
1. Tạo từ main:
   git checkout main
   git pull origin main
   git checkout -b feature/product-card-variant-2

2. Làm việc locally
3. Coding → Theme Check (npm run check)
4. Commit → Push
5. Tạo MR → main
6. Sau khi merge → xóa branch
```

---

## Branch Naming

```
feature/<slug>          ← Tính năng mới
fix/<slug>              ← Bug fix không khẩn cấp
hotfix/<slug>           ← Fix khẩn cấp, tạo trực tiếp từ main
chore/<slug>            ← Config, tooling, dọn dẹp — không ảnh hưởng behavior
docs/<slug>             ← Cập nhật tài liệu
```

**`<slug>` rules:**
- `kebab-case` — chỉ lowercase, dấu gạch ngang
- Ngắn gọn, mô tả rõ thay đổi
- Không dùng tên người (`feature/anntt-hero` ✗ → `feature/hero-banner` ✓)

**Ví dụ đúng:**
```
feature/hero-banner
feature/product-card-v2
fix/header-mobile-overlap
fix/cart-count-update
hotfix/checkout-button-missing
chore/update-eslint-config
docs/update-deployment-guide
```

---

## Commit Message Convention

Format: **Conventional Commits** (adapted cho Shopify theme)

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### Types

| Type | Dùng khi |
|---|---|
| `feat` | Tính năng mới (section, snippet, UI component) |
| `fix` | Bug fix |
| `style` | CSS changes không ảnh hưởng behavior |
| `refactor` | Cải thiện code, không thay đổi behavior |
| `perf` | Performance improvement |
| `docs` | Cập nhật tài liệu (`.claude/`, `*.md`) |
| `chore` | Config, tooling, dependency update |
| `content` | Nội dung text, translation, settings_data |

### Scopes (optional, dùng khi cần rõ hơn)

```
section   fix(section/hero): ...
snippet   feat(snippet/button): ...
assets    style(assets/header): ...
config    chore(config): ...
i18n      content(i18n): ...
ci        chore(ci): ...
```

### Ví dụ commit đúng

```
feat(section/hero): add text alignment setting

fix(snippet/product-card): alt text pre-assign for Theme Check compatibility

style(assets/header): adjust mobile menu z-index

chore(ci): add GitLab CI pipeline

docs: ghi nhận lỗi alt text vào liquid.md

content(i18n): thêm key sections.hero.default_subheading vào vi.json
```

### Ví dụ commit sai

```
✗ update files
✗ fix bug
✗ WIP
✗ anntt fix header
✗ changes
```

---

## Merge Request (MR) Process

### Tạo MR

1. Push branch lên GitLab
2. Tạo MR từ GitLab UI: source → `main`
3. Điền title theo format: `feat(scope): description` hoặc `fix(scope): description`
4. Điền description: mô tả thay đổi + screenshot nếu có UI change

### MR Checklist (người tạo MR tự check)

```
[ ] npm run check pass — 0 error
[ ] Không có debug code (console.log, TODO chưa giải quyết)
[ ] Screenshot hoặc video cho UI change
[ ] Review-checklist.md passed
[ ] Locale keys đã thêm vào cả en.default.json và vi.json
```

### Review Rules

- Mọi MR phải có ít nhất **1 approval** trước khi merge
- Reviewer phải check: behavior (không chỉ đọc code)
- Sau khi merge: **delete source branch**

### Merge Strategy

- Default: **Squash and merge** — giữ history sạch trên `main`
- Ngoại lệ: rebase khi MR nhỏ và history rõ ràng

---

## Hotfix Process

Dùng khi production có bug cần fix ngay:

```
main
  │
  ▼
hotfix/<slug>
  │
  ▼
MR → main
  │
  ▼
CI Deploy (theo pipeline hiện tại)
```

```bash
# 1. Checkout từ main
git checkout -b hotfix/checkout-button-missing main

# 2. Fix bug

# 3. Tạo MR → main (ưu tiên review ngay)

# 4. Sau khi merge vào main → CI tự động deploy theo rule hiện tại
#    (xem developer-docs/DEPLOYMENT.md)
```

---

## Release Flow

Project **không có** branch `develop`, không có release branch riêng, không có môi trường staging. Mọi thay đổi merge thẳng vào `main`, deploy theo cấu hình CI hiện tại:

```
Feature / Fix / Hotfix Branch
        │
        ▼
   Merge Request
        │
        ▼
       main
        │
        ▼
     GitLab CI
        │
        ▼
Shopify Development Theme / Production
   (theo pipeline hiện tại — xem developer-docs/DEPLOYMENT.md)
```

1. Tạo MR từ branch làm việc (`feature/*`, `fix/*`, `hotfix/*`, `chore/*`) → `main`
2. Reviewer approve MR (xem [Review Rules](#review-rules))
3. Merge vào `main`
4. GitLab CI tự động chạy `validate` → `test` (placeholder) → deploy theo rule branch hiện tại

Chi tiết cơ chế deploy (biến môi trường, deploy toggle, rủi ro): [`developer-docs/DEPLOYMENT.md`](../../../developer-docs/DEPLOYMENT.md)

---

## `.gitignore` và `.shopifyignore`

| File | Mục đích |
|---|---|
| `.gitignore` | Loại trừ khỏi Git (node_modules, OS files) |
| `.shopifyignore` | Loại trừ khỏi `shopify theme push/pull` |

**Rule:** `.claude/` không được push lên Shopify store — phải có trong `.shopifyignore`.

---

## Quy trình hàng ngày (Daily Flow)

```bash
# Bắt đầu task mới
git checkout main
git pull origin main
git checkout -b feature/my-feature

# Làm việc...
npm run dev

# Trước khi commit
npm run check

# Commit
git add sections/my-section.liquid assets/my-section.css
git commit -m "feat(section/my-section): add new section"

# Push và tạo MR
git push origin feature/my-feature
# → Mở GitLab, tạo MR → main
```
