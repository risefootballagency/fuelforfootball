export interface ServiceExampleRoute {
  section: "hub" | "analysis" | "physical";
  analysisTab?: "performance" | "video";
  reportHint?: string;
}

interface ServiceExampleRouteInput {
  id?: string;
  name?: string;
  category?: string;
}

const DATA_SERVICE_IDS = new Set([
  "3108440d-8e99-4f4d-b185-eed118dd7225", // Action Reports
  "b934254a-5b37-4ef0-9f0b-caa0558a76a1", // Performance Efficiency Report
  "9d31983c-ded9-4f18-a997-58066451a0fe", // Player Review
  "aed3d11b-8be1-4d7b-84bb-48a3d97188ed", // Transfer Efficiency Report
  "853b38f5-27f3-4482-9ad2-99c10983e988", // Match Analysis (Pre & Post)
  "a370d65d-4c68-4c88-a077-7a57e2829cd6", // Post-Match Analysis
  "6c369b05-d410-4955-98e6-20a936019079", // Pre-Match Opposition Analysis
  "6e2e08ff-d73c-4799-a746-b5b14afe2350", // Performance Analysis Programme
]);

const PROGRAMMING_SERVICE_IDS = new Set([
  "cf818317-35c5-4493-a5f2-ea8b1195e2f6", // SPS Programming
  "03b07768-16ed-4065-bd39-53d7a3c4caf3", // Conditioning Programming
  "da5c0f4d-25a7-422a-b4ac-2a109197e8a8", // Technical Programming
  "1a6257cb-09a9-47e9-a9fc-488d0b6a6144", // Nutrition Programming
  "4ed1cfe9-054a-4a2e-9ce9-0616dd483792", // Nutrition Programming & Recipes
  "f72c2653-1a78-4309-a3f6-ee64dcce65ac", // Elite Performance Programme
  "62b28c75-8dc8-4339-bca3-3f8fd50229d7", // Pro Performance Programme
  "294b3278-896d-4db9-b9ab-7973faaa0ab8", // Youth Development Programme
  "bb08fb97-78c3-4837-9436-1e7c1ca82e61", // SPS bundle
]);

const includesAny = (source: string, terms: string[]) => terms.some((term) => source.includes(term));

export const getServiceExampleRoute = ({ id, name, category }: ServiceExampleRouteInput): ServiceExampleRoute => {
  const normalizedName = (name || "").toLowerCase();
  const normalizedCategory = (category || "").toLowerCase();
  const serviceId = id || "";

  const isDataOrAnalysisService =
    DATA_SERVICE_IDS.has(serviceId) ||
    includesAny(normalizedCategory, ["data", "analysis", "report", "tactical"]) ||
    includesAny(normalizedName, ["analysis", "report", "data", "efficiency", "player review", "post-match", "pre-match"]);

  if (isDataOrAnalysisService) {
    return {
      section: "analysis",
      analysisTab: "performance",
      reportHint: "barcelona leg 2",
    };
  }

  const isProgrammingService =
    PROGRAMMING_SERVICE_IDS.has(serviceId) ||
    includesAny(normalizedCategory, ["physical", "technical", "nutrition", "special packages", "all in one"]) ||
    includesAny(normalizedName, [
      "programme",
      "programming",
      "training",
      "sps",
      "strength",
      "conditioning",
      "nutrition",
      "technical",
      "recovery",
      "injury prevention",
      "elite performance programme",
      "pro performance programme",
      "youth development",
    ]);

  if (isProgrammingService) {
    return { section: "physical" };
  }

  return { section: "hub" };
};