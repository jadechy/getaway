import type { TestimonialProps } from "~/components/landing-page/TestimonialComponent.vue";

export const testimonials: TestimonialProps[] = [
  {
    name: "Clara",
    age: 36,
    quote: "Une super sortie en famille sans prise de tête !",
    avatar: "", // utilisera le label "C"
  },
  {
    name: "Léo & Anna",
    age: 20,
    quote:
      "On a découvert un resto incroyable qu’on n’aurait jamais trouvé seuls.",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Nassim",
    age: 27,
    quote:
      "Franchement, parfait pour surprendre ma copine avec une activité originale.",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Julie",
    age: 31,
    quote:
      "J’ai adoré ne rien avoir à organiser. J’ai juste suivi le programme.",
    avatar: "",
  },
  {
    name: "Thomas",
    age: 42,
    quote: "Ça m’a donné des idées pour nos week-ends. Super pratique.",
    avatar: "https://i.pravatar.cc/100?img=8",
  },
  {
    name: "Mélissa",
    age: 22,
    quote: "On a eu une activité de ouf et un resto trop stylé, validé !",
    avatar: "https://i.pravatar.cc/100?img=45",
  },
];
export const colorsTestimonial = ["pink", "teal", "orange", "indigo"];
