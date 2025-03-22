import type { ContributorDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";

import { axios } from "@/client/libs/axios";

export const fetchGitHubContributors = async () => {
  const response = await axios.get<ContributorDto[]>(`/contributors/github`);

  return response.data;
};

export const useContributors = () => {
  const {
    error: githubError,
    isPending: githubLoading,
    data: github,
  } = useQuery({
    queryKey: ["contributors", "github"],
    queryFn: fetchGitHubContributors,
  });

  const error = githubError;
  const loading = githubLoading;

  return { github, loading, error };
};
