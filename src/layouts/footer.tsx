import { FaFacebook } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cacheLife } from "next/cache";

const cols = [
  {
    title: "Shop",
    links: [
      {
        label: "Discounted",
        url: "/products?discounted=true",
      },
      {
        label: "Categories",
        url: "/categories",
      },
      {
        label: "Best Sellers",
        url: "#",
      },
    ],
  },
  {
    title: "Help",
    links: [
      {
        label: "Shipping",
        url: "#",
      },
      { label: "Returns", url: "#" },
      { label: "Order Status", url: "#" },
      { label: "Contact", url: "/#find-us" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", url: "#" },
      { label: "Careers", url: "#" },
    ],
  },
];

const socials = [
  {
    label: "Instagram",
    url: "https://www.instagram.com/shoeempire.co.ke/",
    icon: IoLogoInstagram,
  },
  {
    label: "Tiktok",
    url: "https://www.tiktok.com/@shoeempire",
    icon: FaTiktok,
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/Shoeempire.co.ke/",
    icon: FaFacebook,
  },
];
async function getCurrentYear() {
  "use cache";
  cacheLife({
    revalidate: 60 * 60 * 24 * 365,
    stale: 60 * 60 * 24 * 365,
    expire: 60 * 60 * 24 * 365,
  });
  return new Date().getFullYear();
}

export const Footer = () => {
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
                  <li key={l.label}>
                    <Link
                      href={l.url}
                      className="group flex gap-1 hover:-translate-x-2 transition-all hover:text-primary"
                    >
                      {l.label}
                      <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all size-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-1 flex lg:flex-col gap-3">
            {socials.map((social) => (
              <Button
                key={social.url}
                className="bg-secondary text-secondary-foreground hover:text-primary-foreground border"
                aria-label={`Visit our ${social.label} profile`}
                title={`Visit our ${social.label} profile`}
                size={"icon-lg"}
                asChild
              >
                <Link href={social.url} rel="noreferre noopener" target="blank">
                  <social.icon />
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p className="font-heading-3 font-bold font-heading text-2xl text-foreground uppercase">
            SHOE<span className="text-accent">.</span>EMPIRE
          </p>
          <p>© {getCurrentYear()} Shoe Empire. Engineered to outlast.</p>
        </div>
      </div>
    </footer>
  );
};
