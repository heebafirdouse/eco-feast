import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Upload, Car } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitActivity, getUserProfile } from "@/lib/api";

type ActivityType = {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: React.ElementType;
};

type Activity = {
  id: string;
  type: string;
  date: string;
  status: string;
  points: number;
  image: string;
};

const activityTypes: ActivityType[] = [
  {
    id: "plant-tree",
    name: "Plant a Tree",
    description: "Upload a photo of yourself planting a tree",
    points: 50,
    icon: Leaf,
  },
  {
    id: "cycle",
    name: "Cycle to Restaurant",
    description: "Use a bicycle instead of a car to visit us",
    points: 25,
    icon: Car,
  },
  {
    id: "carpool",
    name: "Carpool",
    description: "Share a ride with friends to reduce emissions",
    points: 15,
    icon: Car,
  },
];

const EcoRewards = () => {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("wallet");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState({ total: 0, redeemed: 0, balance: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user data and activities
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const loadData = async () => {
      try {
        // Load user profile to get points
        const profileData = await getUserProfile(token);
        if (!profileData.success) {
          throw new Error(profileData.error || 'Failed to load profile');
        }
        
        // Load activities
        const activitiesResponse = await fetch('http://localhost:4002/api/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const activitiesData = await activitiesResponse.json();

        setUserPoints({
          total: profileData.user?.points || 0,
          redeemed: 0,
          balance: profileData.user?.points || 0
        });
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };

    loadData();
  }, [navigate]);

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId);
    setUploadedImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitActivity = async () => {
    if (!selectedActivity || !uploadedImage) {
      toast.error("Please select an activity and upload an image");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const activityData = {
        type: selectedActivity,
        proof: uploadedImage
      };

      const response = await submitActivity(token, activityData);
      
      if (response.success) {
        toast.success("Eco activity submitted successfully!");
        setUserPoints(prev => ({
          ...prev,
          total: response.newPoints,
          balance: response.newPoints
        }));
        setActivities(prev => [...prev, response.activity]);
        setSelectedActivity(null);
        setUploadedImage(null);
        setActiveTab("wallet");
      } else {
        throw new Error(response.error || 'Failed to submit activity');
      }
    } catch (error) {
      console.error('Error submitting activity:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit activity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-2">Eco-Friendly Activities</h1>
          <p className="text-muted-foreground mb-6">
            Make sustainable choices, upload proof, and earn points
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-muted/50 p-1">
              <TabsTrigger value="wallet" className="flex-1 data-[state=active]:bg-eco-green data-[state=active]:text-white">
                Eco Wallet
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex-1 data-[state=active]:bg-eco-green data-[state=active]:text-white">
                Submit Activities
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet" className="pt-6">
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-eco-green to-eco-accent-yellow text-white">
                  <CardHeader>
                    <CardTitle className="text-xl">Your Eco Points</CardTitle>
                    <CardDescription className="text-white/80">
                      Track your eco-friendly activities and points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold mb-6">{userPoints.balance}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-white/80">Total Earned</p>
                        <p className="text-xl font-semibold">{userPoints.total}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/80">Total Redeemed</p>
                        <p className="text-xl font-semibold">{userPoints.redeemed}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => {
                        const activityType = activityTypes.find(t => t.id === activity.type);
                        return (
                          <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-eco-green/20 flex items-center justify-center">
                                {activityType?.icon && <activityType.icon className="h-6 w-6 text-eco-green" />}
                              </div>
                              <div>
                                <p className="font-medium">{activityType?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(activity.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-eco-green">+{activity.points}</p>
                              <p className="text-xs text-muted-foreground capitalize">{activity.status}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No activities recorded yet</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="pt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Eco Activity</CardTitle>
                    <CardDescription>
                      Choose an activity and upload proof to earn eco points
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activityTypes.map((activity) => (
                        <Card 
                          key={activity.id}
                          className={`cursor-pointer border-2 transition-colors ${
                            selectedActivity === activity.id 
                              ? "border-eco-green" 
                              : "border-transparent hover:border-eco-green/50"
                          }`}
                          onClick={() => handleActivitySelect(activity.id)}
                        >
                          <CardContent className="pt-6 text-center">
                            <div className="w-12 h-12 mx-auto rounded-full bg-eco-green/20 flex items-center justify-center mb-4">
                              <activity.icon className="h-6 w-6 text-eco-green" />
                            </div>
                            <h3 className="font-medium mb-1">{activity.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                            <p className="text-eco-green font-semibold">+{activity.points} points</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {selectedActivity && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-4">Upload Proof</h3>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          {uploadedImage ? (
                            <div>
                              <img 
                                src={uploadedImage} 
                                alt="Uploaded proof" 
                                className="max-h-64 mx-auto mb-4"
                              />
                              <Button
                                variant="outline"
                                className="mt-2"
                                onClick={() => setUploadedImage(null)}
                              >
                                Remove Image
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                              <p className="mb-4 text-muted-foreground">
                                Click to upload or drag and drop
                              </p>
                              <Button asChild variant="outline">
                                <label>
                                  Browse Files
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                  />
                                </label>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full bg-eco-green hover:bg-eco-green-dark"
                      disabled={!selectedActivity || !uploadedImage}
                      onClick={handleSubmitActivity}
                    >
                      Submit Activity
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EcoRewards;
