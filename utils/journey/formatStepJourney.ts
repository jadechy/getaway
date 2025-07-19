import type { Step } from "~/types/journey";
import type { ActivityApiType } from "../const/activityTypes";
import type { Restaurant } from "~/types/restaurant";

/**
 * Transforme une activité de l’API en format Step
 */
export function formatActivityFromAPIToStep(
  activity: ActivityApiType,
  isMorning: boolean
): Step {
  return {
    isRestaurant: false,
    name: activity.title,
    types: activity.tags,
    price:
      activity.price_type === "gratuit"
        ? 0
        : activity.price_detail ?? "Inconnu",
    adress: `${activity.address_street}, ${activity.address_zipcode} ${activity.address_city}`,
    startingHour: isMorning ? "10:00" : "15:00",
    endingHour: isMorning ? "12:00" : "17:00",
    description: activity.description,
    img: activity.cover_url
      ? {
          url: activity.cover_url,
          alt: activity.cover_alt || activity.title,
        }
      : undefined,
  };
}

/**
 * Transforme un restaurant Firestore en format Step
 */
export function formatRestaurantFromBDDToStep(restaurant: Restaurant): Step {
  return {
    isRestaurant: true,
    name: restaurant.title,
    types: [restaurant.type],
    price: restaurant.prix_max ?? "Inconnu",
    adress: restaurant.address,
    startingHour: "12:30",
    endingHour: "14:00",
    description: "",
    img: undefined, // tu peux mettre une image par défaut si besoin
  };
}
