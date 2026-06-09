import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  BarChart3,
  Users,
  Briefcase,
  Shield,
  MessageSquare,
  Rocket,
  Globe,
  ChartPie,
  ClipboardCheck,
  ArrowRight,
  ChevronDown,
  Lightbulb,
  CreditCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const floatHover = {
  whileHover: { y: -8, rotateX: 0.5, rotateY: 0.5, scale: 1.005 },
  transition: { type: "spring", stiffness: 220, damping: 24 },
};

const cardLift = {
  whileHover: { y: -10, scale: 1.01, boxShadow: "0 32px 80px rgba(15, 23, 42, 0.35)" },
  transition: { type: "spring", stiffness: 180, damping: 24 },
};

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true, amount: 0.15 },
};

const categories: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Getting Started", description: "Launch your first brand in minutes.", icon: Sparkles },
  { title: "Branding & Logos", description: "Design systems, logomarks, and color strategies.", icon: Layers },
  { title: "AI Assistant", description: "Smart workflows, prompts, and automation.", icon: MessageSquare },
  { title: "Payments", description: "Billing, plans, and enterprise billing controls.", icon: CreditCard },
  { title: "Opportunities", description: "Discover high-value markets and business ideas.", icon: Globe },
  { title: "Enterprise", description: "Scale teams with custom AI operations.", icon: Briefcase },
  { title: "Marketing", description: "Growth tools for campaigns and storytelling.", icon: BarChart3 },
  { title: "Security & Privacy", description: "Data protection designed for modern businesses.", icon: ShieldCheck },
  { title: "Accounts", description: "User settings, access, and profile controls.", icon: Users },
  { title: "Technical Support", description: "Help when you need it most.", icon: ClipboardCheck },
];

const faqSections = [
  {
    title: "Getting Started",
    items: [
      {
        question: "What is Machrou3i?",
        answer:
          "Machrou3i is an AI-first branding platform that helps founders, creators, and teams build premium identities, names, logos, and marketing systems with speed and confidence.",
      },
      {
        question: "How does AI branding work?",
        answer:
          "Our AI models analyze your brief, industry, and values to generate visual directions, naming options, color palettes, typography systems, and messaging that feel refined and strategic.",
      },
      {
        question: "Can I generate business names?",
        answer:
          "Yes. The platform includes dedicated tools for generating high-quality business names, product names, and brand naming concepts tailored to your voice.",
      },
      {
        question: "How do I save projects?",
        answer:
          "Every brand session is automatically saved to your account. You can open past projects, continue work, and export the assets you need at any time.",
      },
    ],
  },
  {
    title: "Branding & Logos",
    items: [
      {
        question: "How are logos generated?",
        answer:
          "Logos are generated using our AI-driven design engine that combines your brief with proven visual systems, delivering polished brandmark concepts instantly.",
      },
      {
        question: "Can I customize colors?",
        answer:
          "Absolutely. Machrou3i lets you refine color palettes, swap tones, and choose the combination that best represents your brand personality.",
      },
      {
        question: "Can I export assets?",
        answer:
          "Yes. Exports include brand guidelines, color palettes, typography directions, and asset-ready files for presentations and stakeholder review.",
      },
      {
        question: "Does Machrou3i support logo variants?",
        answer:
          "You can create multiple logo variants, stacked and horizontal layouts, and adapt the design for digital, print, and social use cases.",
      },
    ],
  },
  {
    title: "AI Assistant",
    items: [
      {
        question: "What can the AI Assistant do?",
        answer:
          "It generates brand stories, messaging, growth recommendations, and creative directions so you can move from idea to execution without guesswork.",
      },
      {
        question: "Can I reuse prompts?",
        answer:
          "Yes. Save prompt templates, iterate on outputs, and reuse the same workflow across new projects for consistent results.",
      },
      {
        question: "Is the assistant available in multiple languages?",
        answer:
          "Machrou3i supports international brand directions and can generate outputs in several major languages as part of your project workflow.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        question: "Is payment secure?",
        answer:
          "Our payment process uses trusted providers and encrypted checkout flows to keep your billing secure at every step.",
      },
      {
        question: "What plans exist?",
        answer:
          "We offer tiered plans for solopreneurs, growing teams, and enterprise customers with flexible access to premium branding and AI tools.",
      },
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes. You can manage or cancel your subscription through your account dashboard with no long-term lock-in.",
      },
      {
        question: "Do you offer enterprise invoicing?",
        answer:
          "Enterprise customers can request invoicing, custom billing terms, and dedicated account management through our support team.",
      },
    ],
  },
  {
    title: "Opportunities",
    items: [
      {
        question: "How does Opportunity Discovery work?",
        answer:
          "The tool analyzes markets, categories, and audience signals to recommend strategic business ideas and growth opportunities.",
      },
      {
        question: "Can I use it for marketing validation?",
        answer:
          "Yes. The platform helps validate branding concepts against audience expectations and go-to-market opportunities.",
      },
      {
        question: "Can I export opportunity briefs?",
        answer:
          "Export brief summaries, market insights, and creative direction reports for investor and team review.",
      },
    ],
  },
  {
    title: "Enterprise",
    items: [
      {
        question: "Do you support teams?",
        answer:
          "Machrou3i supports team collaboration, shared workspaces, and role-based access for design and marketing teams.",
      },
      {
        question: "Can enterprises get custom AI workflows?",
        answer:
          "Yes. Large customers can unlock custom workflows, integrations, and branded automation tailored to their business needs.",
      },
      {
        question: "Is there dedicated onboarding?",
        answer:
          "Enterprise customers receive onboarding guidance, project reviews, and priority support to accelerate adoption.",
      },
    ],
  },
  {
    title: "Security & Privacy",
    items: [
      {
        question: "How is data protected?",
        answer:
          "We protect your data with modern encryption, secure storage, and strict access controls across the platform.",
      },
      {
        question: "Is information encrypted?",
        answer:
          "Yes. Sensitive data is encrypted both in transit and at rest as part of our platform security strategy.",
      },
      {
        question: "Do you comply with privacy standards?",
        answer:
          "We follow established privacy best practices and provide controls that help you manage consent and data use.",
      },
    ],
  },
  {
    title: "Accounts",
    items: [
      {
        question: "How do I manage my profile?",
        answer:
          "Your account dashboard lets you update profile details, billing info, and project preferences in one place.",
      },
      {
        question: "Can I add collaborators?",
        answer:
          "Yes. Add collaborators to your workspace and assign them roles for seamless teamwork.",
      },
      {
        question: "What if I lose access?",
        answer:
          "Contact our support team and we will help you recover access securely and quickly.",
      },
    ],
  },
  {
    title: "Technical Support",
    items: [
      {
        question: "How do I reach support?",
        answer:
          "Use the Contact Support button below or email our team directly for help with account, branding, or technical questions.",
      },
      {
        question: "What response times can I expect?",
        answer:
          "Our support team aims to respond to requests promptly, with priority handling for enterprise customers.",
      },
      {
        question: "Can I request new features?",
        answer:
          "Yes. We welcome feedback and feature requests from customers building on Machrou3i.",
      },
    ],
  },
];

const featureHighlights = [
  { title: "AI Branding", desc: "Generated identity systems that look and feel premium.", icon: Sparkles },
  { title: "Logo Generator", desc: "Create logo concepts instantly with smart design direction.", icon: Layers },
  { title: "AI Assistant", desc: "Get messaging, campaign ideas, and brand briefs fast.", icon: MessageSquare },
  { title: "Opportunity Discovery", desc: "Find product, brand, and market fit opportunities.", icon: Globe },
  { title: "Marketing Automation", desc: "Turn creative insights into growth-focused content.", icon: BarChart3 },
  { title: "Enterprise Solutions", desc: "Scale teams with secure workflows and business controls.", icon: Briefcase },
];

const stats = [
  { label: "Brands Created", value: 50000 },
  { label: "AI Interactions", value: 100000 },
  { label: "Businesses Supported", value: 1000 },
  { label: "User Satisfaction", value: 98, suffix: "%" },
];

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1523225137375-5f45f621e2fd?auto=format&fit=crop&w=1200&q=80",
    alt: "AI dashboard for growth",
    caption: "Brand intelligence visualized",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    alt: "Entrepreneurs collaborating on startup ideas",
    caption: "Startup teams building brands",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    alt: "Marketing growth dashboard",
    caption: "Digital growth and strategy",
  },
];

const featuredQuestions = faqSections
  .flatMap((section) => section.items.map((item) => ({ section: section.title, ...item })))
  .slice(0, 6);

const stories = [
  {
    title: "Brand identity that feels alive",
    description: "See how Machrou3i transforms your brand direction into a polished growth system.",
    image: heroImages[0],
    reversed: false,
  },
  {
    title: "Strategy built for founders",
    description: "From product naming to pitch-ready visuals, every detail is aligned with your ambitions.",
    image: heroImages[2],
    reversed: true,
  },
];

const testimonials = [
  {
    quote: "Machrou3i made our launch assets feel premium overnight.",
    name: "Yara Haddad, Founder",
  },
  {
    quote: "The platform answered questions before we even asked them.",
    name: "Omar Nabil, Growth Lead",
  },
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(faqSections[0].title);
  const [openQuestion, setOpenQuestion] = useState<string>(featuredQuestions[0].question);
  const [counters, setCounters] = useState(stats.map(() => 0));

  const activeSection = useMemo(
    () => faqSections.find((section) => section.title === activeCategory) ?? faqSections[0],
    [activeCategory]
  );

  const featured = useMemo(
    () => featuredQuestions.map((question) => ({
      ...question,
      short: question.answer.length > 110 ? `${question.answer.slice(0, 110)}...` : question.answer,
    })),
    []
  );

  useEffect(() => {
    const increments = stats.map(({ value }) => Math.max(1, Math.round(value / 30)));
    const interval = window.setInterval(() => {
      setCounters((current) =>
        current.map((count, index) => {
          const target = stats[index].value;
          if (count >= target) return target;
          return Math.min(target, count + increments[index]);
        })
      );
    }, 40);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-neon/10 via-transparent to-transparent opacity-70" />

      <section className="relative overflow-hidden bg-gradient-hero px-4 pb-24 pt-24 sm:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-6 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-16 top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute left-12 bottom-6 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto grid gap-16 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <motion.div {...fadeUp(0.1)} className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neon shadow-[0_18px_80px_-58px_rgba(16,185,129,0.7)] backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              FAQ & product guidance for Machrou3i users
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Questions, Answered Beautifully.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              Everything entrepreneurs need to know about Machrou3i.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {featureHighlights.slice(0, 4).map((feature) => (
                <motion.div
                  key={feature.title}
                  {...floatHover}
                  className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.65)] backdrop-blur-3xl"
                >
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.15)}
            className="relative flex justify-center lg:justify-end"
            style={{ perspective: 1600 }}
          >
            <div className="relative w-full max-w-xl">
              <div className="absolute -left-12 top-10 h-28 w-28 rounded-full bg-neon/10 blur-3xl" />
              <div className="absolute right-0 top-24 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
              {heroImages.map((item, index) => (
                <motion.div
                  key={item.src}
                  {...cardLift}
                  className={`absolute left-0 right-0 mx-auto overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/85 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.6)] transition-all ${
                    index === 0 ? "top-0 h-80 w-full" : index === 1 ? "top-12 left-10 h-64 w-11/12" : "top-24 left-20 h-72 w-10/12"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent px-6 py-4 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-white">{item.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <motion.div {...fadeUp(0.1)} className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-neon">Interactive collections</p>
          <h2 className="mt-4 text-4xl font-bold font-heading text-white">Explore FAQs by experience</h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.slice(0, 9).map((category, index) => {
            const active = category.title === activeCategory;
            return (
              <motion.button
                key={category.title}
                onClick={() => setActiveCategory(category.title)}
                whileHover={{ y: -6 }}
                className={`group relative flex h-full flex-col rounded-[2rem] border p-6 text-left transition-all duration-300 ${
                  active ? "border-neon bg-white/10 shadow-[0_35px_80px_-45px_rgba(56,189,248,0.65)]" : "border-white/10 bg-slate-950/80 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.4)]"
                }`}
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neon/10 text-neon shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                  <category.icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{category.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-neon">
                  {active ? "Open" : "Preview"}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          {...fadeUp(0.1)}
          className="mt-10 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.65)] backdrop-blur-3xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-neon">{activeSection.title}</p>
              <h3 className="mt-2 text-3xl font-bold text-white">Key questions for this topic</h3>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
              {activeSection.items.length} questions
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {activeSection.items.map((item) => {
              const open = openQuestion === item.question;
              return (
                <motion.div
                  key={item.question}
                  layout
                  className={`overflow-hidden rounded-[1.75rem] border p-6 transition-all duration-300 ${
                    open ? "border-neon bg-white/10 shadow-[0_30px_90px_-45px_rgba(56,189,248,0.35)]" : "border-white/10 bg-slate-950/90 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(open ? "" : item.question)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-base font-semibold text-white">{item.question}</span>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`h-5 w-5 ${open ? "text-neon" : "text-muted-foreground"}`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mt-4 overflow-hidden text-sm leading-7 text-muted-foreground"
                      >
                        <p>{item.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <motion.div {...fadeUp(0.1)} className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-neon">Most asked</p>
          <h2 className="mt-4 text-4xl font-bold font-heading text-white">Featured questions</h2>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-3">
          {featured.map((item, index) => (
            <motion.div
              key={item.question}
              {...cardLift}
              className="group rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.55)] backdrop-blur-3xl transition-all duration-300"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-neon/15 text-neon shadow-[0_0_30px_rgba(56,189,248,0.15)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.short}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neon">
                {item.section}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <motion.div {...fadeUp(0.1)} className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-neon">Trusted by ambitious founders</p>
          <h2 className="mt-4 text-4xl font-bold font-heading text-white">A premium platform for bold teams</h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              {...cardLift}
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.55)] backdrop-blur-3xl"
            >
              <p className="text-base leading-8 text-muted-foreground">“{testimonial.quote}”</p>
              <p className="mt-6 text-sm font-semibold text-white">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {stories.map((story, index) => (
        <section key={story.title} className="container mx-auto px-4 pb-20">
          <motion.div
            {...fadeUp(0.1)}
            className={`grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center ${story.reversed ? "lg:grid-flow-dense" : ""}`}
          >
            <motion.div
              {...fadeUp(0.15)}
              className={`rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-[0_40px_100px_-60px_rgba(15,23,42,0.65)] backdrop-blur-3xl ${story.reversed ? "lg:col-start-2" : ""}`}
            >
              <p className="text-sm uppercase tracking-[0.35em] text-neon">Visual storytelling</p>
              <h3 className="mt-4 text-3xl font-bold text-white">{story.title}</h3>
              <p className="mt-4 text-base leading-8 text-muted-foreground">{story.description}</p>
            </motion.div>

            <motion.div
              {...fadeUp(0.2)}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/80 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.6)]"
              whileHover={{ y: -6 }}
            >
              <img
                src={story.image.src}
                alt={story.image.alt}
                loading="lazy"
                className="h-[420px] w-full object-cover transition duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent px-8 py-6 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">{story.image.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        </section>
      ))}

      <section className="container mx-auto px-4 pb-20">
        <motion.div {...fadeUp(0.1)} className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-neon">Platform highlights</p>
          <h2 className="mt-4 text-4xl font-bold font-heading text-white">Built for the way teams work</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureHighlights.map((feature) => (
            <motion.div
              key={feature.title}
              {...cardLift}
              className="glass-panel rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.55)] backdrop-blur-3xl transition-all duration-300"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neon/15 text-neon mb-5 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <motion.div
          {...fadeUp(0.1)}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-black p-10 shadow-[0_50px_120px_-60px_rgba(15,23,42,0.7)] backdrop-blur-3xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(67,56,202,0.1),transparent_30%)] pointer-events-none" />
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center relative">
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.35em] text-neon">Still Curious?</p>
              <h2 className="mt-4 text-4xl font-bold text-white">Our AI tools are ready when you are.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Reach out for bespoke onboarding, explore pricing, or start your next brand story with confidence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href="mailto:support@machrou3i.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(236,72,153,0.18)]"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </motion.a>
                <motion.div whileHover={{ y: -2 }} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-neon/40">
                  <Link to="/pricing" className="flex items-center gap-2">
                    Explore Platform
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
            <motion.div
              {...cardLift}
              className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)]"
            >
              <div className="flex items-center gap-4 rounded-3xl bg-slate-900/80 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neon/15 text-neon shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Launch support included</p>
                  <p className="text-sm text-muted-foreground">From brand strategy to execution, we'll help you move faster.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                  Need enterprise support? We provide custom onboarding and workflow setup.
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                  You can also schedule a demo with our team to discuss brand strategy.
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default FAQ;
