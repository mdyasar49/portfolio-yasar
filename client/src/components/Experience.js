import React from 'react';
import { Box, Typography, Card, CardContent, Stack } from '@mui/material';

const Experience = ({ experience }) => {
  return (
    <Box id="experience" sx={{ py: 10 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 6 }}>
        Professional Experience
      </Typography>

      <Stack spacing={4}>
        {experience.map((exp, index) => (
          <Card key={index} className="glass" sx={{ 
            borderLeft: '5px solid', 
            borderColor: 'primary.light',
            boxShadow: '0 0 15px rgba(63, 81, 181, 0.2)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" color="primary.light">
                {exp.role}
              </Typography>
              {exp.companyUrl ? (
                <Typography 
                  variant="h6" 
                  component="a" 
                  href={exp.companyUrl} 
                  target="_blank" 
                  sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  {exp.company}
                </Typography>
              ) : (
                <Typography variant="h6" color="text.primary">
                  {exp.company}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {exp.period}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <ul>
                  {exp.description.map((item, i) => (
                    <li key={i}>
                      <Typography variant="body2" color="text.secondary">
                        {item}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default Experience;
