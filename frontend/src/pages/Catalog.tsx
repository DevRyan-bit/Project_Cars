import { useState } from "react";
import { motion } from "framer-motion";
import CarCard from "@/components/CarCard";
import { cars, brands, types } from "@/data/cars";

const Catalog = () => {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const filtered = cars.filter((car) => {
    const brandMatch = selectedBrand === "All" || car.brand === selectedBrand;
    const typeMatch = selectedType === "All" || car.type === selectedType;
    return brandMatch && typeMatch;
  });

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-6xl font-black mb-2">Our Catalog</h1>
          <p className="text-muted-foreground mb-10">Browse {cars.length} vehicles across 5 world-class brands</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          <div>
            <p className="text-xs text-muted-foreground font-display uppercase tracking-widest mb-2">Brand</p>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-4 py-2 rounded-lg text-sm font-display transition-all ${
                    selectedBrand === b
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-display uppercase tracking-widest mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-display transition-all ${
                    selectedType === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-display text-xl">No vehicles match your filters</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Catalog;
