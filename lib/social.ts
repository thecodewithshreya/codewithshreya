import { Github, Linkedin, Youtube, type LucideIcon } from "lucide-react";

// Fill in a profile URL to show that icon in the footer and on the contact page.
// Entries without a URL stay hidden, so the site never shows a dead link.
const profiles: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "YouTube", href: "", icon: Youtube },
  { label: "LinkedIn", href: "", icon: Linkedin },
  { label: "GitHub", href: "", icon: Github },
];

export const socialLinks = profiles.filter((profile) => profile.href);
