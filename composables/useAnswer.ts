import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { DataBaseCollections } from "~/utils/const/databaseCollections";
import type { Answer } from "~/types/answer";

export const useAnswer = () => {
  const db = getFirestore();

  const createAnswer = async (answer: Answer): Promise<void> => {
    await addDoc(collection(db, DataBaseCollections.reponses), {
      sortieId: answer.sortieId,
      activities: answer.activities,
      activityPriceRange: answer.activityPriceRange,
      restaurant: answer.restaurant,
      restoPriceRange: answer.restoPriceRange,
      isowner: answer.isowner,
    });
  };

  const fetchAnswersByJourneyId = async ({
    journeyId,
  }: {
    journeyId: string;
  }): Promise<Answer[] | undefined> => {
    try {
      const answersColRef = collection(db, DataBaseCollections.reponses);
      const q = query(answersColRef, where("sortieId", "==", journeyId));
      const querySnapshot = await getDocs(q);

      const answers: Answer[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Answer;
        console.log("--------fetch");
        console.log(doc.data());
        answers.push(data);
      });

      return answers;
    } catch (error) {
      console.error("Erreur lors du fetch des réponses:", error);
      return undefined;
    }
  };

  return {
    createAnswer,
    fetchAnswersByJourneyId,
  };
};
