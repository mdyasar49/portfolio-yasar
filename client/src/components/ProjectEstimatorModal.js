/**
 * Interactive Project Scope & Requirements Planner Modal.
 * Enables prospective clients to configure project needs and request a tailored quote directly without fixed prices.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Stack,
  Divider,
  TextField,
} from '@mui/material';
import { X, Layers, Send, CheckCircle2, MessageCircle, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PROJECT_TYPES = [
  { id: 'mern_saas', label: 'Full-Stack MERN / React Web App', timeline: '1 - 3 Weeks', desc: 'Custom SaaS products, admin portals, and modern responsive web apps.' },
  { id: 'ai_voice', label: 'Real-Time AI Voice & Telephony Suite', timeline: '1 - 2 Weeks', desc: 'Gemini Live Voice AI, Twilio web dialer, and automated CRM webhooks.' },
  { id: 'web_scraper', label: 'Python Automation & Lead Scraper', timeline: '3 - 7 Days', desc: 'High-volume proxy scraping, deduplication, and Google Sheets/DB sync.' },
  { id: 'backend_api', label: 'REST / GraphQL API & Database Backend', timeline: '1 - 2 Weeks', desc: 'Node.js or Django APIs, SQLite WAL/MySQL tuning, and token security.' },
  { id: 'speed_audit', label: 'Speed (Lighthouse 95+) & Security Audit', timeline: '3 - 5 Days', desc: 'Core Web Vitals optimization, SonarQube audit, and memory leak fixes.' },
];

const ADDON_FEATURES = [
  { id: 'auth_jwt', label: 'Role-Based Auth & User Dashboard', desc: 'Secure JWT authentication with granular permission levels.' },
  { id: 'payments', label: 'Payment Gateway Integration', desc: 'Stripe, PayPal, or Razorpay automated checkout flows.' },
  { id: 'crm_sync', label: 'CRM & Webhook Sync (Zoho/HubSpot)', desc: 'Instant two-way synchronization into sales pipelines.' },
  { id: 'telegram_bot', label: 'Telegram / WhatsApp Instant Alerts', desc: 'Real-time push notifications for critical system events.' },
  { id: 'admin_dashboard', label: 'Analytics & Reporting Charts', desc: 'Custom KPI metrics visualization and data exports.' },
  { id: 'priority_speed', label: 'Expedited Express Delivery', desc: 'Priority milestone turnaround for urgent project deadlines.' },
];

const ProjectEstimatorModal = ({ open, onClose, defaultProjectType = 'mern_saas' }) => {
  const [selectedType, setSelectedType] = useState(defaultProjectType);
  const [selectedAddons, setSelectedAddons] = useState(['auth_jwt', 'crm_sync']);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [projectNote, setProjectNote] = useState('');

  const currentType = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendViaWhatsApp = () => {
    const selectedAddonLabels = selectedAddons
      .map((id) => ADDON_FEATURES.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const text = `*New Project Scope Inquiry from Portfolio Planner*
👤 *Client Name:* ${clientName || 'Prospective Client'}
📞 *Contact Details:* ${clientContact || 'Not specified'}
🚀 *Architecture:* ${currentType.label}
⏱️ *Timeline:* ${currentType.timeline}
🧩 *Selected Features:* ${selectedAddonLabels || 'Standard architecture'}
📝 *Project Requirements:* ${projectNote || 'Looking forward to discussing project timeline, scope, and customized quote.'}`;

    const waUrl = `https://wa.me/919025943184?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    toast.success('Opening WhatsApp with your project requirements!');
    onClose();
  };

  const handleSendViaEmail = () => {
    const selectedAddonLabels = selectedAddons
      .map((id) => ADDON_FEATURES.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const subject = `Project Scope Inquiry: ${currentType.label} [${clientName || 'New Client'}]`;
    const body = `Hi Mohamed Yasar,

I used your portfolio project requirements planner to configure my project scope:

• Architecture / Type: ${currentType.label}
• Estimated Timeline: ${currentType.timeline}
• Selected Features: ${selectedAddonLabels || 'Standard architecture'}
• Client Name: ${clientName || 'N/A'}
• Contact (Phone / WhatsApp / Email): ${clientContact || 'N/A'}

Project Details & Requirements:
${projectNote || 'Please share your availability to discuss scope and provide a custom proposal.'}

Looking forward to connecting with you.`;

    const mailUrl = `mailto:mohamedyasar081786@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailUrl;
    toast.success('Opening email client with your project brief!');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(7, 10, 19, 0.96)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(225, 29, 72, 0.3)',
          borderRadius: { xs: '16px', md: '24px' },
          color: 'white',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header Bar */}
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(225,29,72,0.15) 0%, rgba(249,115,22,0.08) 100%)',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              bgcolor: 'rgba(225, 29, 72, 0.2)',
              color: '#f97316',
              display: 'flex',
            }}
          >
            <Layers size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1.1 }}>
              Project Scope & Requirements Planner
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              Select your features & send requirements for a tailored proposal
            </Typography>
          </Box>
        </Stack>

        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
        <Grid container spacing={3.5}>
          {/* Left Column: Configurator */}
          <Grid item xs={12} md={7}>
            {/* Step 1: Select Type */}
            <Typography
              variant="overline"
              sx={{ color: '#f97316', fontWeight: 800, letterSpacing: 2, display: 'block', mb: 1.5 }}
            >
              1. Choose Project Architecture
            </Typography>
            <Stack spacing={1.2} sx={{ mb: 3 }}>
              {PROJECT_TYPES.map((pt) => {
                const isSelected = selectedType === pt.id;
                return (
                  <Box
                    key={pt.id}
                    onClick={() => setSelectedType(pt.id)}
                    sx={{
                      p: 1.8,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isSelected
                        ? '1.5px solid #e11d48'
                        : '1px solid rgba(255,255,255,0.08)',
                      bgcolor: isSelected ? 'rgba(225, 29, 72, 0.12)' : 'rgba(255,255,255,0.02)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: '0.25s ease',
                      '&:hover': {
                        borderColor: '#e11d48',
                        bgcolor: 'rgba(225, 29, 72, 0.08)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #e11d48' : '2px solid #475569',
                          bgcolor: isSelected ? 'white' : 'transparent',
                          transition: '0.2s',
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? 'white' : '#cbd5e1' }}>
                          {pt.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {pt.desc}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>

            {/* Step 2: Features & Add-ons */}
            <Typography
              variant="overline"
              sx={{ color: '#f97316', fontWeight: 800, letterSpacing: 2, display: 'block', mb: 1.5 }}
            >
              2. Select Required Features & Integrations
            </Typography>
            <Grid container spacing={1.2} sx={{ mb: 3 }}>
              {ADDON_FEATURES.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <Grid item xs={12} sm={6} key={addon.id}>
                    <Box
                      onClick={() => toggleAddon(addon.id)}
                      sx={{
                        p: 1.5,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: isSelected
                          ? '1px solid rgba(249, 115, 22, 0.7)'
                          : '1px solid rgba(255,255,255,0.05)',
                        bgcolor: isSelected ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255,255,255,0.01)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        transition: '0.2s ease',
                        '&:hover': {
                          borderColor: '#f97316',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircle2
                          size={16}
                          color={isSelected ? '#22c55e' : '#475569'}
                          style={{ flexShrink: 0 }}
                        />
                        <Box>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: isSelected ? 'white' : '#cbd5e1' }}>
                            {addon.label}
                          </Typography>
                          <Typography sx={{ fontSize: '0.68rem', color: '#64748b' }}>
                            {addon.desc}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Step 3: Client Info */}
            <Typography
              variant="overline"
              sx={{ color: '#f97316', fontWeight: 800, letterSpacing: 2, display: 'block', mb: 1.5 }}
            >
              3. Contact & Project Requirements
            </Typography>
            <Stack spacing={1.5}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    placeholder="Your Name / Organization"
                    size="small"
                    fullWidth
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255,255,255,0.03)',
                        color: 'white',
                        fontSize: '0.85rem',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                        '&:hover fieldset': { borderColor: '#e11d48' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    placeholder="Phone / WhatsApp / Email"
                    size="small"
                    fullWidth
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255,255,255,0.03)',
                        color: 'white',
                        fontSize: '0.85rem',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                        '&:hover fieldset': { borderColor: '#e11d48' },
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                placeholder="Briefly describe your goals, required pages/APIs, or specific milestones..."
                size="small"
                multiline
                rows={2}
                fullWidth
                value={projectNote}
                onChange={(e) => setProjectNote(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '0.85rem',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: '#e11d48' },
                  },
                }}
              />
            </Stack>
          </Grid>

          {/* Right Column: Scope Summary & Direct Actions */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: '16px',
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(225, 29, 72, 0.25)',
                position: 'sticky',
                top: 20,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 2, display: 'block', mb: 1 }}
              >
                PROPOSAL SCOPE
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: 'white',
                    fontFamily: 'Outfit',
                    letterSpacing: -0.5,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Custom Proposal
                </Typography>
                <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Sparkles size={13} /> Milestone-Based Delivery Guarantee
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 2 }} />

              {/* Scope Breakdown */}
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Core Stack:
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    {currentType.label}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Target Turnaround:
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#f97316', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={12} /> {currentType.timeline}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Selected Features:
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    {selectedAddons.length} Components
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Post-Launch Support:
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700 }}>
                    30 Days Free Support
                  </Typography>
                </Stack>
              </Stack>

              {/* Action Buttons */}
              <Stack spacing={1.5}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSendViaWhatsApp}
                  startIcon={<MessageCircle size={18} />}
                  sx={{
                    bgcolor: '#22c55e',
                    color: 'white',
                    fontWeight: 800,
                    borderRadius: '12px',
                    py: 1.3,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
                    '&:hover': { bgcolor: '#16a34a' },
                  }}
                >
                  Send Brief via WhatsApp
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleSendViaEmail}
                  startIcon={<Send size={16} />}
                  sx={{
                    borderColor: 'rgba(225, 29, 72, 0.6)',
                    color: 'white',
                    fontWeight: 800,
                    borderRadius: '12px',
                    py: 1.2,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    bgcolor: 'rgba(225, 29, 72, 0.08)',
                    '&:hover': {
                      borderColor: '#e11d48',
                      bgcolor: 'rgba(225, 29, 72, 0.2)',
                    },
                  }}
                >
                  Email Proposal Request
                </Button>
              </Stack>

              {/* Trust Badge */}
              <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <ShieldCheck size={14} color="#38bdf8" />
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                  100% NDA & Source Code Ownership Guaranteed
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEstimatorModal;
