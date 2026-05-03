export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-background border-b border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Browse by Category
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Discover our curated collections. Each category is crafted with
            quality and style in mind.
          </p>
        </div>
      </div>
    </div>
  );
};
