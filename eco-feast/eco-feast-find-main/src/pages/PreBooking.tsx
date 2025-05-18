import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Minus, Plus, ShoppingCart } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { placeOrder } from '@/lib/api';

const timeSlots = [
  "11:30 AM", "12:00 PM", "12:30 PM", 
  "1:00 PM", "1:30 PM", "2:00 PM",
  "6:30 PM", "7:00 PM", "7:30 PM",
  "8:00 PM", "8:30 PM", "9:00 PM",
];

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes in creamy tomato sauce",
    price: 299,
    category: "main",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "2",
    name: "Vegetable Biryani",
    description: "Fragrant basmati rice with mixed vegetables",
    price: 349,
    category: "main",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "3",
    name: "Masala Dosa",
    description: "Crispy rice crepe with spiced potato filling",
    price: 199,
    category: "main",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "4",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 49,
    category: "starter",
    image: "https://images.unsplash.com/photo-1601050690117-94f5f7a4f140?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  },
  {
    id: "5",
    name: "Mango Lassi",
    description: "Refreshing yogurt drink with mango puree",
    price: 99,
    category: "beverage",
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
  },
  {
    id: "6",
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in sugar syrup",
    price: 149,
    category: "dessert",
    image: "https://images.unsplash.com/photo-1627308595171-d1b5d95d69cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
  },
];

type CartItem = {
  item: MenuItem;
  quantity: number;
};

const PreBooking = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filteredItems = activeTab === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);
  
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
    
    toast.success(`${item.name} added to cart`);
  };
  
  const updateQuantity = (itemId: string, change: number) => {
    setCart(prevCart => {
      return prevCart.map(cartItem => {
        if (cartItem.item.id === itemId) {
          const newQuantity = Math.max(0, cartItem.quantity + change);
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      }).filter(cartItem => cartItem.quantity > 0);
    });
  };
  
  const totalAmount = cart.reduce((total, cartItem) => {
    return total + (cartItem.item.price * cartItem.quantity);
  }, 0);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!date || !timeSlot) {
      toast.error("Please select a date and time");
      return;
    }
    
    if (cart.length === 0) {
      toast.error("Please add at least one item to your order");
      return;
    }
    
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage after login
      if (!token) {
        toast.error("Please log in to place an order");
        return;
      }
      const orderData = {
        cart,
        date: date.toISOString(),
        timeSlot,
        guests: parseInt(guests),
      };
      const result = await placeOrder(token, orderData);
      if (result.success) {
        toast.success("Table booked and food pre-ordered successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      toast.error("An error occurred while placing your order");
    }
  };
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Dispatch storage event to update Navbar
    window.dispatchEvent(new Event('storage'));
  }, [cart]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold mb-2">Book a Table & Pre-Order Food</h1>
          <p className="text-muted-foreground mb-6">
            Reserve your table and pre-order your meal for a seamless dining experience
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Reservation Details</CardTitle>
                </CardHeader>
                
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time Slot</Label>
                    <Select value={timeSlot} onValueChange={setTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "person" : "people"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input id="contact" placeholder="Enter your phone number" type="tel" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Pre-Order Menu</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-muted/50 p-1">
                      <TabsTrigger value="all" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                        All Items
                      </TabsTrigger>
                      <TabsTrigger value="starter" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                        Starters
                      </TabsTrigger>
                      <TabsTrigger value="main" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                        Main Course
                      </TabsTrigger>
                      <TabsTrigger value="beverage" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                        Beverages
                      </TabsTrigger>
                      <TabsTrigger value="dessert" className="data-[state=active]:bg-eco-green data-[state=active]:text-white">
                        Desserts
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={activeTab} className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredItems.map((item) => (
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
                                <Button 
                                  onClick={() => addToCart(item)} 
                                  variant="outline" 
                                  size="sm"
                                  className="border-eco-green text-eco-green hover:bg-eco-green hover:text-white"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="shadow-md sticky top-20">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Your Order</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Your cart is empty</p>
                      <p className="text-sm mt-1">Add items from the menu to pre-order</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((cartItem) => (
                        <div key={cartItem.item.id} className="flex justify-between items-center pb-4 border-b">
                          <div>
                            <h4 className="font-medium">{cartItem.item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ₹{cartItem.item.price} each
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => updateQuantity(cartItem.item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center">{cartItem.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => updateQuantity(cartItem.item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total:</span>
                          <span>₹{totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full bg-eco-green hover:bg-eco-green-dark"
                    disabled={cart.length === 0 || !date || !timeSlot}
                  >
                    Confirm Booking & Pre-Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PreBooking;
