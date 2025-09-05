import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Link} from "react-router-dom";

export default function InsertProduct() {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          {/* Header của form */}
          <Box display="flex" alignItems="center" mb={2}>
            <Button
              component={Link}
              to={'/products'}
              variant="outlined"
              >
                <ArrowBackIcon/>
            </Button>
            <Typography variant="h6" component="div">
                Thêm sản phẩm
            </Typography>
          </Box>

          {/* Form Section */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" textAlign={"left"}>Thông tin sản phẩm</Typography>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                variant="outlined"
                margin="normal"
              />
              <TextField fullWidth label="Mã SKU" variant="outlined" margin="normal" />
              <TextField fullWidth label="Mã vạch/Barcode" variant="outlined" margin="normal" />
              <TextField
                fullWidth
                label="Mô tả"
                variant="outlined"
                margin="normal"
                multiline
                rows={6}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Thành phần combo</Typography>
              <TextField fullWidth label="Tìm kiếm phiên bản" variant="outlined" margin="normal" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">Danh mục</Typography>
              <TextField fullWidth label="Chọn danh mục" variant="outlined" margin="normal" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
