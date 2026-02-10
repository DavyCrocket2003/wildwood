import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ForestSchoolPage() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-foreground"
        >
          &larr; Back to Services
        </Link>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Forest School
        </h1>
        <div className="mt-3 h-0.5 w-12 rounded-full bg-accent" />
        <p className="mt-6 leading-relaxed text-muted">
          Forest School is 3 hours once a week for elementary to middle school aged children. The intent of Forest School is to bring children to nature where they learn to be alone, gain confidence and self sufficiency, learn teamwork, expand their curiosity, problem solving skills, and respect and awe for creation. We study a wide range of topics that rotates through the years but has included History: Native American, Norse, and Roman Mythology; Science: Earth science, biology, and astronomy, local geographical history; Art: singing, rhythm sticks, drumming, water colors, drawing, found nature art, role playing and readers theatre; Crafts: building bird houses and flower presses, pottery, carving, paper making, lantern crafting; Writing: poetry, observations, journaling; and Sports: ice hockey, ice skating, cross country skiing, hiking, cold water exploration, and numerous group games; Wilderness Skills: fire, cooking over a fire, shelters, first aid and safety skills, knives. Younger classes include more imaginative play such as house and town, water play, fairy villages, parachute, fables and nursery rhymes, and so on.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          At this time, we meet on Tuesday morning. Enrollment is full but to see a snapshot of what we do, <a href="#" className="text-accent hover:underline">click here</a>.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 text-sm font-medium text-accent-foreground no-underline transition-colors hover:bg-accent-hover"
        >
          Book This Service
        </Link>
      </div>
    </>
  );
}
