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

export const listJobs = async (
  req: AppNextApiRequest,
  res: NextApiResponse
) => {
  return prisma.job.findMany();
};

handler.get(respond(listJobs));
export default handler;
