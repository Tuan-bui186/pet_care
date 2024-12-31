import React, { useEffect, useState } from "react";
import statisticsApi from "../../../api/Statistics.js";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import "../../../sass/Admin/statistics.scss";

const Statistics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    statisticsApi
      .getStatistics()
      .then((response) => {
        console.log("Dữ liệu thống kê nhận được trong component:", response);
        if (response) {
          setData(response); // Cập nhật state 'data' nếu có dữ liệu
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thống kê:", error);
      });
  }, []);

  return (
    <div className="statistics-container">
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Thống kê thú cưng
      </h2>
      {data === null ? (
        <p className="loading-text">Đang tải thống kê...</p>
      ) : (
        <Container>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Card className="statistics-card">
                <CardContent>
                  <Typography variant="h5" className="card-title">
                    Tổng số thú cưng
                  </Typography>
                  <Typography variant="h4" className="card-value">
                    {data.totalPets}
                  </Typography>
                  <Typography className="card-description">
                    Tất cả thú cưng trong hệ thống
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="statistics-card">
                <CardContent>
                  <Typography variant="h5" className="card-title">
                    Số thú cưng đã bán
                  </Typography>
                  <Typography variant="h4" className="card-value">
                    {data.soldPets}
                  </Typography>
                  <Typography className="card-description">
                    Số lượng thú cưng đã được bán
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="statistics-card">
                <CardContent>
                  <Typography variant="h5" className="card-title">
                    Số thú cưng chờ duyệt
                  </Typography>
                  <Typography variant="h4" className="card-value">
                    {data.pendingPets}
                  </Typography>
                  <Typography className="card-description">
                    Số lượng thú cưng đang chờ duyệt
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="statistics-card">
                <CardContent>
                  <Typography variant="h5" className="card-title">
                    Số thú cưng chưa duyệt
                  </Typography>
                  <Typography variant="h4" className="card-value">
                    {data.unapprovedPets}
                  </Typography>
                  <Typography className="card-description">
                    Số lượng thú cưng chưa được duyệt
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default Statistics;
