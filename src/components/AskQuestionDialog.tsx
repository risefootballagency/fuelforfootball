import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface AskQuestionDialogProps {
  articleId?: string;
  articleTitle?: string;
  triggerClassName?: string;
  variant?: "default" | "outline" | "ghost";
}

export const AskQuestionDialog = ({
  articleId,
  articleTitle,
  triggerClassName = "",
  variant = "outline",
}: AskQuestionDialogProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.question) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("daily_fuel_questions" as any).insert({
        article_id: articleId || null,
        article_title: articleTitle || null,
        name: formData.name,
        email: formData.email,
        question: formData.question,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: t("ask_question.success_title", "Question submitted!"),
        description: t("ask_question.success_desc", "We'll get back to you soon."),
      });

      // Reset after delay
      setTimeout(() => {
        setOpen(false);
        setIsSubmitted(false);
        setFormData({ name: "", email: "", question: "" });
      }, 2000);
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={`gap-2 ${triggerClassName}`}>
          <MessageCircle className="h-4 w-4" />
          {t("ask_question.trigger", "Ask a Question")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl uppercase tracking-wider">
            {t("ask_question.title", "Ask About This Article")}
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <p className="text-lg font-medium">
              {t("ask_question.thank_you", "Thank you!")}
            </p>
            <p className="text-muted-foreground">
              {t("ask_question.response_soon", "We'll respond to your question soon.")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {articleTitle && (
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {t("ask_question.regarding", "Regarding")}
                </p>
                <p className="text-sm font-medium line-clamp-2">{articleTitle}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{t("ask_question.name", "Name")}</Label>
              <Input
                id="name"
                placeholder={t("ask_question.name_placeholder", "Your name")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("ask_question.email", "Email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("ask_question.email_placeholder", "your@email.com")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">{t("ask_question.question", "Question")}</Label>
              <Textarea
                id="question"
                placeholder={t("ask_question.question_placeholder", "What would you like to know?")}
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="bg-background min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                t("ask_question.submitting", "Submitting...")
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t("ask_question.submit", "Submit Question")}
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionDialog;
