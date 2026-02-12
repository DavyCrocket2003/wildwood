interface HeroProps {
  title?: string;
  subtitle?: string;
}

export default function Hero({
  title = "WildWoods Studio",
  subtitle = "Connecting you to yourself, others, and the Earth.",
}: HeroProps) {
  return (
    <section className="relative flex min-h-[200px] items-center justify-center overflow-hidden sm:min-h-[260px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/flowers-forest.jpg')" }}
      />
      <div className="absolute inset-0 bg-background/80" />

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <img
          src="/images/logo-swirl.svg"
          alt="WildWoods"
          className="mb-6 h-20 w-20 opacity-90"
        />
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <div className="mx-auto mt-3 h-0.5 w-16 rounded-full bg-accent" />
        <p className="mt-4 max-w-md text-lg text-muted">
          {subtitle}
        </p>
      </div>
    </section>
  );
}