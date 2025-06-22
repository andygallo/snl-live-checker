'use client';

import React from 'react';
import { Box, Card, CardContent, Skeleton, Container } from '@mui/material';

export const LoadingSkeleton: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Status Header Skeleton */}
      <Box textAlign="center" mb={4}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mx: 'auto' }} />
      </Box>

      {/* Host Card Skeleton */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box flex={1}>
              <Skeleton variant="text" width="70%" height={32} />
              <Skeleton variant="text" width="50%" height={24} />
              <Skeleton variant="text" width="90%" height={20} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Musical Guest Card Skeleton */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box flex={1}>
              <Skeleton variant="text" width="70%" height={32} />
              <Skeleton variant="text" width="50%" height={24} />
              <Skeleton variant="text" width="90%" height={20} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons Skeleton */}
      <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
        <Skeleton variant="rounded" width={140} height={48} />
        <Skeleton variant="rounded" width={140} height={48} />
        <Skeleton variant="rounded" width={140} height={48} />
      </Box>
    </Container>
  );
};

export default LoadingSkeleton; 