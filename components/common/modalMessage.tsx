'use client';
import { Modal, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface ModalMessageProps {
  open: boolean;
  message?: string | ReactNode;
  onClose?: () => void;
  width?: number;
}

export default function ModalMessage({
  open,
  message,
  onClose,
  width = 300,
}: ModalMessageProps) {
  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    minWidth: width,
    textAlign: 'center',
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="body1">{message}</Typography>
      </Box>
    </Modal>
  );
}
