import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CarCard from "./CarCard";
import { cars } from "@/data/cars";

const FeaturedCars = () => {
  const featured = cars.slice(0, 4);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-2">Featured Vehicles</h2>
            <p className="text-muted-foreground">Hand-picked selections from our premium catalog</p>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-2 text-primary font-display text-sm hover:gap-3 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
