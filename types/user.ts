import { z } from "zod";

export const FirestoreUserSchema  = z.object({
  util_id: z.string(),
  util_prenom: z.string().min(1, 'Le prénom est requis'),
  util_nom: z.string().min(1, 'Le nom est requis'),
  util_mail: z.string().email('Email invalide'),
  util_sorties: z.array(z.any()).default([]),
});

export type FirestoreUser = z.infer<typeof FirestoreUserSchema>