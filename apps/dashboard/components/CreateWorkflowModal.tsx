import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Divider,
  FormControl,
  Option,
  Sheet,
  Stack,
  Typography,
} from '@mui/joy';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import Select from '@mui/joy/Select';
import React from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { getAgents } from '@app/pages/api/agents';

import {
  fetcher,
  generateActionFetcher,
  HTTP_METHOD,
} from '@chaindesk/lib/swr-fetcher';
import { createWorkflowSchema } from '@chaindesk/lib/types/dtos';
import { Prisma } from '@chaindesk/prisma';

type Props = {
  isOpen: boolean;
  onClose(): any;
  submitCallback?(): void;
};

function CreateWorkflowModal({ isOpen, onClose, submitCallback }: Props) {
  const methods = useForm<createWorkflowSchema>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {},
    mode: 'onBlur',
  });

  const workflowMutation = useSWRMutation(
    `/api/workflows/create`,
    generateActionFetcher(HTTP_METHOD.POST)
  );

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const createWorkflow = async (values: createWorkflowSchema) => {
    try {
      await workflowMutation.trigger({ ...values });
      submitCallback && submitCallback();
    } catch (err) {
      console.log('error', err);
    } finally {
      handleClose();
    }
  };

  const getAgentsQuery = useSWR<Prisma.PromiseReturnType<typeof getAgents>>(
    '/api/agents',
    fetcher
  );

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: 600,
          maxWidth: '100%',
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
          maxHeight: '100%',
          overflowY: 'auto',
        }}
      >
        <Typography level="title-md">Create A New Workflow</Typography>
        <Divider sx={{ my: 4 }} />
        <form onSubmit={methods.handleSubmit(createWorkflow)}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input {...methods.register('name')} />
            <FormHelperText>
              {methods.formState.errors?.name?.message}
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input {...methods.register('description')} />
            <FormHelperText>
              {methods.formState.errors?.description?.message}
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Agent</FormLabel>
            <Select
              onChange={(_, value) => {
                if (value) {
                  methods.setValue('agentId', value as string, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            >
              {getAgentsQuery.data?.map((agent) => (
                <Option value={agent.id} key={agent.id}>
                  {agent.name}
                </Option>
              ))}
            </Select>
            <FormHelperText>
              {methods.formState.errors?.agentId?.message}
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Workflow Query</FormLabel>
            <Input {...methods.register('query')} />
            <FormHelperText>
              {methods.formState.errors?.query?.message}
            </FormHelperText>
          </FormControl>
          <Stack width="100%" direction="row-reverse">
            <Button
              type="submit"
              loading={workflowMutation.isMutating}
              sx={{ ml: 'auto', mt: 2 }}
              disabled={
                !methods.formState.isDirty || !methods.formState.isValid
              }
            >
              Create
            </Button>
          </Stack>
        </form>
      </Sheet>
    </Modal>
  );
}

export default CreateWorkflowModal;
