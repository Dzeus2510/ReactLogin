import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Checkbox,
  TextField,
  Button,
  Tabs,
  Tab,
  styled,
  Pagination
} from "@mui/material";
import { Link } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import SearchIcon from '@mui/icons-material/Search';

export default function DashboardProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/product")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Không thể tải sản phẩm: " + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const StyledHeadCell = styled(TableCell)(() => ({
    fontWeight: 600,
    fontFamily: "Inter",
    fontSize: "14px",
    color: "#333",
  }));

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProducts = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const pageProductIds = paginatedProducts.map((p) => p.id);

  const isAllPageChecked =
    pageProductIds.length > 0 && pageProductIds.every((id) => selected.includes(id));
  const isPageIndeterminate =
    selected.some((id) => pageProductIds.includes(id)) && !isAllPageChecked;

  const handleSelectAllPage = () => {
    setSelected([...new Set([...selected, ...pageProductIds])]);
  };

  const handleClearPage = () => {
    setSelected(selected.filter((id) => !pageProductIds.includes(id)));
  };

  const handleSelectAllGlobal = () => {
    setSelected(products.map((p) => p.id));
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    const confirmDelete = window.confirm(`Bạn có chắc muốn Xóa ${selected.length} sản phẩm đã chọn?`);
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selected.map((id) =>
          axios.delete(`http://localhost:8080/product/${id}`)
        )
      )
      alert("Xóa thành công!");

      setProducts((prev) => prev.filter((p) => !selected.includes(p.id)));

      setSelected([]);
    } catch (err) {
      alert("Xóa thất bại: " + err.message);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]
    );
  };

  return (
    <Box p={2}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h1" sx={{ fontSize: "2em", fontWeight: 600, textAlign: "left" }}>
          Danh sách sản phẩm
        </Typography>
        <Button
          component={Link}
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          to={"/add-product"}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#rgb(0, 136, 255)",
          }}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow >
              <TableCell colSpan={7} sx={{ borderBottom: "none", p: 1, bgcolor: "white" }}>
                <Tabs value={0} sx={{ minHeight: "32px" }}>
                  <Tab label="Tất cả" sx={{ textTransform: "none", fontSize: 14 }} />
                </Tabs>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={7} sx={{ borderBottom: "none", p: 1, bgcolor: "white" }}>
                <Box display="flex" justifyContent="flex-start">
                  <TextField
                    size="small"
                    placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
                    variant="outlined"
                    sx={{ width: "60%" }}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon sx={{ color: "action.active", mr: 1 }} />
                      ),
                      style: { fontFamily: "Inter" }
                    }}
                  />
                </Box>
              </TableCell>
            </TableRow>

            {selected.length > 0 ? (
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell colSpan={7}>
                  <Box display="flex" alignItems="center" gap={2}>

                    <Checkbox
                      checkedIcon={<IndeterminateCheckBoxIcon />}
                      size="small"
                      checked={selected.length > 0 && selected.length === products.length}
                      indeterminate={selected.length > 0 && selected.length < products.length}
                      onChange={() => {
                        if (selected.length > 0) {
                          setSelected([]);
                        } else {
                          handleSelectAllPage();
                        }
                      }}
                    />

                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Đã chọn {selected.length} sản phẩm
                    </Typography>

                    {selected.length < products.length && (
                      <Button
                        size="small"
                        onClick={handleSelectAllGlobal}
                        sx={{ textTransform: "none" }}
                      >
                        Chọn tất cả {products.length} sản phẩm
                      </Button>
                    )}

                    <Button
                      size="small"
                      color="error"
                      onClick={handleDeleteSelected}
                      sx={{ textTransform: "none" }}
                    >
                      Xóa
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell padding="checkbox" sx={{ width: "2.5%" }}>
                  <Checkbox
                    size="small"
                    checked={isAllPageChecked}
                    indeterminate={isPageIndeterminate}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleSelectAllPage();
                      } else {
                        handleClearPage();
                      }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ width: "2.5%" }}></TableCell>
                <StyledHeadCell sx={{ width: "35%" }}>Sản phẩm</StyledHeadCell>
                <StyledHeadCell sx={{ width: "10%" }}>Có thể bán</StyledHeadCell>
                <StyledHeadCell sx={{ width: "15%" }}>Loại</StyledHeadCell>
                <StyledHeadCell sx={{ width: "15%" }}>Nhãn hiệu</StyledHeadCell>
                <StyledHeadCell sx={{ width: "15%" }}>Ngày khởi tạo</StyledHeadCell>
              </TableRow>
            )}

          </TableHead>

          <TableBody>
            {paginatedProducts.map((product) => {
              const firstVariant = product.variants?.[0];
              return (
                <TableRow
                  key={product.id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#fafafa" },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox size="small"
                      checked={selected.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {product.images?.length > 0 && (
                        <img
                          src={product.images[0].src}
                          alt={product.images[0].filename}
                          style={{
                            width: 38,
                            height: 38,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #d3d5d7",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontSize={14}
                      component={Link}
                      to={`/edit-product/${product.id}`}
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {product.productName}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {firstVariant ? firstVariant.inventoryQuantity : "-"}
                  </TableCell>
                  <TableCell>{product.type || "-"}</TableCell>
                  <TableCell>{product.brand || "-"}</TableCell>
                  <TableCell>
                    {product.createdOn ? formatDate(product.createdOn) : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderTop="1px solid #e0e0e0"
          p={1}
        >
          <Typography variant="body2">
            {`Từ ${page * rowsPerPage + 1} đến ${Math.min(
              (page + 1) * rowsPerPage,
              products.length
            )} trên tổng ${products.length}`}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">Hiển thị</Typography>

            <TextField
              select
              size="small"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              SelectProps={{ native: true }}
              sx={{ width: 80 }}
            >
              {[5, 10, 20, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>

            <Typography variant="body2">sản phẩm</Typography>
          </Box>


          <Pagination
            count={Math.ceil(products.length / rowsPerPage)}
            page={page + 1}
            onChange={(e, value) => setPage(value - 1)}
            color="primary"
            shape="rounded"
          />
        </Box>
      </TableContainer>
    </Box>
  );
}
