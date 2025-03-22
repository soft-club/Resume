import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ContributorDto } from "@reactive-resume/dto";

type GitHubResponse = { id: number; login: string; html_url: string; avatar_url: string }[];
@Injectable()
export class ContributorsService {
  constructor(private readonly httpService: HttpService) {}

  async fetchGitHubContributors() {
    const response = await this.httpService.axiosRef.get(
      `https://api.github.com/repos/AmruthPillai/Reactive-Resume/contributors`,
    );
    const data = response.data as GitHubResponse;

    return data
      .filter((_, index) => index <= 20)
      .map((user) => {
        return {
          id: user.id,
          name: user.login,
          url: user.html_url,
          avatar: user.avatar_url,
        } satisfies ContributorDto;
      });
  }
}
