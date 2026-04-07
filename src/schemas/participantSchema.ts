import { z } from "zod";

export const participantSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;
