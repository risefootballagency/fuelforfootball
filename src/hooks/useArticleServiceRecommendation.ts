import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
}

// Category to service category mapping
const categoryToServiceMap: Record<string, string[]> = {
  "TECHNICAL": ["Technical Services", "Analysis Services"],
  "NUTRITION": ["Physical Services", "Nutrition"],
  "PSYCHOLOGY": ["Mental Services", "Psychological"],
  "TACTICAL": ["Analysis Services", "Tactical"],
  "STRENGTH, POWER & SPEED": ["Physical Services"],
  "RECOVERY": ["Physical Services"],
  "COACHING": ["All in One Services", "Coaching"],
  "AGENTS": ["Data Services", "Representation"],
};

// Keyword-based matching for more precise recommendations
const keywordToService: Record<string, string[]> = {
  "analysis": ["Match Analysis", "Post-Match Analysis", "Pre-Match", "Action Reports"],
  "nutrition": ["Nutrition", "Diet", "Fuel"],
  "strength": ["Strength, Power & Speed"],
  "speed": ["Strength, Power & Speed", "Conditioning"],
  "conditioning": ["Conditioning"],
  "mental": ["Mental", "Psychology", "Mindset"],
  "tactical": ["Tactical", "Pre-Match", "Post-Match", "Action Reports"],
  "technical": ["Technical", "Skill"],
  "recovery": ["Recovery", "Mobility"],
  "off-season": ["Off-Season"],
  "elite": ["Elite Performance"],
  "pro": ["Pro Performance"],
};

export function useArticleServiceRecommendation(articleCategory: string, articleTitle: string, articleContent: string) {
  const [recommendedService, setRecommendedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedService = async () => {
      try {
        const { data: services, error } = await supabase
          .from("service_catalog")
          .select("*")
          .order("price", { ascending: true });

        if (error || !services || services.length === 0) {
          setLoading(false);
          return;
        }

        // Score each service based on relevance
        const scoredServices = services.map((service) => {
          let score = 0;
          const serviceName = service.name?.toLowerCase() || "";
          const serviceCategory = service.category?.toLowerCase() || "";
          const serviceDesc = service.description?.toLowerCase() || "";
          
          const contentLower = (articleTitle + " " + articleContent).toLowerCase();
          const categoryLower = articleCategory?.toLowerCase() || "";

          // Category match
          const mappedCategories = categoryToServiceMap[articleCategory?.toUpperCase()] || [];
          for (const cat of mappedCategories) {
            if (serviceCategory.includes(cat.toLowerCase()) || serviceName.includes(cat.toLowerCase())) {
              score += 10;
            }
          }

          // Keyword matching
          for (const [keyword, serviceMatches] of Object.entries(keywordToService)) {
            if (contentLower.includes(keyword)) {
              for (const match of serviceMatches) {
                if (serviceName.toLowerCase().includes(match.toLowerCase())) {
                  score += 5;
                }
              }
            }
          }

          // Direct category word match
          if (categoryLower && serviceName.toLowerCase().includes(categoryLower)) {
            score += 8;
          }

          // Avoid expensive bundles for simple articles - prefer standalone services
          if (service.price > 500) {
            score -= 2;
          }

          return { service, score };
        });

        // Sort by score descending, then by price ascending for ties
        scoredServices.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.service.price - b.service.price;
        });

        // Get top match
        if (scoredServices.length > 0 && scoredServices[0].score > 0) {
          setRecommendedService(scoredServices[0].service);
        } else {
          // Fallback to a random service if no match
          const randomIndex = Math.floor(Math.random() * Math.min(5, services.length));
          setRecommendedService(services[randomIndex]);
        }
      } catch (error) {
        console.error("Error fetching recommended service:", error);
      } finally {
        setLoading(false);
      }
    };

    if (articleCategory) {
      fetchRecommendedService();
    } else {
      setLoading(false);
    }
  }, [articleCategory, articleTitle, articleContent]);

  return { recommendedService, loading };
}
