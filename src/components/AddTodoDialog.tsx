"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CreateTodo } from "@/types/todo";

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type FormValues = z.infer<typeof schema>;

type AddTodoDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddTodoDialog({ open, onClose }: AddTodoDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "" },
  });

  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationFn: (todo: CreateTodo) =>
      fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["todos"] });
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = (data: FormValues) => {
    createTodoMutation.mutate(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>Novo todo</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2">
          <TextField
            label="Título"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
            autoFocus
          />
          <TextField
            label="Descrição"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
          />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={handleClose} disabled={createTodoMutation.isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createTodoMutation.isPending}
            loading={createTodoMutation.isPending}
          >
            Adicionar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
