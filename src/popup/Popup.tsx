import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Popup: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Side Scribe 設定
        </Typography>
        <Typography variant="body1">
          此處將是設定面板，包含 API 設定、錄音設定、摘要設定等。
        </Typography>
      </Box>
    </Container>
  );
};

export default Popup; 