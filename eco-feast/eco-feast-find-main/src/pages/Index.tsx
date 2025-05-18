
import Hero from "@/components/Hero";
import FeatureButtons from "@/components/FeatureButtons";
import CuisineCategories from "@/components/CuisineCategories";
import AiChatbot from "@/components/AiChatbot";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <FeatureButtons />
        <CuisineCategories />
        <AiChatbot />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
