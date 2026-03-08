import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TermsOfService() {
  const { t } = useLanguage();

  return (
    <>
      <SEO 
        title="Terms of Service - Fuel For Football"
        description="Read the terms and conditions for using Fuel For Football services. Understand your rights and obligations when using our football performance platform."
        url="/terms-of-service"
      />
      <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 space-y-3 animate-fade-in">
            <div className="inline-block">
              <span className="text-sm font-bebas uppercase tracking-widest text-primary border border-primary/30 px-6 py-2 rounded-full">
                {t("terms.badge", "Legal")}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas uppercase tracking-wider text-foreground">
              {t("terms.title_1", "Terms of")} <span className="text-primary">{t("terms.title_2", "Service")}</span>
            </h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.agreement_heading", "Agreement to Terms")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.agreement_text", "By accessing or using the Fuel For Football website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access our services.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.services_heading", "Services")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("terms.services_intro", "Fuel For Football provides:")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>{t("terms.services_1", "Professional football player representation")}</li>
                <li>{t("terms.services_2", "Performance optimization and training programs")}</li>
                <li>{t("terms.services_3", "Career development and management services")}</li>
                <li>{t("terms.services_4", "Club and scout networking opportunities")}</li>
                <li>{t("terms.services_5", "Coaching and tactical analysis resources")}</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-6">
                {t("terms.services_compliance", "All services are conducted in accordance with the regulatory frameworks established by FIFA and UEFA. Our processes adhere to the standards required for player representation, ensuring compliance with governance requirements and maintaining the integrity of football operations.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.eligibility_heading", "Eligibility")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.eligibility_text", "You must be at least 16 years of age to use our services. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.accounts_heading", "User Accounts")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.accounts_text", "When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.representation_heading", "Representation Agreement")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.representation_text", "Our representation services are subject to a separate written agreement. These Terms of Service govern your use of our website and general services, while a formal representation contract will outline the specific terms of our agency relationship.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.ip_heading", "Intellectual Property")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.ip_text", "All content on our website, including text, graphics, logos, images, and software, is the property of Fuel For Football and protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.conduct_heading", "User Conduct")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("terms.conduct_intro", "You agree not to:")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>{t("terms.conduct_1", "Use our services for any unlawful purpose")}</li>
                <li>{t("terms.conduct_2", "Impersonate any person or entity")}</li>
                <li>{t("terms.conduct_3", "Interfere with or disrupt our services")}</li>
                <li>{t("terms.conduct_4", "Attempt to gain unauthorized access to our systems")}</li>
                <li>{t("terms.conduct_5", "Upload malicious code or engage in harmful activities")}</li>
                <li>{t("terms.conduct_6", "Harass, abuse, or harm other users")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.content_heading", "Content Submission")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.content_text", "By submitting content to our platform (including performance data, videos, or personal information), you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute that content for the purpose of providing our services.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.privacy_heading", "Privacy and Data Protection")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.privacy_text", "Your use of our services is also governed by our Privacy Policy. We are committed to protecting your personal data in accordance with applicable data protection laws, including GDPR.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.fees_heading", "Fees and Payment")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.fees_text", "Certain services may require payment. All fees are outlined in separate agreements. You agree to provide accurate billing information and authorize us to charge the specified fees.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.termination_heading", "Termination")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.termination_text", "We reserve the right to suspend or terminate your access to our services at any time, with or without cause, with or without notice. Upon termination, your right to use our services will immediately cease.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.warranty_heading", "Disclaimer of Warranties")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.warranty_text", 'Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.')}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.liability_heading", "Limitation of Liability")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.liability_text", "To the maximum extent permitted by law, Fuel For Football shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.indemnification_heading", "Indemnification")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.indemnification_text", "You agree to indemnify and hold harmless Fuel For Football from any claims, damages, losses, liabilities, and expenses arising from your use of our services or violation of these Terms.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.law_heading", "Governing Law")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.law_text", "These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.changes_heading", "Changes to Terms")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.changes_text", "We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the updated Terms on our website. Your continued use of our services after such modifications constitutes your acceptance of the updated Terms.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.severability_heading", "Severability")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.severability_text", "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.")}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bebas uppercase tracking-wider text-foreground mb-4">{t("terms.contact_heading", "Contact Information")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.contact_text", "If you have any questions about these Terms of Service, please contact us at:")}
              </p>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <p>Email: <a href="mailto:jolon.levene@fuelforfootball.com" className="text-primary hover:underline">jolon.levene@fuelforfootball.com</a></p>
                <p>WhatsApp: <a href="http://wa.link/mabnsw" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t("terms.contact_whatsapp", "Contact via WhatsApp")}</a></p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {t("terms.last_updated", "Last Updated")}: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
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
