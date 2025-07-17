export const typeDefs = `#graphql
  type Repository {
    name: String!
    size: Int!
    owner: String!
    private: Boolean!
    fileCount: Int
    ymlContent: String
    webhooks: [Webhook!]
  }

  type Webhook {
    id: Int!
    name: String!
    active: Boolean!
    events: [String!]!
    config: WebhookConfig!
  }

  type WebhookConfig {
    url: String!
    content_type: String!
  }

  input RepoListInput {
    repositories: [String!]!
    token: String!
  }

  input RepoDetailsInput {
    repository: String!
    token: String!
  }

  type Query {
    repositories(input: RepoListInput!): [Repository!]!
    repositoryDetails(input: RepoDetailsInput!): Repository
  }
`;
