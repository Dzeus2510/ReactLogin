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
  Table,
  TableBody,
  TableCell,
  MenuItem,
  TableHead,
  TableRow,
  FormControl,
  Select,
  FormGroup,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  InputAdornment,
  Stack,
  Chip,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

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
    options: [],
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
          options: data.options || [],
        };

        const mappedAttributes = (data.options || []).map((opt) => ({
          name: opt.name,
          values: (opt.values || []).map(v => ({ value: v.value })),
          position: opt.position,
        }));

        setProduct(mapped);
        setInitialProduct(mapped);
        setAttributes(mappedAttributes);
      })
      .catch((err) => {
        console.error(err);
        alert("Không thể tải dữ liệu sản phẩm");
      });
  }, [id]);

  const defaultNames = ["Kích thước", "Màu sắc", "Chất liệu"];
  const [attributes, setAttributes] = useState([]);
  const [openSort, setOpenSort] = useState(false);

  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      options: attributes.map((attr) => ({
        name: attr.name,
        position: attr.position,
        values: attr.value ? [{ value: attr.value, position: 1 }] : [],
      })),
    }));
  }, [attributes]);


  const handleAddOption = () => {
    if (attributes.length < 3) {
      setAttributes([
        ...attributes,
        { name: defaultNames[attributes.length], values: [], tempValue: "", position: attributes.length + 1 },
      ]);
    }
  };

  const handleChangeOption = (index, field, newValue) => {
    const updated = [...attributes];
    updated[index][field] = newValue;
    setAttributes(updated);
  };

  const handleAddValue = (index, newValue) => {
    if (!newValue.trim()) return;
    const updated = [...attributes];
    if (!updated[index].values.includes(newValue)) {
      updated[index].values.push(newValue);
      updated[index].tempValue = "";
      setAttributes(updated);
    }
  }

  const handleDeleteValue = (index, valIndex) => {
    const updated = [...attributes];
    updated[index].values.splice(valIndex, 1);
    setAttributes(updated);
  };

  const handlerDeleteOption = (index) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated.map((attr, i) => ({ ...attr, position: i + 1 })));
  };

  const handleMoveOption = (from, to) => {
    if (to < 0 || to >= attributes.length) return;
    const updated = [...attributes];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setAttributes(updated.map((attr, i) => ({ ...attr, position: i + 1 })));
  };

  const [openUrlDialog, setOpenUrlDialog] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    const newImages = [];
    files.forEach((file) => {
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

        if (newImages.length === files.length) {
          setProduct((prev) => {
            const updatedImages = [...(prev.images || []), ...newImages];
            return {
              ...prev,
              images: updatedImages,
              image: updatedImages[0],
            };
          });
        }
      };
    });
  };

  const handleAddUrl = () => {
    if (!urlInput) return;
    const img = new Image();
    img.src = urlInput;

    img.onload = () => {
      const imageInfo = {
        src: urlInput,
        alt: "Image from URL",
        filename: urlInput,
        size: 0,
        width: img.width,
        height: img.height,
      };

      setProduct((prev) => {
        const updatedImages = [...(prev.images || []), imageInfo];
        return {
          ...prev,
          images: updatedImages,
          image: updatedImages[0],
        };
      });
    };

    setUrlInput("");
    setOpenUrlDialog(false);
  };

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
        options: product.options,
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
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          bgcolor: "white",
          color: "black",
          top: 0,
          left: 0,
          mx: -3, // đè padding ngang main
          width: "calc(100% + 48px)", // full width
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, mx: "auto", maxWidth: "68%" }}>
        {/* Header */}
        <Box display="flex" minWidth={"51%"} maxWidth={"calc(100% -16px)"} alignItems="center" mb={3}>
          <Button
            component={Link}
            to={"/products"}
            variant="outlined"
            borderRadius={6}
            sx={{ mr: 2, minWidth: 36, minHeight: 36, padding: "5px 5px", border: "1px solid rgb(211, 213, 215)", background: "rgb(255, 255, 255)" }}
          >
            <ArrowBackIcon
              viewbox="0 0 20 20"
              sx={{ color: "rgb(163, 168, 175)" }}
            />
          </Button>
          <Typography variant="h5" fontWeight="550">
            Thêm sản phẩm
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="flex-start" wrap="wrap">
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={8} sx={{ flex: "2.04425 2.04425 693px" }}>
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
                  class="MuiTextField-root"
                  fullWidth
                  placeholder="Nhập tên sản phẩm (Tối đa 320 ký tự)"
                  inputProps={{ maxLength: 320 }}
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
                      placeholder="Nhập mã SKU (Tối đa 50 ký tự)"
                      inputProps={{ maxLength: 50 }}
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
                      placeholder="Nhập Mã vạch / Barcode (Tối đa 50 ký tự)"
                      inputProps={{ maxLength: 50 }}
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
                      placeholder="Điền đơn vị tính"
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
                      type="number"
                      placeholder="Nhập giá bán sản phẩm"
                      margin="dense"
                      value={product.price}
                      onChange={handleChange("price")}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                      }}
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
                      type="number"
                      placeholder="Nhập giá so sánh sản phẩm"
                      margin="dense"
                      value={product.compareAtPrice}
                      onChange={handleChange("compareAtPrice")}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                      }}
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
                      type="number"
                      placeholder="Nhập giá vốn sản phẩm"
                      margin="dense"
                      InputProps={{
                        endAdornment: <InputAdornment position="end" >₫</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
                <FormControlLabel
                  align="left"
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
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Nhập số lượng tồn kho"
                  margin="dense"
                  value={product.inventoryQuantity}
                  onChange={handleChange("inventoryQuantity")}
                />
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
                  placeholder="Nhập khối lượng"
                  margin="dense"
                  value={product.weight || 0}
                  type="number"
                  sx={{ width: "50%" }}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setProduct((prev) => {
                      const gram = convertToGram(value, prev.weightUnit);
                      return { ...prev, weight: value, gram };
                    });
                  }}
                  InputProps={{
                    endAdornment: (
                      <FormControl sx={{ minWidth: 45, ml: 1, pl: 1, borderLeft: "1px solid #ccc", }}>
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
                          disableUnderline
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
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Thuộc tính
                  </Typography>
                  {attributes.length >= 2 && (
                    <IconButton size="small" onClick={() => setOpenSort(true)}>
                      <SortIcon />
                      <Typography variant="body2" color="text.secondary" mr={0.5}>
                        Sắp xếp Thuộc Tính
                      </Typography>
                    </IconButton>
                  )}
                  {attributes.length === 0 && (
                    <Button size="small" sx={{ mt: 1 }} onClick={handleAddOption}>
                      Thêm thuộc tính
                    </Button>
                  )}
                </Box>

                {attributes.length === 0 && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Sản phẩm có nhiều thuộc tính khác nhau. Ví dụ: kích thước, màu sắc.
                  </Typography>
                )}

                {attributes.length > 0 && (
                  <Table
                    size="small"
                    sx={{
                      "& .MuiTableCell-root": {
                        border: "none",
                        padding: "8px",
                        verticalAlign: "top",
                      },
                      "& .MuiTableCell-head": {
                        borderBottom: "1px solid rgba(0,0,0,0.12)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      },
                    }}
                  >
                    <TableHead sx={{ bgcolor: "white" }}>
                      <TableRow>
                        <TableCell width="30%">Tên thuộc tính</TableCell>
                        <TableCell width="60%">Giá trị</TableCell>
                        <TableCell width="10%"></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {attributes.map((attr, index) => (
                        <TableRow key={index}>
                          {/* Tên thuộc tính */}
                          <TableCell>
                            <TextField
                              placeholder="Nhập tên thuộc tính"
                              value={attr.name}
                              onChange={(e) =>
                                handleChangeOption(index, "name", e.target.value)
                              }
                              size="small"
                              fullWidth
                            />
                          </TableCell>

                          {/* Giá trị */}
                          <TableCell>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {(attr.values || []).map((val, vIndex) => (
                                <Chip
                                  key={vIndex}
                                  label={typeof val === "string" ? val : val.value}   // 🔥 lấy chuỗi
                                  size="small"
                                  onDelete={() => handleDeleteValue(index, vIndex)}
                                />
                              ))}
                            </Box>
                            <TextField
                              placeholder="Nhập và Enter để thêm"
                              value={attr.tempValue || ""}
                              onChange={(e) =>
                                handleChangeOption(index, "tempValue", e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddValue(index, attr.tempValue || "");
                                }
                              }}
                              size="small"
                              fullWidth
                              sx={{ mt: 1 }}
                            />
                          </TableCell>


                          {/* Nút xóa */}
                          <TableCell align="center">
                            <IconButton onClick={() => handlerDeleteOption(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {attributes.length < 3 && attributes.length > 0 && (
                  <Button size="small" sx={{ mt: 1 }} onClick={handleAddOption}>
                    Thêm thuộc tính khác
                  </Button>
                )}
              </CardContent>



              {/* Popup sắp xếp */}
              <Dialog open={openSort} onClose={() => setOpenSort(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Sắp xếp thuộc tính</DialogTitle>
                <DialogContent>
                  <List>
                    {attributes.map((attr, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <Box>
                            <Button
                              size="small"
                              onClick={() => handleMoveOption(index, index - 1)}
                            >
                              ↑
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handleMoveOption(index, index + 1)}
                            >
                              ↓
                            </Button>
                          </Box>
                        }
                      >
                        <ListItemText primary={attr.name} secondary={attr.value} />
                      </ListItem>
                    ))}
                  </List>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenSort(false)}>Đóng</Button>
                </DialogActions>
              </Dialog>
            </Card>

            {/* SEO */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Tối ưu SEO
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Tùy chỉnh SEO
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Xin hãy nhập Tiêu đề và Mô tả để xem trước kết quả tìm kiếm của sản phẩm này.
                </Typography>

              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={4} sx={{ flex: "1 1 339px" }}>
            <Box display="flex" justifyContent="flex-end">
              <Box sx={{ width: "100%", maxWidth: 400 }}>
                {/* Ảnh sản phẩm */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      Ảnh sản phẩm
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      id="upload-images"
                      onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                    />
                    <Box
                      sx={{
                        border: "1px dashed grey",
                        p: 3,
                        textAlign: "center",
                        borderRadius: 1,
                        "&:hover": {
                          border: "1px dashed blue",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => document.getElementById("upload-images").click()}
                    >
                      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
                        <AddIcon sx={{ color: "gray" }} />
                        <Typography variant="body2" color="text.secondary">
                          Kéo thả hoặc{" "}
                          <Box
                            component="span"
                            sx={{
                              color: "primary.main",
                              cursor: "pointer",
                              "&:hover": { textDecoration: "underline" },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenUrlDialog(true);
                            }}
                          >
                            thêm ảnh từ URL
                          </Box>
                        </Typography>
                      </Stack>

                      {/* Link tải ảnh */}
                      <label htmlFor="upload-images" onClick={(e) => e.stopPropagation()}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Tải ảnh lên từ thiết bị
                        </Typography>
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
                                border: index === 0 ? "2px solid #1976d2" : "1px solid lightgrey",
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

                  {/* Popup nhập URL */}
                  <Dialog fullWidth open={openUrlDialog} onClose={() => setOpenUrlDialog(false)}>
                    <DialogTitle>Thêm ảnh từ URL</DialogTitle>
                    <DialogContent>
                      <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                        Đường dẫn ảnh
                      </Typography>
                      <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        placeholder="https://"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenUrlDialog(false)}>Hủy</Button>
                      <Button onClick={handleAddUrl} variant="contained">
                        Xác nhận
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Card>


                {/* Kênh bán hàng */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      Kênh bán hàng
                    </Typography>

                    <FormGroup>
                      {["Lazada", "Tiktok Shop", "Shopee", "Facebook"].map((ch) => (
                        <Box>
                          <FormControlLabel
                            key={ch}
                            control={<Checkbox defaultChecked />}
                            label={ch}
                          />
                          <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                            Áp dụng bảng giá <Link to={"#"} style={{ textDecoration: "none", variant: "body2", align: "left", color: "blue" }}> {ch} </Link>
                          </Typography>
                        </Box>
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

                    <Typography variant="body2" align="left" color="green" >
                      • <Link to="#" style={{ textDecoration: "none", color: "blue" }}>
                        bảng giá theo chi nhánh
                      </Link>
                    </Typography>
                  </CardContent>
                </Card>

                {/* Danh mục - Nhãn hiệu - Loại sản phẩm - Tag */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                      Danh mục
                    </Typography>
                    <Select fullWidth placeholder="Chọn danh mục" margin="dense" size="small" />
                    <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                      Nhãn hiệu
                    </Typography>
                    <Select fullWidth placeholder="Chọn nhãn hiệu" margin="dense" size="small">
                    </Select>
                    <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                      Loại sản phẩm
                    </Typography>
                    <Select fullWidth placeholder="Chọn loại sản phẩm" margin="dense" size="small" />
                    <Typography variant="body2" align="left" sx={{ mt: 1 }}>
                      Tag
                    </Typography>
                    <Select fullWidth placeholder="Tìm kiếm hoặc thêm mới" margin="dense" size="small" />
                  </CardContent>
                </Card>

                {/* Khung giao diện */}
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                      Khung giao diện
                    </Typography>
                    <FormControl fullWidth margin="dense" size="small">
                      <Select
                        value={product.templates}
                        onChange={handleChange("templates")}
                        sx={{ textAlign: "left" }}
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
    </>
  );
}
