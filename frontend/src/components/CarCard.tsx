import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Car } from "@/data/cars";

interface CarCardProps {
  car: Car;
  index: number;
}

const CarCard = ({ car, index }: CarCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={`/car/${car.id}`}
        className="block glass-panel overflow-hidden card-hover group"
      >
        <div className="relative overflow-hidden aspect-[16/10]">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-md bg-primary/90 text-primary-foreground text-xs font-display font-semibold">
              {car.brand}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-display">
              {car.type}
            </span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-lg font-bold">
              {car.model}
            </h3>
            <span className="text-primary font-display font-bold text-lg">
              ${car.price.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{car.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {car.colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{car.specs.horsepower} HP • {car.specs.fuelType}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;
