
import { Link } from "react-router-dom";
import { Calendar, ShoppingCart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Pre-Dining",
    description: "Book a table at your favorite restaurant",
    icon: Calendar,
    path: "/pre-dining",
    color: "bg-eco-accent-red",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "Pre-Dining & Pre-Booking",
    description: "Book a table and pre-order your meal",
    icon: ShoppingCart,
    path: "/pre-booking",
    color: "bg-eco-brown",
    image: "https://images.unsplash.com/photo-1543826173-70651703c5a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1206&q=80"
  },
  {
    title: "Eco-Friendly Rewards",
    description: "Earn rewards for sustainable choices",
    icon: Leaf,
    path: "/eco-rewards",
    color: "bg-eco-green",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
  },
];

const FeatureButtons = () => {
  return (
    <div className="container py-10">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
        Choose Your Experience
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link 
            key={feature.title}
            to={feature.path}
            className="group animate-fade-in"
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className="bg-card border rounded-xl overflow-hidden shadow-md h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
              <div className="h-40 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className={cn("h-2", feature.color)} />
              <div className="p-6 flex flex-col items-center text-center">
                <div className={cn("w-14 h-14 rounded-full flex items-center justify-center mb-4", feature.color)}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Button
                  variant="outline"
                  className={cn("mt-auto group-hover:bg-eco-green group-hover:text-white group-hover:border-eco-green transition-colors duration-300")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeatureButtons;
