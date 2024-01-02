import { NextApiResponse } from 'next';
import { z } from 'zod';

import AgentManager from '@chaindesk/lib/agent';
import { ApiError, ApiErrorType } from '@chaindesk/lib/api-error';
import {
  createAuthApiHandler,
  respond,
} from '@chaindesk/lib/createa-api-handler';
import { AppNextApiRequest } from '@chaindesk/lib/types';
import validate from '@chaindesk/lib/validate';
import { prisma } from '@chaindesk/prisma/client';

const handler = createAuthApiHandler();

const triggerScheam = z.object({
  workflowId: z.string().min(8),
});

export const triggerWorkflow = async (
  req: AppNextApiRequest,
  res: NextApiResponse
) => {
  const session = req.session;
  const { workflowId } = triggerScheam.parse(req.body);

  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: {
      id: workflowId,
    },
    include: {
      agent: {
        include: {
          tools: {
            include: {
              datastore: true,
            },
          },
        },
      },
    },
  });

  if (workflow?.agent.organizationId !== session.organization.id) {
    throw new ApiError(ApiErrorType.UNAUTHORIZED);
  }

  const manager = new AgentManager({ agent: workflow?.agent });

  const workflowResult = await manager.query({
    input: workflow.query,
  });

  return workflowResult;
};

handler.post(
  validate({
    body: triggerScheam,
    handler: respond(triggerWorkflow),
  })
);

export default handler;
