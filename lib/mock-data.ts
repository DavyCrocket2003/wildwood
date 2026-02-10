export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export const services: Service[] = [
  {
    id: "stickwork-session",
    name: "Stickwork Session",
    duration: 60,
    price: 100,
    description: "Nervous system retraining and somatic education to guide habitual reactions toward calm and ease.",
  },
  {
    id: "doterra-session",
    name: "doTERRA Session",
    duration: 60,
    price: 80,
    description: "Essential oil wellness consultation and aromatherapy experience for enhanced health and vitality.",
  },
  {
    id: "forest-bathing",
    name: "Forest Bathing Therapy",
    duration: 120,
    price: 75,
    description: "Guided sensory immersion in nature for deep relaxation, meditation, and grounding.",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Sarah M.",
    rating: 5,
    text: "Carlie is absolutely amazing! Best massage I've ever had. She really listens to what you need and the pressure is always perfect.",
    date: "January 2026",
  },
  {
    id: "r2",
    name: "James T.",
    rating: 5,
    text: "I've been coming here for months and it's always a wonderful experience. The atmosphere is so calming and relaxing.",
    date: "December 2025",
  },
  {
    id: "r3",
    name: "Michelle K.",
    rating: 5,
    text: "Hands down the best therapist in town. I always leave feeling completely renewed. Highly recommend!",
    date: "November 2025",
  },
  {
    id: "r4",
    name: "David R.",
    rating: 5,
    text: "Professional, skilled, and creates such a peaceful environment. My back pain is finally manageable thanks to Carlie.",
    date: "October 2025",
  },
];

export const timeSlots: TimeSlot[] = [
  { id: "t1", time: "9:00 AM", available: true },
  { id: "t2", time: "9:30 AM", available: true },
  { id: "t3", time: "10:00 AM", available: true },
  { id: "t4", time: "10:30 AM", available: false },
  { id: "t5", time: "11:00 AM", available: true },
  { id: "t6", time: "11:30 AM", available: true },
  { id: "t7", time: "1:00 PM", available: true },
  { id: "t8", time: "1:30 PM", available: false },
  { id: "t9", time: "2:00 PM", available: true },
  { id: "t10", time: "3:00 PM", available: true },
];

export const provider = {
  name: "Emily Lacey",
  title: "Licensed Massage Therapist",
  rating: 5.0,
  reviewCount: reviews.length,
  phone: "(801) 310-7119",
  email: "emily.lacey@gmail.com",
  timezone: "Mountain Time (MT)",
};