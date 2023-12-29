import { JobInterval } from '@prisma/client';
import { NextApiResponse } from 'next';
import { z } from 'zod';

import {
  createAuthApiHandler,
  respond,
} from '@chaindesk/lib/createa-api-handler';
import { AppNextApiRequest } from '@chaindesk/lib/types';
import validate from '@chaindesk/lib/validate';
import { prisma } from '@chaindesk/prisma/client';

const handler = createAuthApiHandler();

export const createJobSchema = z.object({
  agentId: z.string().min(8),
  query: z.string().min(8),
  interval: z.nativeEnum(JobInterval).default('DAILY'),
});

export const createJob = async (
  req: AppNextApiRequest,
  res: NextApiResponse
) => {
  const { agentId, query, interval } = createJobSchema.parse(req.body);

  return prisma.job.create({
    data: {
      agentId,
      query,
      interval,
    },
  });
};

handler.post(
  validate({
    body: createJobSchema,
    handler: respond(createJob),
  })
);
export default handler;
