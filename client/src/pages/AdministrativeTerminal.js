/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This is the "Master Control" terminal for the entire portfolio system. 
 * It provides a secure administrative interface to modify profile data, 
 * manage projects, view inquiry telemetry, and control system-wide security settings.
 * It supports a "Public View" (read-only) simulation and a "Master View" (authenticated).
 */

import React, { useState, useEffect } from 'react';
// Material UI components for the administrative dashboard layout
import { 
  Box, Container, Typography, Tab, Tabs, TextField, Button, 
  Stack, Grid, Paper, IconButton, CircularProgress, Alert, 
  Snackbar, Card, CardContent 
} from '@mui/material';

// Icons for various administrative actions and modules
import { 
  Save, ArrowLeft, Trash2, Plus, User, Briefcase, Terminal, Layers, Inbox, 
  GraduationCap, Settings, Shield, Book, Edit3 as EditIcon, X as XIcon 
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
// API services for interacting with the backend administrative endpoints
import { 
  fetchPendingModifications, authorizeArchitecturalChange, dismissArchitecturalChange, 
  fetchTransmissionLogs, purgeTransmissionRecord, probeSystemIntegrity, 
  synchronizeArchitecture, modifyMaintenanceLock, rotateSecurityCredentials,
  fetchSystemAnalytics, dispatchArchitecturalProposal
} from '../services/api';
// Custom hook to fetch the current profile data
import useProfile from '../hooks/useProfile';


const AdministrativeTerminal = ({ publicView = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile: initialProfile, loading: initialLoading } = useProfile();

    // State for tracking the active tab in the management hub
    const [activeTab, setActiveTab] = useState(0);

    /**
     * [URL Parameter Protocol]
     * Synchronizes the UI state with URL parameters (tab selection and secure link actions).
     */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(parseInt(tab, 10));

        // [SECURE_LINK_ACTION_PROTOCOL]
        // Handles approval/rejection actions triggered via secure email links
        const approveId = params.get('approve');
        const rejectId = params.get('reject');

        if (approveId) {
            const executeApprove = async () => {
                try {
                    await authorizeArchitecturalChange(approveId);
                    setSuccess('ARCHITECTURAL_BLUEPRINT_SYNCHRONIZED_SUCCESSFULLY');
                    // Clean up URL parameters after action
                    navigate('/admin/management?tab=5', { replace: true });
                } catch (e) { setError('SYNC_FAILURE: LINK_EXPIRED_OR_INVALID'); }
            };
            executeApprove();
        } else if (rejectId) {
            const executeReject = async () => {
                try {
                    await dismissArchitecturalChange(rejectId);
                    setSuccess('ARCHITECTURAL_PROPOSAL_REJECTED');
                    navigate('/admin/management?tab=5', { replace: true });
                } catch (e) { setError('REJECTION_FAILURE: LINK_EXPIRED_OR_INVALID'); }
            };
            executeReject();
        }
    }, [location, navigate]);

    // Internal state for profile data (cloned to allow local editing)
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [proposalSending, setProposalSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    /**
     * [Profile Hydration]
     * Clones the fetched profile into local state for editing.
     */
    useEffect(() => {
        if (initialProfile) {
            setProfile(JSON.parse(JSON.stringify(initialProfile))); 
        }
    }, [initialProfile]);

    /**
     * [Security Protocol]
     * Enforces authentication for the Master View. Redirects to login if token is missing.
     */
    useEffect(() => {
        if (publicView) return; 
        
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token || token === 'null') {
                navigate('/admin/login');
            }
        };
        // Small delay to allow session hydration
        const timer = setTimeout(checkAuth, 600);
        return () => clearTimeout(timer);
    }, [navigate, publicView]);


    /**
     * [handleSave]
     * Synchronizes the modified architecture back to the cloud database.
     * (Master Admin Only)
     */
    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'null') {
            navigate('/admin/login');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await synchronizeArchitecture(profile);
            if (res.success) {
                setSuccess('Portfolio architecture updated successfully!');
            }
        } catch (err) {
            if (err.response?.status === 401) navigate('/admin/login');
            setError(err.response?.data?.message || 'Failed to sync data to the cloud.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * [handleProposalSubmit]
     * Submits a refinement proposal instead of direct modification.
     * (Public Simulation Mode)
     */
    const handleProposalSubmit = async () => {
        setProposalSending(true);
        try {
            const res = await dispatchArchitecturalProposal(profile);
            if (res.success) {
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

    /**
     * ── [TAB_MODULES] ──
     * Sub-components representing individual administrative sectors.
     */

    // 1. Profile Intelligence Module (Identity & Contacts)
    const ProfileTab = ({ publicView }) => (
        <Stack spacing={4}>
            <Paper sx={{ p: { xs: 2.5, md: 4 }, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ color: '#33ccff', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem' }}>IDENTITY_CORE</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="FULL_NAME" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} disabled={publicView} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="PROFESSIONAL_TITLE" value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} disabled={publicView} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline rows={4} label="PROFESSIONAL_SUMMARY" value={profile.summary} onChange={(e) => setProfile({...profile, summary: e.target.value})} disabled={publicView} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="LOCATION" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} disabled={publicView} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="PRIMARY_EMAIL" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} disabled={publicView} />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: { xs: 2.5, md: 4 }, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ color: '#33ccff', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem' }}>SOCIAL_DISPATCH_HANDLES</Typography>
                <Grid container spacing={3}>
                    {Object.keys(profile.socials || {}).map((key) => (
                        <Grid item xs={12} md={6} key={key}>
                            <TextField fullWidth label={key.toUpperCase()} value={profile.socials[key]} 
                                onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, [key]: e.target.value } })}
                                disabled={publicView}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Stack>
    );

    // 2. Bespoke Projects Module (Deployment Units)
    const ProjectsTab = ({ publicView }) => (
        <Stack spacing={4}>
            {!publicView && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" startIcon={<Plus size={18} />}
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

            {publicView && (
                <Box sx={{ mb: 6, p: 3, border: '1px solid rgba(51, 204, 255, 0.2)', bgcolor: 'rgba(51, 204, 255, 0.05)', borderRadius: 2 }}>
                   <Typography variant="caption" sx={{ color: '#33ccff', fontWeight: 900, fontFamily: 'Syncopate' }}>
                      [ SYSTEM_ADVISORY ]: You are viewing the live deployment architecture. Refining projects here will submit a "Refinement Proposal" to the system administrator.
                   </Typography>
                </Box>
            )}

            {(profile.projects || []).map((project, idx) => (
                <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#ff3366', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.8rem' }}>DEPLOYMENT_UNIT_{String(idx + 1).padStart(2, '0')}</Typography>
                            {!publicView && (
                                <IconButton color="error" size="small" onClick={() => {
                                    const updated = profile.projects.filter((_, i) => i !== idx);
                                    setProfile({ ...profile, projects: updated });
                                }}><Trash2 size={20} /></IconButton>
                             )}
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="PROJECT_NAME" value={project.name} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => i === idx ? { ...p, name: e.target.value } : p);
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                    disabled={publicView}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="IMAGE_URL" value={project.image} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => i === idx ? { ...p, image: e.target.value } : p);
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                    disabled={publicView}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={3} label="DESCRIPTION_LINE_1" value={project.description[0]} 
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
                                <TextField fullWidth label="LIVE_URL" value={project.link} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => i === idx ? { ...p, link: e.target.value } : p);
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                    disabled={publicView}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="GITHUB_URL" value={project.github} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => i === idx ? { ...p, github: e.target.value } : p);
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                    disabled={publicView}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="TECHNOLOGIES (COMMA_SEPARATED)" value={project.technologies.join(', ')} 
                                    onChange={(e) => {
                                        const updatedProjects = profile.projects.map((p, i) => i === idx ? { ...p, technologies: e.target.value.split(',').map(s => s.trim()) } : p);
                                        setProfile({ ...profile, projects: updatedProjects });
                                    }}
                                    disabled={publicView}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="METRICS_JSON" value={JSON.stringify(project.stats || {})} 
                                    onChange={(e) => {
                                        try {
                                            const newStats = JSON.parse(e.target.value);
                                            const updatedProjects = profile.projects.map((p, i) => i === idx ? { ...p, stats: newStats } : p);
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

    // 3. Career Trajectory Module (Work Experience Nodes)
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
            {(profile.experience || []).map((exp, idx) => (
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

    // 4. Education Timeline Module (Academic Achievements)
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
            {(profile.education || []).map((edu, idx) => (
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
        </Stack>
    );

    // 5. Technical Arsenal Module (Skills & Tools)
    const SkillsTab = ({ publicView }) => (
        <Stack spacing={4}>
            {Object.keys(profile.technicalSkills || {}).map((category) => (
                <Paper key={category} sx={{ p: { xs: 2.5, md: 4 }, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#33ccff', mb: 3, fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.8rem' }}>{category.toUpperCase()}_STACK</Typography>
                    <TextField fullWidth multiline rows={2} label="SKILLS (COMMA_SEPARATED)" value={profile.technicalSkills[category].join(', ')}
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

    // 6. Inquiry Center Module (Messages & Proposals Analytics)
    const MessagesTab = () => {
        const [telemetryEntries, setTelemetryEntries] = useState([]);
        const [msgLoading, setMsgLoading] = useState(false);

        // Fetch both direct messages and architectural refinement proposals
        useEffect(() => {
            const initializeTelemetrySync = async () => {
                setMsgLoading(true);
                try {
                    const [inboundInquiryPayload, architecturalProposalPayload] = await Promise.all([
                        fetchTransmissionLogs(),
                        fetchPendingModifications()
                    ]);
                    
                    const inquiries = (inboundInquiryPayload.data || []).map(c => ({ ...c, type: 'INQUIRY' }));
                    const proposals = (architecturalProposalPayload.data || []).map(p => ({ 
                        ...p, type: 'PROPOSAL', name: 'SYSTEM_USER', email: p.clientIp || '0.0.0.0',
                        subject: `ARCHITECTURAL_BLUEPRINT_v${p._id.toString().slice(-4).toUpperCase()}`,
                        message: `A refinement proposal has been logged for the system core. Status: ${p.status.toUpperCase()}`
                    }));

                    const synchronizedTransmissionArray = [...inquiries, ...proposals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setTelemetryEntries(synchronizedTransmissionArray);
                } catch (e) { console.error('TELEMETRY_FETCH_FAIL'); }
                finally { setMsgLoading(false); }
            };
            initializeTelemetrySync();
        }, []);

        if (msgLoading) return <CircularProgress sx={{ display: 'block', m: 'auto', color: '#ff3366' }} />;

        return (
            <Stack spacing={4}>
                {/* Purge and Export controls */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="outlined" size="small" onClick={async () => {
                        if (window.confirm('CRITICAL_ACTION: PERMANENTLY_PURGE_ALL_TELEMETRY?')) {
                            try {
                                const inquiriesToPurge = telemetryEntries.filter(i => i.type === 'INQUIRY');
                                await Promise.all(inquiriesToPurge.map(entry => purgeTransmissionRecord(entry._id || entry.createdAt)));
                                setTelemetryEntries([]); setSuccess('Telemetry Array Cleared.');
                            } catch (e) { setError('Failed to execute bulk purge.'); }
                        }
                    }} sx={{ color: '#ff3366', borderColor: 'rgba(255, 51, 102, 0.3)', fontWeight: 900, fontSize: '0.65rem', mr: 2 }}>PURGE_INQUIRIES</Button>
                    
                    <Button variant="outlined" size="small" disabled={telemetryEntries.length === 0} onClick={() => {
                        // Export telemetry to CSV
                        const telemetryHeaders = ['Date', 'Type', 'Name', 'Email', 'Subject', 'Message'];
                        const csvContent = [telemetryHeaders.join(','), ...telemetryEntries.map(e => [new Date(e.createdAt).toLocaleString(), e.type, `"${e.name}"`, e.email, `"${e.subject}"`, `"${e.message}"`].join(','))].join('\n');
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob); link.setAttribute('download', `system_telemetry_export_${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link); link.click(); document.body.removeChild(link);
                    }} sx={{ color: '#00ffcc', borderColor: 'rgba(0, 255, 204, 0.3)', fontWeight: 900, fontSize: '0.65rem' }}>DOWNLOAD_LOGS (.CSV)</Button>
                </Box>
                
                {/* List of telemetry entries (Messages and Proposals) */}
                {telemetryEntries.map((manifest, idx) => (
                    <Card key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderLeft: manifest.type === 'PROPOSAL' ? '4px solid #ff3366' : '1px solid rgba(255,255,255,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography sx={{ color: manifest.type === 'PROPOSAL' ? '#ff3366' : '#33ccff', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.7rem' }}>[{manifest.type}] {manifest.name}</Typography>
                                <Typography sx={{ color: '#444', fontSize: '0.7rem' }}>{new Date(manifest.createdAt).toLocaleString()}</Typography>
                            </Box>
                            <Typography sx={{ color: 'white', fontWeight: 900, mb: 1 }}>{manifest.subject}</Typography>
                            <Typography sx={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{manifest.message}</Typography>
                            
                            {/* Actions for pending proposals */}
                            {manifest.type === 'PROPOSAL' && manifest.status === 'pending' && (
                                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                    <Button size="small" variant="contained" onClick={async () => {
                                        try { await authorizeArchitecturalChange(manifest._id); setSuccess('System synchronized.'); setTelemetryEntries(telemetryEntries.map(e => e._id === manifest._id ? {...e, status: 'approved'} : e)); } 
                                        catch (e) { setError('Sync failure.'); }
                                    }} sx={{ bgcolor: '#00ffcc', color: '#000', fontWeight: 900, fontSize: '0.6rem' }}>APPROVE_NOW</Button>
                                    <Button size="small" variant="outlined" onClick={async () => {
                                        try { await dismissArchitecturalChange(manifest._id); setSuccess('Proposal rejected.'); setTelemetryEntries(telemetryEntries.map(e => e._id === manifest._id ? {...e, status: 'rejected'} : e)); }
                                        catch (e) { setError('Rejection failure.'); }
                                    }} sx={{ color: '#ff3366', borderColor: '#ff3366', fontWeight: 900, fontSize: '0.6rem' }}>REJECT</Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        );
    };

    // 7. System Operational Security Module (Password & Locks)
    const SettingsTab = ({ publicView }) => {
        const [pwData, setPwData] = useState({ current: '', new: '', confirm: '' });
        const [health, setHealth] = useState(null);
        const [stats, setStats] = useState({ count: 0, history: [] });
        const [updating, setUpdating] = useState(false);

        const fetchData = async () => {
            try {
                const [h, s] = await Promise.all([probeSystemIntegrity(), fetchSystemAnalytics()]);
                setHealth(h); setStats(s);
            } catch (e) {}
        };

        useEffect(() => {
            fetchData();
            const interval = setInterval(fetchData, 10000);
            return () => clearInterval(interval);
        }, []);

        const handlePasswordChange = async (e) => {
            e.preventDefault();
            if (pwData.new !== pwData.confirm) return setError('Passwords do not match.');
            setUpdating(true);
            try {
                const res = await rotateSecurityCredentials({ currentPassword: pwData.current, newPassword: pwData.new });
                if (res.success) { setSuccess('Security Credentials Updated.'); setPwData({ current: '', new: '', confirm: '' }); }
            } catch (err) { setError(err.response?.data?.message || 'Failed to update credentials.'); }
            finally { setUpdating(false); }
        };

        const toggleMaintenance = async () => {
            setUpdating(true);
            try {
                const res = await modifyMaintenanceLock({ enabled: !health?.maintenance });
                if (res.success) { fetchData(); setSuccess(res.message); }
            } catch (err) { setError('Failed to toggle lock.'); }
            finally { setUpdating(false); }
        };

        return (
            <Stack spacing={4}>
                {/* Real-time System Dashboard */}
                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#00ffcc', fontFamily: 'Syncopate', fontWeight: 900, fontSize: '0.9rem', mb: 3 }}>System Telemetry Dashboard</Typography>
                    <Grid container spacing={3}>
                        {[
                            { label: 'DATA_LAYER', value: health?.db?.status === 'ONLINE' ? 'MONGODB' : 'LOCAL_JSON', color: '#00ffcc' },
                            { label: 'RUNTIME_UPTIME', value: `${Math.floor(health?.uptimeSeconds / 3600 || 0)}h ${Math.floor((health?.uptimeSeconds % 3600) / 60 || 0)}m`, color: '#33ccff' },
                            { label: 'TRAFFIC_TOTAL', value: stats.count || '0', color: '#a855f7' }
                        ].map((stat, i) => (
                            <Grid item xs={12} sm={4} key={i}>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#444', fontWeight: 900, display: 'block' }}>{stat.label}</Typography>
                                    <Typography sx={{ color: stat.color, fontWeight: 900, fontFamily: 'monospace' }}>{stat.value}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Maintenance & Public Access Control */}
                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 900 }}>Maintenance Protocol</Typography>
                        <Button variant="outlined" onClick={toggleMaintenance} disabled={updating || publicView} color={health?.maintenance ? "error" : "success"}>
                            {health?.maintenance ? 'Deactivate System Lock' : 'Activate System Lock'}
                        </Button>
                    </Box>
                </Paper>

                {/* Master Access Key Rotation */}
                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ color: '#33ccff', mb: 3 }}>Security Credentials</Typography>
                    <Box component="form" onSubmit={handlePasswordChange}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}><TextField fullWidth type="password" label="CURRENT_ACCESS_KEY" value={pwData.current} onChange={(e) => setPwData({...pwData, current: e.target.value})} required disabled={publicView} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth type="password" label="NEW_ACCESS_KEY" value={pwData.new} onChange={(e) => setPwData({...pwData, new: e.target.value})} required disabled={publicView} /></Grid>
                            <Grid item xs={12} md={6}><TextField fullWidth type="password" label="CONFIRM_NEW_ACCESS_KEY" value={pwData.confirm} onChange={(e) => setPwData({...pwData, confirm: e.target.value})} required disabled={publicView} /></Grid>
                            <Grid item xs={12}><Button type="submit" variant="contained" disabled={updating || publicView} sx={{ bgcolor: '#33ccff', color: '#000', fontWeight: 900 }}>UPDATE_CREDENTIALS</Button></Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Stack>
        );
    };

    // 8. Architecture Documentation Module (Deep-Dive & README)
    const DocsTab = ({ publicView }) => (
        <Stack spacing={4}>
            <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ color: '#00ffcc', mb: 3 }}>SYSTEM_README (MARKDOWN)</Typography>
                <TextField fullWidth multiline rows={15} value={profile.readme || ''} onChange={(e) => setProfile({...profile, readme: e.target.value})} sx={{ '& .MuiInputBase-input': { color: '#cbd5e1', fontFamily: 'monospace' } }} disabled={publicView} />
            </Paper>
            <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ color: '#ff3366', mb: 3 }}>CORE_ARCHITECTURE (MARKDOWN)</Typography>
                <TextField fullWidth multiline rows={15} value={profile.projectExplanation || ''} onChange={(e) => setProfile({...profile, projectExplanation: e.target.value})} sx={{ '& .MuiInputBase-input': { color: '#cbd5e1', fontFamily: 'monospace' } }} disabled={publicView} />
            </Paper>
        </Stack>
    );

    /**
     * ── [MAIN TERMINAL RENDER] ──
     */
    return (
        <Box sx={{ py: 4, pb: 10, bgcolor: publicView ? 'transparent' : '#000000', color: 'white' }}>
            <Container maxWidth={publicView ? "xl" : "lg"}>
                {/* Header Actions */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {!publicView && <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/admin/dashboard')} sx={{ color: '#444', fontWeight: 900 }}>RETURN_TO_CONTROL</Button>}
                    {!publicView && <Button variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />} onClick={handleSave} disabled={loading} sx={{ bgcolor: '#33ccff', color: '#000', fontWeight: 900 }}>UPDATE_SYSTEM</Button>}
                    {publicView && <Box sx={{ px: 3, py: 1, borderRadius: 1, border: '1px solid #ff3366', bgcolor: 'rgba(255, 51, 102, 0.05)', display: 'flex', alignItems: 'center', gap: 2 }}><Shield size={16} color="#ff3366" /><Typography sx={{ color: '#ff3366', fontWeight: 900, fontSize: '0.65rem' }}>SIMULATION_MODE (READ_ONLY)</Typography></Box>}
                </Box>

                <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, fontFamily: 'Syncopate', fontWeight: 900, fontSize: { xs: '1.5rem', md: '3rem' } }}>MANAGEMENT <Box component="span" sx={{ color: '#33ccff' }}>HUB</Box></Typography>
                
                {/* Public View: Refinement Proposal Controls */}
                {publicView && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 1.5 }}>
                        <Button variant="outlined" size="small" onClick={() => setEditMode(!editMode)} startIcon={editMode ? <XIcon size={14} /> : <EditIcon size={14} />} sx={{ color: editMode ? '#ff3366' : '#00ffcc', borderColor: editMode ? 'rgba(255, 51, 102, 0.3)' : 'rgba(0, 255, 204, 0.3)', fontWeight: 900 }}>{editMode ? 'Cancel Refinement' : 'Draft Refinement'}</Button>
                        {editMode && <Button variant="contained" size="small" onClick={handleProposalSubmit} disabled={proposalSending} sx={{ bgcolor: '#00ffcc', color: '#000', fontWeight: 900 }}>{proposalSending ? 'DISPATCHING...' : 'Submit for Approval'}</Button>}
                    </Box>
                )}

                {/* Module Selection Tabs */}
                <Tabs value={activeTab} onChange={(e, v) => { setActiveTab(v); const p = new URLSearchParams(location.search); p.set('tab', v); navigate({ search: p.toString() }, { replace: true }); }} variant="scrollable" scrollButtons="auto" sx={{ mb: 8, '& .MuiTabs-indicator': { bgcolor: '#33ccff' }, '& .MuiTab-root': { color: '#444', fontWeight: 900, fontSize: '0.8rem', '&.Mui-selected': { color: 'white' } } }}>
                    <Tab label="Profile" icon={<User size={18} />} iconPosition="start" />
                    <Tab label="Projects" icon={<Briefcase size={18} />} iconPosition="start" />
                    <Tab label="Experience" icon={<Layers size={18} />} iconPosition="start" />
                    <Tab label="Education" icon={<GraduationCap size={18} />} iconPosition="start" />
                    <Tab label="Skills" icon={<Terminal size={18} />} iconPosition="start" />
                    {!publicView && <Tab label="Inquiries" icon={<Inbox size={18} />} iconPosition="start" />}
                    <Tab label="Docs" icon={<Book size={18} />} iconPosition="start" />
                    {!publicView && <Tab label="Security" icon={<Settings size={18} />} iconPosition="start" />}
                </Tabs>

                {/* Render active module component */}
                {(() => {
                    const viewOnlyActive = publicView && !editMode;
                    const tabs = [
                        { id: 0, component: <ProfileTab publicView={viewOnlyActive} /> },
                        { id: 1, component: <ProjectsTab publicView={viewOnlyActive} /> },
                        { id: 2, component: <ExperienceTab publicView={viewOnlyActive} /> },
                        { id: 3, component: <EducationTab publicView={viewOnlyActive} /> },
                        { id: 4, component: <SkillsTab publicView={viewOnlyActive} /> },
                        { id: 5, component: <MessagesTab />, hidden: publicView },
                        { id: 6, component: <DocsTab publicView={viewOnlyActive} /> },
                        { id: 7, component: <SettingsTab publicView={viewOnlyActive} />, hidden: publicView }
                    ].filter(tab => !tab.hidden);
                    return tabs[activeTab]?.component;
                })()}

                {/* Notification Feed */}
                <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity="success" variant="filled" sx={{ width: '100%', bgcolor: '#00ffcc', color: '#000', fontWeight: 900 }}>{success}</Alert></Snackbar>
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity="error" variant="filled" sx={{ width: '100%', bgcolor: '#ff3366', fontWeight: 900 }}>{error}</Alert></Snackbar>
            </Container>

            <style>{`
                .MuiTextField-root { background: rgba(255,255,255,0.01); border-radius: 8px; }
                .MuiOutlinedInput-root { color: white; font-family: 'Outfit', sans-serif; }
                .MuiOutlinedInput-notchedOutline { border-color: rgba(255,255,255,0.1) !important; }
                .MuiInputLabel-root { color: #444 !important; font-family: 'Syncopate', sans-serif; font-weight: 900; font-size: 0.7rem; }
                .Mui-focused .MuiOutlinedInput-notchedOutline { border-color: #33ccff !important; border-width: 1px !important; }
                .Mui-focused.MuiInputLabel-root { color: #33ccff !important; }
            `}</style>
        </Box>
    );
};

export default AdministrativeTerminal;
