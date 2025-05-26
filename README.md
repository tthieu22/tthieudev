
# Dự án tthieu.dev

# Giới thiệu Dự án Demo

Kính chào anh/chị HR,

Em xin gửi đến anh/chị sản phẩm demo do em tự học, nghiên cứu và phát triển hoàn toàn độc lập nhằm thể hiện năng lực và kỹ năng phát triển web Fullstack của mình. Em rất trân trọng thời gian quý báu của anh/chị khi xem CV và trải nghiệm sản phẩm này.

## Giới thiệu chung

Dự án demo là hệ thống quản lý sản phẩm và đơn hàng tối ưu hóa quy trình bán hàng trực tuyến, từ thêm sản phẩm, quản lý danh mục đến xử lý thanh toán. Hệ thống sử dụng JWT đảm bảo bảo mật xác thực người dùng, đồng thời tích hợp chatbot thông minh giúp trả lời tự động các câu hỏi thường gặp, giảm đến 30% lượng yêu cầu hỗ trợ thủ công, nâng cao trải nghiệm và tiết kiệm thời gian vận hành.

## Tính năng quản trị (Admin)

- Quản lý sản phẩm: thêm, sửa, xoá với đầy đủ thông tin chi tiết (tên, mô tả, giá, hình ảnh).
- Quản lý danh mục sản phẩm, bài viết/blog, thương hiệu, người dùng, danh sách yêu thích.
- Quản lý đơn hàng với các trạng thái cập nhật theo quy trình vận hành.
- Các chức năng hỗ trợ khác: giảm giá, xử lý yêu cầu liên hệ, bình luận, đánh giá.
- Xác thực người dùng, quên/mật khẩu và đặt lại mật khẩu sử dụng token JWT bảo mật.
- Thanh toán demo qua VNPay với hướng dẫn thử nghiệm chi tiết.

Giao diện admin hiện còn đơn giản, một số tính năng chưa hoàn thiện, nhưng các chức năng cốt lõi đã hoàn thành để vận hành hệ thống hiệu quả.

## Tài khoản truy cập admin 

   Email: hietrng202@gmail.com
   Password: admin
   (Đây là dự án em tự phát triển nên không tránh khỏi được các lỗi phát sinh trong quá trình review. Mong các anh chị thông cảm ạ! Phần user các anh chị đăng nhập để trải nghiệm hết các tính năng ạ. Em xin chân thành cảm ơn. )
## Tính năng frontend dành cho người dùng

- Hiển thị sản phẩm theo danh mục, hỗ trợ lọc và tìm kiếm nhanh.
- Giỏ hàng thêm, sửa, xoá sản phẩm dễ dàng.
- Thanh toán demo qua VNPay với hướng dẫn chi tiết.
- Quản lý tài khoản bảo mật bằng JWT, hỗ trợ quên/mật khẩu qua email.
- Bài viết, bình luận, đánh giá sản phẩm.
- Chatbot đa kịch bản hỗ trợ trò chuyện, tư vấn sản phẩm, chính sách, tra cứu đơn hàng.

## Kiến trúc & Công nghệ sử dụng

**Frontend:** React.js, Redux Toolkit, React Router, CSS/SCSS, Axios.  
**Backend:** Node.js + Express.js (MVC), MongoDB Atlas, JWT, hệ thống mailer.  
**Triển khai:** Docker, DockerHub, AWS EC2, SSL/HTTPS, domain riêng.  
**Công cụ hỗ trợ:** Git/GitHub, Postman.

## Điểm nhấn kỹ thuật nâng cao

- Bảo mật: JWT với refresh token, chống CSRF, XSS, reset mật khẩu an toàn.
- Kiến trúc mở rộng: mô hình MVC chuẩn, module hóa quản lý sản phẩm, đơn hàng, người dùng.
- Hiệu suất: tối ưu Redux, caching API, lazy loading, code splitting.
- DevOps: Container hóa, pipeline CI/CD cơ bản, SSL/HTTPS bảo mật.
- Chatbot AI đa kịch bản giúp giảm 30% yêu cầu hỗ trợ thủ công.

## Kết quả & Bài học

Dự án giúp em nâng cao kỹ năng phát triển API RESTful, quản lý trạng thái phức tạp, triển khai thực tế trên AWS với Docker, quản lý mã nguồn Git, bảo mật ứng dụng và làm việc nhóm hiệu quả. Dù còn một số điểm chưa hoàn thiện, em rất mong nhận được góp ý từ anh/chị để hoàn thiện và phát triển thành giải pháp thương mại chuyên nghiệp.

## Kế hoạch phát triển mở rộng

- Báo cáo, thống kê doanh thu trực quan (ChartJS/Recharts).
- Xác thực hai lớp (2FA), phân quyền chi tiết (RBAC).
- Tối ưu giao diện, SEO frontend.
- Mở rộng chatbot AI nâng cao.

## Link GitHub source code

[https://github.com/tthieu22/tthieudev.git](https://github.com/tthieu22/tthieudev.git)  

Em rất sẵn lòng trao đổi thêm hoặc hỗ trợ trải nghiệm trực tiếp sản phẩm khi anh/chị cần. Xin cảm ơn anh/chị đã dành thời gian đọc và xem xét.





## Tổng quan dự án

Dự án tthieu.dev là một hệ thống đa thành phần, bao gồm:

- **Frontend**: Giao diện người dùng cuối (client) dành cho khách hàng sử dụng dịch vụ.
- **Admin**: Giao diện quản trị dành cho quản lý và nhân viên admin.
- **Backend**: Server API chịu trách nhiệm xử lý logic, tương tác cơ sở dữ liệu và bảo mật.

Mỗi phần được phát triển độc lập, sử dụng công nghệ hiện đại nhằm đảm bảo hiệu năng, khả năng mở rộng và bảo trì dễ dàng.

---

## Frontend (Client)

### Công nghệ sử dụng

- React 18
- Redux Toolkit (quản lý trạng thái)
- React Router DOM (định tuyến)
- Axios (giao tiếp API)
- Formik & Yup (form và validation)
- Swiper, React Icons, React Toastify (UI/UX enhancements)
- Moment.js (xử lý thời gian)

### Hướng dẫn cài đặt & chạy

1. Di chuyển đến thư mục frontend:

   ```bash
   cd frontend
   ```

2. Cài đặt các package:

   ```bash
   npm install
   ```

3. Chạy ứng dụng trong môi trường phát triển:

   ```bash
   npm start
   ```

4. Mở trình duyệt tại địa chỉ:

   ```
   http://localhost:3000
   ```

### Build production

```bash
npm run build
```

Thư mục build sẽ được tạo ra trong `frontend/build`.

---

## Admin (Giao diện quản trị)

### Công nghệ sử dụng

- React 18
- Ant Design & Ant Design Charts (UI framework & biểu đồ)
- Redux Toolkit (quản lý trạng thái)
- React Router DOM (định tuyến)
- Formik, Yup (form & validation)
- jsPDF, XLSX (xuất file PDF, Excel)
- React Dropzone (upload file)
- React Widgets (component UI đa dạng)

### Hướng dẫn cài đặt & chạy

1. Chuyển đến thư mục admin:

   ```bash
   cd admin
   ```

2. Cài đặt các package:

   ```bash
   npm install
   ```

3. Chạy ứng dụng ở môi trường phát triển:

   ```bash
   npm start
   ```

4. Truy cập giao diện admin tại:

   ```
   http://localhost:3001
   ```

   *Lưu ý:* Port có thể thay đổi tùy cấu hình.

### Build production

```bash
npm run build
```

Thư mục build sẽ được tạo ra trong `admin/build`.

---

## Backend (API Server)

### Công nghệ sử dụng

- Node.js (v16+)
- Express.js (framework server)
- MongoDB + Mongoose (cơ sở dữ liệu NoSQL)
- JWT (xác thực & phân quyền)
- Middleware (xử lý request, bảo mật, logging)

### Hướng dẫn cài đặt & chạy

1. Di chuyển vào thư mục backend:

   ```bash
   cd backend
   ```

2. Cài đặt các package:

   ```bash
   npm install
   ```

3. Tạo file `.env` với các biến môi trường (xem mẫu bên dưới).

4. Chạy server ở môi trường phát triển:

   ```bash
   npm run dev
   ```

5. API mặc định chạy ở:

   ```
   http://localhost:5000
   ```

### Biến môi trường `.env` mẫu

```env
PORT=5000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
MAIL_ID=your_mail_account
MP=some_value
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECRET_KEY=your_vnpay_secret_key
VNPAY_RETURN_URL=https://yourdomain.com/vnpay_return
VNPAY_PAY_URL=https://pay.vnpay.vn/vpcpay.html
GEMINI_API_KEY=your_gemini_api_key

<!-- Chưa tích hợp  -->
# MOMO_PARTNER_CODE=your_partner_code
# MOMO_ACCESS_KEY=your_access_key
# MOMO_SECRET_KEY=your_secret_key
```

---

## Lưu ý chung & Tips

- **Cập nhật Browserslist**: Để tránh cảnh báo khi build frontend/admin, chạy lệnh:

  ```bash
  npx update-browserslist-db@latest
  ```

- **Node.js và npm**: Nên sử dụng phiên bản Node.js LTS mới nhất và npm cập nhật để tránh lỗi không tương thích.

- **Chạy độc lập hoặc đồng bộ**: Các phần frontend, admin và backend có thể chạy độc lập hoặc được tích hợp trên server tùy môi trường triển khai thực tế.

- **Môi trường deploy**: Có thể deploy từng phần lên các dịch vụ khác nhau như Vercel, Netlify cho frontend/admin, và Heroku, AWS, DigitalOcean cho backend.

---

## Liên hệ hỗ trợ

Nếu gặp vấn đề hoặc cần hỗ trợ, vui lòng liên hệ:

- **SĐT**: 0563650708  


<!-- NOTE QUÁ TRÌNH THỰC HIỆN  -->
<!-- 
### fontend ####
npx create-react-app digital-fe --template redux
npm i react-icons
npm i react-router-dom

delete some file don't use 
keep app.css app.js index.js

** create components , pages 

react router dom oulet 
__ create page Home 
setting write html in  .js
"emmet.includeLanguages": {
        "javascript": "javascriptreact"
}

** instal slide Marqee play logo
npm i react fast marquee

** rating instal libary 
npm i react-rating-stars-component
** instal swiper 
npm i swiper

** instal react helmet a
npm i react-helmet
use change title

** Our store use 
let location = useLocation();

zoom image product
npm i react-image-zoom

done html css
CustomInput / Container short code

domain 
netlify.com
'

npm install @reduxjs/toolkit
npm install react-redux
npm i axios
npm install formik --save

npm i yup
npm i react-toastify

npm uninstall reselect

### backend ### 

npm init 
npm i express mongoose bcrypt body-parser dotenv

** Run
npm start server
 (package.json) add {
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node index.js",
        "server": "nodemon index.js"
    },
}

** Create User
index ==> Models-> userModel (!mdbgum) ==> Ctroller -> userCtrol ==> routes -> authRoute ==> middlewares -> errorHandler
npm i nodemon --save-dev
** Mã hóa Password
npm i express-async-handler

**Token thoong bao cho nguoi dung -> xac minh nguoi dung 
npm i jsonwebtoken
*get a User
config ==> jwtToken ==> middlewares -> authmiddleware -> athRoute(      U : router.get("/:id", authmiddleware, getaUser)     )
* update user uses Api dung token xac minh token
* block a user when you are admin and you need an id user of the account you want block 
router.put("/block-user/:id", authmiddleware, isAdmin, blockUser);
** verified user id 
Create folder Utils -> validateMonfgodbID 
** Phan tich cookie -> refreshToken 3day 72*60*60*1000
npm i cookie-parser
-> handlerRefreshToken 
** Log out  

** Product : Model-> control -> router
morgan - > npm i morgan
** slugify -> auto create slug follow title
slugify-> npm i slugify
** search with filter 
gte : min
lte : max
localhost:5000/api/product?price[gte]=22000&price[lte]=40000 || postman
** search sort 
localhost:5000/api/product?sort=-category,-brand
** limiting the fields
localhost:5000/api/product?fields=title,price,category
**pagination
localhost:5000/api/product?page=7&limit=3
**Hide Password || resetTokenPassword || changed Password
login -> get token 
localhost:5000/api/user/password

npm i nodemailer
->search nodemailer {}
**forgot password with email
-create app password (my account :security -> 2 steps verification ->app password )
localhost:5000/api/user/forgot-password-token
** blog category , Product category ,Brand -> create update delete get a , get all
** add to wishlist , rating -> productCtrl 
**add image create link of image with cloudinary 
 npm i multer sharp cloundinary
untils -> cloudinary => middlewares -> uploadImage 
post man : {{base_url}}product/upload/667d416297dc47aa4270eb63 
image :filename 

router.put("/upload/:id", authmiddleware, isAdmin, uploadPhotoProduct.array('image', 10), uploadImages, productImgResize)
router.put("/upload/:id", authmiddleware, isAdmin, uploadPhotoBlog.array('image', 10), uploadImages, blogImgResize)

** order cart 
npm i uniqid

** delete image and create color enquiry >>>

done Backend

npm i cors

### admin ###
npm i react-icons
npm i react-router-dom
npm i antd

create layout with ant design
*dashboard
npm install @ant-design/charts --force

form add 
npm i react-quill
npm install react-form-stepper --save

npm install axios --force

npm i yup --force
npm install formik 
npm install @reduxjs/toolkit react-redux --force 

create app /store -> index.js import

create util features / auth /authSlice  && authService
configuration them

util -> base_url : link localhost/api
Yup use Warning

use Select in antd
Notice show 
npm install --save react-toastify
 -->
