import React from 'react';
import {
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Grid,
    Box,
    Chip,
    Paper,
    Button,
} from '@mui/material';
import {
    Storage,
    Person,
    Lock,
    Public,
    ArrowBack,
} from '@mui/icons-material';

interface Repository {
    name: string;
    size: number;
    owner: string;
    private: boolean;
}

interface RepoListProps {
    repositories: Repository[];
    onSelectRepo: (repoName: string) => void;
    onBack: () => void;
}

const RepoList: React.FC<RepoListProps> = ({ repositories, onSelectRepo, onBack }) => {
    const formatSize = (size: number): string => {
        if (size < 1024) return `${size} KB`;
        return `${(size / 1024).toFixed(1)} MB`;
    };

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Repository List
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                >
                    Back to Search
                </Button>
            </Box>

            <Grid container spacing={3}>
                {repositories.map((repo) => (
                    <Grid item xs={12} sm={6} md={4} key={`${repo.owner}/${repo.name}`}>
                        <Card elevation={2} sx={{ height: '100%' }}>
                            <CardActionArea
                                onClick={() => onSelectRepo(`${repo.owner}/${repo.name}`)}
                                sx={{ height: '100%' }}
                            >
                                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" gutterBottom noWrap>
                                        {repo.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Person sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {repo.owner}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Storage sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {formatSize(repo.size)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Chip
                                            icon={repo.private ? <Lock /> : <Public />}
                                            label={repo.private ? 'Private' : 'Public'}
                                            color={repo.private ? 'error' : 'success'}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {repositories.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No repositories found
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default RepoList;