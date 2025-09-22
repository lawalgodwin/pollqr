import { z } from 'zod';

// Define the schema for creating a poll and ensure validation using zod
export const CreatePollSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  options: z
    .array(z.string().min(1, 'Option text is required'))
    .min(2, 'At least two options are required'),
});

// Define the TypeScript type for creating a poll based on the schema
export class CreatePollDto {
  question: string;
  options: string[];

  constructor(data: z.infer<typeof CreatePollSchema>) {
    this.question = data.question;
    this.options = data.options;
  }
  static validate(data: unknown) {
    return CreatePollSchema.parse(data);
  }
}
