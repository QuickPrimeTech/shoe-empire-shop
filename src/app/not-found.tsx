"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        {/* Decorative Element */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 scale-150 blur-3xl opacity-20 bg-primary/30 rounded-full" />
          <Search className="relative h-24 w-24 text-primary animate-bounce" />
        </div>

        <h1 className="mt-4 text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Page not found
        </h2>

        <p className="mt-4 text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved, deleted, or perhaps it never existed in the
          first place.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </Button>
        </div>

        {/* Support Link */}
        <p className="mt-10 text-sm text-muted-foreground">
          Need help?{" "}
          <Link
            href="/contact"
            className="font-medium text-primary hover:underline"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
