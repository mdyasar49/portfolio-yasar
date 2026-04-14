import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Tab, Tabs, TextField, Button, 
  Stack, Grid, Paper, IconButton, CircularProgress, Alert, 
  Snackbar, Card, CardContent 
} from '@mui/material';

import { 
  Save, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  User, 
  Briefcase, 
  Terminal, 
  Layers, 
  Inbox,
  GraduationCap
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import useProfile from '../hooks/useProfile';


const ManagementHub = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile: initialProfile, loading: initialLoading } = useProfile();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(parseInt(tab, 10));
    }, [location]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (initialProfile) {
            setProfile(JSON.parse(JSON.stringify(initialProfile))); // Deep clone
        }
    }, [initialProfile]);

    useEffect(() => {
        // Patient Auth Protocol: Allow hydration before redirect
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token || token === 'null') {
                navigate('/admin/login');
            }
        };
        const timer = setTimeout(checkAuth, 600);
        return () => clearTimeout(timer);
    }, [navigate]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'null') {
            navigate('/admin/login');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.put('/profile', profile);
            if (res.data.success) {
                setSuccess('Portfolio architecture updated successfully!');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/admin/login');
            }
            setError(err.response?.data?.message || 'Failed to sync data to the cloud.');
        } finally {
            setLoading(false);
        }
    };



    if (initialLoading || !profile) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#010409' }}>
                <CircularProgress sx={{ color: '#33ccff' }} />
            </Box>
        );
    }

    const ProfileTab = () => (
        <Stack spacing={4}>
            <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ color: '#33ccff', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem' }}>IDENTITY_CORE</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="FULL_NAME" 
                            variant="outlined" 
                            value={profile.name} 
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="PROFESSIONAL_TITLE" 
                            variant="outlined" 
                            value={profile.title} 
                            onChange={(e) => setProfile({...profile, title: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth multiline rows={4} label="PROFESSIONAL_SUMMARY" 
                            variant="outlined" 
                            value={profile.summary} 
                            onChange={(e) => setProfile({...profile, summary: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="LOCATION" 
                            variant="outlined" 
                            value={profile.location} 
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="PRIMARY_EMAIL" 
                            variant="outlined" 
                            value={profile.email} 
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ color: '#33ccff', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem' }}>SOCIAL_DISPATCH_HANDLES</Typography>
                <Grid container spacing={3}>
                    {Object.keys(profile.socials).map((key) => (
                        <Grid item xs={12} md={6} key={key}>
                            <TextField 
                                fullWidth label={key.toUpperCase()} 
                                variant="outlined" 
                                value={profile.socials[key]} 
                                onChange={(e) => setProfile({
                                    ...profile, 
                                    socials: { ...profile.socials, [key]: e.target.value }
                                })}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Stack>
    );

    const ProjectsTab = () => (
        <Stack spacing={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="contained" 
                    startIcon={<Plus size={18} />}
                    onClick={() => {
                        const newProject = { name: 'New Project', description: [''], technologies: [], image: '', link: '#', github: '#' };
                        setProfile({ ...profile, projects: [newProject, ...profile.projects] });
                    }}
                    sx={{ bgcolor: '#00ffcc', color: '#000', fontWeight: 900, '&:hover': { bgcolor: '#00ccaa' } }}
                >
                    ADD_NEW_PROJECT
                </Button>
            </Box>
            {profile.projects.map((project, idx) => (
                <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#ff3366', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.8rem' }}>DEPLOYMENT_UNIT_{String(idx + 1).padStart(2, '0')}</Typography>
                            <IconButton color="error" size="small" onClick={() => {
                                const updated = profile.projects.filter((_, i) => i !== idx);
                                setProfile({ ...profile, projects: updated });
                            }}>
                                <Trash2 size={20} />
                            </IconButton>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth label="PROJECT_NAME" 
                                    value={project.name} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => 
                                            i === idx ? { ...p, name: e.target.value } : p
                                        );
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth label="IMAGE_URL" 
                                    value={project.image} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => 
                                            i === idx ? { ...p, image: e.target.value } : p
                                        );
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth multiline rows={3} label="DESCRIPTION_LINE_1" 
                                    value={project.description[0]} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => {
                                            if (i === idx) {
                                                const newDesc = [...p.description];
                                                newDesc[0] = e.target.value;
                                                return { ...p, description: newDesc };
                                            }
                                            return p;
                                        });
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth label="LIVE_URL" 
                                    value={project.link} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => 
                                            i === idx ? { ...p, link: e.target.value } : p
                                        );
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth label="GITHUB_URL" 
                                    value={project.github} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => 
                                            i === idx ? { ...p, github: e.target.value } : p
                                        );
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth label="TECHNOLOGIES (COMMA_SEPARATED)" 
                                    value={project.technologies.join(', ')} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => 
                                            i === idx ? { ...p, technologies: e.target.value.split(',').map(s => s.trim()) } : p
                                        );
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                />
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
    const ExperienceTab = () => (
        <Stack spacing={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => {
                    const newExp = { role: 'New Role', company: 'New Company', period: '2024 - Present', description: [''] };
                    setProfile({ ...profile, experience: [newExp, ...profile.experience] });
                }} sx={{ bgcolor: '#ff3366', color: '#fff', fontWeight: 900 }}>ADD_EXPERIENCE_NODE</Button>
            </Box>
            {profile.experience.map((exp, idx) => (
                <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography sx={{ color: '#ff3366', fontWeight: 900 }}>TRAJECTORY_NODE_{String(idx + 1).padStart(2, '0')}</Typography>
                            <IconButton color="error" onClick={() => {
                                const updated = profile.experience.filter((_, i) => i !== idx);
                                setProfile({ ...profile, experience: updated });
                            }}><Trash2 size={20} /></IconButton>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}><TextField fullWidth label="ROLE" value={exp.role} onChange={(e) => { 
                                const updatedExp = profile.experience.map((ex, i) => i === idx ? { ...ex, role: e.target.value } : ex);
                                setProfile({ ...profile, experience: updatedExp }); 
                            }} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth label="COMPANY" value={exp.company} onChange={(e) => { 
                                const updatedExp = profile.experience.map((ex, i) => i === idx ? { ...ex, company: e.target.value } : ex);
                                setProfile({ ...profile, experience: updatedExp }); 
                            }} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth label="PERIOD" value={exp.period} onChange={(e) => { 
                                const updatedExp = profile.experience.map((ex, i) => i === idx ? { ...ex, period: e.target.value } : ex);
                                setProfile({ ...profile, experience: updatedExp }); 
                            }} /></Grid>
                            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="KEY_RESPONSIBILITIES" value={exp.description.join('\n')} onChange={(e) => { 
                                const updatedExp = profile.experience.map((ex, i) => i === idx ? { ...ex, description: e.target.value.split('\n') } : ex);
                                setProfile({ ...profile, experience: updatedExp }); 
                            }} /></Grid>
                        </Grid>

                    </CardContent>
                </Card>
            ))}
        </Stack>
    );

    const EducationTab = () => (
        <Stack spacing={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => {
                    const newEdu = { degree: 'Degree Name', institution: 'University', year: '2024' };
                    setProfile({ ...profile, education: [newEdu, ...profile.education] });
                }} sx={{ bgcolor: '#ff9933', color: '#fff', fontWeight: 900 }}>ADD_ACADEMIC_NODE</Button>
            </Box>
            {profile.education.map((edu, idx) => (
                <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography sx={{ color: '#ff9933', fontWeight: 900 }}>ACADEMIC_NODE_{String(idx + 1).padStart(2, '0')}</Typography>
                            <IconButton color="error" onClick={() => {
                                const updated = profile.education.filter((_, i) => i !== idx);
                                setProfile({ ...profile, education: updated });
                            }}><Trash2 size={20} /></IconButton>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}><TextField fullWidth label="DEGREE" value={edu.degree} onChange={(e) => { 
                                const updatedEdu = profile.education.map((ed, i) => i === idx ? { ...ed, degree: e.target.value } : ed);
                                setProfile({ ...profile, education: updatedEdu }); 
                            }} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth label="INSTITUTION" value={edu.institution} onChange={(e) => { 
                                const updatedEdu = profile.education.map((ed, i) => i === idx ? { ...ed, institution: e.target.value } : ed);
                                setProfile({ ...profile, education: updatedEdu }); 
                            }} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth label="YEAR" value={edu.year} onChange={(e) => { 
                                const updatedEdu = profile.education.map((ed, i) => i === idx ? { ...ed, year: e.target.value } : ed);
                                setProfile({ ...profile, education: updatedEdu }); 
                            }} /></Grid>
                        </Grid>

                    </CardContent>
                </Card>
            ))}

            <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ color: '#ff9933', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.8rem' }}>CERTIFICATION_STACK</Typography>
                <TextField 
                    fullWidth multiline rows={2} 
                    label="PRO_CERTIFICATIONS (COMMA_SEPARATED)"
                    value={profile.certifications ? profile.certifications.join(', ') : ''}
                    onChange={(e) => {
                        setProfile({ ...profile, certifications: e.target.value.split(',').map(s => s.trim()) });
                    }}
                />
            </Paper>
        </Stack>
    );


    const SkillsTab = () => (
        <Stack spacing={4}>
            {Object.keys(profile.technicalSkills).map((category) => (
                <Paper key={category} sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#33ccff', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.8rem' }}>{category.toUpperCase()}_STACK</Typography>
                    <TextField 
                        fullWidth multiline rows={2} 
                        label="SKILLS (COMMA_SEPARATED)"
                        value={profile.technicalSkills[category].join(', ')}
                        onChange={(e) => {
                            const updated = { ...profile.technicalSkills };
                            updated[category] = e.target.value.split(',').map(s => s.trim());
                            setProfile({ ...profile, technicalSkills: updated });
                        }}
                    />
                </Paper>
            ))}
        </Stack>
    );


    const MessagesTab = () => {
        const [messages, setMessages] = useState([]);
        const [msgLoading, setMsgLoading] = useState(false);

        useEffect(() => {
            const fetchMessages = async () => {
                setMsgLoading(true);
                try {
                    const res = await api.get('/contact');
                    if (res.data.success) setMessages(res.data.data);
                } catch (e) {
                    console.error('MSG_FETCH_FAIL');
                } finally {
                    setMsgLoading(false);
                }
            };

            fetchMessages();
        }, []);
        if (msgLoading) return <CircularProgress sx={{ display: 'block', m: 'auto', color: '#ff3366' }} />;

        return (
            <Stack spacing={4}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button 
                        variant="outlined"
                        size="small"
                        onClick={async () => {
                            if (window.confirm('CRITICAL_ACTION: PERMANENTLY_PURGE_ALL_TRANSMISSIONS?')) {
                                try {
                                    const deletePromises = messages.map(m => api.delete(`/contact/${m._id || m.createdAt}`));
                                    await Promise.all(deletePromises);
                                    setMessages([]);
                                    setSuccess('Communications Array Cleared.');
                                } catch (e) {
                                    setError('Failed to execute bulk purge.');
                                }
                            }
                        }}
                        sx={{ 
                            color: '#ff3366', borderColor: 'rgba(255, 51, 102, 0.3)', 
                            fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.65rem', mr: 2,
                            '&:hover': { borderColor: '#ff3366', bgcolor: 'rgba(255, 51, 102, 0.05)' }
                        }}
                    >
                        PURGE_ALL
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        disabled={messages.length === 0}
                        onClick={() => {
                            const headers = ['Date', 'Name', 'Email', 'Subject', 'Message'];
                            const rows = messages.map(m => [
                                new Date(m.createdAt).toLocaleString(),
                                `"${m.name.replace(/"/g, '""')}"`,
                                m.email,
                                `"${m.subject.replace(/"/g, '""')}"`,
                                `"${m.message.replace(/"/g, '""')}"`
                            ]);
                            const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.setAttribute('download', `correspondence_export_${new Date().toISOString().split('T')[0]}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        sx={{ 
                            color: '#00ffcc', borderColor: 'rgba(0, 255, 204, 0.3)', 
                            fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.65rem',
                            '&:hover': { borderColor: '#00ffcc', bgcolor: 'rgba(0, 255, 204, 0.05)' }
                        }}
                    >
                        DOWNLOAD_LOGS (.CSV)
                    </Button>
                </Box>
                {messages.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ color: '#444', fontFamily: 'Syncopate', fontWeight: 900 }}>EMPTY_INBOX</Typography>
                    </Paper>
                ) : messages.map((m, idx) => (

                    <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'monospace' }}>FROM: {m.name} &lt;{m.email}&gt;</Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography sx={{ color: '#444', fontSize: '0.7rem' }}>{new Date(m.createdAt).toLocaleString()}</Typography>
                                    <IconButton size="small" color="error" onClick={async () => {
                                        try {
                                            await api.delete(`/contact/${m._id || m.createdAt}`);
                                            setMessages(messages.filter(msg => msg._id !== m._id && msg.createdAt !== m.createdAt));
                                        } catch (e) {
                                            setError('Failed to purge transmission.');
                                        }
                                    }}>

                                        <Trash2 size={16} />
                                    </IconButton>
                                </Stack>
                            </Box>
                            <Typography sx={{ color: 'white', fontWeight: 900, mb: 1 }}>{m.subject}</Typography>
                            <Typography sx={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>{m.message}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        );
    };


    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#010409', color: 'white', pt: 4, pb: 10 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Button 
                        startIcon={<ArrowLeft size={18} />} 
                        onClick={() => navigate('/admin/dashboard')}
                        sx={{ color: '#444', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.7rem', '&:hover': { color: '#33ccff' } }}
                    >
                        RETURN_TO_CONTROL
                    </Button>

                    <Button 
                        variant="contained" 
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
                        onClick={handleSave}
                        disabled={loading}
                        sx={{ 
                            bgcolor: '#33ccff', color: '#000', fontWeight: 900, px: 4, fontFamily: 'Syncopate', fontSize: '0.7rem',
                            '&:hover': { bgcolor: '#00aacc' },
                            '&.Mui-disabled': { bgcolor: 'rgba(51, 204, 255, 0.2)' }
                        }}
                    >
                        {loading ? 'SYNCING...' : 'SAVE_CHANGES'}
                    </Button>
                </Box>


                <Typography variant="h3" sx={{ textAlign: 'center', mb: 8, fontFamily: 'Syncopate', fontWeight: 900, letterSpacing: -2 }}>
                    MANAGEMENT <Box component="span" sx={{ color: '#33ccff' }}>HUB</Box>
                </Typography>

                <Tabs 
                    value={activeTab} 
                    onChange={(e, v) => setActiveTab(v)}
                    centered
                    sx={{
                        mb: 8,
                        '& .MuiTabs-indicator': { bgcolor: '#33ccff', height: 3 },
                        '& .MuiTab-root': { color: '#444', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.8rem', '&.Mui-selected': { color: 'white' } }
                    }}
                >
                    <Tab label="IDENTITY" icon={<User size={18} />} iconPosition="start" />
                    <Tab label="DEPLOYMENTS" icon={<Briefcase size={18} />} iconPosition="start" />
                    <Tab label="STACK" icon={<Terminal size={18} />} iconPosition="start" />
                    <Tab label="TRAJECTORY" icon={<Layers size={18} />} iconPosition="start" />
                    <Tab label="FOUNDATIONS" icon={<GraduationCap size={18} />} iconPosition="start" />
                    <Tab label="CORRESPONDENCE" icon={<Inbox size={18} />} iconPosition="start" />
                </Tabs>

                {activeTab === 0 && <ProfileTab />}
                {activeTab === 1 && <ProjectsTab />}
                {activeTab === 2 && <SkillsTab />}
                {activeTab === 3 && <ExperienceTab />}
                {activeTab === 4 && <EducationTab />}
                {activeTab === 5 && <MessagesTab />}

                <Snackbar 
                    open={!!success} 
                    autoHideDuration={6000} 
                    onClose={() => setSuccess('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity="success" variant="filled" sx={{ width: '100%', bgcolor: '#00ffcc', color: '#000', fontWeight: 900 }}>
                        {success}
                    </Alert>
                </Snackbar>

                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity="error" variant="filled" sx={{ width: '100%', bgcolor: '#ff3366', fontWeight: 900 }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Container>

            <style>
                {`
                    .MuiTextField-root {
                        background: rgba(255,255,255,0.01);
                        border-radius: 8px;
                    }
                    .MuiOutlinedInput-root {
                        color: white;
                        font-family: 'Outfit', sans-serif;
                    }
                    .MuiOutlinedInput-notchedOutline {
                        border-color: rgba(255,255,255,0.1) !important;
                    }
                    .MuiInputLabel-root {
                        color: #444 !important;
                        font-family: 'Syncopate', sans-serif;
                        font-weight: 900;
                        font-size: 0.7rem;
                    }
                    .Mui-focused .MuiOutlinedInput-notchedOutline {
                        border-color: #33ccff !important;
                        border-width: 1px !important;
                    }
                    .Mui-focused.MuiInputLabel-root {
                        color: #33ccff !important;
                    }
                `}
            </style>
        </Box>
    );
};

export default ManagementHub;
