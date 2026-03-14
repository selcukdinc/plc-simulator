import { Box, Link, Typography } from '@mui/material';
import styled from 'styled-components';

const Container = styled.div`
  background-color: var(--color-bg-footer);
  bottom: 0;
  display: flex;
  grid-area: footer;
  height: 1.75rem;
  justify-content: space-between;
  left: 0;
  position: relative;
  right: 0;
`;

type Props = {
  mobileUI: boolean;
};

export default function Footer({ mobileUI }: Props) {
  return (
    <Container>
      <Box sx={{ color: 'text.secondary' }} mx={1} my="auto">
        <Typography variant="body2">
          {'© '}
          <Link href="https://www.codingplc.com/" color="inherit" target="_blank" rel="noopener noreferrer">
            CodingPLC
          </Link>
          {' · '}
          <Link href="https://github.com/codingplc/plc-simulator" color="inherit" target="_blank" rel="noopener noreferrer">
            Original Project
          </Link>
          {' · '}
          <Link href="https://app.plcsimulator.online" color="inherit" target="_blank" rel="noopener noreferrer">
            Original Site
          </Link>
        </Typography>
      </Box>
      {!mobileUI && (
        <Box sx={{ color: 'text.secondary' }} mx={1} my="auto">
          <Typography variant="body2">
            <Link href="https://github.com/selcukdinc/plc-simulator" color="inherit" target="_blank" rel="noopener noreferrer">
              Fork by selcukdinc
            </Link>
            {' · '}
            <Link href="https://devloop.com.tr" color="inherit" target="_blank" rel="noopener noreferrer">
              devloop.com.tr
            </Link>
          </Typography>
        </Box>
      )}
    </Container>
  );
}
