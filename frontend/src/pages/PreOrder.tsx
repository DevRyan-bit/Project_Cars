import { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Wallet, CheckCircle2 } from "lucide-react";
import { cars } from "@/data/cars";

const PreOrder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const car = cars.find((c) => c.id === id);
  const state = location.state as { color?: { name: string; hex: string }; features?: string[] } | null;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [formData, setFormData] = useState({
    name: "", email: "", address: "", city: "", country: "", zip: "",
    cardNumber: "", expiry: "", cvv: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!car) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Vehicle not found.</p>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto glass-panel p-10"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Pre-Order Confirmed!</h2>
          <p className="text-muted-foreground mb-2">
            Your {car.brand} {car.model} in {state?.color?.name || "default color"} is being processed.
          </p>
          <p className="text-sm text-muted-foreground mb-6">Order #AV-{Date.now().toString(36).toUpperCase()}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/tracking" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-semibold text-sm">
              Track Your Order
            </Link>
            <Link to="/catalog" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-display text-sm">
              Browse More
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <Link to={`/car/${car.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to {car.model}
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-black mb-8">Pre-Order Your {car.model}</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-6 sticky top-24">
              <img src={car.image} alt={car.model} className="w-full aspect-video object-cover rounded-lg mb-4" />
              <h3 className="font-display font-bold text-lg">{car.brand} {car.model}</h3>
              <p className="text-sm text-muted-foreground mb-4">{car.year} • {car.type}</p>
              {state?.color && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: state.color.hex }} />
                  <span className="text-sm">{state.color.name}</span>
                </div>
              )}
              {state?.features && state.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Selected Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {state.features.map((f) => (
                      <span key={f} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between font-display font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gradient-gold">${car.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {/* Shipping */}
            <div className="glass-panel p-6">
              <h3 className="font-display font-bold mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { field: "name", label: "Full Name", span: 2 },
                  { field: "email", label: "Email", span: 2 },
                  { field: "address", label: "Address", span: 2 },
                  { field: "city", label: "City", span: 1 },
                  { field: "country", label: "Country", span: 1 },
                  { field: "zip", label: "ZIP Code", span: 1 },
                ].map((f) => (
                  <div key={f.field} className={f.span === 2 ? "sm:col-span-2" : ""}>
                    <label className="text-xs text-muted-foreground font-display block mb-1">{f.label}</label>
                    <input
                      required
                      value={(formData as Record<string, string>)[f.field]}
                      onChange={(e) => updateField(f.field, e.target.value)}
                      className="w-full bg-secondary text-foreground px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="glass-panel p-6">
              <h3 className="font-display font-bold mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-display text-sm transition-all ${
                    paymentMethod === "card"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Credit / Debit
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-display text-sm transition-all ${
                    paymentMethod === "paypal"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <Wallet className="w-4 h-4" /> PayPal
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-display block mb-1">Card Number</label>
                    <input
                      required
                      placeholder="4242 4242 4242 4242"
                      value={formData.cardNumber}
                      onChange={(e) => updateField("cardNumber", e.target.value)}
                      className="w-full bg-secondary text-foreground px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground font-display block mb-1">Expiry</label>
                      <input
                        required
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={(e) => updateField("expiry", e.target.value)}
                        className="w-full bg-secondary text-foreground px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-display block mb-1">CVV</label>
                      <input
                        required
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => updateField("cvv", e.target.value)}
                        className="w-full bg-secondary text-foreground px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <p className="text-sm">You'll be redirected to PayPal after submitting.</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-display font-bold text-lg hover:bg-primary/90 transition-all gold-glow"
            >
              Confirm Pre-Order — ${car.price.toLocaleString()}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PreOrder;
