import { motion, useReducedMotion } from "framer-motion";
import { Cpu, Shield, Layers, Database, Code, Workflow, Server, Lock } from "lucide-react";

export default function PlatformStackSection() {
  const reduceMotion = useReducedMotion();

  const stackCategories = [
    {
      category: "Frontend",
      icon: <Code className="h-5 w-5" />,
      items: [
        { name: "React", desc: "UI framework for web and desktop" },
        { name: "Electron", desc: "Desktop application wrapper" },
        { name: "TypeScript", desc: "Type-safe development" },
        { name: "Tailwind CSS", desc: "Utility-first styling" },
      ],
      color: "neon",
    },
    {
      category: "Backend",
      icon: <Server className="h-5 w-5" />,
      items: [
        { name: "NestJS", desc: "Scalable Node.js framework" },
        { name: "Node.js API", desc: "RESTful and GraphQL endpoints" },
        { name: "Express", desc: "HTTP server foundation" },
        { name: "TypeScript", desc: "Backend type safety" },
      ],
      color: "gold",
    },
    {
      category: "Database",
      icon: <Database className="h-5 w-5" />,
      items: [
        { name: "MongoDB", desc: "NoSQL document database" },
        { name: "Mongoose", desc: "ODM for MongoDB" },
        { name: "Indexing", desc: "Optimized query performance" },
        { name: "Replication", desc: "High availability setup" },
      ],
      color: "neon",
    },
    {
      category: "AI & ML",
      icon: <Cpu className="h-5 w-5" />,
      items: [
        { name: "Python", desc: "AI model development" },
        { name: "Hugging Face", desc: "Pre-trained models & transformers" },
        { name: "Roadmap Prediction", desc: "AI-powered timeline forecasting" },
        { name: "Market Analysis", desc: "NLP for market insights" },
        { name: "Product Analysis", desc: "Competitive intelligence AI" },
      ],
      color: "gold",
    },
    {
      category: "Automation",
      icon: <Workflow className="h-5 w-5" />,
      items: [
        { name: "n8n Workflows", desc: "Visual workflow automation" },
        { name: "API Integrations", desc: "Third-party service connections" },
        { name: "Scheduled Tasks", desc: "Automated job execution" },
        { name: "Event Triggers", desc: "Real-time automation" },
      ],
      color: "neon",
    },
    {
      category: "DevOps & Linux",
      icon: <Layers className="h-5 w-5" />,
      items: [
        { name: "Docker", desc: "Containerization & deployment" },
        { name: "systemd", desc: "Service management" },
        { name: "Bash Scripts", desc: "Automation & maintenance" },
        { name: "Cron Jobs", desc: "Scheduled task execution" },
        { name: "Monitoring", desc: "htop, Glances, system metrics" },
      ],
      color: "gold",
    },
    {
      category: "Security",
      icon: <Shield className="h-5 w-5" />,
      items: [
        { name: "JWT Auth", desc: "Token-based authentication" },
        { name: "RBAC", desc: "Role-Based Access Control" },
        { name: "Encrypted Storage", desc: "Secure data at rest" },
        { name: "HTTPS/TLS", desc: "Encrypted data in transit" },
        { name: "Audit Logs", desc: "Security event tracking" },
      ],
      color: "neon",
    },
  ];

  return (
    <section id="stack" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="Technology stack">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Technology Blueprint|Built like a product. Presented like a film.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Cpu className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Technology stack</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="Built like a product. Presented like a film|A clear blueprint for cross-platform execution and operations."
          >
            Built like a product. Presented like a film.
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            A clear blueprint for cross-platform execution and operations.
          </p>
        </div>

        <div className="mb-6 glass rounded-[2rem] p-6" data-narrate="One Codebase|Three surfaces. Zero friction.">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-3">
              <Cpu className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">One Codebase. Three Surfaces.</h3>
              <p className="text-sm text-muted-foreground">Web, Desktop, Mobile—powered by shared core logic</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stackCategories.map((category, catIdx) => (
            <motion.div
              key={category.category}
              className="glass glass-hover rounded-[2rem] p-6"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: catIdx * 0.1 }}
              data-narrate={`${category.category}|${category.items.length} technologies`}
              whileHover={reduceMotion ? undefined : { y: -4 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className={`rounded-xl bg-${category.color}/20 p-2 text-${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold">{category.category}</h3>
              </div>

              <div className="space-y-3">
                {category.items.map((item, itemIdx) => (
                  <motion.div
                    key={item.name}
                    className="rounded-xl bg-surface/40 p-3"
                    initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: catIdx * 0.1 + itemIdx * 0.05 }}
                    data-narrate={`${item.name}|${item.desc}`}
                  >
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-6 glass rounded-[2rem] p-6"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          data-narrate="Architecture Summary|Want this page to be interactive with real data? We can connect a backend next."
        >
          <div className="flex items-start gap-4">
            <Lock className="h-5 w-5 text-gold mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Security Architecture</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                JWT tokens with refresh mechanism, RBAC with granular permissions, encrypted storage for sensitive data, 
                audit logging for compliance, and HTTPS/TLS for all communications.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
