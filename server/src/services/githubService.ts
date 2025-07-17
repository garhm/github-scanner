import { Octokit } from '@octokit/rest';
import pLimit from 'p-limit';
import { Repository, Webhook } from '../types';

export class GitHubService {
    private octokit: Octokit;
    private limit = pLimit(2);

    constructor(token: string) {
        this.octokit = new Octokit({
            auth: token,
        });
    }

    async getRepositories(repoNames: string[]): Promise<Repository[]> {
        const promises = repoNames.map(repoName =>
            this.limit(() => this.getBasicRepoInfo(repoName))
        );

        const results = await Promise.all(promises);
        return results.filter(repo => repo !== null) as Repository[];
    }

    async getRepositoryDetails(repoName: string): Promise<Repository | null> {
        try {
            const [owner, repo] = repoName.split('/');

            const repoInfo = await this.octokit.rest.repos.get({
                owner,
                repo,
            });

            const fileCount = await this.getFileCount(owner, repo);

            const ymlContent = await this.getYmlFileContent(owner, repo);

            const webhooks = await this.getWebhooks(owner, repo);

            return {
                name: repoInfo.data.name,
                size: repoInfo.data.size,
                owner: repoInfo.data.owner.login,
                private: repoInfo.data.private,
                fileCount,
                ymlContent,
                webhooks,
            };
        } catch (error) {
            console.error(`Error fetching repository details for ${repoName}:`, error);
            return null;
        }
    }

    private async getBasicRepoInfo(repoName: string): Promise<Repository | null> {
        try {
            const [owner, repo] = repoName.split('/');

            const repoInfo = await this.octokit.rest.repos.get({
                owner,
                repo,
            });

            return {
                name: repoInfo.data.name,
                size: repoInfo.data.size,
                owner: repoInfo.data.owner.login,
                private: repoInfo.data.private,
            };
        } catch (error) {
            console.error(`Error fetching repository ${repoName}:`, error);
            return null;
        }
    }

    private async getFileCount(owner: string, repo: string): Promise<number> {
        try {
            const tree = await this.octokit.rest.git.getTree({
                owner,
                repo,
                tree_sha: 'HEAD',
                recursive: 'true',
            });

            return tree.data.tree.filter(item => item.type === 'blob').length;
        } catch (error) {
            console.error(`Error getting file count for ${owner}/${repo}:`, error);
            return 0;
        }
    }

    private async getYmlFileContent(owner: string, repo: string): Promise<string | null> {
        try {
            const tree = await this.octokit.rest.git.getTree({
                owner,
                repo,
                tree_sha: 'HEAD',
                recursive: 'true',
            });

            const ymlFile = tree.data.tree.find(item =>
                item.type === 'blob' &&
                (item.path?.endsWith('.yml') || item.path?.endsWith('.yaml'))
            );

            if (!ymlFile || !ymlFile.path) {
                return null;
            }

            const fileContent = await this.octokit.rest.repos.getContent({
                owner,
                repo,
                path: ymlFile.path,
            });

            if ('content' in fileContent.data) {
                return Buffer.from(fileContent.data.content, 'base64').toString('utf8');
            }

            return null;
        } catch (error) {
            console.error(`Error getting YML file content for ${owner}/${repo}:`, error);
            return null;
        }
    }

    private async getWebhooks(owner: string, repo: string): Promise<Webhook[]> {
        try {
            const webhooks = await this.octokit.rest.repos.listWebhooks({
                owner,
                repo,
            });

            return webhooks.data.map(webhook => ({
                id: webhook.id,
                name: webhook.name,
                active: webhook.active,
                events: webhook.events,
                config: {
                    url: webhook.config.url || '',
                    content_type: webhook.config.content_type || '',
                },
            }));
        } catch (error) {
            console.error(`Error getting webhooks for ${owner}/${repo}:`, error);
            return [];
        }
    }
}