---
name: figma-mcp-go
description: Diagnose and reconnect the project's custom Figma MCP server (`hungnms1/figma-mcp-go`, declared in this project's `.mcp.json`) before doing any Figma lookup. Use whenever the user asks to connect/use "mcp-go" or "figma-mcp-go", or before calling any `mcp__figma__*` tool.
---

# Figma MCP-Go — Connect & Diagnose (Haruco)

Project Haruco (site tĩnh HTML/SCSS/JS, không dùng framework/build tool) dùng một MCP server Figma **riêng cho project này**, khác với connector `claude.ai Figma` chính thức (server đó vẫn kết nối song song, dùng cho các tác vụ Figma không cần tới mcp-go). Server `figma-mcp-go` khai báo trong `.mcp.json` ở **project root**, chạy qua Docker, expose cổng `1994`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "-p", "1994:1994", "hungnms1/figma-mcp-go"]
    }
  }
}
```

`.mcp.json` này project-scoped và gitignored — không commit vào repo.

> **Lưu ý riêng cho Haruco:** bản mẫu `.mcp.json` hiện đang nằm ở `mcp-figma/.mcp.json` (thư mục con), **không phải** project root. Claude Code chỉ tự động đọc `.mcp.json` đặt tại root, nên ở trạng thái hiện tại server `figma` **chưa được Claude Code phát hiện**. Bước 0 dưới đây xử lý đúng việc này trước khi chẩn đoán các bước tiếp theo.

Chạy skill này **trước** khi dùng bất kỳ tool nào thuộc server `figma` — không âm thầm fallback sang `claude.ai Figma` nếu user đã yêu cầu cụ thể dùng mcp-go.

---

## Quy trình mỗi lần được gọi

### 0. Xác nhận `.mcp.json` đã ở đúng vị trí (project root)

```bash
test -f ./.mcp.json && echo "OK: .mcp.json đã có ở root" || echo "THIẾU: .mcp.json chưa có ở root"
```

- Nếu **THIẾU**: đây là nguyên nhân phổ biến nhất khiến server không bao giờ được Claude Code phát hiện. Báo user, hỏi có muốn copy nội dung từ `mcp-figma/.mcp.json` sang `.mcp.json` ở root không — **không tự ý copy** khi chưa được xác nhận, vì đây là thêm một MCP server mới cần user duyệt qua `/mcp`.
- Nếu **OK**: sang bước 1.

### 1. Kiểm tra trạng thái kết nối hiện tại

```bash
claude mcp get figma
```

- **`✔ Connected`** → sẵn sàng. Dùng `ToolSearch` với query `"figma"` hoặc `"mcp__figma__"` để load schema tool, rồi dùng trực tiếp. Dừng ở đây.
- **`⏸ Pending approval`** → project-scoped server chưa được approve cho session hiện tại → báo user chạy `/mcp` trong Claude Code UI để approve, thử lại bước 1.
- **`✘ Failed to connect`** → sang bước 2.

### 2. Chẩn đoán nguyên nhân "Failed to connect"

Nguyên nhân phổ biến nhất: cổng `1994` đã bị một container `hungnms1/figma-mcp-go` cũ (từ phiên trước) chiếm giữ — container dùng `--rm` nhưng vẫn còn sống nếu tiến trình cha (subprocess MCP của phiên trước) chưa thoát sạch.

```bash
docker ps --filter "publish=1994" --format '{{.ID}} {{.Image}} {{.Status}} {{.Names}}'
```

Chỉ xử lý tiếp nếu container trả về đúng image `hungnms1/figma-mcp-go`. Nếu cổng bị process khác (không phải image này) chiếm — dừng lại và hỏi user, không tự ý can thiệp.

Ghi chú riêng cho máy này: từng có nhiều container `hungnms1/figma-mcp-go` chạy song song (dùng chung image nhưng không chung `--rm` lifecycle) — nếu thấy nhiều hơn 1 container publish cổng 1994, đây là bất thường, dừng lại và hỏi user thay vì tự chọn container để dừng.

### 3. Dọn container cũ chiếm cổng

```bash
docker stop <container_id>
```

Container chạy với `--rm` nên tự bị xoá sau khi `stop`. Không dùng `docker rm -f` trừ khi `stop` không dọn được sau ~10s.

### 4. Xác nhận cổng đã trống

```bash
docker ps --filter "publish=1994" --format '{{.ID}}'
```

Không còn container nào giữ cổng 1994.

### 5. Yêu cầu harness reconnect

Dọn container **không** tự động làm session hiện tại kết nối lại — Claude Code chỉ spawn subprocess MCP tại thời điểm khởi động session/approve server. Sau bước 3–4:

- Báo user chạy `/mcp` (trong Claude Code interactive) để reconnect thủ công, HOẶC
- Báo user restart Claude Code / reload window nếu `/mcp` không khả dụng trong môi trường hiện tại (ví dụ non-interactive session).

### 6. Xác nhận lại

```bash
claude mcp get figma
```

Lặp lại tới khi `✔ Connected`. Sau khi connected, dùng `ToolSearch` để load schema các tool `mcp__figma__*` (fileKey/nodeId theo file Figma thực tế của project Haruco) trước khi gọi.

---

## Việc KHÔNG được tự ý làm

- Không tự ý copy/tạo `.mcp.json` ở project root nếu chưa được user xác nhận — đây là việc thêm một MCP server mới, cần user duyệt.
- Không sửa `.mcp.json` (đổi command/port/image của MCP server) nếu không được yêu cầu.
- Không `docker rm -f` hoặc `docker stop` container không rõ nguồn gốc — luôn kiểm tra `{{.Image}}` khớp `hungnms1/figma-mcp-go` trước khi dừng.
- Không tự chọn 1 trong nhiều container trùng cổng để dừng nếu phát hiện bất thường (nhiều container cùng publish cổng 1994) — hỏi user trước.
- Không âm thầm chuyển sang dùng `claude.ai Figma` connector thay thế nếu mcp-go vẫn "Failed to connect" sau khi đã thử — báo rõ tình trạng và hỏi user có muốn fallback không.
