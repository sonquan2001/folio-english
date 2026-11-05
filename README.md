# Folio English

Ứng dụng học tiếng Anh cá nhân (dành cho điện thoại), dựng từ bản thiết kế Claude Design trong `project/` (`Folio English.dc.html`, hệ thiết kế *Classical*).

## Chạy

```bash
npm install
npm run dev      # mở http://localhost:5173 (dùng --host nên mở được từ điện thoại cùng Wi‑Fi)
npm run build    # bản production trong dist/
```

`dist/` là trang tĩnh — đưa lên bất kỳ host tĩnh nào (GitHub Pages, Netlify, Vercel…), mở trên điện thoại rồi chọn **Thêm vào màn hình chính** để dùng như app (có manifest + service worker để chạy offline).

## Màn hình

- **Hôm nay** — mục tiêu ôn thẻ, 3 việc trong ngày, câu của ngày (đổi mỗi ngày, có phát âm), từ đang khó nhớ.
- **Chủ đề** — 6 chủ đề (chào hỏi, thời tiết, thời trang, ăn uống, công việc, du lịch): từ vựng, mẫu câu, hội thoại; thêm cả chủ đề vào sổ để ôn.
- **Ôn tập** — flashcard lặp lại ngắt quãng (Quên / Khó / Nhớ / Dễ, hộp Leitner 0–5, khoảng 1·3·7·14·30 ngày).
- **Sổ từ** — tìm kiếm, lọc theo mức độ, thêm/xoá từ.
- **Tiến độ** — chuỗi ngày học, bản đồ nhiệt 5 tuần, mức độ ghi nhớ.

Dữ liệu lưu trong `localStorage` của trình duyệt (khoá `folio-english-v1`). Phát âm dùng Web Speech API của trình duyệt.

## Cấu trúc

- `src/App.tsx` — trạng thái, hàng đợi ôn tập, thanh tab; `SETTINGS` (mục tiêu/ngày, hướng thẻ, hiện IPA).
- `src/screens/` — từng màn hình.
- `src/data/topics.ts` — nội dung chủ đề.
- `src/lib/store.ts` — lưu trữ, thuật toán ôn tập, streak.
- `src/styles/classical.css` — token của hệ thiết kế (bản sao từ `project/_ds/…/styles.css`); `src/styles/app.css` — bố cục.
- `project/`, `chats/` — bản thiết kế gốc để tham chiếu.
