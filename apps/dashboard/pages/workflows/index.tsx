import AddIcon from '@mui/icons-material/Add';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Link as JoyLink,
  Typography,
} from '@mui/joy';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ReactElement } from 'react';
import * as React from 'react';
import useSWR from 'swr';

import CreateWorkflowModal from '@app/components/CreateWorkflowModal';
import DatastoreTable from '@app/components/DatastoreTable';
import Layout from '@app/components/Layout';
import WorkflowsTable from '@app/components/WorkflowsTable';
import useStateReducer from '@app/hooks/useStateReducer';

import { fetcher } from '@chaindesk/lib/swr-fetcher';
import { RouteNames } from '@chaindesk/lib/types';
import { Prisma } from '@chaindesk/prisma';

import { getDatastores } from '../api/datastores';
import { listWorkflows } from '../api/workflows/list';

const CreateDatastoreModal = dynamic(
  () => import('@app/components/CreateDatastoreModal'),
  {
    ssr: false,
  }
);

export default function WorkflowsPage() {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });

  const [state, setState] = useStateReducer({
    isCreateWorkflowModalOpen: false,
  });

  const getWorkflowsQuery = useSWR<
    Prisma.PromiseReturnType<typeof listWorkflows>
  >('/api/workflows/list', fetcher);

  console.log('fetched data-------->', getWorkflowsQuery.data);

  const handleClickNewWorkflow = () => {
    setState({ isCreateWorkflowModalOpen: true });
  };

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
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        gap: 1,
      })}
    >
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
        <Typography fontSize="inherit" color="neutral">
          Workflows
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          my: 1,
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography level="h1" fontSize="xl4">
          Workflows
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, '& > *': { flexGrow: 1 } }}>
          <Button
            variant="solid"
            color="primary"
            startDecorator={<AddIcon />}
            onClick={handleClickNewWorkflow}
          >
            New Workflow
          </Button>
        </Box>
      </Box>

      <Alert
        variant="soft"
        color="neutral"
        startDecorator={<InfoRoundedIcon />}
        sx={{ mb: 2 }}
      >
        A workflow is an easy way to schedule regular tasks with the help of AI.
      </Alert>
      <CreateWorkflowModal
        isOpen={state.isCreateWorkflowModalOpen}
        onClose={() => setState({ isCreateWorkflowModalOpen: false })}
        submitCallback={getWorkflowsQuery.mutate}
      />
      {getWorkflowsQuery?.data && (
        <WorkflowsTable workflows={getWorkflowsQuery.data} />
      )}
    </Box>
  );
}

WorkflowsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
