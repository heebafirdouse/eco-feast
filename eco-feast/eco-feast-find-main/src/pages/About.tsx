import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">About EcoFeast</h1>
          
          <div className="prose prose-lg">
            <p className="text-muted-foreground mb-6">
              Welcome to EcoFeast, where sustainable dining meets exceptional cuisine. 
              We are committed to providing an eco-friendly dining experience while 
              maintaining the highest standards of food quality and service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              At EcoFeast, we believe in creating a sustainable future through 
              responsible dining practices. Our mission is to serve delicious food 
              while minimizing our environmental impact and promoting eco-friendly 
              initiatives in the food industry.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 text-muted-foreground mb-6">
              <li>Sustainability in all our operations</li>
              <li>Quality ingredients from local sources</li>
              <li>Minimal waste and eco-friendly packaging</li>
              <li>Community engagement and education</li>
              <li>Innovation in sustainable dining</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-6">
              Founded in 2024, EcoFeast began with a simple idea: to create a 
              dining experience that's both environmentally conscious and 
              gastronomically satisfying. Today, we continue to push boundaries 
              in sustainable dining while serving our community with pride.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About; 