
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      
      <div className="relative container h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in text-white drop-shadow-lg">
          Dine Green, <span className="text-eco-accent-yellow">Save Earth</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in animate-delay-200 text-white drop-shadow-md">
          Book tables, pre-order your favorite meals, and earn eco-rewards 
          while making sustainable choices for our planet.
        </p>
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in animate-delay-300">
          <Button size="lg" className="bg-eco-green hover:bg-eco-green-dark" asChild>
            <Link to="/pre-dining">Book a Table</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/80 hover:bg-white" asChild>
            <Link to="/eco-rewards">Learn About Eco Rewards</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
