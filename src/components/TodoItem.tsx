"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
};

export default function TodoItem({ todo }: TodoItemProps) {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/todos/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["todos"] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/todos/${id}/complete`).then((res) => {
        if (!res.ok) throw new Error("Falha ao completar");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["todos"] });
    },
  });

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!todo.completed) completeMutation.mutate(todo._id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    deleteTodoMutation.mutate(todo._id);
  };

  const summarySx = todo.completed
    ? {
        textDecoration: "line-through",
        opacity: 0.85,
        color: "text.secondary",
      }
    : undefined;

  return (
    <Accordion
      disableGutters
      className="border border-solid border-gray-200 rounded-lg overflow-hidden mb-2 before:shadow-none"
      sx={{
        "&.Mui-expanded": { margin: "0 0 8px 0" },
        ...(todo.completed && {
          bgcolor: "action.hover",
        }),
      }}
    >
      <Box className="flex items-center min-h-14">
        <Box
          className="flex items-center justify-center shrink-0"
          sx={{ width: 40, height: 40 }}
        >
          {completeMutation.isPending ? (
            <CircularProgress size={24} aria-label="Salvando..." />
          ) : (
            <Checkbox
              checked={todo.completed}
              disabled={todo.completed}
              onClick={handleCompleteClick}
              size="small"
              aria-label={
                todo.completed ? "Concluído" : "Marcar como concluído"
              }
            />
          )}
        </Box>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className="min-h-14 flex-1 min-w-0"
          sx={{
            "& .MuiAccordionSummary-content": { alignItems: "center" },
          }}
        >
          <Typography variant="subtitle1" sx={summarySx} className="truncate">
            {todo.title}
          </Typography>
        </AccordionSummary>
        <IconButton
          size="small"
          onClick={handleDeleteClick}
          aria-label="Excluir todo"
          color="error"
          loading={deleteTodoMutation.isPending}
          disabled={deleteTodoMutation.isPending}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Box>
      <AccordionDetails className="pt-0">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={todo.completed ? { opacity: 0.8 } : undefined}
        >
          {todo.description}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
