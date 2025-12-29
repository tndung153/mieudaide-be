const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;

// Middleware - ĐẶT ĐÚNG THỨ TỰ
app.use(cors());
app.use(express.json());

// Serve static files - CHO PHÉP TRUY CẬP ẢNH
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Dữ liệu sản phẩm
let products = [
  {
    id: 1,
    name: "Red Magic Astra",
    price: 21990000,
    chip: "Snapdragon 8 Gen 3",
    ram: "16GB",
    pin: "6500mAh",
    image: "/images/astra.png",
  },
  {
    id: 2,
    name: "Red Magic 11",
    price: 19490000,
    chip: "Snapdragon 8 Gen 4",
    ram: "12GB",
    tanNhiet: "ICE 13.0",
    image: "/images/red11.png",
  },
  {
    id: 3,
    name: "Red Magic 11 Pro",
    price: 24990000,
    chip: "Snapdragon 8 Gen 4",
    ram: "24GB",
    sacNhanh: "165W",
    image: "/images/red11pro.png",
  },
];

// Route trang chủ
app.get("/", (req, res) => {
  res.send("✅ Server đang hoạt động! API: /products");
});

// API: Lấy danh sách tất cả sản phẩm
app.get("/products", (req, res) => {
  res.json(products);
});

// API: Lấy 1 sản phẩm theo ID
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({
      success: false,
      message: "Không tìm thấy sản phẩm",
    });
  }
});

// API: Thêm sản phẩm mới
app.post("/products", (req, res) => {
  const newProduct = req.body;

  // Tìm ID lớn nhất và cộng 1
  const maxId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;

  newProduct.id = maxId + 1;
  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: "Thêm sản phẩm thành công",
    product: newProduct,
  });
});

// API: Cập nhật sản phẩm
app.put("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index !== -1) {
    // Giữ nguyên ID, cập nhật các trường khác
    products[index] = { ...products[index], ...req.body, id };
    res.json({
      success: true,
      message: "Cập nhật thành công",
      product: products[index],
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Không tìm thấy sản phẩm",
    });
  }
});

// API: Xóa sản phẩm
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;

  products = products.filter((p) => p.id !== id);

  if (products.length < initialLength) {
    res.json({
      success: true,
      message: `Đã xóa sản phẩm có id=${id}`,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Không tìm thấy sản phẩm để xóa",
    });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log("=".repeat(50));
  console.log(`✅ Server đang chạy tại: http://localhost:${port}`);
  console.log(`📁 Thư mục ảnh: ${path.join(__dirname, "public/images")}`);
  console.log(`🔗 Test API:`);
  console.log(`   - Trang chủ: http://localhost:${port}/`);
  console.log(`   - Sản phẩm: http://localhost:${port}/products`);
  console.log(`   - Ảnh test: http://localhost:${port}/images/astra.png`);
  console.log("=".repeat(50));
});
