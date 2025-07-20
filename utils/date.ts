import { format } from "date-fns";
import type { BaseJourney } from "~/types/journey";

export const getDurationHours = ({ journey }: { journey: BaseJourney }) => {
  if (journey.isFullDay) return "Toute la journée";
  const diffMs = journey.timeFinish.getTime() - journey.timeStart.getTime();
  const diffH = diffMs / (1000 * 60 * 60);
  return `${diffH.toFixed(1)}h`;
};

export const getFormattedDate = ({ date }: { date: Date }) => {
  return format(date, "dd MMMM yyyy");
};

export const parseDateFrenchFormat = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const parseTimeString = (date: Date, timeStr: string): Date => {
  const [hour, minute] = timeStr.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hour, minute, 0, 0);
  return newDate;
};
