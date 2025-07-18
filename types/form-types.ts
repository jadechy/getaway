import type { createJourneyAnswers } from "./answer";

export type FormStepProps = {
  formAnswers: createJourneyAnswers;
  setFormAnswers: (value: createJourneyAnswers) => void;
};
