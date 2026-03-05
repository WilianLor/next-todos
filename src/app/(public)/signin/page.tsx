"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Paper, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const handleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <Box
      className="min-h-screen w-full flex items-center justify-center p-4"
      sx={{
        background:
          "linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(245, 245, 245, 1) 50%, rgba(25, 118, 210, 0.06) 100%)",
      }}
    >
      <Paper
        elevation={2}
        className="w-full max-w-sm p-8 rounded-2xl text-center"
        sx={{
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box className="flex justify-center mb-4">
          <Box
            className="flex items-center justify-center rounded-full w-16 h-16"
            sx={{ bgcolor: "primary.main" }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 36, color: "primary.contrastText" }}
            />
          </Box>
        </Box>
        <Typography
          variant="h5"
          component="h1"
          fontWeight={700}
          color="text.primary"
          gutterBottom
        >
          Meus Todos
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="mb-8"
          sx={{ maxWidth: 280, mx: "auto" }}
        >
          Entre com sua conta Google para acessar e gerenciar suas tarefas.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSignIn}
          startIcon={<GoogleIcon />}
          className="rounded-xl py-2.5"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: 1,
          }}
        >
          Entrar com Google
        </Button>
      </Paper>
    </Box>
  );
}
