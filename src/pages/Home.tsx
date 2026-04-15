import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, MessageSquare, BarChart3, Rocket, ArrowRight, Zap } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const Home = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Brain, ...t("features.ai", { returnObjects: true }) as { title: string; desc: string } },
    { icon: MessageSquare, ...t("features.chatbot", { returnObjects: true }) as { title: string; desc: string } },
    { icon: Rocket, ...t("features.marketing", { returnObjects: true }) as { title: string; desc: string } },
    { icon: BarChart3, ...t("features.dashboard", { returnObjects: true }) as { title: string; desc: string } },
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-neon mb-8">
            <Zap className="h-4 w-4" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading leading-tight mb-6"
          >
            {t("hero.title")}{" "}
            <span className="text-gradient-neon">{t("hero.titleHighlight")}</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.3)}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-neon text-accent-foreground font-semibold text-lg glow-neon hover:opacity-90 transition-all"
            >
              {t("hero.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl glass-panel font-semibold text-lg text-foreground hover:border-neon/40 transition-all"
            >
              {t("hero.ctaSecondary")}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.5)}
            className="grid grid-cols-3 gap-6 mt-20 max-w-lg mx-auto"
          >
            {[
              { value: "2,400+", label: t("hero.stat1") },
              { value: "94%", label: t("hero.stat2") },
              { value: "35+", label: t("hero.stat3") },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient-gold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} viewport={{ once: true }} whileInView="animate" initial="initial" className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">{t("features.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("features.subtitle")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-panel rounded-2xl p-6 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center mb-4 group-hover:glow-neon transition-shadow">
                  <feature.icon className="h-6 w-6 text-neon" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
