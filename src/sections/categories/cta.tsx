// @/sections/categories/cta.tsx

import Link from "next/link";

export const CTA = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="relative rounded-2xl bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Browse our full catalog to discover even more amazing products
            across all categories.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 rounded-full bg-background text-primary font-semibold hover:bg-background/90 transition-colors duration-200 shadow-lg"
          >
            View All Products
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
