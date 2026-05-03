// @/sections/categories/empty-state.tsx

export const EmptyState = () => {
  return (
    <div className="text-center py-24">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <svg
          className="w-8 h-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No categories yet
      </h3>
      <p className="text-muted-foreground">
        Check back soon for new collections.
      </p>
    </div>
  );
};
