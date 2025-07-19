import { ActivityType } from "~/types/journey";

export interface IconAndColor {
  color: string;
  icon: string | null;
}

export const getIconAndColor = (activityType: ActivityType): IconAndColor => {
  switch (activityType) {
    case ActivityType.friends:
      return { color: "blue", icon: "pi-users" };
    case ActivityType.romantic:
      return { color: "pink", icon: "pi-heart" };
    case ActivityType.family:
      return { color: "green", icon: "pi-home" };
    case ActivityType.random:
      return {
        color: "yellow",
        icon: "pi-objects-column",
      };
    default:
      return { color: "gray", icon: null };
  }
};
