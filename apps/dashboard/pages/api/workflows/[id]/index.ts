import { NextApiResponse } from 'next';

import { ApiError, ApiErrorType } from '@chaindesk/lib/api-error';
import {
  createAuthApiHandler,
  respond,
} from '@chaindesk/lib/createa-api-handler';
import { AppNextApiRequest } from '@chaindesk/lib/types';
import { prisma } from '@chaindesk/prisma/client';

const handler = createAuthApiHandler();

export const getWorkflow = async (
  req: AppNextApiRequest,
  res: NextApiResponse
) => {
  const session = req.session;
  const id = req.query.id as string;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
    },
    include: {
      agent: {
        select: {
          organizationId: true,
          name: true,
        },
      },
    },
  });

  if (workflow?.agent?.organizationId !== session.organization.id) {
    throw new ApiError(ApiErrorType.UNAUTHORIZED);
  }

  return workflow;
};

handler.get(respond(getWorkflow));
export default handler;
