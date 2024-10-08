import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask, deleteTask, fetchTasks } from "../api/task";
import { useNavigate } from "react-router-dom";

interface CreateTaskPayload {
  title: string;
  description: string;
  dueDate: string;
}

interface UpdateTaskPayload {
  id: string;
  status?: string;
}

export const useTask = () => {
  const queryClient = useQueryClient(); 

  const { data: tasks, isLoading: isFetchingTasks, error: fetchError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const createMutation = useMutation({
    mutationFn: (taskData: CreateTaskPayload) => createTask(taskData),
    onSuccess: (data) => {
      console.log("Task created successfully:", data);
      queryClient.invalidateQueries({queryKey:["tasks"]});  
    },
    onError: (error: any) => {
      console.error("Failed to create task:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (taskData: any) => updateTask(taskData),
    onSuccess: (data) => {
      console.log("Task updated successfully:", data);
      queryClient.invalidateQueries({queryKey:["tasks"]});  
    },
    onError: (error: any) => {
      console.error("Failed to update task:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (data) => {
      console.log("Task deleted successfully:", data);
      queryClient.invalidateQueries({queryKey:["tasks"]});  
    },
    onError: (error: any) => {
      console.error("Failed to delete task:", error);
    },
  });

  return {
    tasks,
    isFetchingTasks,
    fetchError,
    createTask: createMutation.mutateAsync,
    createTaskIsPending: createMutation.isPending,
    updateTask: updateMutation.mutateAsync,
    updateTaskIsPending: updateMutation.isPending,
    deleteTask: deleteMutation.mutateAsync,
    deleteTaskIsPending: deleteMutation.isPending,
    createTaskStatus: createMutation.status,
    updateTaskStatus: updateMutation.status,
    deleteTaskStatus: deleteMutation.status,
  };
};
