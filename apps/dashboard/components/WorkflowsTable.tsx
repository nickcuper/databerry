import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Button } from '@mui/joy';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Link from 'next/link';
import * as React from 'react';

import { RouteNames } from '@chaindesk/lib/types';
import { Workflow } from '@chaindesk/prisma';

export default function WorkflowsTable({
  workflows,
}: {
  workflows: Workflow[];
}) {
  return (
    <React.Fragment>
      <Sheet
        variant="outlined"
        sx={{
          width: '100%',
          borderRadius: 'md',
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': (theme) =>
              theme.vars.palette.background.level1,
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': (theme) =>
              theme.vars.palette.background.level1,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 120, padding: 12 }}>Name</th>
              <th style={{ width: 220, padding: 12 }}>Description</th>
              <th style={{ width: 160, padding: 12 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow) => (
              <tr key={workflow.id}>
                <td>
                  <div className="flex flex-col">
                    <Link href={`${RouteNames.WORKFLOWS}/${workflow.id}`}>
                      <Typography
                        className="truncate hover:underline"
                        fontWeight={'bold'}
                        color="primary"
                      >
                        {workflow.name}
                      </Typography>
                    </Link>
                  </div>
                </td>
                <td>
                  <Typography>{workflow?.description}</Typography>
                </td>
                <td>
                  <Button
                    variant="outlined"
                    size="sm"
                    className="rounded-full"
                    loading={false}
                    endDecorator={<ElectricBoltIcon fontSize="md" />}
                  >
                    Trigger
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}
