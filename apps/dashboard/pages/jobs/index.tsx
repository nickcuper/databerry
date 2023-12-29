import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, Stack } from '@mui/joy';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';

import useStateReducer from '@app/hooks/useStateReducer';
import { getAgents } from '@app/pages/api/agents';
import { createJobSchema } from '@app/pages/api/jobs/create';

import {
  fetcher,
  generateActionFetcher,
  HTTP_METHOD,
} from '@chaindesk/lib/swr-fetcher';
import { Prisma } from '@chaindesk/prisma';

import { listJobs } from '../api/jobs/list';

function JobForm() {
  const [state, setState] = useStateReducer({
    isLoading: false,
  });

  const getAgentsQuery = useSWR<Prisma.PromiseReturnType<typeof getAgents>>(
    '/api/agents',
    fetcher
  );

  const getJobsQuery = useSWR<Prisma.PromiseReturnType<typeof listJobs>>(
    '/api/jobs/list',
    fetcher
  );

  const jobMutation = useSWRMutation(
    `/api/jobs/create`,
    generateActionFetcher(HTTP_METHOD.POST)
  );

  const jobTrigger = useSWRMutation(
    `/api/jobs/trigger`,
    generateActionFetcher(HTTP_METHOD.POST)
  );

  const { handleSubmit, register } = useForm<z.infer<typeof createJobSchema>>(
    {}
  );

  const onSubmit = async (values: z.infer<typeof createJobSchema>) => {
    try {
      const toastId = toast.loading('saving', {
        position: 'bottom-center',
      });
      await jobMutation.trigger({ ...values });
      await getJobsQuery.mutate();
      toast.dismiss(toastId);
    } catch (err) {
      console.log('error', err);
    } finally {
      setState({ isLoading: false });
    }
  };

  const trigger = async (id: string) => {
    const toastId = toast.loading('saving', {
      position: 'bottom-center',
    });
    const response = await jobTrigger.trigger({ jobId: id });
    console.log(response);
    toast.dismiss(toastId);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <div>agent</div>
          <select {...register('agentId')} defaultValue="select agent">
            {getAgentsQuery?.data?.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </Stack>
        <Stack>
          <div>Query</div>
          <input {...register('query', { required: true })} />
        </Stack>
        <Stack sx={{ pb: '9px' }}>
          Interval
          <select {...register('interval')}>
            <option value="DAILY">daily</option>
            <option value="DAILY">weekly</option>
            <option value="DAILY">monthly</option>
          </select>
        </Stack>

        <input type="submit" />
      </form>
      <Divider sx={{ mt: '20px' }} />
      {getJobsQuery.data?.map((job) => (
        <div key={job.id}>
          <div> {job.id} </div>
          <button onClick={() => trigger(job.id)}>trigger</button>
        </div>
      ))}
    </div>
  );
}

export default JobForm;
