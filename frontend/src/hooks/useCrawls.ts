import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crawlsApi } from "../api/crawls.api";

export const useCrawls = (projectId: number | null | undefined) => {
  return useQuery({
    queryKey: ["crawls", projectId],
    queryFn: () => {
      if (!projectId) return [];
      return crawlsApi.getHistory(projectId);
    },
    enabled: !!projectId,
  });
};

export const useDeleteCrawl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (crawlId: number) => crawlsApi.delete(crawlId),
    onSuccess: () => {
      // Invalidate all crawls queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["crawls"] });
    },
  });
};
