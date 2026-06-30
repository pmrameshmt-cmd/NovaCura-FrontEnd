
export interface AyurvedicHospital {
  id: string;
  name: string;
  shortSummary: string;
  intro: string;
  overview: string;
  specialities: string[];
  locations: string[];
  approach: string;
  wellnessInfo: string;
  officialWebsite: string;
  image: string;
}

export const ayurvedicHospitals: AyurvedicHospital[] = [
  {
    id: "buchinger-wilhelmi",
    name: "Buchinger Wilhelmi",
    shortSummary: "World-leading clinic for therapeutic fasting and integrative medicine with over 100 years of experience.",
    intro: "The Buchinger Med Programme is based on more than 100 years of experience and is continually developed in cooperation with university research centres.",
    overview: "Founded on the discoveries of Dr. Otto Buchinger, the clinic has perfected the art of therapeutic fasting as a key component of a holistic health concept. It aims to empower guests to live healthy and fulfilling lives through a balance of medical care, nutrition, and mental well-being.",
    specialities: [
      "Therapeutic Fasting",
      "Integrative Medicine",
      "Longevity & Anti-aging",
      "Nutritional Strategies",
      "Weight Management",
      "Detoxification Programmes"
    ],
    locations: [
      "Lake Constance (Germany)",
      "Marbella (Spain)",
      "Roquefort-les-Pins (Côte d’Azur, France)"
    ],
    approach: "A holistic methodology that integrates medical supervision with natural therapies, gourmet organic nutrition, and physical activities such as yoga, pilates, and guided nature walks.",
    wellnessInfo: "The clinics focus on sustainability and are aligned with UN Global Sustainable Development Goals, providing an environment that nourishes the body, mind, and soul through art, culture, and nature.",
    officialWebsite: "https://www.buchinger-wilhelmi.com/en/",
    image: "/images/hospitals/ayurvedic/buchinger-wilhelmi.png"
  },
  {
    id: "arya-vaidya-sala",
    name: "Arya Vaidya Sala (Kottakkal)",
    shortSummary: "A century-old charitable institution engaged in the practice and propagation of authentic Ayurveda.",
    intro: "Vaidyaratnam P.S. Varier's Arya Vaidya Sala (AVS) is a premier charitable institution committed to the classical practice of Ayurveda.",
    overview: "Established in 1902 at Kottakkal in Kerala, AVS has been a beacon of authentic Ayurvedic healing for over a century. It manages Ayurvedic hospitals, research centres, and manufacturing units, ensuring the highest standards of traditional treatment.",
    specialities: [
      "Authentic Ayurvedic Treatments",
      "Classical Panchakarma",
      "Traditional Therapy Management",
      "Research & Development in Ayurveda",
      "Quality Control in Herbal Medicine",
      "In-patient and Out-patient Care"
    ],
    locations: [
      "Headquarters: Kottakkal, Kerala, India",
      "27 Branch Clinics across major Indian cities",
      "Authorized Dealers in Middle East and Far East"
    ],
    approach: "The institution follows the classical textual tradition of Ayurveda, using high-quality herbal medicines and traditional therapies administered by experienced physicians.",
    wellnessInfo: "AVS houses its own herbal estates, factories for medicine production, and an Ayurveda College, fostering a complete ecosystem for traditional medical education and healthcare.",
    officialWebsite: "https://www.aryavaidyasala.com/",
    image: "/images/hospitals/ayurvedic/arya-vaidya-sala.png"
  }
];
