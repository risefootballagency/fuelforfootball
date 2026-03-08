import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSmokyBackground } from "@/components/AnimatedSmokyBackground";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("form_submissions").insert({
        form_type: "contact",
        data: formData,
      });

      if (error) throw error;

      toast.success(t("contact.success_msg", "Message sent successfully! We'll get back to you soon."));
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t("contact.error_msg", "Failed to send message. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us | Fuel For Football"
        description="Get in touch with Fuel For Football. Enquire about our performance programmes, analysis services, and partnership opportunities."
        image="/og-preview-contact.png"
        url="/contact"
      />
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <AnimatedSmokyBackground />
        </div>

        <div className="relative z-10">
          <Header />
          
          <main className="pt-20 md:pt-24">
            <ScrollReveal>
              <section className="relative py-8 md:py-12 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bebas uppercase text-white mb-3 tracking-wider">
                    {t('contact.title', 'Contact Us')}
                  </h1>
                  <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto">
                    {t('contact.subtitle', 'Ready to take your game to the next level? Get in touch.')}
                  </p>
                </div>
              </section>
            </ScrollReveal>

            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
              <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button 
                      asChild
                      size="lg"
                      className="font-bebas uppercase tracking-wider bg-accent hover:bg-accent/90 text-black text-lg px-8"
                    >
                      <a 
                        href="https://wa.me/447508342901"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        {t("contact.whatsapp_btn", "WhatsApp Us")}
                      </a>
                    </Button>

                    <Button 
                      asChild
                      variant="outline"
                      size="lg"
                      className="font-bebas uppercase tracking-wider border-white/30 text-white hover:border-accent hover:text-accent text-lg px-8"
                    >
                      <a 
                        href="mailto:info@fuelforfootball.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        {t("contact.email_btn", "Email Us")}
                      </a>
                    </Button>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bebas uppercase tracking-wider text-white mb-6 text-center">
                      {t("contact.form_title", "Send Us A Message")}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-white/80">{t("contact.label_name", "Name")}</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-black/40 border-white/20 text-white placeholder:text-white/40"
                            placeholder={t("contact.placeholder_name", "Your name")}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white/80">{t("contact.label_email", "Email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-black/40 border-white/20 text-white placeholder:text-white/40"
                            placeholder={t("contact.placeholder_email", "your@email.com")}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-white/80">{t("contact.label_subject", "Subject")}</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="bg-black/40 border-white/20 text-white placeholder:text-white/40"
                          placeholder={t("contact.placeholder_subject", "What's this about?")}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-white/80">{t("contact.label_message", "Message")}</Label>
                        <Textarea
                          id="message"
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="bg-black/40 border-white/20 text-white placeholder:text-white/40 resize-none"
                          placeholder={t("contact.placeholder_message", "Tell us how we can help...")}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        size="lg"
                        className="w-full font-bebas uppercase tracking-wider text-lg"
                      >
                        {submitting ? t("contact.sending", "Sending...") : t("contact.send_btn", "Send Message")}
                      </Button>
                    </form>
                  </div>
                </ScrollReveal>

                <div className="text-center mt-8">
                  <p className="text-white/60 text-sm">
                    {t("contact.location", "Based in the United Kingdom, working with players worldwide.")}
                  </p>
                </div>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Contact;
