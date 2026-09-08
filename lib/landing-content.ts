export const NAV = [
  { href: "#preview", label: "Product" },
  { href: "#templates", label: "Templates" },
  { href: "#pricing", label: "Pricing" },
  { href: "#roadmap", label: "Roadmap" },
] as const;

export const PLANS = [
  {
    name: "Free",
    price: 0,
    audience: "Explore the idea",
    description: "A small first step into visual building.",
    features: ["3 trial builds", "Trial scope to be finalized"],
    featured: false,
  },
  {
    name: "Starter",
    price: 15,
    audience: "Your first server",
    description: "Room to build and refine your core systems.",
    features: ["20 builds / month", "2 revisions*"],
    featured: false,
  },
  {
    name: "Pro",
    price: 30,
    audience: "More room to build",
    description: "A larger allowance for evolving servers.",
    features: ["60 builds / month", "5 revisions*"],
    featured: true,
  },
  {
    name: "Business",
    price: 75,
    audience: "Bigger workflows",
    description: "More capacity, with a priority build queue.",
    features: [
      "200 builds / month",
      "Priority queue",
      "Unlimited revisions proposed*",
    ],
    featured: false,
  },
] as const;

export const FAQS = [
  {
    question: "Can I use StackForge on my server today?",
    answer:
      "This page presents the planned product, not a released editor. The interactive preview runs only in your browser and does not generate deployable game scripts. Release availability and supported versions will be announced after validation.",
  },
  {
    question: "Which game will be supported first?",
    answer:
      "FiveM is the leading candidate because it overlaps with the game-mod studio project used to develop and test reusable blocks. The first game, framework and supported versions are not finalized. Minecraft and Unturned are part of the longer-term vision, not launch compatibility promises.",
  },
  {
    question: "Is this unrestricted AI code generation?",
    answer:
      "No. The roadmap calls for composing pre-tested modular blocks from a structured visual specification. That approach can reduce variability, but it does not guarantee security. Block combinations, server-side permissions, inputs and framework compatibility still need validation.",
  },
  {
    question: "Where will the generated systems run?",
    answer:
      "The plan is to export game-specific systems for your own server. Package formats, dependencies and installation steps will depend on the supported game and framework. The JSON shown here is an illustrative blueprint, not a native game resource or plugin.",
  },
  {
    question: "What happens to my exports if I cancel?",
    answer:
      "Export licensing, ongoing use after cancellation, update access and redistribution rights are not finalized. These terms need to be published before paid plans become available. We are not promising unrestricted ownership of bundled third-party components.",
  },
  {
    question: "How will billing and revisions work?",
    answer:
      "The roadmap proposes monthly USD plans with build limits. Revision scope, failed-build handling, trial resets and fair-use terms remain to be defined. Paddle or Lemon Squeezy are being considered for web billing; no payment provider or checkout is live on this page.",
  },
  {
    question: "Are desktop, mobile and selling tools included in the MVP?",
    answer:
      "No. Web comes first. A Tauri desktop client and a Tebex export bridge are later expansion candidates. Mobile is planned as a companion for monitoring, notifications and light changes—not a full drag-and-drop editor. An internal marketplace and personal AI agency workflows are further out.",
  },
] as const;
