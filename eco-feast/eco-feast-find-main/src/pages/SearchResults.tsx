import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Plus, Minus } from 'lucide-react';

const API_URL = 'http://localhost:4002/api';

// Menu items from Explore Cuisines
const menuItems = [
  // Indian Cuisine
  {
    id: 1,
    name: 'Laal Maas',
    description: 'Traditional Rajasthani spicy mutton curry',
    price: 599,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'indian'
  },
  {
    id: 2,
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich tomato-based curry',
    price: 399,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'indian'
  },
  {
    id: 3,
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese with Indian spices',
    price: 299,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'indian'
  },
  {
    id: 4,
    name: 'Biryani',
    description: 'Fragrant rice dish with spices and meat',
    price: 449,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'indian'
  },
  {
    id: 5,
    name: 'Malabar Biryani',
    description: 'Kerala-style biryani with fragrant spices and tender meat',
    price: 499,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'indian'
  },
  {
    id: 6,
    name: 'Masala Dosa',
    description: 'Crispy crepe filled with spiced potatoes',
    price: 249,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'indian'
  },
  {
    id: 21,
    name: 'Appam with Stew',
    description: 'Kerala-style soft appam served with a creamy vegetable stew',
    price: 299,
    category: 'main',
    image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/12/appam-recipe-1.jpg',
    cuisine: 'indian'
  },
  {
    id: 22,
    name: 'Dal Baati Churma',
    description: 'Traditional Rajasthani dish with baked wheat balls, lentil curry, and sweet churma.',
    price: 399,
    category: 'main',
    image: 'https://www.cookwithmanali.com/wp-content/uploads/2018/08/Dal-Baati-Churma.jpg',
    cuisine: 'indian'
  },

  // Italian Cuisine
  {
    id: 7,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce and mozzarella',
    price: 299,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'italian'
  },
  {
    id: 8,
    name: 'Pasta Alfredo',
    description: 'Creamy pasta with parmesan cheese',
    price: 349,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1645112411345-9c06c0c5c0a0?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'italian'
  },
  {
    id: 9,
    name: 'Risotto',
    description: 'Creamy Italian rice dish',
    price: 399,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'italian'
  },
  {
    id: 10,
    name: 'Lasagna',
    description: 'Layered pasta with meat sauce and cheese',
    price: 449,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1619894991233-5ff2a1b9f3c0?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'italian'
  },

  // Japanese Cuisine
  {
    id: 11,
    name: 'Sushi Roll',
    description: 'Fresh salmon and avocado roll',
    price: 499,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'japanese'
  },
  {
    id: 12,
    name: 'Miso Soup',
    description: 'Traditional Japanese soup with tofu',
    price: 199,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'japanese'
  },
  {
    id: 13,
    name: 'Ramen',
    description: 'Japanese noodle soup with rich broth',
    price: 399,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'japanese'
  },
  {
    id: 14,
    name: 'Tempura',
    description: 'Crispy battered and fried seafood/vegetables',
    price: 349,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd4b1c8d4b3?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'japanese'
  },

  // Chinese Cuisine
  {
    id: 15,
    name: 'Dim Sum',
    description: 'Assorted steamed dumplings and buns',
    price: 299,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'chinese'
  },
  {
    id: 16,
    name: 'Kung Pao Chicken',
    description: 'Spicy diced chicken with peanuts',
    price: 399,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'chinese'
  },
  {
    id: 17,
    name: 'Wonton Soup',
    description: 'Clear soup with dumplings',
    price: 249,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'chinese'
  },

  // Thai Cuisine
  {
    id: 18,
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with eggs and tofu',
    price: 349,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'thai'
  },
  {
    id: 19,
    name: 'Tom Yum Soup',
    description: 'Hot and sour soup with shrimp',
    price: 299,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'thai'
  },
  {
    id: 20,
    name: 'Green Curry',
    description: 'Coconut milk curry with vegetables',
    price: 399,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1000&auto=format&fit=crop',
    cuisine: 'thai'
  }
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [cart, setCart] = useState<Array<{ item: typeof menuItems[0]; quantity: number }>>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  useEffect(() => {
    // Filter items based on search query with improved matching
    const searchResults = menuItems.filter(item => {
      const searchLower = query.toLowerCase();

      // Special case: If searching for 'dal baati churma', also show 'Laal Maas'
      if (searchLower.includes('dal baati churma')) {
        return (
          item.name.toLowerCase().includes('dal baati churma') ||
          item.name.toLowerCase().includes('laal maas')
        );
      }

      // More flexible search: show if ANY term matches
      const searchTerms = searchLower.split(' ');
      const itemName = item.name.toLowerCase();
      const itemDesc = item.description.toLowerCase();
      const itemCuisine = item.cuisine.toLowerCase();

      return searchTerms.some(term =>
        itemName.includes(term) ||
        itemDesc.includes(term) ||
        itemCuisine.includes(term)
      );
    });
    setFilteredItems(searchResults);
  }, [query]);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...prevCart, { item, quantity: 1 }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (itemId: number, change: number) => {
    setCart(prevCart => {
      const newCart = prevCart.map(cartItem => {
        if (cartItem.item.id === itemId) {
          const newQuantity = cartItem.quantity + change;
          return newQuantity > 0
            ? { ...cartItem, quantity: newQuantity }
            : null;
        }
        return cartItem;
      }).filter(Boolean) as Array<{ item: typeof menuItems[0]; quantity: number }>;
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  // Filter items based on active tab
  const displayedItems = activeTab === 'all' 
    ? filteredItems 
    : filteredItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold mb-2">Search Results</h1>
          <p className="text-muted-foreground mb-6">
            Showing results for "{query}"
          </p>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="pt-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No items found matching your search.</p>
                    <p className="text-sm mt-1">Try different keywords or browse all items.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredItems.map((item) => {
                      const cartItem = cart.find(cartItem => cartItem.item.id === item.id);
                      return (
                        <div key={item.id} className="flex overflow-hidden border rounded-lg">
                          <div className="w-1/3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="w-2/3 p-4 flex flex-col">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="font-medium">₹{item.price}</span>
                              {cartItem ? (
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center">{cartItem.quantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => addToCart(item)}
                                  className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResults; 