export enum ActivityType {
  friends = "friends",
  romantic = "romantic",
  family = "family",
  random = "random",
}
export type BaseJourney = {
  id: string;
  title: string;
  type: ActivityType;
  date: Date;
  timeStart: Date;
  timeFinish: Date;
  isFullDay: boolean;
  ownerId: string;
  needPMR: boolean;
};
export interface JourneyFromDB {
  id: string;
  SOR_TYPE: string;
  SOR_TITRE: string;
  SOR_DATE: string;
  SOR_HEURE_FIN: string;
  SOR_PMR: boolean;
  SOR_NB_PRSN: number;
  SOR_JOURNEE: boolean;
  SOR_HEURE_DEB: string;
  UTIL_ID: string;
}
export enum JourneyStatus {
  waitingForAnswer = "waitingForAnswers",
  readyForGeneration = "readyForGeneration",
  generated = "generated",
}
