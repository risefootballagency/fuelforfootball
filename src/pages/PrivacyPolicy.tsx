import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <>
      <SEO 
        title="Privacy Policy - Fuel For Football"
        description="Learn how Fuel For Football collects, uses, and protects your personal information. Our privacy policy explains your rights and our data practices."
        url="/privacy-policy"
      />
      <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 space-y-3 animate-fade-in">
            <div className="inline-block">
              <span className="text-sm font-bebas uppercase tracking-widest text-primary border border-primary/30 px-6 py-2 rounded-full">
                {t("privacy.badge", "Legal")}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas uppercase tracking-wider text-foreground">
              {t("privacy.title_1", "Privacy")} <span className="text-primary">{t("privacy.title_2", "Policy")}</span>
            </h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.intro_heading", "Introduction")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.intro_text", 'Fuel For Football ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.')}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.collect_heading", "Information We Collect")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("privacy.collect_intro", "We may collect information about you in a variety of ways, including:")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>{t("privacy.collect_1", "Personal identification information (name, email address, phone number)")}</li>
                <li>{t("privacy.collect_2", "Professional information (club, position, career statistics)")}</li>
                <li>{t("privacy.collect_3", "Technical data (IP address, browser type, device information)")}</li>
                <li>{t("privacy.collect_4", "Usage data (pages visited, time spent on site, interactions)")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.use_heading", "How We Use Your Information")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("privacy.use_intro", "We use the information we collect to:")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>{t("privacy.use_1", "Provide, operate, and maintain our services")}</li>
                <li>{t("privacy.use_2", "Improve and personalize your experience")}</li>
                <li>{t("privacy.use_3", "Communicate with you about opportunities and updates")}</li>
                <li>{t("privacy.use_4", "Analyze usage patterns and optimize our website")}</li>
                <li>{t("privacy.use_5", "Send marketing and promotional communications (with your consent)")}</li>
                <li>{t("privacy.use_6", "Comply with legal obligations and protect our rights")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.sharing_heading", "Data Sharing and Disclosure")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.sharing_intro", "We may share your information with:")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>{t("privacy.sharing_1", "Football clubs and scouts (with your consent)")}</li>
                <li>{t("privacy.sharing_2", "Service providers who assist in our operations")}</li>
                <li>{t("privacy.sharing_3", "Legal authorities when required by law")}</li>
                <li>{t("privacy.sharing_4", "Business partners for legitimate business purposes")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.security_heading", "Data Security")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.security_text", "We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.rights_heading", "Your Rights")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("privacy.rights_intro", "You have the right to:")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>{t("privacy.rights_1", "Access your personal data")}</li>
                <li>{t("privacy.rights_2", "Correct inaccurate or incomplete data")}</li>
                <li>{t("privacy.rights_3", "Request deletion of your data")}</li>
                <li>{t("privacy.rights_4", "Object to processing of your data")}</li>
                <li>{t("privacy.rights_5", "Request data portability")}</li>
                <li>{t("privacy.rights_6", "Withdraw consent at any time")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.cookies_heading", "Cookies and Tracking")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.cookies_text", "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user behavior. You can control cookie settings through your browser preferences.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.thirdparty_heading", "Third-Party Links")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.thirdparty_text", "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.children_heading", "Children's Privacy")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.children_text", "Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.changes_heading", "Changes to This Policy")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.changes_text", 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.')}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("privacy.contact_heading", "Contact Us")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.contact_text", "If you have any questions about this Privacy Policy, please contact us at:")}
              </p>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <p>Email: <a href="mailto:info@fuelforfootball.com" className="text-primary hover:underline">info@fuelforfootball.com</a></p>
                <p>WhatsApp: <a href="http://wa.link/mabnsw" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t("privacy.contact_whatsapp", "Contact via WhatsApp")}</a></p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {t("privacy.last_updated", "Last Updated")}: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}
