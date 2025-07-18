import { ActivityType } from "../types/activity";
export interface Color {
  name: string;
  icon: string | null;
}

export const getColoredBackgroundFromActivtyType = (
  activityType: ActivityType
): Color => {
  switch (activityType) {
    case ActivityType.friends:
      return { name: "blue", icon: "pi-users" };
    case ActivityType.romantic:
      return { name: "pink", icon: "pi-heart" };
    case ActivityType.family:
      return { name: "green", icon: "pi-home" };
    case ActivityType.random:
      return {
        name: "yellow",
        icon: "pi-objects-column",
      };
    default:
      return { name: "gray", icon: null };
  }
};
