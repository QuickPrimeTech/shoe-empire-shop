const ITEMS = [
  "NEW ARRIVALS",
  "LIMITED EDITION",
  "FREE SHIPPING OVER $150", // You can change this to Ksh if you prefer!
  "DROP 04 LIVE NOW",
  "MEMBER EXCLUSIVE",
];

export const Marquee = () => {
  // We map the items once.
  // Notice the gap-12 is placed on the parent flex containers below,
  // so we just need the gap between the text and the star here.
  const marqueeContent = ITEMS.map((t, i) => (
    <span
      key={i}
      className="font-display flex items-center gap-12 text-heading-4 uppercase"
    >
      {t}
      <span className="text-primary">★</span>
    </span>
  ));

  return (
    <section className="border-border bg-background flex w-full overflow-hidden border-y py-8">
      {/* First block sliding left */}
      {/* Added gap-12 and pr-12 to ensure perfect spacing when the loop resets */}
      <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12 whitespace-nowrap">
        {marqueeContent}
      </div>

      {/* Second identical block trailing right behind it */}
      <div
        className="animate-marquee flex shrink-0 items-center gap-12 pr-12 whitespace-nowrap"
        aria-hidden="true"
      >
        {marqueeContent}
      </div>
    </section>
  );
};
