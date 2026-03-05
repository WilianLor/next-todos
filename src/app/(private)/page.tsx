"use client";

import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AddTodoDialog from "@/components/AddTodoDialog";
import Header from "@/components/Header";
import TodoItem from "@/components/TodoItem";
import type { CreateTodo, Todo } from "@/types/todo";

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Falha ao carregar todos");
  return res.json();
}

export default function HomePage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const todos = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  return (
    <Box className="min-h-screen bg-gray-50">
      <Header />
      <Box className="max-w-4xl mx-auto px-4 py-6">
        <Typography variant="h5" className="font-semibold mb-4">
          Meus todos
        </Typography>

        {todos.isLoading && (
          <Box className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={56}
                className="rounded-lg"
              />
            ))}
          </Box>
        )}

        {todos.isError && (
          <Paper className="p-4 text-center">
            <Typography color="error" className="mb-2">
              Não foi possível carregar os todos.
            </Typography>
            <Button variant="outlined" onClick={() => todos.refetch()}>
              Tentar novamente
            </Button>
          </Paper>
        )}

        {todos.isSuccess && (
          <>
            <Box className="mb-4">
              {(todos.data ?? []).map((todo) => (
                <TodoItem key={todo._id} todo={todo} />
              ))}
            </Box>

            <Box
              component="button"
              type="button"
              className="w-full p-4 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-left"
              onClick={() => setAddDialogOpen(true)}
            >
              <Typography variant="body2" color="text.secondary">
                Clique para adicionar um todo
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <AddTodoDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
    </Box>
  );
}
