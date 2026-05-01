import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export const Footer = () => {
  const cols = [
    {
      title: "Shop",
      links: ["New Arrivals", "Best Sellers", "Sale", "Gift Cards"],
    },
    {
      title: "Help",
      links: ["Shipping", "Returns", "Order Status", "Contact"],
    },
    {
      title: "Company",
      links: ["About", "Sustainability", "Careers", "Press"],
    },
  ];
  return (
    <footer className="border-t">
      <div className="container mx-auto section py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h3 className="font-display text-heading-3 md:text-heading-2 uppercase leading-none">
              Join the
              <br />
              movement.
            </h3>
            <form className="mt-8 flex max-w-md border-b focus-within:border-foreground/50 transition duration-300">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 py-3 outline-none placeholder:text-muted-foregound"
              />
              <Button
                type="submit"
                variant={"ghost"}
                className="rounded-full px-6 py-2 h-full"
              >
                Subscribe
              </Button>
            </form>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                {c.title}
              </p>
              <ul className="space-y-2.5 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="group flex gap-1 hover:-translate-x-2 transition-all hover:text-primary"
                    >
                      {l}
                      <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-1 flex lg:flex-col gap-3">
            {[IoLogoInstagram, FaXTwitter, FaTiktok].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-10 w-10 max-sm:bg-accent rounded-full border border-background/20 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p className="font-display text-2xl text-foreground uppercase">
            SHOE<span className="text-accent">.</span>EMPIRE
          </p>
          <p>© 2026 Shoe Empire. Engineered to outlast.</p>
        </div>
      </div>
    </footer>
  );
};
