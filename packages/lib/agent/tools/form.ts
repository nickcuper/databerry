import { handleFormValid } from '@chaindesk/lib/forms';
import slugify from '@chaindesk/lib/slugify';
import { FormConfigSchema, FormToolSchema } from '@chaindesk/lib/types/dtos';
import { Form } from '@chaindesk/prisma';

export type FormToolPayload = Record<string, unknown>;

export const toJsonSchema = (tool: FormToolSchema) => {
  const form = tool.form as Form;

  return {
    name: `isFormValid_${slugify(form.name)}`,
    description: 'Trigger only when all the required field have been answered',
    parameters: (form?.publishedConfig as any)?.schema,
  };
};

export const createHandler =
  (tool: FormToolSchema, props: any) => async (payload: FormToolPayload) => {
    const form = tool.form as Form;
    const config = form?.publishedConfig as FormConfigSchema;

    await handleFormValid({
      // conversationId: c?.id!,
      formId: tool.formId,
      values: payload,
      webhookUrl: config?.webhook?.url!,
    });

    return 'Form submitted successfully';
  };
