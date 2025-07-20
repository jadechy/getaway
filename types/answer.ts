import type { ActivityType } from "./journey";
export type TypedPriceRange = {
  types: string[];
  priceRange: [number, number];
};
export interface CreateJourneyAnswers {
  userId: string;

  journeyName: string;
  journeyDate: Date;
  journeyStartingTime: Date;
  journeyEndingTime: Date;
  journeyMemberNumber: number;
  journeyNeedPMR: boolean;
  journeyActivityType?: ActivityType;

  journeyIsFullDay: boolean;

  activity: TypedPriceRange;
  restaurant: TypedPriceRange;
}

export type Answer = {
  id: string | null;
  sortieId: string | null;
  activities: string[];
  activityPriceRange: number[];
  restaurant: string[];
  restoPriceRange: number[];
  isowner: boolean;
};
