"use client";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <AppBar position="static" className="mb-6">
        <Toolbar className="max-w-4xl mx-auto w-full gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={120} />
          <Box className="flex-1" />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" className="mb-6">
      <Toolbar className="max-w-4xl mx-auto w-full gap-4">
        <Avatar
          src={session?.user?.image ?? undefined}
          alt={session?.user?.name ?? ""}
          className="shrink-0"
        >
          {getInitials(session?.user?.name)}
        </Avatar>
        <Typography variant="h6" component="span" className="flex-1 truncate">
          {session?.user?.name ?? "Usuário"}
        </Typography>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          onClick={() => signOut()}
        >
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}
