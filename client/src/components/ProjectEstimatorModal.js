/**
 * Interactive Freelance Project Estimator & Scope Calculator Modal.
 * Enables prospective clients to configure project needs and get an instant quote / send brief.
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
import { X, Calculator, Send, CheckCircle2, MessageCircle, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PROJECT_TYPES = [
  { id: 'mern_saas', label: 'MERN SaaS / Web App', basePrice: 28000, baseUsd: 380, days: 14 },
  { id: 'ai_voice', label: 'AI Voice & Telephony Bot', basePrice: 35000, baseUsd: 480, days: 10 },
  { id: 'web_scraper', label: 'Python Scraper & Automation', basePrice: 18000, baseUsd: 250, days: 5 },
  { id: 'backend_api', label: 'REST API & Database Backend', basePrice: 22000, baseUsd: 300, days: 7 },
  { id: 'speed_audit', label: 'Speed (Lighthouse 95+) & QA', basePrice: 15000, baseUsd: 200, days: 4 },
];

const ADDON_FEATURES = [
  { id: 'auth_jwt', label: 'Role Auth & User Portal', price: 4000, usd: 55 },
  { id: 'payments', label: 'Payment Gateway (Stripe/Razorpay)', price: 5000, usd: 70 },
  { id: 'crm_sync', label: 'CRM & Webhook Sync (Zoho/HubSpot)', price: 6000, usd: 80 },
  { id: 'telegram_bot', label: 'Telegram/WhatsApp Instant Alerts', price: 4500, usd: 60 },
  { id: 'admin_dashboard', label: 'Advanced Analytics Dashboard', price: 7000, usd: 95 },
  { id: 'priority_speed', label: 'Expedited Express Delivery (48h/Rapid)', price: 8000, usd: 110 },
];

const ProjectEstimatorModal = ({ open, onClose, defaultProjectType = 'mern_saas' }) => {
  const [selectedType, setSelectedType] = useState(defaultProjectType);
  const [selectedAddons, setSelectedAddons] = useState(['auth_jwt', 'crm_sync']);
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [projectNote, setProjectNote] = useState('');

  const currentType = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let totalInr = currentType.basePrice;
    let totalUsd = currentType.baseUsd;

    selectedAddons.forEach((addonId) => {
      const addon = ADDON_FEATURES.find((a) => a.id === addonId);
      if (addon) {
        totalInr += addon.price;
        totalUsd += addon.usd;
      }
    });

    return { inr: totalInr, usd: totalUsd };
  };

  const total = calculateTotal();

  const handleSendViaWhatsApp = () => {
    const selectedAddonLabels = selectedAddons
      .map((id) => ADDON_FEATURES.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const priceString = currency === 'INR' ? `₹${total.inr.toLocaleString('en-IN')}` : `$${total.usd}`;

    const text = `*New Freelance Project Inquiry from Portfolio Estimator*
👤 Name: ${clientName || 'Prospective Client'}
📞 Contact: ${clientContact || 'Not specified'}
🚀 Project Type: ${currentType.label}
🧩 Selected Features: ${selectedAddonLabels || 'Standard package'}
💰 Estimated Budget: ${priceString}
📝 Notes: ${projectNote || 'Looking forward to discussing project timeline and next steps.'}`;

    const waUrl = `https://wa.me/919025943184?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    toast.success('Opening WhatsApp with your configured project brief!');
    onClose();
  };

  const handleSendViaEmail = () => {
    const selectedAddonLabels = selectedAddons
      .map((id) => ADDON_FEATURES.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const priceString = currency === 'INR' ? `₹${total.inr.toLocaleString('en-IN')}` : `$${total.usd}`;

    const subject = `Freelance Inquiry: ${currentType.label} [${clientName || 'New Client'}]`;
    const body = `Hi Mohamed Yasar,

I used your portfolio project calculator to estimate my project requirements:

• Project Type: ${currentType.label}
• Selected Features: ${selectedAddonLabels || 'Standard package'}
• Estimated Investment: ${priceString}
• Name: ${clientName || 'N/A'}
• Contact (Phone/Email): ${clientContact || 'N/A'}

Project Details & Requirements:
${projectNote || 'Please share your availability and official proposal.'}

Looking forward to your response.`;

    const mailUrl = `mailto:mohamedyasar081786@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailUrl;
    toast.success('Opening your email client with your project brief!');
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
            <Calculator size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1.1 }}>
              Interactive Project Estimator
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              Select requirements to get an instant timeline & estimate
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {/* Currency Toggle */}
          <Box
            sx={{
              display: 'flex',
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              p: 0.5,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Button
              size="small"
              onClick={() => setCurrency('INR')}
              sx={{
                minWidth: 42,
                py: 0.2,
                px: 1,
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: '6px',
                color: currency === 'INR' ? 'white' : '#64748b',
                bgcolor: currency === 'INR' ? '#e11d48' : 'transparent',
                '&:hover': { bgcolor: currency === 'INR' ? '#e11d48' : 'rgba(255,255,255,0.05)' },
              }}
            >
              INR (₹)
            </Button>
            <Button
              size="small"
              onClick={() => setCurrency('USD')}
              sx={{
                minWidth: 42,
                py: 0.2,
                px: 1,
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: '6px',
                color: currency === 'USD' ? 'white' : '#64748b',
                bgcolor: currency === 'USD' ? '#e11d48' : 'transparent',
                '&:hover': { bgcolor: currency === 'USD' ? '#e11d48' : 'rgba(255,255,255,0.05)' },
              }}
            >
              USD ($)
            </Button>
          </Box>

          <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
            <X size={20} />
          </IconButton>
        </Stack>
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
              1. Choose Core Project Type
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
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? 'white' : '#cbd5e1' }}>
                        {pt.label}
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontWeight: 800, color: '#f97316', fontSize: '0.85rem' }}>
                      {currency === 'INR' ? `₹${pt.basePrice.toLocaleString('en-IN')}` : `$${pt.baseUsd}`}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            {/* Step 2: Features & Add-ons */}
            <Typography
              variant="overline"
              sx={{ color: '#f97316', fontWeight: 800, letterSpacing: 2, display: 'block', mb: 1.5 }}
            >
              2. Add Desired Integrations & Features
            </Typography>
            <Grid container spacing={1} sx={{ mb: 3 }}>
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
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? 'white' : '#94a3b8' }}>
                          {addon.label}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#f97316' }}>
                        +{currency === 'INR' ? `₹${addon.price}` : `$${addon.usd}`}
                      </Typography>
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
              3. Your Project Info (Optional)
            </Typography>
            <Stack spacing={1.5}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    placeholder="Your Name / Company"
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
                    placeholder="Email or Phone / WhatsApp"
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
                placeholder="Briefly describe your project goals or specific requirements..."
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

          {/* Right Column: Estimate Summary & CTA */}
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
                ESTIMATED INVESTMENT
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: 'white',
                    fontFamily: 'Outfit',
                    letterSpacing: -1,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {currency === 'INR' ? `₹${total.inr.toLocaleString('en-IN')}` : `$${total.usd}`}
                </Typography>
                <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Sparkles size={13} /> Fixed-Price Milestone Guarantee
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 2 }} />

              {/* Scope Breakdown */}
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Core Architecture:
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    {currentType.label}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Est. Turnaround:
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#f97316', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={12} /> {currentType.days} - {currentType.days + 5} Days
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Selected Features:
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                    {selectedAddons.length} Selected
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Post-Launch Support:
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700 }}>
                    30 Days Included
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
                  100% NDA & IP Protection Guaranteed
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
