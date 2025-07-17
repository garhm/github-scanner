import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Chip,
    Stack,
    Alert,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';

interface TokenFormProps {
    onSubmit: (token: string, repositories: string[]) => void;
    loading: boolean;
}

const TokenForm: React.FC<TokenFormProps> = ({ onSubmit, loading }) => {
    const [token, setToken] = useState('');
    const [repositories, setRepositories] = useState<string[]>([
        'garhm/oxRepoA',
        'garhm/oxRepoB',
        'garhm/oxRepoC'
    ]);
    const [repoInput, setRepoInput] = useState('');

    const handleAddRepo = () => {
        if (repoInput.trim() && !repositories.includes(repoInput.trim())) {
            setRepositories([...repositories, repoInput.trim()]);
            setRepoInput('');
        }
    };

    const handleRemoveRepo = (repo: string) => {
        setRepositories(repositories.filter(r => r !== repo));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (token.trim() && repositories.length > 0) {
            onSubmit(token.trim(), repositories);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <GitHub sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h4" component="h1">
                    GitHub Scanner
                </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
                Enter your GitHub Personal Access Token and repository names to scan.
                You can create a token at: GitHub Settings → Developer settings → Personal access tokens
            </Alert>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="GitHub Personal Access Token"
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    margin="normal"
                    required
                    helperText="Required for accessing repository data"
                />

                <Box sx={{ mt: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Repositories to Scan
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            label="Repository (owner/repo)"
                            value={repoInput}
                            onChange={(e) => setRepoInput(e.target.value)}
                            placeholder="e.g., octocat/Hello-World"
                            size="small"
                            sx={{ flexGrow: 1 }}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddRepo()}
                        />
                        <Button onClick={handleAddRepo} variant="outlined">
                            Add
                        </Button>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {repositories.map((repo) => (
                            <Chip
                                key={repo}
                                label={repo}
                                onDelete={() => handleRemoveRepo(repo)}
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || !token.trim() || repositories.length === 0}
                    sx={{ mt: 2 }}
                >
                    {loading ? 'Scanning...' : 'Scan Repositories'}
                </Button>
            </form>
        </Paper>
    );
};

export default TokenForm;