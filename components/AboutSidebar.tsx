import Link from "next/link";

export default function AboutSidebar() {
  return (
    <aside className="w-full lg:sticky lg:top-20 lg:w-80 lg:shrink-0 lg:self-start">
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/emily-photo.jpg"
            alt="Emily Lacey"
            className="mb-4 h-28 w-28 rounded-full object-cover"
          />
          <p className="text-sm font-medium text-accent">Founder, WildWoods Studio</p>
          <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-border" />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            With a deep love for nature and holistic wellness, I created
            WildWoods Studio to help people reconnect — with themselves, with
            others, and with the natural world around them. Whether in the
            studio or out in the forest, every experience is designed to nurture
            mind, body, and spirit.
          </p>
          <Link
            href="/book"
            className="mt-6 inline-block w-full rounded-lg bg-accent px-6 py-3 text-center text-sm font-medium text-accent-foreground no-underline transition-colors hover:bg-accent-hover"
          >
            Book a Session
          </Link>
        </div>
      </div>
    </aside>
  );
}
