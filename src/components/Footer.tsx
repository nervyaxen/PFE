import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neon" />
          <span className="font-heading font-bold text-gradient-neon">{t("brand")}</span>
        </div>
        <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
