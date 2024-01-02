import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { CircularProgress, type ColorPaletteProp, Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';
import * as React from 'react';
import useSWR, { useSWRConfig } from 'swr';

import Layout from '@app/components/Layout';
import useStateReducer from '@app/hooks/useStateReducer';
import { getDatasource } from '@app/pages/api/datasources/[id]';
import { getWorkflow } from '@app/pages/api/workflows/[id]';

import { fetcher } from '@chaindesk/lib/swr-fetcher';
import { RouteNames } from '@chaindesk/lib/types';
import { Prisma } from '@chaindesk/prisma';

const DatasourceForm = dynamic(
  () => import('@app/components/DatasourceForms'),
  {
    ssr: false,
  }
);

export default function JobsPage() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [state, setState] = useStateReducer({
    isCreateDatasourceModalOpen: false,
    currentDatastoreId: undefined as string | undefined,
  });

  const getWorkflowQuery = useSWR<Prisma.PromiseReturnType<typeof getWorkflow>>(
    `/api/workflows/${router.query?.workflowId}`,
    fetcher
  );

  return (
    <Box
      component="main"
      className="MainContent"
      sx={(theme) => ({
        px: {
          xs: 2,
          md: 6,
        },
        pb: {
          xs: 2,
          sm: 2,
          md: 3,
        },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        width: '100%',
        gap: 1,
      })}
    >
      <>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon />}
          sx={{
            '--Breadcrumbs-gap': '1rem',
            '--Icon-fontSize': '16px',
            fontWeight: 'lg',
            color: 'neutral.400',
            px: 0,
          }}
        >
          <Link href={RouteNames.HOME}>
            <HomeRoundedIcon />
          </Link>
          <Link href={RouteNames.WORKFLOWS}>
            <Typography
              fontSize="inherit"
              color="neutral"
              className="hover:underline"
            >
              Workflows
            </Typography>
          </Link>
          <Typography
            fontSize="inherit"
            color="neutral"
            className="hover:underline"
          >
            {getWorkflowQuery?.data?.name}
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 1,
            mb: 2,
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Typography level="h1" fontSize="xl4">
              {getWorkflowQuery?.data?.name}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={(theme) => ({
            maxWidth: '100%',
            width: theme.breakpoints.values.md,
            mx: 'auto',
          })}
        >
          <Divider sx={{ my: 4 }} />
        </Box>
      </>
    </Box>
  );
}

JobsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
