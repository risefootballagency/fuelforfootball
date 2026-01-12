import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Marquee } from "@/components/Marquee";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Briefcase, MapPin, Clock, Building2, ArrowRight, Users } from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  description: string | null;
  requirements: string | null;
  salary_range: string | null;
  application_url: string | null;
}

const departments = ["All", "Performance", "Scouting", "Marketing", "Operations", "Coaching"];
const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Remote"];

export default function Jobs() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setJobs(data);
        setFilteredJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (selectedDepartment !== "All") {
      filtered = filtered.filter(job => 
        job.department?.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }

    if (selectedType !== "All") {
      filtered = filtered.filter(job => 
        job.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  }, [selectedDepartment, selectedType, jobs]);

  const handleApply = (job: Job) => {
    if (job.application_url) {
      window.open(job.application_url, "_blank");
    } else {
      window.location.href = `mailto:careers@fuelforfootball.com?subject=Application for ${job.title}`;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SEO
        title="Careers - Join Fuel For Football"
        description="Join the Fuel For Football team. Explore career opportunities in football performance, scouting, coaching, and more."
        url="/jobs"
      />
      <Header />

      <main className="pt-24 md:pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          
          <div className="container mx-auto relative z-10">
            <ScrollReveal>
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-block mb-6">
                  <span className="text-sm font-bebas uppercase tracking-widest text-primary border border-primary/30 px-6 py-2 rounded-full">
                    {t("jobs.badge", "Join Our Team")}
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas uppercase tracking-wider mb-6">
                  {t("jobs.title", "Build The Future")}
                  <br />
                  <span className="text-primary">{t("jobs.title_accent", "Of Football")}</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t("jobs.subtitle", "We're looking for passionate individuals to help shape the next generation of football talent.")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Marquee text="CHANGE THE GAME" />

        {/* Filters */}
        <section className="py-8 px-4 border-b border-border">
          <div className="container mx-auto">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center">
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-muted-foreground font-medium mr-2">Department:</span>
                  {departments.map((dept) => (
                    <Button
                      key={dept}
                      variant={selectedDepartment === dept ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDepartment(dept)}
                      className="font-bebas uppercase tracking-wider text-xs"
                    >
                      {dept}
                    </Button>
                  ))}
                </div>
                
                <div className="hidden md:block w-px h-8 bg-border" />
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-muted-foreground font-medium mr-2">Type:</span>
                  {jobTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className="font-bebas uppercase tracking-wider text-xs"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted/30 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <ScrollReveal>
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-bebas text-2xl uppercase tracking-wider mb-2">
                    {t("jobs.no_jobs", "No Open Positions")}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t("jobs.no_jobs_desc", "Check back soon for new opportunities, or send us a speculative application.")}
                  </p>
                  <Button
                    onClick={() => window.location.href = "mailto:careers@fuelforfootball.com"}
                  >
                    {t("jobs.contact_us", "Contact Us")}
                  </Button>
                </div>
              </ScrollReveal>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <ScrollReveal key={job.id} delay={index * 0.1}>
                    <Card 
                      className={`group border-border hover:border-primary/50 transition-all duration-300 overflow-hidden ${
                        expandedJob === job.id ? "ring-2 ring-primary/30" : ""
                      }`}
                    >
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Briefcase className="h-5 w-5 text-primary" />
                              <h3 className="font-bebas text-2xl uppercase tracking-wider group-hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              {job.department && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {job.department}
                                </div>
                              )}
                              {job.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {job.location}
                                </div>
                              )}
                              {job.type && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {job.type}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {job.salary_range && (
                              <Badge variant="secondary" className="bg-primary/10 border-primary/20">
                                {job.salary_range}
                              </Badge>
                            )}
                            <ArrowRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                              expandedJob === job.id ? "rotate-90" : "group-hover:translate-x-1"
                            }`} />
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedJob === job.id && (
                        <div className="px-6 pb-6 pt-2 border-t border-border">
                          {job.description && (
                            <div className="mb-4">
                              <h4 className="font-bebas text-lg uppercase tracking-wider mb-2">
                                {t("jobs.description", "Description")}
                              </h4>
                              <p className="text-muted-foreground whitespace-pre-line">
                                {job.description}
                              </p>
                            </div>
                          )}
                          
                          {job.requirements && (
                            <div className="mb-6">
                              <h4 className="font-bebas text-lg uppercase tracking-wider mb-2">
                                {t("jobs.requirements", "Requirements")}
                              </h4>
                              <p className="text-muted-foreground whitespace-pre-line">
                                {job.requirements}
                              </p>
                            </div>
                          )}
                          
                          <Button 
                            onClick={() => handleApply(job)}
                            className="gap-2"
                          >
                            {t("jobs.apply", "Apply Now")}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-4">
                {t("jobs.cta_title", "Don't See Your Role?")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("jobs.cta_desc", "We're always looking for talented individuals. Send us your CV and tell us how you can contribute.")}
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = "mailto:careers@fuelforfootball.com?subject=Speculative Application"}
                className="font-bebas uppercase tracking-wider"
              >
                {t("jobs.send_cv", "Send Your CV")}
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
