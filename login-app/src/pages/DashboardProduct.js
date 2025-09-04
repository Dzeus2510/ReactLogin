import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

export default function DashboardProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/product")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Không thể tải sản phẩm:" + err.message);
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
        const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Danh sách sản phẩm
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightgray" }}>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell sx={{ color: "black" , "font-weight": "bold" }}>Sản Phẩm</TableCell>
              <TableCell sx={{ color: "black" , "font-weight": "bold" }}>Có thể bán</TableCell>
              <TableCell sx={{ color: "black" , "font-weight": "bold" }}>Loại</TableCell>
              <TableCell sx={{ color: "black" , "font-weight": "bold" }}>Giá Bán</TableCell>
              <TableCell sx={{ color: "black" , "font-weight": "bold" }}>Ngày khởi tạo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const firstVariant = product.variants?.[0];
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.images?.length > 0 ? (
                      <img
                        src={product.images[0].src}
                        alt={product.images[0].filename}
                        style={{ width: 60, height: 60, objectFit: "cover" }}
                      />
                    ) : (
                      ""
                    )}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{firstVariant ? firstVariant.inventoryQuantity: "-"}</TableCell>
                  <TableCell>{product.type || "-"}</TableCell>
                  <TableCell>
                    {firstVariant ? firstVariant.price.toLocaleString("vi-VN") + " đ" : "-"}
                  </TableCell>
                  <TableCell>{product.createdOn ? formatDate(product.createdOn) : "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
