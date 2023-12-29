import { NextApiResponse } from 'next';
import { z } from 'zod';

import AgentManager from '@chaindesk/lib/agent';
import {
  createAuthApiHandler,
  respond,
} from '@chaindesk/lib/createa-api-handler';
import { AppNextApiRequest } from '@chaindesk/lib/types';
import validate from '@chaindesk/lib/validate';
import { prisma } from '@chaindesk/prisma/client';

const handler = createAuthApiHandler();

const triggerScheam = z.object({
  jobId: z.string().min(8),
});

export const triggerJob = async (
  req: AppNextApiRequest,
  res: NextApiResponse
) => {
  const { jobId } = triggerScheam.parse(req.body);

  const job = await prisma.job.findUniqueOrThrow({
    where: {
      id: jobId,
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

  const manager = new AgentManager({ agent: job?.agent });

  const jobResult = await manager.query({
    input: job.query,
  });

  return jobResult;
};

handler.post(
  validate({
    body: triggerScheam,
    handler: respond(triggerJob),
  })
);
export default handler;
