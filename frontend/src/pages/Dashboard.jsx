import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import api from "../api";
import { formatAmount } from "../utils/format";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    setLoading(true);
    const data = await api.fetchSummary();
    setSummary(data);
    setLoading(false);
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Resumen</Typography>
          <Button onClick={fetchSummary} variant="outlined">
            Refrescar
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2">Ingresos</Typography>
                <Typography variant="h5">
                  {summary?.total_income ?? 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2">Egresos</Typography>
                <Typography variant="h5">
                  {summary?.total_expense ?? 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2">Neto</Typography>
                <Typography variant="h5">{summary?.net_total ?? 0}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Reporte Looker Studio
      </Typography>
      <Paper sx={{ p: 1 }}>
        <iframe
          title="Looker Studio"
          src="https://lookerstudio.google.com/embed/reporting/0B5FF6JBKbLCSaW1VbDl2S3prYUE/page/6SXD"
          width="100%"
          height="600"
          style={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}
