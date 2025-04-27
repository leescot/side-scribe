import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MicIcon from '@mui/icons-material/Mic';

const Panel: React.FC = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="h1">
            Side Scribe 錄音面板
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" startIcon={<MicIcon />}>
              開始錄音
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            即時轉錄內容
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            此處將顯示錄音的即時轉錄內容...
          </Typography>
        </Box>
        
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            摘要
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            此處將顯示從轉錄內容生成的摘要...
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Panel; 