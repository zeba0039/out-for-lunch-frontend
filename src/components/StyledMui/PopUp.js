import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { themeOptions as theme } from '../../utils/ThemeOptions';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple popup display with message with optional refer to another page on
// site. -AK
export function ReferPopUp({ displayText, buttonText, referTo, callback }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  // Button refer navigation handling
  function handleRefer() {
    if (callback) {
      callback();
    } else {
      navigate(referTo);
    }
    setOpen(false);
  }
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
        <DialogContentText align={'center'}> {displayText}</DialogContentText>
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: 'center',
        }}
        sx={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Button
          onClick={handleRefer}
          sx={{
            color: 'black',
            fontWeight: 'bold',
            backgroundColor: theme.palette.secondary.dark,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
            },
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
