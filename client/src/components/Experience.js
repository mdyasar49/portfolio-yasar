import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

const Experience = ({ experience }) => {
  if (!experience || !Array.isArray(experience)) return null;

  return (
    <Box id="experience" sx={{ py: 15 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 10, textAlign: 'center', fontFamily: 'Syncopate', fontWeight: 800, letterSpacing: 2 }}>
        CAREER <Box component="span" sx={{ color: '#ff3366' }}>TRAJECTORY</Box>
      </Typography>

      <Stack spacing={6}>
        {experience.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2, type: 'spring', bounce: 0.4 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <Card className="glass-panel" sx={{ 
              borderLeft: '5px solid #ff3366', 
              borderRadius: '24px',
              position: 'relative',
              overflow: 'visible',
              background: 'transparent'
            }}>
              <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 800, 
                      fontSize: '1.8rem', 
                      background: 'linear-gradient(90deg, #fff, #aaa)', 
                      WebkitBackgroundClip: 'text', 
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}>
                      {exp.role}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      {exp.companyUrl ? (
                        <Typography 
                          variant="h6" 
                          component="a" 
                          href={exp.companyUrl} 
                          target="_blank" 
                          sx={{ color: '#ff9933', textDecoration: 'none', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', '&:hover': { color: '#ff3366' } }}
                        >
                          {exp.company}
                        </Typography>
                      ) : (
                        <Typography variant="h6" sx={{ color: '#ff9933', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                          {exp.company}
                        </Typography>
                      )}

                      {exp.companyLinkedIn && (
                        <Button 
                          component="a" 
                          href={exp.companyLinkedIn} 
                          target="_blank" 
                          variant="outlined"
                          size="small"
                          startIcon={<Linkedin size={16} />}
                          sx={{ 
                            color: '#00a0dc', 
                            borderColor: 'rgba(0, 160, 220, 0.3)',
                            borderRadius: 6,
                            textTransform: 'none',
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            pl: 1.5,
                            pr: 2,
                            py: 0.5,
                            background: 'rgba(0, 160, 220, 0.05)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              borderColor: '#00a0dc',
                              background: 'rgba(0, 160, 220, 0.1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 5px 15px rgba(0, 160, 220, 0.2)'
                            }
                          }}
                        >
                          Official Post
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ mt: { xs: 2, md: 0 }, background: 'rgba(255,255,255,0.05)', px: 2, py: 1, borderRadius: 2, display: 'inline-flex', alignItems: 'center', height: 'fit-content' }}>
                    <Typography variant="body2" sx={{ color: '#ccc', fontWeight: 600, letterSpacing: 1 }}>
                      {exp.period}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 3, opacity: 0.8 }}>
                  <Stack spacing={2}>
                    {exp.description.map((item, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ color: '#ff3366', fontSize: '1.2rem' }}>▹</Box>
                        <Typography variant="body1" sx={{ color: '#ddd', lineHeight: 1.8, fontSize: '1.05rem' }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default Experience;
