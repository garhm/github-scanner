import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Alert,
} from '@mui/material';
import {
    ArrowBack,
    Storage,
    Person,
    Lock,
    Public,
    FolderOpen,
    Code,
    Webhook,
    ExpandMore,
    Circle,
} from '@mui/icons-material';

interface Webhook {
    id: number;
    name: string;
    active: boolean;
    events: string[];
    config: {
        url: string;
        content_type: string;
    };
}

interface RepositoryDetails {
    name: string;
    size: number;
    owner: string;
    private: boolean;
    fileCount?: number;
    ymlContent?: string;
    webhooks?: Webhook[];
}

interface RepoDetailsProps {
    repository: RepositoryDetails;
    onBack: () => void;
}

const RepoDetails: React.FC<RepoDetailsProps> = ({ repository, onBack }) => {
    const formatSize = (size: number): string => {
        if (size < 1024) return `${size} KB`;
        return `${(size / 1024).toFixed(1)} MB`;
    };

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Repository Details
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                >
                    Back to List
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" component="h2">
                                    {repository.name}
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Chip
                                        icon={repository.private ? <Lock /> : <Public />}
                                        label={repository.private ? 'Private' : 'Public'}
                                        color={repository.private ? 'error' : 'success'}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    <strong>Owner:</strong> {repository.owner}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Storage sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    <strong>Size:</strong> {formatSize(repository.size)}
                                </Typography>
                            </Box>

                            {repository.fileCount !== undefined && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <FolderOpen sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        <strong>Files:</strong> {repository.fileCount}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Webhooks */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Webhook sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Active Webhooks
                            </Typography>

                            {repository.webhooks && repository.webhooks.length > 0 ? (
                                <List dense>
                                    {repository.webhooks.map((webhook) => (
                                        <ListItem key={webhook.id} divider>
                                            <ListItemIcon>
                                                <Circle
                                                    sx={{
                                                        color: webhook.active ? 'success.main' : 'error.main',
                                                        fontSize: 12
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={webhook.name}
                                                secondary={
                                                    <Box>
                                                        <Typography variant="caption" display="block">
                                                            Events: {webhook.events.join(', ')}
                                                        </Typography>
                                                        <Typography variant="caption" display="block">
                                                            URL: {webhook.config.url}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No active webhooks found
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {repository.ymlContent && (
                    <Grid item xs={12}>
                        <Card elevation={2}>
                            <CardContent>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Code sx={{ mr: 1 }} />
                                            <Typography variant="h6">
                                                YML File Content
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                backgroundColor: 'grey.50',
                                                overflow: 'auto',
                                                maxHeight: '400px'
                                            }}
                                        >
                      <pre style={{
                          margin: 0,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          whiteSpace: 'pre-wrap'
                      }}>
                        {repository.ymlContent}
                      </pre>
                                        </Paper>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {!repository.ymlContent && (
                    <Grid item xs={12}>
                        <Alert severity="info">
                            No YML files found in this repository
                        </Alert>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default RepoDetails;