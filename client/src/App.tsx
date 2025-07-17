import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useLazyQuery } from '@apollo/client';
import {  CssBaseline, Container, Alert, CircularProgress, Box } from '@mui/material';
import TokenForm from './components/TokenForm';
import RepoList from './components/RepoList';
import RepoDetails from './components/RepoDetails';
import { GET_REPOSITORIES, GET_REPOSITORY_DETAILS } from './graphql/queries';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

interface Repository {
    name: string;
    size: number;
    owner: string;
    private: boolean;
}

interface RepositoryDetails extends Repository {
    fileCount?: number;
    ymlContent?: string;
    webhooks?: Array<{
        id: number;
        name: string;
        active: boolean;
        events: string[];
        config: {
            url: string;
            content_type: string;
        };
    }>;
}

type ViewState = 'form' | 'list' | 'details';

const AppContent: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('form');
    const [currentToken, setCurrentToken] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<RepositoryDetails | null>(null);

    const [getRepositories, { loading: repoLoading, error: repoError }] = useLazyQuery(
        GET_REPOSITORIES,
        {
            onCompleted: (data) => {
                setRepositories(data.repositories);
                setViewState('list');
            },
            onError: (error) => {
                console.error('Error fetching repositories:', error);
            }
        }
    );

    const [getRepositoryDetails, { loading: detailsLoading, error: detailsError }] = useLazyQuery(
        GET_REPOSITORY_DETAILS,
        {
            onCompleted: (data) => {
                setSelectedRepo(data.repositoryDetails);
                setViewState('details');
            },
            onError: (error) => {
                console.error('Error fetching repository details:', error);
            }
        }
    );

    const handleTokenSubmit = (token: string, repoNames: string[]) => {
        setCurrentToken(token);
        getRepositories({
            variables: {
                input: {
                    token,
                    repositories: repoNames,
                },
            },
        });
    };

    const handleSelectRepo = (repoName: string) => {
        getRepositoryDetails({
            variables: {
                input: {
                    token: currentToken,
                    repository: repoName,
                },
            },
        });
    };

    const handleBackToList = () => {
        setViewState('list');
        setSelectedRepo(null);
    };

    const handleBackToForm = () => {
        setViewState('form');
        setRepositories([]);
        setSelectedRepo(null);
        setCurrentToken('');
    };

    const renderContent = () => {
        if (repoLoading || detailsLoading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={60} />
                </Box>
            );
        }

        if (repoError) {
            return (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading repositories: {repoError.message}
                </Alert>
            );
        }

        if (detailsError) {
            return (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading repository details: {detailsError.message}
                </Alert>
            );
        }

        switch (viewState) {
            case 'form':
                return (
                    <TokenForm
                        onSubmit={handleTokenSubmit}
                        loading={repoLoading}
                    />
                );
            case 'list':
                return (
                    <RepoList
                        repositories={repositories}
                        onSelectRepo={handleSelectRepo}
                        onBack={handleBackToForm}
                    />
                );
            case 'details':
                return selectedRepo ? (
                    <RepoDetails
                        repository={selectedRepo}
                        onBack={handleBackToList}
                    />
                ) : null;
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {renderContent()}
        </Container>
    );
};

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <CssBaseline />
            <AppContent />
        </ApolloProvider>
    );
};

export default App;