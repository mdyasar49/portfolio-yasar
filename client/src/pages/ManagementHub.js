import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Tab, Tabs, TextField, Button, 
  Stack, Grid, Paper, IconButton, CircularProgress, Alert, 
  Snackbar, Card, CardContent 
} from '@mui/material';

import { 
  Save, ArrowLeft, Trash2, Plus, User, Briefcase, Terminal, Layers, Inbox, 
  GraduationCap, Settings, Shield, Book, Edit3 as EditIcon, X as XIcon 
} from 'lucide-react';


import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import useProfile from '../hooks/useProfile';


const ManagementHub = ({ publicView = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile: initialProfile, loading: initialLoading } = useProfile();

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(parseInt(tab, 10));

        // [SECURE_LINK_ACTION_PROTOCOL]
        const approveId = params.get('approve');
        const rejectId = params.get('reject');

        if (approveId) {
            const executeApprove = async () => {
                try {
                    await api.put(`/proposals/approve/${approveId}`);
                    setSuccess('ARCHITECTURAL_BLUEPRINT_SYNCHRONIZED_SUCCESSFULLY');
                    // Remove param from URL without reload
                    navigate('/admin/management?tab=5', { replace: true });
                } catch (e) { setError('SYNC_FAILURE: LINK_EXPIRED_OR_INVALID'); }
            };
            executeApprove();
        } else if (rejectId) {
            const executeReject = async () => {
                try {
                    await api.put(`/proposals/reject/${rejectId}`);
                    setSuccess('ARCHITECTURAL_PROPOSAL_REJECTED');
                    navigate('/admin/management?tab=5', { replace: true });
                } catch (e) { setError('REJECTION_FAILURE: LINK_EXPIRED_OR_INVALID'); }
            };
            executeReject();
        }
    }, [location, navigate]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [proposalSending, setProposalSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (initialProfile) {
            setProfile(JSON.parse(JSON.stringify(initialProfile))); // Deep clone
        }
    }, [initialProfile]);

    useEffect(() => {
        if (publicView) return; // Skip auth for public view simulation
        
        // Patient Auth Protocol: Allow hydration before redirect
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token || token === 'null') {
                navigate('/admin/login');
            }
        };
        const timer = setTimeout(checkAuth, 600);
        return () => clearTimeout(timer);
    }, [navigate, publicView]);


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

    const handleProposalSubmit = async () => {
        setProposalSending(true);
        try {
            const res = await api.post('/proposals/submit', { suggestedData: profile });
            if (res.data.success) {
                setSuccess('ARCHITECTURAL_PROPOSAL_DISPATCHED. Awaiting administrative approval via secure link.');
                setEditMode(false);
            }
        } catch (err) {
            setError('PROPOSAL_DISPATCH_FAILURE. System handshake timed out.');
        } finally {
            setProposalSending(false);
        }
    };

    if (initialLoading || !profile) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000000' }}>
                <CircularProgress sx={{ color: '#33ccff' }} />
            </Box>
        );
    }

    const ProfileTab = ({ publicView }) => (
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
                            disabled={publicView}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="PROFESSIONAL_TITLE" 
                            variant="outlined" 
                            value={profile.title} 
                            onChange={(e) => setProfile({...profile, title: e.target.value})}
                            disabled={publicView}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth multiline rows={4} label="PROFESSIONAL_SUMMARY" 
                            variant="outlined" 
                            value={profile.summary} 
                            onChange={(e) => setProfile({...profile, summary: e.target.value})}
                            disabled={publicView}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="LOCATION" 
                            variant="outlined" 
                            value={profile.location} 
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            disabled={publicView}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="PRIMARY_EMAIL" 
                            variant="outlined" 
                            value={profile.email} 
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            disabled={publicView}
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
                                disabled={publicView}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Stack>
    );


    const ProjectsTab = ({ publicView }) => (
        <Stack spacing={4}>
            {!publicView && (
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
            )}

            {profile.projects.map((project, idx) => (
                <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#ff3366', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.8rem' }}>DEPLOYMENT_UNIT_{String(idx + 1).padStart(2, '0')}</Typography>
                            {!publicView && (
                                <IconButton color="error" size="small" onClick={() => {
                                    const updated = profile.projects.filter((_, i) => i !== idx);
                                    setProfile({ ...profile, projects: updated });
                                }}>
                                    <Trash2 size={20} />
                                </IconButton>
                             )}
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
                                    disabled={publicView}
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
                                    disabled={publicView}
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
                                    disabled={publicView}
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
                                    disabled={publicView}
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
                                    disabled={publicView}
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
                                    disabled={publicView}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth multiline rows={2} label="KEY_HIGHLIGHTS (COMMA_SEPARATED)" 
                                    value={project.highlights?.join(', ') || ''} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => 
                                            i === idx ? { ...p, highlights: e.target.value.split(',').map(s => s.trim()) } : p
                                        );
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                    disabled={publicView}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth label="METRICS_JSON (e.g. {'Uptime': '99%', 'Latency': '50ms'})" 
                                    value={JSON.stringify(project.stats || {})} 
                                    onChange={(e) => {
                                        try {
                                            const newStats = JSON.parse(e.target.value);
                                            const updatedProjects = profile.projects.map((p, i) => 
                                                i === idx ? { ...p, stats: newStats } : p
                                            );
                                            setProfile({ ...profile, projects: updatedProjects });
                                        } catch (e) {}
                                    }}
                                    sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
                                    disabled={publicView}
                                />
                            </Grid>

                        </Grid>
                    </CardContent>

                </Card>
            ))}
        </Stack>
    );
    const ExperienceTab = ({ publicView }) => (
        <Stack spacing={4}>
            {!publicView && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => {
                        const newExp = { role: 'New Role', company: 'New Company', period: '2024 - Present', description: [''] };
                        setProfile({ ...profile, experience: [newExp, ...profile.experience] });
                    }} sx={{ bgcolor: '#ff3366', color: '#fff', fontWeight: 900 }}>ADD_EXPERIENCE_NODE</Button>
                </Box>
            )}
            {profile.experience.map((exp, idx) => (
                <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography sx={{ color: '#ff3366', fontWeight: 900 }}>TRAJECTORY_NODE_{String(idx + 1).padStart(2, '0')}</Typography>
                            {!publicView && (
                                <IconButton color="error" onClick={() => {
                                    const updated = profile.experience.filter((_, i) => i !== idx);
                                    setProfile({ ...profile, experience: updated });
                                }}><Trash2 size={20} /></IconButton>
                            )}
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}><TextField fullWidth label="ROLE" value={exp.role} onChange={(e) => { 
                                const updatedExp = profile.experience.map((ex, i) => i === idx ? { ...ex, role: e.target.value } : ex);
                                setProfile({ ...profile, experience: updatedExp }); 
                            }} disabled={publicView} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth label="COMPANY" value={exp.company} onChange={(e) => { 
                                const updatedExp = profile.experience.map((ex, i) => i === idx ? { ...ex, company: e.target.value } : ex);
                                setProfile({ ...profile, experience: updatedExp }); 
                            }} disabled={publicView} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth label="PERIOD" value={exp.period} onChange={(e) => { 
                                const updatedExp = profile.experience.map((ex, i) => i === idx ? { ...ex, period: e.target.value } : ex);
                                setProfile({ ...profile, experience: updatedExp }); 
                            }} disabled={publicView} /></Grid>
                            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="KEY_RESPONSIBILITIES" value={exp.description.join('\n')} onChange={(e) => { 
                                const updatedExp = profile.experience.map((ex, i) => i === idx ? { ...ex, description: e.target.value.split('\n') } : ex);
                                setProfile({ ...profile, experience: updatedExp }); 
                            }} disabled={publicView} /></Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );


    const EducationTab = ({ publicView }) => (
        <Stack spacing={4}>
            {!publicView && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => {
                        const newEdu = { degree: 'Degree Name', institution: 'University', year: '2024' };
                        setProfile({ ...profile, education: [newEdu, ...profile.education] });
                    }} sx={{ bgcolor: '#ff9933', color: '#fff', fontWeight: 900 }}>ADD_ACADEMIC_NODE</Button>
                </Box>
            )}
            {profile.education.map((edu, idx) => (
                <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography sx={{ color: '#ff9933', fontWeight: 900 }}>ACADEMIC_NODE_{String(idx + 1).padStart(2, '0')}</Typography>
                            {!publicView && (
                                <IconButton color="error" onClick={() => {
                                    const updated = profile.education.filter((_, i) => i !== idx);
                                    setProfile({ ...profile, education: updated });
                                }}><Trash2 size={20} /></IconButton>
                            )}
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}><TextField fullWidth label="DEGREE" value={edu.degree} onChange={(e) => { 
                                const updatedEdu = profile.education.map((ed, i) => i === idx ? { ...ed, degree: e.target.value } : ed);
                                setProfile({ ...profile, education: updatedEdu }); 
                            }} disabled={publicView} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth label="INSTITUTION" value={edu.institution} onChange={(e) => { 
                                const updatedEdu = profile.education.map((ed, i) => i === idx ? { ...ed, institution: e.target.value } : ed);
                                setProfile({ ...profile, education: updatedEdu }); 
                            }} disabled={publicView} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth label="YEAR" value={edu.year} onChange={(e) => { 
                                const updatedEdu = profile.education.map((ed, i) => i === idx ? { ...ed, year: e.target.value } : ed);
                                setProfile({ ...profile, education: updatedEdu }); 
                            }} disabled={publicView} /></Grid>
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
                    disabled={publicView}
                />
            </Paper>
        </Stack>
    );



    const SkillsTab = ({ publicView }) => (
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
                        disabled={publicView}
                    />
                </Paper>
            ))}
        </Stack>
    );



    const MessagesTab = () => {
        const [items, setItems] = useState([]);
        const [msgLoading, setMsgLoading] = useState(false);

        useEffect(() => {
            const fetchData = async () => {
                setMsgLoading(true);
                try {
                    const [contactsRes, proposalsRes] = await Promise.all([
                        api.get('/contact'),
                        api.get('/proposals')
                    ]);
                    
                    const contacts = (contactsRes.data.data || []).map(c => ({ ...c, type: 'INQUIRY' }));
                    const proposals = (proposalsRes.data.data || []).map(p => ({ 
                        ...p, 
                        type: 'PROPOSAL', 
                        name: 'SYSTEM_USER',
                        email: p.clientIp || '0.0.0.0',
                        subject: `ARCHITECTURAL_BLUEPRINT_v${p._id.toString().slice(-4).toUpperCase()}`,
                        message: `A refinement proposal has been logged for the system core. Status: ${p.status.toUpperCase()}`
                    }));

                    const merged = [...contacts, ...proposals].sort((a, b) => 
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );

                    setItems(merged);
                } catch (e) {
                    console.error('TELEMETRY_FETCH_FAIL');
                } finally {
                    setMsgLoading(false);
                }
            };

            fetchData();
        }, []);

        if (msgLoading) return <CircularProgress sx={{ display: 'block', m: 'auto', color: '#ff3366' }} />;

        return (
            <Stack spacing={4}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button 
                        variant="outlined"
                        size="small"
                        onClick={async () => {
                            if (window.confirm('CRITICAL_ACTION: PERMANENTLY_PURGE_ALL_TELEMETRY?')) {
                                try {
                                    // Primary purge logic for contacts
                                    const contacts = items.filter(i => i.type === 'INQUIRY');
                                    const deletePromises = contacts.map(m => api.delete(`/contact/${m._id || m.createdAt}`));
                                    await Promise.all(deletePromises);
                                    setItems([]);
                                    setSuccess('Telemetry Array Cleared.');
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
                        PURGE_INQUIRIES
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        disabled={items.length === 0}
                        onClick={() => {
                            const headers = ['Date', 'Type', 'Name', 'Email', 'Subject', 'Message'];
                            const rows = items.map(m => [
                                new Date(m.createdAt).toLocaleString(),
                                m.type,
                                `"${m.name.replace(/"/g, '""')}"`,
                                m.email,
                                `"${m.subject.replace(/"/g, '""')}"`,
                                `"${m.message.replace(/"/g, '""')}"`
                            ]);
                            const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.setAttribute('download', `system_telemetry_export_${new Date().toISOString().split('T')[0]}.csv`);
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
                {items.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ color: '#444', fontFamily: 'Syncopate', fontWeight: 900 }}>EMPTY_TELEMETRY_LOG</Typography>
                    </Paper>
                ) : items.map((m, idx) => (
                    <Card key={idx} sx={{ 
                        bgcolor: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderLeft: m.type === 'PROPOSAL' ? '4px solid #ff3366' : '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography sx={{ 
                                        color: m.type === 'PROPOSAL' ? '#ff3366' : '#33ccff', 
                                        fontWeight: 900, fontFamily: 'monospace', fontSize: '0.7rem' 
                                    }}>
                                        [{m.type}]
                                    </Typography>
                                <Typography sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace' }}>
                                    {m.type === 'INQUIRY' ? (
                                        <>
                                            FROM: {m.name} &lt;
                                            <Box 
                                                component="a" 
                                                href={`mailto:${m.email}`} 
                                                sx={{ 
                                                    color: '#00ffcc', 
                                                    textDecoration: 'none',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {m.email}
                                            </Box>
                                            &gt;
                                        </>
                                    ) : `BLUEPRINT_ACTION: ${m.status.toUpperCase()}`}
                                </Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography sx={{ color: '#444', fontSize: '0.7rem' }}>{new Date(m.createdAt).toLocaleString()}</Typography>
                                    {m.type === 'INQUIRY' && (
                                        <IconButton size="small" color="error" onClick={async () => {
                                            try {
                                                await api.delete(`/contact/${m._id || m.createdAt}`);
                                                setItems(items.filter(item => item._id !== m._id));
                                            } catch (e) {
                                                setError('Failed to purge transmission.');
                                            }
                                        }}>
                                            <Trash2 size={16} />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Box>
                            
                            <Typography sx={{ color: '#888', mb: 1.5, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                TARGET_DOMAIN: {m.email}
                            </Typography>

                            <Typography sx={{ color: 'white', fontWeight: 900, mb: 1, fontSize: '1rem' }}>{m.subject}</Typography>
                            <Typography sx={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>{m.message}</Typography>

                            {m.type === 'PROPOSAL' && m.status === 'pending' && (
                                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                    <Button 
                                        size="small" variant="contained" 
                                        onClick={async () => {
                                            try {
                                                await api.put(`/proposals/approve/${m._id}`);
                                                setSuccess('System architecturally synchronized.');
                                                // Refresh logic here or just update local status
                                                setItems(items.map(i => i._id === m._id ? {...i, status: 'approved', message: 'A refinement proposal has been logged for the system core. Status: APPROVED'} : i));
                                            } catch (e) { setError('Sync failure.'); }
                                        }}
                                        sx={{ bgcolor: '#00ffcc', color: '#000', fontWeight: 900, fontSize: '0.6rem' }}
                                    >
                                        APPROVE_NOW
                                    </Button>
                                    <Button 
                                        size="small" variant="outlined" 
                                        onClick={async () => {
                                            try {
                                                await api.put(`/proposals/reject/${m._id}`);
                                                setSuccess('Proposal rejected.');
                                                setItems(items.map(i => i._id === m._id ? {...i, status: 'rejected', message: 'A refinement proposal has been logged for the system core. Status: REJECTED'} : i));
                                            } catch (e) { setError('Rejection failure.'); }
                                        }}
                                        sx={{ color: '#ff3366', borderColor: '#ff3366', fontWeight: 900, fontSize: '0.6rem' }}
                                    >
                                        REJECT
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        );
    };

        const SettingsTab = ({ publicView }) => {
            const [pwData, setPwData] = useState({ current: '', new: '', confirm: '' });
            const [health, setHealth] = useState(null);
            const [stats, setStats] = useState({ count: 0, history: [] });
            const [updating, setUpdating] = useState(false);

    
            const fetchHealth = async () => {
                try {
                    const res = await api.get('/health');
                    setHealth(res.data);
                } catch (e) {}
            };

            const fetchStats = async () => {
                try {
                    const res = await api.get('/visitors');
                    setStats(res.data);
                } catch (e) {}
            };
    
            useEffect(() => {
                fetchHealth();
                fetchStats();
                const interval = setInterval(() => {
                    fetchHealth();
                    fetchStats();
                }, 10000);
                return () => clearInterval(interval);
            }, []);

    
            const handlePasswordChange = async (e) => {
                e.preventDefault();
                if (pwData.new !== pwData.confirm) return setError('Passwords do not match.');
                setUpdating(true);
                try {
                    const res = await api.put('/auth/change-password', {
                        currentPassword: pwData.current,
                        newPassword: pwData.new
                    });
                    if (res.data.success) {
                        setSuccess('Security Credentials Updated Successfully.');
                        setPwData({ current: '', new: '', confirm: '' });
                    }
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to update security credentials.');
                } finally {
                    setUpdating(false);
                }
            };
    
            const toggleMaintenance = async () => {
                setUpdating(true);
                try {
                    const res = await api.put('/health/maintenance', { enabled: !health?.maintenance });
                    if (res.data.success) {
                        fetchHealth();
                        setSuccess(res.data.message);
                    }
                } catch (err) {
                    setError('Failed to toggle system lock.');
                } finally {
                    setUpdating(false);
                }
            };


        return (
            <Stack spacing={4}>
                {/* System Intelligence Dashboard */}
                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#00ffcc', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem', mb: 3 }}>System Telemetry Dashboard</Typography>

                    <Grid container spacing={3}>
                        {[
                            { label: 'DATA_LAYER_PROTOCOL', value: health?.db?.status === 'ONLINE' ? 'CLOUD_SYNC (MONGODB)' : 'PORTABLE_CORE (JSON)', color: '#00ffcc' },
                            { label: 'RUNTIME_UPTIME', value: health?.uptimeSeconds ? `${Math.floor(health.uptimeSeconds / 3600)}h ${Math.floor((health.uptimeSeconds % 3600) / 60)}m` : 'CALCULATING...', color: '#33ccff' },
                            { label: 'MEMORY_UTILIZATION', value: health?.memoryUsage ? `${health.memoryUsage}%` : 'TRACE_PENDING', color: '#ff9933' },
                            { label: 'TOTAL_VISITOR_TRAFFIC', value: stats.count || '0', color: '#a855f7' }
                        ].map((stat, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, display: 'block', mb: 1 }}>{stat.label}</Typography>
                                    <Typography sx={{ color: stat.color, fontWeight: 900, fontFamily: 'monospace', fontSize: '0.85rem' }}>{stat.value}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Analytics Intelligence Exhibit */}
                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#ff3366', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem', mb: 4 }}>Visitor Analytics Exhibit</Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, mb: 3, display: 'block' }}>7_DAY_TRAFFIC_DENSITY</Typography>
                                <Box sx={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 1, px: 2, pb: 2 }}>
                                    {[...Array(7)].map((_, i) => {
                                        const dayData = stats.history?.[stats.history.length - 7 + i];
                                        const count = dayData?.count || 0;
                                        const max = Math.max(...(stats.history?.map(h => h.count) || [1]), 1);
                                        const height = (count / max) * 100;
                                        return (
                                            <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ 
                                                    width: '100%', 
                                                    height: `${Math.max(height, 5)}%`, 
                                                    bgcolor: i === 6 ? '#ff3366' : 'rgba(255, 51, 102, 0.2)',
                                                    borderRadius: '4px 4px 0 0',
                                                    transition: 'height 0.5s ease'
                                                }} />
                                                <Typography sx={{ fontSize: '0.5rem', color: '#444', fontFamily: 'monospace' }}>
                                                    {dayData?.date?.split('-')[2] || '--'}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={2}>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, mb: 1, display: 'block' }}>DEVICE_DISTRIBUTION</Typography>
                                    <Stack spacing={1}>
                                        {['DESKTOP (85%)', 'MOBILE (12%)', 'SYSTEM_BOT (3%)'].map((d, i) => (
                                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === 0 ? '#33ccff' : '#444' }} />
                                                <Typography sx={{ fontSize: '0.65rem', color: i === 0 ? 'white' : '#444', fontFamily: 'monospace' }}>{d}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, mb: 1, display: 'block' }}>GEOGRAPHIC_ORIGIN</Typography>
                                    <Typography sx={{ fontSize: '0.65rem', color: 'white', fontFamily: 'monospace' }}>PRIMARY: IN_REGION (LOCAL)</Typography>
                                    <Typography sx={{ fontSize: '0.65rem', color: '#444', fontFamily: 'monospace' }}>SECONDARY: GLOBAL_TRACE_PENDING</Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>


                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: '#ff3366', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem', mb: 1 }}>System Access Protocol</Typography>
                            <Typography sx={{ color: '#444', fontSize: '0.8rem' }}>Control the public accessibility of your portfolio during architectural updates.</Typography>
                        </Box>
                        <Button 
                            variant="outlined" 
                            onClick={toggleMaintenance}
                            disabled={updating || !health || publicView}
                            color={health?.maintenance ? "error" : "success"}
                            sx={{ fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.65rem' }}
                        >
                            {health?.maintenance ? 'Deactivate System Lock' : 'Activate System Lock'}
                        </Button>
                    </Box>
                </Paper>

                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#33ccff', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem' }}>Security Credentials</Typography>
                    <Box component="form" onSubmit={handlePasswordChange}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth type="password" label="CURRENT_ACCESS_KEY" 
                                    value={pwData.current} onChange={(e) => setPwData({...pwData, current: e.target.value})}
                                    required
                                    disabled={publicView}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth type="password" label="NEW_ACCESS_KEY" 
                                    value={pwData.new} onChange={(e) => setPwData({...pwData, new: e.target.value})}
                                    required
                                    disabled={publicView}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth type="password" label="CONFIRM_NEW_ACCESS_KEY" 
                                    value={pwData.confirm} onChange={(e) => setPwData({...pwData, confirm: e.target.value})}
                                    required
                                    disabled={publicView}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    type="submit" variant="contained" 
                                    disabled={updating || publicView}
                                    startIcon={<Shield size={16} />}
                                    sx={{ bgcolor: '#33ccff', color: '#000', fontWeight: 900, fontFamily: 'Syncopate', fontSize: '0.7rem' }}
                                >
                                    UPDATE_CREDENTIALS
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

            </Stack>
        );
    };

    const DocsTab = ({ publicView }) => {
        return (
            <Stack spacing={4}>
                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#00ffcc', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem' }}>SYSTEM_OVERVIEW_MARKDOWN</Typography>
                    <TextField 
                        fullWidth multiline rows={15}
                        placeholder="# Enter System README Markdown..."
                        value={profile.readme || ''}
                        onChange={(e) => setProfile({...profile, readme: e.target.value})}
                        sx={{ '& .MuiInputBase-input': { color: '#cbd5e1', fontFamily: 'monospace', fontSize: '0.85rem' } }}
                        disabled={publicView}
                    />
                </Paper>

                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#ff3366', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem' }}>CORE_ARCHITECTURE_MARKDOWN</Typography>
                    <TextField 
                        fullWidth multiline rows={15}
                        placeholder="# Enter Architecture Deep-Dive Markdown..."
                        value={profile.projectExplanation || ''}
                        onChange={(e) => setProfile({...profile, projectExplanation: e.target.value})}
                        sx={{ '& .MuiInputBase-input': { color: '#cbd5e1', fontFamily: 'monospace', fontSize: '0.85rem' } }}
                        disabled={publicView}
                    />
                </Paper>
            </Stack>
        );
    };



    return (
        <Box sx={{ py: 4, pb: 10, bgcolor: publicView ? 'transparent' : '#000000', color: 'white' }}>
            <Container maxWidth={publicView ? "xl" : "lg"}>
                {!publicView && (
                    <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>

                    {!publicView && (
                        <Button 
                            startIcon={<ArrowLeft size={18} />} 
                            onClick={() => navigate('/admin/dashboard')}
                            sx={{ color: '#444', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.7rem', '&:hover': { color: '#33ccff' } }}
                        >
                            RETURN_TO_CONTROL
                        </Button>
                    )}


                        {!publicView && (
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
                                {loading ? 'SYNCING...' : 'Update System Architecture'}

                            </Button>
                        )}
                        {publicView && (
                            <Box sx={{ 
                                px: 3, py: 1, borderRadius: 1, border: '1px solid #ff3366', 
                                bgcolor: 'rgba(255, 51, 102, 0.05)', display: 'flex', alignItems: 'center', gap: 2
                            }}>
                                <Shield size={16} color="#ff3366" />
                                <Typography sx={{ color: '#ff3366', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.65rem', letterSpacing: 2 }}>
                                    System Simulation Mode Active (Read Only)
                                </Typography>

                            </Box>
                        )}
                    </Box>
                )}




                <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, fontFamily: 'Syncopate', fontWeight: 900, letterSpacing: -2 }}>
                    MANAGEMENT <Box component="span" sx={{ color: '#33ccff' }}>HUB</Box>
                </Typography>
                
                {publicView && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8, gap: 2 }}>
                        <Typography variant="overline" sx={{ color: '#444', letterSpacing: 2 }}>
                            SYSTEM_TERMINAL_BLUEPRINT
                        </Typography>
                        <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => setEditMode(!editMode)}
                            startIcon={editMode ? <XIcon size={14} /> : <EditIcon size={14} />}

                            sx={{ 
                                color: editMode ? '#ff3366' : '#00ffcc', 
                                borderColor: editMode ? 'rgba(255, 51, 102, 0.3)' : 'rgba(0, 255, 204, 0.3)',
                                fontSize: '0.6rem',
                                fontFamily: 'Syncopate',
                                fontWeight: 900,
                                '&:hover': { borderColor: editMode ? '#ff3366' : '#00ffcc', bgcolor: 'transparent' }
                            }}
                        >
                            {editMode ? 'Cancel Refinement' : 'Draft Refinement'}
                        </Button>

                        {editMode && (
                            <Button 
                                variant="contained" 
                                size="small"
                                onClick={handleProposalSubmit}
                                disabled={proposalSending}
                                sx={{ 
                                    bgcolor: '#00ffcc', 
                                    color: '#000',
                                    fontSize: '0.6rem',
                                    fontFamily: 'Syncopate',
                                    fontWeight: 900,
                                    '&:hover': { bgcolor: '#00ccaa' }
                                }}
                            >
                                {proposalSending ? 'DISPATCHING...' : 'Submit for Approval'}

                            </Button>
                        )}
                    </Box>
                )}



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
                    <Tab label="Profile Intelligence" icon={<User size={18} />} iconPosition="start" />
                    <Tab label="Bespoke Projects" icon={<Briefcase size={18} />} iconPosition="start" />
                    <Tab label="Technical Arsenal" icon={<Terminal size={18} />} iconPosition="start" />
                    <Tab label="Career Trajectory" icon={<Layers size={18} />} iconPosition="start" />
                    <Tab label="Education Timeline" icon={<GraduationCap size={18} />} iconPosition="start" />
                    {!publicView && <Tab label="Inquiry Center" icon={<Inbox size={18} />} iconPosition="start" />}
                    <Tab label="System Documentation" icon={<Book size={18} />} iconPosition="start" />
                    {!publicView && <Tab label="Operational Security" icon={<Settings size={18} />} iconPosition="start" />}
                </Tabs>



                {(() => {
                    const viewOnlyActive = publicView && !editMode;
                    const tabs = [
                        { id: 0, component: <ProfileTab publicView={viewOnlyActive} /> },
                        { id: 1, component: <ProjectsTab publicView={viewOnlyActive} /> },
                        { id: 2, component: <ExperienceTab publicView={viewOnlyActive} /> },
                        { id: 3, component: <EducationTab publicView={viewOnlyActive} /> },
                        { id: 4, component: <SkillsTab publicView={viewOnlyActive} /> },
                        { id: 5, component: <MessagesTab publicView={viewOnlyActive} />, hidden: publicView },
                        { id: 6, component: <DocsTab publicView={viewOnlyActive} /> },
                        { id: 7, component: <SettingsTab publicView={viewOnlyActive} />, hidden: publicView }
                    ].filter(tab => !tab.hidden);

                    return tabs[activeTab]?.component;
                })()}


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
