import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Cuisine = {
  id: string;
  name: string;
  image: string;
  region: string;
};

const cuisines: Cuisine[] = [
  {
    id: "1",
    name: "Malabar Biryani",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    region: "kerala",
  },
  {
    id: "2",
    name: "Appam with Stew",
    image: "https://images.unsplash.com/photo-1630409351217-bc4fa6422ef3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    region: "kerala",
  },
  {
    id: "3",
    name: "Dal Baati Churma",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    region: "rajasthani",
  },
  {
    id: "4",
    name: "Laal Maas",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    region: "rajasthani",
  },
  {
    id: "5",
    name: "Butter Chicken",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=684&q=80",
    region: "north-indian",
  },
  {
    id: "6",
    name: "Chole Bhature",
    image: "https://images.unsplash.com/photo-1626132527578-5b2698601835?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    region: "north-indian",
  },
  {
    id: "7",
    name: "Dosa",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    region: "south-indian",
  },
  {
    id: "8",
    name: "Idli Sambar",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f72e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    region: "south-indian",
  },
  {
    id: "9",
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
    region: "italian",
  },
  {
    id: "10",
    name: "Pasta Carbonara",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    region: "italian",
  },
  {
    id: "11",
    name: "Kung Pao Chicken",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    region: "chinese",
  },
  {
    id: "12",
    name: "Dim Sum",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1329&q=80",
    region: "chinese",
  },
];

const regions = [
  { id: "all", name: "All Cuisines" },
  { id: "kerala", name: "Kerala" },
  { id: "rajasthani", name: "Rajasthani" },
  { id: "north-indian", name: "North Indian" },
  { id: "south-indian", name: "South Indian" },
  { id: "italian", name: "Italian" },
  { id: "chinese", name: "Chinese" },
];

const CuisineCategories = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCuisines = activeTab === "all" 
    ? cuisines 
    : cuisines.filter(cuisine => cuisine.region === activeTab);

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">Explore Cuisines</h2>
        <Button variant="outline" className="hidden sm:flex">View All</Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="bg-secondary/50 h-auto p-1">
            {regions.map(region => (
              <TabsTrigger 
                key={region.id}
                value={region.id}
                className={cn(
                  "data-[state=active]:bg-eco-green data-[state=active]:text-white px-4 py-2",
                  "whitespace-nowrap"
                )}
              >
                {region.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredCuisines.map((cuisine, index) => (
              <div 
                key={cuisine.id}
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-square rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-eco-green transition-all duration-300 shadow-md">
                  <img 
                    src={cuisine.image} 
                    alt={cuisine.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-center font-medium group-hover:text-eco-green transition-colors">
                  {cuisine.name}
                </h3>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CuisineCategories;