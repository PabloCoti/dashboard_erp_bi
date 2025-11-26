import React, { useEffect, useState } from "react";
import Toast from "../components/Toast";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import api from "../api";
import { formatAmount } from "../utils/format";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Transactions() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
    isIncome: true,
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const data = await api.fetchTransactions();
      setTransactions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    const e = {};
    if (!form.date || !/^\d{4}-\d{2}-\d{2}$/.test(form.date))
      e.date = "Formato de fecha inválido (YYYY-MM-DD)";
    if (!form.description) e.description = "Descripción requerida";
    if (!form.category) e.category = "Categoría requerida";
    if (form.amount === "" || isNaN(Number(form.amount)))
      e.amount = "Monto numérico requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      // normalize amount sign according to isIncome
      let amt = parseFloat(form.amount);
      if (isNaN(amt)) amt = 0;
      amt = form.isIncome ? Math.abs(amt) : -Math.abs(amt);
      const payload = {
        date: form.date,
        description: form.description,
        amount: amt,
        category: form.category,
      };
      await api.postTransaction(payload);
      setMessage({ type: "success", text: "Transacción agregada" });
      setForm({
        date: "",
        description: "",
        amount: "",
        category: "",
        isIncome: true,
      });
      await fetchList();
    } catch (err) {
      setMessage({ type: "error", text: String(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <h2>Agregar transacción</h2>
        <Box
          component="form"
          onSubmit={submit}
          sx={{ mt: 2 }}
          aria-label="Formulario de transacción"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                error={!!errors.date}
                helperText={errors.date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Categoría"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                error={!!errors.category}
                helperText={errors.category}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                error={!!errors.amount}
                helperText={errors.amount}
                inputProps={{ step: "0.01" }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isIncome}
                    onChange={(e) =>
                      setForm({ ...form, isIncome: e.target.checked })
                    }
                  />
                }
                label={form.isIncome ? "Ingreso" : "Egreso"}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} /> : null}
              >
                {submitting ? "Guardando..." : "Agregar"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <h2>Transacciones</h2>
          <Button onClick={fetchList} variant="outlined">
            Refrescar
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Monto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell align="right">{formatAmount(t.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Toast message={message} onClose={() => setMessage(null)} />
    </Box>
  );
}
