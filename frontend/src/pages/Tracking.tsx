import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Package, Truck, CheckCircle2, Clock } from "lucide-react";

interface TrackingStep {
  label: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  active: boolean;
}

const mockRoute = [
  { lat: 35.6762, lng: 139.6503, label: "Factory — Tokyo, Japan" },
  { lat: 22.3193, lng: 114.1694, label: "Port — Hong Kong" },
  { lat: 1.3521, lng: 103.8198, label: "In Transit — Singapore" },
  { lat: -33.8688, lng: 151.2093, label: "Customs — Sydney, Australia" },
  { lat: 40.7128, lng: -74.006, label: "Distribution — New York, USA" },
];

const Tracking = () => {
  const [activePoint, setActivePoint] = useState(2);
  const [orderId, setOrderId] = useState("");
  const [isTracking, setIsTracking] = useState(true);

  // Simulate movement
  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(() => {
      setActivePoint((prev) => (prev < mockRoute.length - 1 ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, [isTracking]);

  const steps: TrackingStep[] = [
    { label: "Order Confirmed", description: "Your pre-order has been confirmed", icon: Package, completed: true, active: false },
    { label: "Manufacturing", description: "Vehicle is being assembled at the factory", icon: Clock, completed: true, active: false },
    { label: "In Transit", description: "Currently shipping via international freight", icon: Truck, completed: false, active: true },
    { label: "Customs & Inspection", description: "Awaiting clearance at destination port", icon: MapPin, completed: false, active: false },
    { label: "Delivered", description: "Vehicle delivered to your address", icon: CheckCircle2, completed: false, active: false },
  ];

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-black mb-2">Track Your Order</h1>
          <p className="text-muted-foreground mb-8">Real-time shipment monitoring</p>
        </motion.div>

        {/* Search */}
        <div className="glass-panel p-4 flex gap-3 mb-10 max-w-lg">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. AV-M3KXYZ)"
            className="flex-1 bg-transparent text-foreground text-sm focus:outline-none px-2"
          />
          <button
            onClick={() => setIsTracking(true)}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-display font-semibold"
          >
            Track
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Live Map Simulation */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-6 aspect-[16/10] relative overflow-hidden">
              <div className="absolute inset-0 bg-secondary/30 rounded-xl" />
              {/* Simulated map with dots & route */}
              <svg viewBox="0 0 800 500" className="w-full h-full relative z-10">
                {/* Grid lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 50} x2={800} y2={i * 50} stroke="hsl(220, 14%, 16%)" strokeWidth={0.5} />
                ))}
                {Array.from({ length: 16 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={500} stroke="hsl(220, 14%, 16%)" strokeWidth={0.5} />
                ))}

                {/* Route line */}
                {mockRoute.map((point, i) => {
                  if (i === 0) return null;
                  const prev = mockRoute[i - 1];
                  const x1 = ((prev.lng + 180) / 360) * 800;
                  const y1 = ((90 - prev.lat) / 180) * 500;
                  const x2 = ((point.lng + 180) / 360) * 800;
                  const y2 = ((90 - point.lat) / 180) * 500;
                  return (
                    <line
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={i <= activePoint ? "hsl(38, 92%, 50%)" : "hsl(220, 14%, 25%)"}
                      strokeWidth={i <= activePoint ? 2 : 1}
                      strokeDasharray={i <= activePoint ? "none" : "6 4"}
                    />
                  );
                })}

                {/* Points */}
                {mockRoute.map((point, i) => {
                  const x = ((point.lng + 180) / 360) * 800;
                  const y = ((90 - point.lat) / 180) * 500;
                  const isActive = i === activePoint;
                  const isPast = i < activePoint;
                  return (
                    <g key={i}>
                      {isActive && (
                        <circle cx={x} cy={y} r={16} fill="hsl(38, 92%, 50%)" opacity={0.2}>
                          <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle
                        cx={x} cy={y}
                        r={isActive ? 6 : 4}
                        fill={isPast || isActive ? "hsl(38, 92%, 50%)" : "hsl(220, 14%, 30%)"}
                      />
                      <text
                        x={x} y={y - 14}
                        textAnchor="middle"
                        fill={isPast || isActive ? "hsl(40, 10%, 92%)" : "hsl(220, 10%, 55%)"}
                        fontSize={10}
                        fontFamily="Space Grotesk"
                      >
                        {point.label.split("—")[0].trim()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Live tracking — Currently at: <span className="text-primary">{mockRoute[activePoint].label}</span>
            </p>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-6">
              <h3 className="font-display font-bold text-lg mb-6">Shipment Progress</h3>
              <div className="space-y-0">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          step.completed
                            ? "bg-primary text-primary-foreground"
                            : step.active
                            ? "bg-primary/20 text-primary border-2 border-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <step.icon className="w-4 h-4" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 h-12 ${step.completed ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`font-display font-semibold text-sm ${step.active ? "text-primary" : ""}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ETA Card */}
            <div className="glass-panel p-6 mt-4 gold-glow">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-display font-bold">Estimated Arrival</p>
                  <p className="text-primary font-display text-lg font-bold">March 28, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Tracking;
