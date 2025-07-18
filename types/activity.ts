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

export type Journey = BaseJourney & {
    activitiesId: number[];
    restaurantId: string;
};

export enum JourneyStatus {
    waitingForAnswer = "waitingForAnswers",
    readyForGeneration = "readyForGeneration",
    generated = "generated",
}

export type JourneyData = {
    sortie: Journey;
    restaurants: Restaurant[] | null;
};

export type Restaurant = {
    id: string,
    address: string,
    amis: boolean
    couple: boolean
    famille: boolean
    metro : string,
    title: string,
    prix_max: number,
    prix_min: number
    type: string,
    openingHour?: number,
    closingHour?: number,
    rateOutOf5?: number,
}


export enum ActivityType {
  friends = "friends",
  romantic = "romantic",
  family = "family",
  random = "random",
}
