# AGENTS.md

Quy chuẩn hành vi nhằm giảm thiểu các lỗi lập trình phổ biến của LLM. Kết hợp với các hướng dẫn riêng của từng dự án khi cần.

**Đánh đổi (Tradeoff):** Bộ quy chuẩn này ưu tiên sự cẩn trọng hơn tốc độ. Với các tác vụ đơn giản, hãy linh hoạt đánh giá.

## 1. Tư duy trước khi viết code (Think Before Coding)

**Không giả định. Không giấu chỗ chưa rõ. Làm rõ các đánh đổi.**

Trước khi bắt tay vào thực hiện:

- Nêu rõ các giả định của bạn. Nếu chưa chắc chắn, hãy hỏi.
- Nếu có nhiều cách hiểu khác nhau, hãy trình bày ra — đừng tự ý chọn một cách trong im lặng.
- Nếu có cách tiếp cận đơn giản hơn, hãy nêu ra. Chủ động phản biện khi thấy cần thiết.
- Nếu có điểm chưa rõ, hãy dừng lại. Chỉ rõ điểm gây thắc mắc và đặt câu hỏi.

## 2. Ưu tiên sự đơn giản (Simplicity First)

**Lượng code tối thiểu đủ để giải quyết vấn đề. Không suy đoán viển vông.**

- Không thêm tính năng ngoài phạm vi yêu cầu.
- Không tạo abstraction (lớp trừu tượng) cho code chỉ dùng một lần.
- Không tự ý thêm tính "linh hoạt" hay "khả năng cấu hình" khi chưa được yêu cầu.
- Không viết xử lý lỗi cho các kịch bản không thể xảy ra.
- Nếu viết 200 dòng trong khi 50 dòng là đủ, hãy viết lại.

Tự hỏi: "Một kỹ sư cấp cao có thấy đoạn code này bị phức tạp hóa quá mức không?" Nếu có, hãy đơn giản hóa.

## 3. Thay đổi chuẩn xác (Surgical Changes)

**Chỉ chạm vào những gì bắt buộc. Chỉ dọn rác do chính mình tạo ra.**

Khi chỉnh sửa code hiện có:

- Không "tiện tay cải thiện" code lân cận, comment hay định dạng (formatting).
- Không refactor những phần đang chạy ổn định.
- Bám sát phong cách code sẵn có, kể cả khi bạn muốn viết theo cách khác.
- Nếu phát hiện code thừa (dead code) không liên quan, hãy nêu ra — không tự ý xóa.

Khi thay đổi của bạn tạo ra code thừa:

- Xóa các import / biến / hàm trở nên vô dụng do chính thay đổi của bạn gây ra.
- Không xóa code thừa có sẵn từ trước trừ khi được yêu cầu.

Thước đo: Mỗi dòng code thay đổi đều phải truy nguyên được trực tiếp từ yêu cầu của người dùng.

## 4. Thực thi theo mục tiêu (Goal-Driven Execution)

**Xác định tiêu chí thành công. Lặp lại cho đến khi được kiểm chứng.**

Chuyển đổi tác vụ thành các mục tiêu có thể kiểm chứng được:

- "Thêm validation" → "Viết test cho input không hợp lệ, rồi làm cho test pass"
- "Sửa bug" → "Viết test tái hiện lại lỗi đó, rồi sửa code cho test pass"
- "Refactor X" → "Đảm bảo test pass cả trước và sau khi refactor"

Với các tác vụ nhiều bước, hãy nêu kế hoạch ngắn gọn:

```
1. [Bước] → kiểm chứng: [tiêu chí kiểm tra]
2. [Bước] → kiểm chứng: [tiêu chí kiểm tra]
3. [Bước] → kiểm chứng: [tiêu chí kiểm tra]
```

Tiêu chí thành công rõ ràng giúp bạn tự chủ trong việc lặp lại quy trình. Tiêu chí mơ hồ ("làm cho nó chạy được") sẽ đòi hỏi phải liên tục hỏi lại.

## 5. Tuân thủ tài liệu đặc tả (Spec Compliance)

**Tôn trọng hợp đồng có sẵn. Không tự tạo phong cách riêng.**

Khi thao tác với giao diện hoặc văn bản:

- **Giao diện (UI):** Đối chiếu `DESIGN.md` làm chuẩn đích (source of truth) cho kiểu dáng, thông số và component.
- **Văn bản (Copy):** Đối chiếu `COPY.md` làm chuẩn đích (source of truth) cho câu chữ, ngữ cảnh và giọng điệu.

---

**Bộ quy chuẩn này phát huy hiệu quả khi:** diff có ít thay đổi thừa hơn, ít phải viết lại code do làm quá phức tạp, và các câu hỏi làm rõ xuất hiện trước khi lập trình thay vì sau khi xảy ra sai sót.

## Kỹ năng của agent (Agent skills)

### Issue tracker

Các issue và tài liệu đặc tả (spec) được lưu dưới dạng file markdown trong `.scratch/<feature>/`. Xem `docs/agents/issue-tracker.md`.

### Triage labels

Tập nhãn mặc định gồm 5 vai trò, mỗi chuỗi nhãn trùng với tên vai trò tương ứng. Xem `docs/agents/triage-labels.md`.

### Domain docs

Ngữ cảnh đơn lẻ: `GLOSSARY.md` + `docs/adr/` tại thư mục gốc của repository. Xem `docs/agents/domain.md`.
