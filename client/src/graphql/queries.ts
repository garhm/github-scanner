import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query GetRepositories($input: RepoListInput!) {
    repositories(input: $input) {
      name
      size
      owner
      private
    }
  }
`;

export const GET_REPOSITORY_DETAILS = gql`
  query GetRepositoryDetails($input: RepoDetailsInput!) {
    repositoryDetails(input: $input) {
      name
      size
      owner
      private
      fileCount
      ymlContent
      webhooks {
        id
        name
        active
        events
        config {
          url
          content_type
        }
      }
    }
  }
`;