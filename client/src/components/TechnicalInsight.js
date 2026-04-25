/**
 * [React.js & Recharts - Data Visualization Architecture]
 * Technologies: React.js, Material UI (Grid, Paper, Stack), Recharts (ResponsiveContainer, AreaChart, BarChart), Framer Motion
 * Purpose: This component visualizes technical throughput and skill distribution using interactive charts.
 */
import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Zap, Activity, Cpu, Database } from 'lucide-react';

/**
 * TechnicalInsight Component
 * Renders two primary data visualizations: Performance Optimization and Tech Stack Mastery.
 */
const TechnicalInsight = ({ profile }) => {
  // Use data from backend or fallback to empty arrays to prevent crashes
  const performanceData = profile?.performanceData || [];
  const skillDistribution = profile?.skillDistribution || [];
  const systemStats = profile?.systemStats || [];

  return (
    <Box id="insights" sx={{ py: { xs: 10, md: 20 }, position: 'relative', bgcolor: 'rgba(2, 4, 10, 0.5)' }}>
      <Container maxWidth="xl">

        {/* Section Header: Metric Definitions */}
        <Stack spacing={2} sx={{ mb: 12, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: '#00ffcc', fontWeight: 900, letterSpacing: 8, fontFamily: 'Syncopate' }}>
            ENGINEERING_METRICS
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: 'Syncopate', fontWeight: 900, fontSize: { xs: '2rem', md: '4rem' } }}>
            SYSTEM <span style={{ color: '#ff3366' }}>INTELLIGENCE</span>
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {/* [Visualization A] - Performance Trend (Area Chart) */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Paper className="glass-panel" sx={{ p: 4, height: 450, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Activity color="#00ffcc" size={24} /> PERFORMANCE_OPTIMIZATION_THROUGHPUT
                  </Typography>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(0, 255, 204, 0.1)', color: '#00ffcc' }}>
                    <Typography variant="caption" sx={{ fontWeight: 900 }}>+45.2% ACCELERATION</Typography>
                  </Box>
                </Stack>

                {/*
                  Chart Container
                  'minWidth: 0' and 'width: 100%' are essential fix for Recharts
                  ResponsiveContainer initialization issues in flex/grid layouts.
                */}
                <Box sx={{ flexGrow: 1, width: '100%', minWidth: 0, position: 'relative' }}>
                  <ResponsiveContainer width="99.9%" height={300}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#02040a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#00ffcc' }}
                      />
                      <Area type="monotone" dataKey="optimization" stroke="#00ffcc" strokeWidth={3} fillOpacity={1} fill="url(#colorOpt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* [Visualization B] - Skill Distribution (Horizontal Bar Chart) */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Paper className="glass-panel" sx={{ p: 4, height: 450, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, fontFamily: 'Syncopate', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Zap color="#ff3366" size={24} /> TECH_STACK_MASTERY
                </Typography>
                <Box sx={{ flexGrow: 1, width: '100%', minWidth: 0, position: 'relative' }}>
                  <ResponsiveContainer width="99.9%" height={250}>
                    <BarChart data={skillDistribution} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="white" fontSize={11} width={80} tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#02040a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {skillDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                    >_ ANALYZING_SYSTEM_COMPETENCY... [COMPLETED]
                  </Typography>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>

          {/* Dynamic Stats Cards: Supplementary Evidence */}
          {systemStats.map((stat, i) => (
            <Grid item xs={6} md={3} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper className="glass-panel" sx={{ p: 3, textAlign: 'center', borderBottom: `4px solid ${stat.color}` }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                     {stat.label === 'API_STABILITY' && <Database color={stat.color} />}
                     {stat.label === 'CODE_COVERAGE' && <ShieldCheck color={stat.color} />}
                     {stat.label === 'COMPUTE_EFFICIENCY' && <Cpu color={stat.color} />}
                     {stat.label === 'DEPLOYMENT_FREQUENCY' && <Zap color={stat.color} />}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, letterSpacing: 2 }}>{stat.label}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Internal icon for Security Certification badge
const ShieldCheck = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default TechnicalInsight;
