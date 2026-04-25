import carSuv from "@/assets/car-suv.jpg";
import carSedan from "@/assets/car-sedan.jpg";
import carHatchback from "@/assets/car-hatchback.jpg";

export type CarType = "SUV" | "Sedan" | "Hatchback" | "SAV";

export interface CarColor {
  name: string;
  hex: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  type: CarType;
  year: number;
  price: number;
  image: string;
  description: string;
  specs: {
    engine: string;
    horsepower: number;
    acceleration: string;
    topSpeed: string;
    fuelType: string;
  };
  colors: CarColor[];
  features: string[];
}

export const cars: Car[] = [
  {
    id: "toyota-camry",
    brand: "Toyota",
    model: "Camry",
    type: "Sedan",
    year: 2025,
    price: 28500,
    image: carSedan,
    description: "The iconic mid-size sedan redefining comfort and reliability with cutting-edge hybrid technology.",
    specs: { engine: "2.5L Hybrid", horsepower: 208, acceleration: "7.6s", topSpeed: "130 mph", fuelType: "Hybrid" },
    colors: [{ name: "Supersonic Red", hex: "#C41E3A" }, { name: "Wind Chill Pearl", hex: "#F0EDE8" }, { name: "Midnight Black", hex: "#1A1A2E" }, { name: "Celestial Silver", hex: "#C0C0C0" }],
    features: ["Toyota Safety Sense 3.0", "12.3\" Touchscreen", "Wireless CarPlay", "JBL Premium Audio"],
  },
  {
    id: "toyota-rav4",
    brand: "Toyota",
    model: "RAV4",
    type: "SUV",
    year: 2025,
    price: 32500,
    image: carSuv,
    description: "Adventure-ready SUV with legendary durability and advanced all-wheel drive capability.",
    specs: { engine: "2.5L AWD", horsepower: 219, acceleration: "8.0s", topSpeed: "120 mph", fuelType: "Gasoline" },
    colors: [{ name: "Blueprint", hex: "#1E3A5F" }, { name: "Lunar Rock", hex: "#A8A9AD" }, { name: "Ruby Flare", hex: "#8B0000" }, { name: "Ice Cap", hex: "#E8E8E8" }],
    features: ["Multi-Terrain Select", "Panoramic Roof", "360° Camera", "Adaptive Cruise"],
  },
  {
    id: "bmw-3series",
    brand: "BMW",
    model: "3 Series",
    type: "Sedan",
    year: 2025,
    price: 44900,
    image: carSedan,
    description: "The ultimate driving machine. Precision engineering meets luxury in this iconic sports sedan.",
    specs: { engine: "2.0L TwinPower Turbo", horsepower: 255, acceleration: "5.6s", topSpeed: "155 mph", fuelType: "Gasoline" },
    colors: [{ name: "Alpine White", hex: "#F2F2F2" }, { name: "Black Sapphire", hex: "#0D0D0D" }, { name: "Portimao Blue", hex: "#003366" }, { name: "Melbourne Red", hex: "#8B0000" }],
    features: ["iDrive 8", "M Sport Package", "Harman Kardon Sound", "Lane Departure Warning"],
  },
  {
    id: "bmw-x5",
    brand: "BMW",
    model: "X5",
    type: "SAV",
    year: 2025,
    price: 65200,
    image: carSuv,
    description: "Commanding presence meets refined luxury. The X5 SAV delivers power and sophistication.",
    specs: { engine: "3.0L Inline-6 Turbo", horsepower: 335, acceleration: "5.3s", topSpeed: "155 mph", fuelType: "Gasoline" },
    colors: [{ name: "Mineral White", hex: "#E8E4DB" }, { name: "Carbon Black", hex: "#1C1C1C" }, { name: "Phytonic Blue", hex: "#1B3F6B" }, { name: "Manhattan Green", hex: "#2D4A3E" }],
    features: ["xDrive AWD", "Air Suspension", "Gesture Control", "Panoramic Sky Lounge"],
  },
  {
    id: "nissan-altima",
    brand: "Nissan",
    model: "Altima",
    type: "Sedan",
    year: 2025,
    price: 27900,
    image: carSedan,
    description: "Bold design meets intelligent technology in Nissan's best-selling mid-size sedan.",
    specs: { engine: "2.5L 4-Cylinder", horsepower: 188, acceleration: "7.8s", topSpeed: "130 mph", fuelType: "Gasoline" },
    colors: [{ name: "Scarlet Ember", hex: "#C0392B" }, { name: "Deep Blue Pearl", hex: "#1A237E" }, { name: "Brilliant Silver", hex: "#B0B0B0" }, { name: "Super Black", hex: "#0A0A0A" }],
    features: ["ProPILOT Assist", "NissanConnect", "Zero Gravity Seats", "Intelligent AWD"],
  },
  {
    id: "nissan-rogue",
    brand: "Nissan",
    model: "Rogue",
    type: "SUV",
    year: 2025,
    price: 30800,
    image: carSuv,
    description: "Smart, spacious, and ready for anything. The Rogue redefines the compact SUV segment.",
    specs: { engine: "1.5L VC-Turbo", horsepower: 201, acceleration: "7.9s", topSpeed: "124 mph", fuelType: "Gasoline" },
    colors: [{ name: "Everest White", hex: "#F5F5F0" }, { name: "Magnetic Black", hex: "#111111" }, { name: "Champagne Silver", hex: "#C9B99A" }, { name: "Scarlet Ember", hex: "#B22222" }],
    features: ["ProPILOT Assist 2.0", "Tri-Zone Climate", "Motion Activated Liftgate", "Quilted Leather"],
  },
  {
    id: "tesla-model3",
    brand: "Tesla",
    model: "Model 3",
    type: "Sedan",
    year: 2025,
    price: 42990,
    image: carSedan,
    description: "The future of driving. All-electric performance with autonomous capabilities.",
    specs: { engine: "Dual Motor Electric", horsepower: 366, acceleration: "3.1s", topSpeed: "162 mph", fuelType: "Electric" },
    colors: [{ name: "Pearl White", hex: "#F0F0F0" }, { name: "Solid Black", hex: "#0C0C0C" }, { name: "Ultra Red", hex: "#CC0000" }, { name: "Quicksilver", hex: "#8E8E93" }],
    features: ["Autopilot", "15\" Touchscreen", "Over-the-Air Updates", "Glass Roof"],
  },
  {
    id: "tesla-modely",
    brand: "Tesla",
    model: "Model Y",
    type: "SUV",
    year: 2025,
    price: 47990,
    image: carSuv,
    description: "The most versatile electric SUV. Maximum range meets maximum utility.",
    specs: { engine: "Dual Motor AWD", horsepower: 384, acceleration: "3.5s", topSpeed: "155 mph", fuelType: "Electric" },
    colors: [{ name: "Pearl White", hex: "#F0F0F0" }, { name: "Midnight Silver", hex: "#42464A" }, { name: "Deep Blue", hex: "#0A1628" }, { name: "Red Multi-Coat", hex: "#A30000" }],
    features: ["Full Self-Driving", "HEPA Filtration", "Tow Package", "Camp Mode"],
  },
  {
    id: "ford-mustang",
    brand: "Ford",
    model: "Mustang",
    type: "Sedan",
    year: 2025,
    price: 32515,
    image: carSedan,
    description: "American muscle meets modern technology. The legend continues to inspire.",
    specs: { engine: "5.0L V8", horsepower: 480, acceleration: "4.2s", topSpeed: "155 mph", fuelType: "Gasoline" },
    colors: [{ name: "Grabber Blue", hex: "#0072CE" }, { name: "Race Red", hex: "#C8102E" }, { name: "Shadow Black", hex: "#101820" }, { name: "Oxford White", hex: "#F2F3F4" }],
    features: ["MagneRide Suspension", "SYNC 4", "Track Apps", "Performance Pack"],
  },
  {
    id: "ford-explorer",
    brand: "Ford",
    model: "Explorer",
    type: "SUV",
    year: 2025,
    price: 38000,
    image: carSuv,
    description: "Go further. The Explorer delivers three rows of adventure-ready capability.",
    specs: { engine: "2.3L EcoBoost", horsepower: 300, acceleration: "6.2s", topSpeed: "143 mph", fuelType: "Gasoline" },
    colors: [{ name: "Star White", hex: "#F0EDE5" }, { name: "Agate Black", hex: "#0A0A0A" }, { name: "Atlas Blue", hex: "#1A3C6E" }, { name: "Rapid Red", hex: "#A4262C" }],
    features: ["SYNC 4A", "Co-Pilot360", "Intelligent 4WD", "B&O Sound System"],
  },
];

export const brands = ["All", "Toyota", "BMW", "Nissan", "Tesla", "Ford"] as const;
export const types: ("All" | CarType)[] = ["All", "SUV", "Sedan", "Hatchback", "SAV"];
