import { GitHubService } from '../services/githubService';
import { RepoInput, RepoDetailsInput } from '../types';

export const resolvers = {
    Query: {
        repositories: async (_: any, { input }: { input: RepoInput }) => {
            const githubService = new GitHubService(input.token);
            return await githubService.getRepositories(input.repositories);
        },

        repositoryDetails: async (_: any, { input }: { input: RepoDetailsInput }) => {
            const githubService = new GitHubService(input.token);
            return await githubService.getRepositoryDetails(input.repository);
        },
    },
};