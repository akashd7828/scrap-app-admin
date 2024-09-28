import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Divider,
  Box,
  Avatar,
} from "@mui/material";
import {
  ShoppingCartOutlined,
  BarChartOutlined,
  PendingActionsOutlined,
  LayersOutlined,
} from "@mui/icons-material";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScrapTypes: 0,
    totalWeight: 0,
    topCollectedScrap: "",
    recentScraps: [],
    pendingRequests: 0,
  });

  // Fetch the statistics from the API
  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/dashboard/dashboard-stats`
        );
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    }
    fetchStats();
  }, []);

  // Utility to add a little color and icons
  const statCard = (title, value, icon, color) => (
    <Card sx={{ boxShadow: 3 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: color }}>{icon}</Avatar>}
        title={title}
        subheader={<Typography variant="h4">{value}</Typography>}
      />
    </Card>
  );

  return (
    <Grid container spacing={3} sx={{ padding: 2 }}>
      {/* Main Header */}
      <Grid item xs={12}>
        <Card sx={{ backgroundColor: "#f5f5f5", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Administrator Dashboard
            </Typography>
            <Typography variant="h6" align="center">
              Here's an overview of your site's activity:
            </Typography>
            <Divider sx={{ marginY: 2 }} />
          </CardContent>
        </Card>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12} md={3}>
        {statCard(
          "Total Scrap Types",
          stats.totalScrapTypes,
          <LayersOutlined />,
          "#1E88E5"
        )}
      </Grid>

      <Grid item xs={12} md={3}>
        {statCard(
          "Total Weight Collected",
          `${stats.totalWeight} `,
          <BarChartOutlined />,
          "#43A047"
        )}
      </Grid>

      <Grid item xs={12} md={3}>
        {statCard(
          "Top Collected Scrap",
          stats.topCollectedScrap || "N/A",
          <ShoppingCartOutlined />,
          "#FB8C00"
        )}
      </Grid>

      <Grid item xs={12} md={3}>
        {statCard(
          "Pending Requests",
          stats.pendingRequests,
          <PendingActionsOutlined />,
          "#D81B60"
        )}
      </Grid>

      {/* Recent Scrap Additions */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 3 }}>
          <CardHeader title="Recent Scrap Additions" />
          <CardContent>
            <ul style={{ listStyleType: "none" }}>
              {stats?.recentScraps?.length > 0 ? (
                stats?.recentScraps?.map((scrap, index) => (
                  <li key={index}>
                    <Typography variant="body1">
                      {(scrap?.scrapTypes?.length ? scrap?.scrapTypes : [])
                        .map((e) => e.scrapType)
                        .join(", ")}{" "}
                      - {scrap.scrapWeight} kg
                    </Typography>
                  </li>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No recent additions.
                </Typography>
              )}
            </ul>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
