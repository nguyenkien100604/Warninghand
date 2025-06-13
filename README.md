# 🤖 WarningHand – Nhận Diện Cử Chỉ Tay Chạm Mặt Qua Webcam

Ứng dụng trình duyệt dùng AI để phát hiện khi người dùng **chạm tay vào mặt** – một hành vi phổ biến cần hạn chế trong các tình huống như dịch bệnh, phẫu thuật, hoặc môi trường vệ sinh cao.

## 🚀 Demo

![](https://user-images.githubusercontent.com/your-gif-or-demo-link.gif)

> Ứng dụng hoạt động hoàn toàn trên trình duyệt, không cần cài đặt thêm.

---

## 🔧 Công nghệ sử dụng

- [ReactJS](https://reactjs.org/) – Giao diện người dùng
- [TensorFlow.js](https://www.tensorflow.org/js) – Thư viện AI chạy trực tiếp trên trình duyệt
- [MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) – Mô hình nhận diện đặc trưng hình ảnh
- [KNN Classifier](https://github.com/tensorflow/tfjs-models/tree/master/knn-classifier) – Bộ phân loại mẫu dựa trên dữ liệu huấn luyện
- [WebGL backend](https://www.tensorflow.org/js/guide/platform_environment) – Tăng tốc xử lý trên GPU
- [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) – Truy cập webcam người dùng

---

## 📦 Cài đặt

```bash
git clone https://github.com/nguyenkien100604/Warninghand.git
cd Warninghand
npm install
npm start
