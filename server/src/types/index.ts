export interface Repository {
    name: string;
    size: number;
    owner: string;
    private: boolean;
    fileCount?: number;
    ymlContent?: string | null;
    webhooks?: Webhook[];
}

export interface Webhook {
    id: number;
    name: string;
    active: boolean;
    events: string[];
    config: {
        url: string;
        content_type: string;
    };
}

export interface Context {
    token: string;
}

export interface RepoInput {
    repositories: string[];
    token: string;
}

export interface RepoDetailsInput {
    repository: string;
    token: string;
}
