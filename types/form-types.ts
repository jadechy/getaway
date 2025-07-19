import type { CreateJourneyAnswers } from "./answer";

export type FormStepProps = {
  formAnswers: CreateJourneyAnswers;
  setFormAnswers: (value: CreateJourneyAnswers) => void;
};
