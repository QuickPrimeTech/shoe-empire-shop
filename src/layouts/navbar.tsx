"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Sun,
  Moon,
  Monitor,
  Search,
  ShoppingBag,
  Heart,
  Accessibility,
  Type,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";
import { RiMenu2Line } from "react-icons/ri";

/* ─── NAV LINKS ─── */
const NAV = [
  { label: "New", href: "/new" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Sale", href: "/sale", accent: true },
];

/* ─── THEME OPTIONS ─── */
const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

/* ─── ACCESSIBILITY STORE (localStorage-backed) ─── */
function useA11y() {
  const [mounted, setMounted] = React.useState(false);
  const [fontSize, setFontSize] = React.useState<"sm" | "base" | "lg">("base");
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const fs = localStorage.getItem("a11y-font") as "sm" | "base" | "lg" | null;
    const rm = localStorage.getItem("a11y-motion");
    if (fs) setFontSize(fs);
    if (rm !== null) setReducedMotion(rm === "1");
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.classList.add(`text-${fontSize}`);
    root.classList.toggle("reduce-motion", reducedMotion);
    localStorage.setItem("a11y-font", fontSize);
    localStorage.setItem("a11y-motion", reducedMotion ? "1" : "0");
  }, [fontSize, reducedMotion, mounted]);

  return { mounted, fontSize, setFontSize, reducedMotion, setReducedMotion };
}

/* ═════════════════════════════════════════
    NAVBAR
    ═════════════════════════════════════════ */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [a11yOpen, setA11yOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-border/60 shadow-sm"
            : "bg-background border-transparent",
        )}
      >
        <div className="container mx-auto h-16 px-4 flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 hover:bg-secondary rounded-full transition lg:hidden">
                <RiMenu2Line className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-0">
              <MobileNavContent
                pathname={pathname}
                onA11y={() => setA11yOpen(true)}
              />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="font-heading font-bold text-xl tracking-tight lg:ml-0 ml-2"
          >
            Shoe Empire<span className="text-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  item.accent
                    ? "text-red-500 hover:text-red-600"
                    : pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {item.label}
                {pathname === item.href && !item.accent && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-secondary rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-secondary rounded-full transition"
            >
              <Search className="size-5" />
            </button>
            <button
              onClick={() => setA11yOpen(true)}
              className="p-2 hover:bg-secondary rounded-full transition hidden sm:flex"
            >
              <Accessibility className="size-5" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition hidden sm:block">
              <Heart className="size-5" />
            </button>
            <button className="relative p-2 hover:bg-secondary rounded-full transition">
              <ShoppingBag className="size-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              className="container mx-auto pt-28 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Search className="absolute left-0 bottom-4 size-6 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search products, brands..."
                  className="w-full bg-transparent text-3xl md:text-4xl font-bold border-b-2 border-foreground/20 focus:border-primary outline-none pb-4 pl-10 placeholder:text-muted-foreground/40"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-0 bottom-3 p-2 hover:bg-secondary rounded-full transition"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Trending
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Air Max", "Running", "Jordan", "New Balance"].map((t) => (
                    <span
                      key={t}
                      className="px-4 py-2 border rounded-full text-sm hover:border-primary hover:text-foreground cursor-pointer transition"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility Sheet */}
      <Sheet open={a11yOpen} onOpenChange={setA11yOpen}>
        <SheetContent side="right" className="w-[360px] p-0">
          <A11yPanel />
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ─── Mobile Nav Content ─── */
function MobileNavContent({
  pathname,
  onA11y,
}: {
  pathname: string;
  onA11y: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 pt-6 pb-2">
        <SheetTitle className="text-left text-lg font-bold">Menu</SheetTitle>
      </SheetHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {NAV.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <SheetClose asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    item.accent
                      ? "text-red-500 hover:bg-red-500/10"
                      : pathname === item.href
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.label}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </SheetClose>
            </motion.div>
          ))}
        </div>

        <Separator className="my-4" />

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
          <Accessibility className="size-5" />
          Accessibility
        </button>
      </ScrollArea>
    </div>
  );
}

/* ─── Accessibility Panel ─── */
function A11yPanel() {
  const { theme, setTheme } = useTheme();
  const { mounted, fontSize, setFontSize, reducedMotion, setReducedMotion } =
    useA11y();

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Accessibility className="size-5 text-primary" />
          </div>
          <div>
            <SheetTitle className="text-left">Accessibility</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Customize your experience
            </p>
          </div>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6">
          {/* Theme */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Theme
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((t) => (
                <Button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  variant={theme === t.value ? "default" : "secondary"}
                >
                  <t.icon />
                  <span className="text-xs font-medium">{t.label}</span>
                </Button>
              ))}
            </div>
          </section>

          <Separator />

          {/* Font Size */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Text Size
            </h3>
            <div className="flex items-center gap-3 bg-muted rounded-2xl p-1.5">
              {(
                [
                  { key: "sm" as const, icon: Minus },
                  { key: "base" as const, icon: Type },
                  { key: "lg" as const, icon: Plus },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFontSize(item.key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
                    fontSize === item.key
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.key === "sm"
                    ? "Small"
                    : item.key === "base"
                      ? "Default"
                      : "Large"}
                </button>
              ))}
            </div>
          </section>

          <Separator />

          {/* Motion */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Motion
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
              <div>
                <p className="text-sm font-medium">Reduce Motion</p>
                <p className="text-xs text-muted-foreground">
                  Minimize animations
                </p>
              </div>
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </section>
        </div>
      </ScrollArea>

      <div className="px-6 py-4 border-t">
        <SheetClose asChild>
          <Button className="w-full">Done</Button>
        </SheetClose>
      </div>
    </div>
  );
}
