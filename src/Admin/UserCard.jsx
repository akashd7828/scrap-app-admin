import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Box,
  CircularProgress,
  Avatar,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total number of pages
  const limit = 6; // Set limit per page

  // Fetch user data from API with pagination
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/all?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass accessToken in Authorization header
            },
          }
        );
        setUsers(response.data.users); // Assume users are in response.data.users
        setTotalPages(response.data.totalPages); // Assume total pages are in response.data.totalPages
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]); // Trigger fetch on page change

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Loading spinner
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
      <Grid container spacing={3}>
        {users.map((user, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            {" "}
            {/* Responsive layout */}
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 2,
                borderRadius: 3,
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)", // Subtle shadow
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)", // Scale on hover
                },
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Avatar sx={{ backgroundColor: "#1976d2", marginRight: 2 }}>
                    <AccountCircleIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 1 }}
                >
                  <strong>username:</strong> {user.username}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 1 }}
                >
                  <strong>Email:</strong> {user.email}
                </Typography>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 1 }}
                >
                  <strong>Phone:</strong> {user.mobileNumber}
                </Typography>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 1 }}
                >
                  <strong>Created At:</strong>{" "}
                  {new Date(user.createdAt)?.toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Control */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Pagination
          count={Math.ceil(totalPages / 6)} // Total number of pages
          page={currentPage} // Current active page
          onChange={handlePageChange} // Handle page change
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default UserCards;
