import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";
import { ServiceQuickAddWidget } from "@/components/ServiceQuickAddWidget";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url?: string | null;
}

const Technical = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('service_catalog')
        .select('id, name, description, price, category, image_url')
        .ilike('category', '%technical%')
        .limit(5);
      
      if (data) setServices(data as Service[]);
    };
    fetchServices();
  }, []);

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png", label: "RECEIVING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png", label: "PASSING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png", label: "DRIBBLING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png", label: "FINISHING" },
  ];

  const concepts = [
    "Training paradigms (behaviourism, cognitivism, constructivism)",
    "CARDS",
    "Embodied cognition",
    "Game realism",
    "Ventral and Dorsal processing",
    "Non-cognitive processing",
    "Stability bias",
    "Problem-creating",
    "Learning-rich environments",
    "Constraints-based approaches",
    "Dynamic practice",
    "Perception-action coupling",
    "Perceptual-motor landscape",
    "Degeneracy",
    "Structure variability"
  ];

  const tabContent = [
    {
      label: "Overview",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "Technical aspects are the cornerstone of a player's game. Ball mastery can mean the difference between a missed opportunity and a spectacular goal, a fumbled pass and a game-changing assist. Our tailored technical training services are dedicated to honing your control over the ball and creating the ability to play precise passes, dribble, cut at speed, and finish with high accuracy.",
            "Players are quick to acknowledge the need for expert coaching when it comes to the physical aspects of the game - both primary (strength, power, speed, conditioning) and secondary (nutrition). When it comes to technical aspects of play, however, there is a tendency to assume it can be done to the highest level by oneself. Some might stumble upon great training, but there are well-understood, reliable evidence-based approaches and methods of training which most players will miss out on."
          ]}
        />
      )
    },
    {
      label: "In-Person",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "Our in-person technical training sessions take place across the UK with our expert technical coaches. Unlike 1 to 1 sessions you may have seen online, our analysts break your game down in detail before training to key in on the details that actually matter for improving.",
            "We mainly work through workshops: for understanding new ideas, keying in on areas for development, walking through correct technique and decision-making in high detail. Sessions are tailored to your position, playing style, and the specific technical areas you need to develop.",
            "Our individualised training sessions are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact."
          ]}
        />
      )
    },
    {
      label: "Online",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "For players abroad or those unable to attend in-person sessions, we offer comprehensive online technical support. This includes detailed video analysis of your technique with personalised feedback and improvement plans.",
            "In-depth programming with a high attention to detail. Programming is individualised to improve the key technical aspects for improving performance on the pitch. Our technical coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations.",
            "Remote sessions via video call allow our coaches to provide real-time feedback and guidance, ensuring you receive the same quality of coaching regardless of your location."
          ]}
        />
      )
    }
  ];

  return (
    <ServicePageLayout
      category="TECHNICAL"
      title="CONTROL THE BALL, CONTROL THE GAME"
      heroVideo="/videos/players-hero.mp4"
    >
      <ServicePillars pillars={pillars} />

      {/* In Detail Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          <ServiceDetailTabs tabs={tabContent} />
        </div>
      </ServiceSection>

      {/* Options Section with Product Widget */}
      <ServiceSection>
        <ServiceSectionTitle>OPTIONS</ServiceSectionTitle>
        
        <div className="max-w-2xl mx-auto">
          {services.length > 0 && (
            <ServiceQuickAddWidget 
              services={services}
              autoSlideshow={true}
              slideshowInterval={6000}
            />
          )}
        </div>
      </ServiceSection>

      {/* More Than Cones Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>MORE THAN CONES</ServiceSectionTitle>
        
        <p className="text-white/80 text-center max-w-4xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
          Our technical sessions take a scientific approach to developing technical skills and include ideas such as:
        </p>
        
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {concepts.map((concept, index) => (
            <div 
              key={index} 
              className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-center hover:border-accent/30 transition-colors"
            >
              <span className="text-xs md:text-sm text-white/80">{concept}</span>
            </div>
          ))}
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Technical;
