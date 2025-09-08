import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  Paper,
  MenuItem,
  TableContainer,
  TableRow,
  FormControl,
  Select,
  FormGroup,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const storeOptions = [
    { value: "main", label: "Cửa hàng chính" },
    { value: "hn", label: "Hà Nội" },
    { value: "hcm", label: "Thành phố Hồ Chí Minh" },
  ];

  const [selectedStores, setSelectedStores] = useState([]);
  const [storeQuantities, setStoreQuantities] = useState({});

  const inventoryQuantity = Object.values(storeQuantities).reduce(
    (sum, q) => sum + (q || 0),
    0
  );

  const convertToGram = (value, unit) => {
    switch (unit) {
      case "kg":
        return value * 1000;
      case "oz":
        return value * 28.3495;
      case "lb":
        return value * 453.592;
      default:
        return value;
    }
  };

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    barcode: "",
    description: "",
    price: "",
    compareAtPrice: "",
    taxable: false,
    inventoryQuantity: "",
    requireShipping: false,
    weight: "",
    weightUnit: "g",
    unit: "",
    gram: "",
    templates: "product",
    images: [],
    image: null,
  });

  const [initialProduct, setInitialProduct] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  // Lấy dữ liệu sản phẩm khi vào trang edit
  useEffect(() => {
    axios.get(`http://localhost:8080/product/${id}`)
      .then((res) => {      
        const data = res.data;

        const mapped = {
          name: data.productName || "",
          sku: data.variants?.[0]?.sku || "",
          barcode: data.variants?.[0]?.barcode || "",
          description: data.content || "",
          price: data.variants?.[0]?.price || "",
          compareAtPrice: data.variants?.[0]?.compareAtPrice || "",
          taxable: data.variants?.[0]?.taxable || false,
          inventoryQuantity: data.variants?.[0]?.inventoryQuantity || "",
          requireShipping: data.requireShipping || false,
          weight: data.variants?.[0]?.weight || "",
          weightUnit: data.variants?.[0]?.weightUnit || "g",
          unit: data.variants?.[0]?.unit || "",
          gram: data.variants?.[0]?.grams || "",
          templates: data.templateLayout || "product",
          images: data.images || [],
          image: data.image || null,
        };

        setProduct(mapped);
        setInitialProduct(mapped);
      })
      .catch((err) => {
        console.error(err);
        alert("Không thể tải dữ liệu sản phẩm");
      });
  }, [id]);

  useEffect(() => {
    if (product && initialProduct) {
      setIsChanged(JSON.stringify(product) !== JSON.stringify(initialProduct));
    }
  }, [product, initialProduct]);

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setProduct({ ...product, [field]: value });
  };

  const handleCancel = () => {
    setProduct(initialProduct);
  };

  const handleSubmit = async () => {
    try {
      const dto = {
        productName: product.name,
        content: product.description,
        templateLayout: product.templates,
        variants: [
          {
            sku: product.sku,
            barcode: product.barcode,
            price: parseFloat(product.price || 0),
            compareAtPrice: parseFloat(product.compareAtPrice || 0),
            taxable: product.taxable,
            inventoryQuantity: parseInt(product.inventoryQuantity || 0),
            weight: parseFloat(product.weight || 0),
            weightUnit: product.weightUnit,
            unit: product.unit,
            grams: parseFloat(product.gram || 0),
          },
        ],
        images: product.images,
        image: product.image,
        options: [],
      };

      await axios.put(`http://localhost:8080/product/${id}`, dto);
      alert("Cập nhật sản phẩm thành công!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1400px", mx: "auto" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          component={Link}
          to={"/products"}
          variant="outlined"
          sx={{ mr: 2, minWidth: 40 }}
        >
          <ArrowBackIcon />
        </Button>
        <Typography variant="h6" fontWeight="bold">
          Chỉnh sửa sản phẩm
        </Typography>
      </Box>

      <Grid container spacing={2} alignItems="flex-start" wrap="nowrap">
              {/* LEFT COLUMN */}
              <Grid item xs={12} md={8}>
                {/* Thông tin sản phẩm */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      Thông tin sản phẩm
                    </Typography>
                    <Typography required variant="body2" align="left" sx={{ mt: 1 }}>
                      Tên sản phẩm
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Nhập tên sản phẩm"
                      margin="dense"
                      value={product.name}
                      onChange={handleChange("name")}
                    />
                    <Grid
                      container
                      spacing={2}
                      wrap="wrap"
                      sx={{ alignItems: "flex-start", justifyContent: "flex-start" }}
                    >
                      <Grid
                        item
                        sx={{
                          flexBasis: { xs: "100%", sm: "48%" },
                          boxSizing: "border-box",
                        }}
                      >
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Mã SKU
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Mã SKU"
                          margin="dense"
                          value={product.sku}
                          onChange={handleChange("sku")}
                        />
                      </Grid>
                      <Grid
                        item
                        sx={{
                          flexBasis: { xs: "100%", sm: "48%" },
                          boxSizing: "border-box",
                        }}
                      >
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Mã vạch / Barcode
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Mã vạch / Barcode"
                          margin="dense"
                          value={product.barcode}
                          onChange={handleChange("barcode")}
                        />
                      </Grid>
                      <Grid
                        item
                        sx={{
                          flexBasis: { xs: "100%", sm: "48%" },
                          boxSizing: "border-box",
                        }}
                      >
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Đơn vị tính
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Đơn vị tính"
                          margin="dense"
                          value={product.unit}
                          onChange={handleChange("unit")}
                        />
                      </Grid>
                    </Grid>
      
                    <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                      Mô tả
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Mô tả sản phẩm"
                      multiline
                      rows={6}
                      margin="dense"
                      value={product.description}
                      onChange={handleChange("description")}
                    />
                  </CardContent>
                </Card>
      
                {/* Thông tin giá */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      Thông tin giá
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item
                        sx={{
                          flexBasis: { xs: "100%", sm: "48%" },
                          boxSizing: "border-box",
                        }}>
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Giá bán
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Giá bán"
                          margin="dense"
                          value={product.price}
                          onChange={handleChange("price")}
                        />
                      </Grid>
                      <Grid item
                        sx={{
                          flexBasis: { xs: "100%", sm: "48%" },
                          boxSizing: "border-box",
                        }}>
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Giá so sánh
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Giá so sánh"
                          margin="dense"
                          value={product.compareAtPrice}
                          onChange={handleChange("compareAtPrice")}
                        />
                      </Grid>
                      <Grid item
                        sx={{
                          flexBasis: { xs: "100%", sm: "48%" },
                          boxSizing: "border-box",
                        }}>
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Giá vốn
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Giá vốn"
                          margin="dense"
                        />
                      </Grid>
                    </Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={product.taxable}
                          onChange={handleChange("taxable")}
                        />
                      }
                      label="Áp dụng thuế"
                    />
                  </CardContent>
                </Card>
      
                {/* Thông tin kho */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      Thông tin kho
                    </Typography>
      
                    {/* Dropdown chọn cửa hàng */}
                    <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                      Lưu kho tại
                    </Typography>
                    <FormControl fullWidth margin="dense">
                      <Select
                        multiple
                        displayEmpty
                        value={selectedStores}
                        onChange={(e) => {
                          const stores = e.target.value;
                          setSelectedStores(stores);
      
                          // reset quantity khi bỏ chọn
                          setStoreQuantities((prev) => {
                            const updated = { ...prev };
                            Object.keys(updated).forEach((key) => {
                              if (!stores.includes(key)) delete updated[key];
                            });
                            return updated;
                          });
                        }}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <em>Chọn cửa hàng</em>;
                          }
                          if (selected.length === 1) {
                            return storeOptions.find((s) => s.value === selected[0])?.label;
                          }
                          return `Đã lưu tại ${selected.length} cửa hàng`;
                        }}
                      >
                        {storeOptions.map((store) => (
                          <MenuItem key={store.value} value={store.value}>
                            <Checkbox checked={selectedStores.indexOf(store.value) > -1} />
                            <ListItemText primary={store.label} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
      
                    {/* Các tùy chọn quản lý kho */}
                    <FormGroup sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Quản lý số lượng tồn kho"
                      />
                      <FormControlLabel control={<Checkbox />} label="Cho phép bán âm" />
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Quản lý sản phẩm theo lô - HSD"
                      />
                    </FormGroup>
      
                    <Divider sx={{ my: 2 }} />
      
                    <Typography variant="body2" fontWeight="bold" mb={1}>
                      Bảng phân bổ tồn kho
                    </Typography>
      
                    {/* Bảng phân bổ */}
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          {selectedStores.map((storeId) => {
                            const store = storeOptions.find((s) => s.value === storeId);
                            return (
                              <TableRow key={storeId}>
                                <TableCell sx={{ fontWeight: "500", width: "40%" }}>
                                  {store?.label}
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={storeQuantities[storeId] || ""}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value, 10) || 0;
                                      setStoreQuantities((prev) => ({
                                        ...prev,
                                        [storeId]: value,
                                      }));
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
      
                    {/* Tổng tồn kho */}
                    <Typography variant="body2" fontWeight="bold" mt={2}>
                      Tổng số lượng: {inventoryQuantity}
                    </Typography>
                  </CardContent>
                </Card>
      
                {/* Vận chuyển */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      Vận chuyển
                    </Typography>
      
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Sản phẩm yêu cầu vận chuyển"
                      value={product.requireShipping}
                      onChange={handleChange("requireShipping")}
                    />
      
                    <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                      Khối lượng
                    </Typography>
      
                    <TextField
                      fullWidth
                      placeholder="Khối lượng"
                      margin="dense"
                      value={product.weight}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setProduct((prev) => {
                          const gram = convertToGram(value, prev.weightUnit);
                          return { ...prev, weight: value, gram };
                        });
                      }}
                      InputProps={{
                        endAdornment: (
                          <FormControl sx={{ minWidth: 70, ml: 1 }}>
                            <Select
      
                              value={product.weightUnit}
                              onChange={(e) => {
                                const unit = e.target.value;
                                setProduct((prev) => {
                                  const gram = convertToGram(prev.weight, unit);
                                  return { ...prev, weightUnit: unit, gram };
                                });
                              }}
                              displayEmpty
                              variant="standard"
                            >
                              <MenuItem value="g">g</MenuItem>
                              <MenuItem value="kg">kg</MenuItem>
                              <MenuItem value="oz">oz</MenuItem>
                              <MenuItem value="lb">lb</MenuItem>
                            </Select>
                          </FormControl>
                        ),
                      }}
                    />
                  </CardContent>
                </Card>
      
      
                {/* Thuộc tính */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                      Thuộc tính
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sản phẩm có nhiều thuộc tính khác nhau. Ví dụ: kích thước, màu sắc.
                    </Typography>
                    <Button size="small" sx={{ mt: 1 }}>
                      Thêm thuộc tính
                    </Button>
                  </CardContent>
                </Card>
      
                {/* SEO */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                      Tối ưu SEO
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Xin hãy nhập Tiêu đề và Mô tả để xem trước kết quả tìm kiếm của sản phẩm này.
                    </Typography>
                    <Button size="small" sx={{ mt: 1 }}>
                      Tùy chỉnh SEO
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
      
              {/* RIGHT COLUMN */}
              <Grid item xs={12} md={4}>
                <Box display="flex" justifyContent="flex-end">
                  <Box sx={{ width: "100%", maxWidth: 400 }}>
                    {/* Ảnh sản phẩm */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                          Ảnh sản phẩm
                        </Typography>
      
                        <Box
                          sx={{
                            border: "1px dashed grey",
                            p: 3,
                            textAlign: "center",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Kéo thả hoặc thêm ảnh từ URL
                          </Typography>
      
                          {/* Input chọn nhiều ảnh */}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            id="upload-images"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;
      
                              const newImages = [];
      
                              files.forEach((file, idx) => {
                                const img = new Image();
                                img.src = URL.createObjectURL(file);
      
                                img.onload = () => {
                                  const imageInfo = {
                                    src: img.src,
                                    alt: file.name,
                                    filename: file.name,
                                    size: file.size,
                                    width: img.width,
                                    height: img.height,
                                  };
      
                                  newImages.push(imageInfo);
      
                                  // Khi đã load hết ảnh
                                  if (newImages.length === files.length) {
                                    setProduct((prev) => {
                                      const updatedImages = [...(prev.images || []), ...newImages];
                                      return {
                                        ...prev,
                                        images: updatedImages,
                                        image: updatedImages[0], // ảnh đầu tiên = ảnh chính
                                      };
                                    });
                                  }
                                };
                              });
                            }}
                          />
      
                          <label htmlFor="upload-images">
                            <Button variant="text" component="span" sx={{ mt: 1 }}>
                              Tải ảnh lên từ thiết bị
                            </Button>
                          </label>
      
                          <Typography variant="caption" display="block" mt={1}>
                            (Dung lượng ảnh tối đa 2MB)
                          </Typography>
                        </Box>
      
                        {/* Preview ảnh */}
                        {product.images && product.images.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" fontWeight="bold" mb={1}>
                              Danh sách ảnh
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                              {product.images.map((img, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    border:
                                      index === 0 ? "2px solid #1976d2" : "1px solid lightgrey",
                                    borderRadius: 2,
                                    p: 1,
                                    textAlign: "center",
                                    width: 120,
                                  }}
                                >
                                  <img
                                    src={img.src}
                                    alt={img.alt}
                                    style={{ maxWidth: "100%", maxHeight: 100, borderRadius: 4 }}
                                  />
                                  <Typography variant="caption" display="block" noWrap>
                                    {img.filename}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {(img.size / 1024).toFixed(1)} KB
                                  </Typography>
                                  {index === 0 && (
                                    <Typography
                                      variant="caption"
                                      color="primary"
                                      display="block"
                                      fontWeight="bold"
                                    >
                                      Ảnh chính
                                    </Typography>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
      
      
                    {/* Kênh bán hàng */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                          Kênh bán hàng
                        </Typography>
      
                        <FormGroup>
                          {["Lazada", "Tiktok Shop", "Shopee", "Facebook"].map((ch) => (
                            <FormControlLabel
                              key={ch}
                              control={<Checkbox defaultChecked />}
                              label={ch}
                            />
                          ))}
                        </FormGroup>
      
                        <Button size="small" sx={{ mt: 1 }}>
                          Xem thêm
                        </Button>
                      </CardContent>
                    </Card>
      
      
                    {/* Bảng giá theo chi nhánh */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Bảng giá theo chi nhánh
                        </Typography>
                        <Typography variant="body2" color="green">
                          + bảng giá theo chi nhánh
                        </Typography>
                      </CardContent>
                    </Card>
      
                    {/* Danh mục - Nhãn hiệu - Tag */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Danh mục
                        </Typography>
                        <TextField fullWidth placeholder="Danh mục" margin="dense" />
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Nhãn hiệu
                        </Typography>
                        <TextField fullWidth placeholder="Nhãn hiệu" margin="dense" />
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Loại sản phẩm
                        </Typography>
                        <TextField fullWidth placeholder="Loại sản phẩm" margin="dense" />
                        <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                          Tag
                        </Typography>
                        <TextField fullWidth placeholder="Tag" margin="dense" />
                      </CardContent>
                    </Card>
      
                    {/* Khung giao diện */}
                    <Card>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                          Khung giao diện
                        </Typography>
                        <FormControl fullWidth margin="dense">
                          <Select
                            value={product.templates}
                            onChange={handleChange("templates")}
                            sx={{textAlign: "left"}}
                          >
                            <MenuItem value="product">product</MenuItem>
                            <MenuItem value="product.json">product.json</MenuItem>
                            <MenuItem value="product.quickview">product.quickview</MenuItem>
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>
      
                  </Box>
                </Box>
              </Grid>
            </Grid>
      
      {/* Action Buttons */}
      <Box mt={3} textAlign="right">
        {isChanged && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            Hủy
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isChanged}
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Box>
  );
}
