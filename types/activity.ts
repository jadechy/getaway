import type { ActivityApiType } from "~/utils/const/activityTypes";
import type { BaseJourney } from "./journey";
import type { Restaurant } from "./restaurant";

export type Journey = BaseJourney & {
  activitiesId: number[];
  restaurantId: string;
};

export type JourneyData = BaseJourney & {
  restaurant?: Restaurant;
  activities?: ActivityApiType;
};
