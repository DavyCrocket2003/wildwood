import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function StickworkTrainingPage() {
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
          Stick Work Neural System Retraining
        </h1>
        <div className="mt-3 h-0.5 w-12 rounded-full bg-accent" />
        <p className="mt-6 leading-relaxed text-muted">
          Stickwork is "an active process of nervous system training and somatic education where you participate in guiding your habitual reactions toward states of calm and pleasantness." You can think about it not as a massage, but like an internal martial arts training where together, we are teaching your body to dissolve the conflict within and learn new ways to interpret and interact with the world. This is a powerful tool to reboot and redirect your life. <a href="#" className="text-accent hover:underline">Click here to discover more.</a>
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
