import type { ActivityType } from "./activity";

export interface createJourneyAnswers {
  userId: string,

  journeyName: string;
  journeyDate: Date;
  journeyStartingTime: Date;
  journeyEndingTime: Date;
  journeyMemberNumber: number;
  journeyNeedPMR: boolean;
  journeyActivityType: ActivityType;

  journeyIsFullDay: boolean;

  answerActivityOptions: string[];
  answerPriceRange: [number, number];

  answerRestaurantTypes: string[];
  answerRestaurantPriceRange: [number, number];
}

export type Answer = {
    id: string | null,
    sortieId: string | null,
    activities: string[];
    activityPriceRange: number[],
    restaurant: string[];
    restoPriceRange: number[],
    isowner: boolean
};

