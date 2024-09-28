import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Pagination,
  Button,
  Divider,
} from "@mui/material";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import PlasticIcon from "@mui/icons-material/ShoppingBag";
import PaperIcon from "@mui/icons-material/Receipt";
import GlassIcon from "@mui/icons-material/LocalDrink";

const ScrapCards = () => {
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      console.log("@@refreshToken", refreshToken);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/refresh-token`,
        { refreshToken }
      );
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const fetchScrapData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/all?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScraps(response?.data?.items || []);
      setTotalPages(response?.data?.totalPages || 0);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
        // await refreshToken();
      } else {
        console.log("Error fetching scrap data:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchScrapData(accessToken);
  }, [accessToken, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    setLoading(true);
  };

  const getScrapIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "plastic":
        return <PlasticIcon sx={{ color: "#4CAF50", fontSize: 40 }} />;
      case "paper":
        return <PaperIcon sx={{ color: "#FFC107", fontSize: 40 }} />;
      case "glass":
        return <GlassIcon sx={{ color: "#2196F3", fontSize: 40 }} />;
      default:
        return <PendingIcon sx={{ color: "#9E9E9E", fontSize: 40 }} />;
    }
  };

  const handleApprove = async (scrapId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/orders/${scrapId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchScrapData(accessToken);
    } catch (error) {
      console.error("Error approving scrap:", error);
    }
  };

  const handleDecline = async (scrapId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/orders/${scrapId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchScrapData(accessToken);
    } catch (error) {
      console.error("Error declining scrap:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          All Orders
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
          {totalPages} Orders Found
        </Typography>
      </Box>
      <Divider sx={{ marginBottom: 4 }} />{" "}
      {/* Adds a horizontal divider line */}
      {/* Cards Grid */}
      <Grid container spacing={3}>
        {(scraps || []).map((scrap, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "350px",
                padding: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {getScrapIcon(scrap?.scrapTypes?.[0]?.scrapType)}{" "}
                  {/* Show icon based on scrap type */}
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {scrap?.users?.username}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                  {scrap.address.houseNo}, {scrap.address.street},{" "}
                  {scrap.address.city}, {scrap.address.state} -{" "}
                  {scrap.address.pincode}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 1 }}
                >
                  <strong>Pickup Date:</strong>{" "}
                  {new Date(scrap.pickupDate)?.toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: 1,
                    color:
                      scrap.status === "APPROVED"
                        ? "green"
                        : scrap.status === "DECLINED"
                        ? "red"
                        : "inherit",
                  }}
                >
                  <strong>Status:</strong> {scrap.status}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Array.isArray(scrap?.scrapTypes) &&
                    (scrap?.scrapTypes || []).map((ele, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          padding: "10px",
                          borderRadius: "8px",
                          marginBottom: "10px",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Scrap Type: {ele.scrapType}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Expected Weight: {ele.scrapWeight}
                        </Typography>
                        <Typography variant="body2">
                          Rate: {ele.amount} {ele.unit}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
              {scrap.status === "PENDING" && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(scrap._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDecline(scrap._id)}
                  >
                    Decline
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Pagination */}
      {scraps?.length > 0 && totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          <Pagination
            count={Math.ceil(totalPages / 6)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default ScrapCards;
