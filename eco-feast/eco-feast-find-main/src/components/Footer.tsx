import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-eco-brown-dark text-white">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EcoFeastFind</h3>
            <p className="text-white/80">
              Your sustainable dining companion, helping you make eco-friendly choices
              while enjoying delicious meals.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/pre-dining" className="text-white/80 hover:text-white">Pre-Dining</Link>
              </li>
              <li>
                <Link to="/pre-booking" className="text-white/80 hover:text-white">Pre-Booking</Link>
              </li>
              <li>
                <Link to="/eco-rewards" className="text-white/80 hover:text-white">Eco Rewards</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-white/80">
                <span>info@ecofeastfind.com</span>
              </li>
              <li className="flex items-center text-white/80">
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center text-white/80">
                <span>Gandipet, Hyderabad, Telangana 500075</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <span>FB</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <span>IG</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <span>TW</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} EcoFeastFind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
