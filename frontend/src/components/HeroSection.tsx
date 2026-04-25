import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroCar from "@/assets/hero-car.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Background car */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={heroCar}
          alt="Luxury sports car"
          className="w-full h-full object-cover opacity-40"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-body tracking-widest uppercase bg-primary/10 text-primary border border-primary/20 mb-6">
              Global Automotive Marketplace
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6"
          >
            Design Your
            <br />
            <span className="text-gradient-gold">Dream Car</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 font-body"
          >
            Customize, pre-order, and track your vehicle delivery in real-time. Premium brands delivered worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-display font-semibold text-base hover:bg-primary/90 transition-all gold-glow"
            >
              Explore Catalog <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/tracking"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-display font-semibold text-base hover:bg-secondary/80 transition-all border border-border"
            >
              Track Your Order
            </Link>
          </motion.div>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl"
        >
          {[
            { icon: Zap, label: "3D Customization", desc: "Design every detail" },
            { icon: Globe, label: "Global Delivery", desc: "Ship anywhere worldwide" },
            { icon: Shield, label: "Secure Payments", desc: "PayPal & Cards accepted" },
          ].map((f, i) => (
            <div key={i} className="glass-panel p-4 flex items-center gap-3">
              <f.icon className="w-8 h-8 text-primary shrink-0" />
              <div>
                <p className="text-sm font-display font-semibold">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
