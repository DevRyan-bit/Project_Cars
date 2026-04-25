import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gauge, Zap, Wind, Fuel, Check } from "lucide-react";
import { cars } from "@/data/cars";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find((c) => c.id === id);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  if (!car) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Vehicle not found.</p>
      </main>
    );
  }

  const toggleFeature = (f: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const handlePreOrder = () => {
    navigate(`/preorder/${car.id}`, {
      state: { color: car.colors[selectedColor], features: selectedFeatures },
    });
  };

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-body text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image with 3D perspective */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="perspective-container"
          >
            <motion.div
              whileHover={{ rotateY: 5, rotateX: -3 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-2xl overflow-hidden gold-glow"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full aspect-[16/10] object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-primary font-display text-sm tracking-widest uppercase">{car.brand} • {car.type}</span>
            <h1 className="font-display text-4xl md:text-5xl font-black mt-2 mb-1">{car.model}</h1>
            <p className="text-3xl font-display font-bold text-gradient-gold mb-4">${car.price.toLocaleString()}</p>
            <p className="text-muted-foreground mb-8">{car.description}</p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Zap, label: "Power", value: `${car.specs.horsepower} HP` },
                { icon: Gauge, label: "0-60 mph", value: car.specs.acceleration },
                { icon: Wind, label: "Top Speed", value: car.specs.topSpeed },
                { icon: Fuel, label: "Fuel", value: car.specs.fuelType },
              ].map((s) => (
                <div key={s.label} className="glass-panel p-3 flex items-center gap-3">
                  <s.icon className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="font-display font-semibold text-sm">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Color picker */}
            <div className="mb-8">
              <p className="font-display text-sm font-semibold mb-3">Exterior Color — {car.colors[selectedColor].name}</p>
              <div className="flex gap-3">
                {car.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === i ? "border-primary scale-110 gold-glow" : "border-border"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <p className="font-display text-sm font-semibold mb-3">Add-On Features</p>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFeature(f)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body transition-all ${
                      selectedFeatures.includes(f)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {selectedFeatures.includes(f) && <Check className="w-3.5 h-3.5" />}
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handlePreOrder}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-display font-bold text-lg hover:bg-primary/90 transition-all gold-glow"
            >
              Pre-Order Now — ${car.price.toLocaleString()}
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default CarDetail;
