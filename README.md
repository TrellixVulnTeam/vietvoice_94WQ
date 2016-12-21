Để thiết lập lại project thì vào **/model/batch.js** sửa **speechClient**

Các thông số thiết lập database (mongo) thì vào **/model/db.js**

### Hướng dẫn cách dịch file

1. Chuẩn bị tệp json chứa Google Drive ID của file audio (xem mẫu ở thư mục json)
2. Chạy lệnh **node b.js duong-dan-den-file.json 1-cai-ten-audio-file-unique**
3. Có thể mở nhiều terminal để chạy song song lệnh trên với nhiều file json
4. dữ liệu sẽ được lưu vào database. Chạy lệnh **node index.js** để xem trên web.
