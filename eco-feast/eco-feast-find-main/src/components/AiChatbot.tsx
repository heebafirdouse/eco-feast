
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

const AiChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm your EcoFeast AI assistant. Ask me about cuisines, eco-friendly dining options, or recommendations for your taste!",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      
      if (input.toLowerCase().includes("italian")) {
        response = "For Italian cuisine, I recommend trying our authentic Margherita Pizza or Pasta Carbonara. They're made with locally sourced ingredients!";
      } else if (input.toLowerCase().includes("kerala")) {
        response = "Kerala cuisine is known for its coconut-based dishes. Try the Appam with Stew or the spicy Malabar Biryani for an authentic experience!";
      } else if (input.toLowerCase().includes("seafood")) {
        response = "For seafood lovers in Kerala, I recommend the Karimeen Pollichathu (Pearl spot fish) or the spicy Fish Curry. Both are local specialties!";
      } else {
        response = "I'd be happy to help you discover the perfect meal. Are you looking for something specific? Perhaps tell me what flavors you enjoy or dietary preferences you have.";
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: "ai",
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-eco-green hover:bg-eco-green-dark text-white shadow-lg z-30"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>EcoFeast AI Assistant</DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="h-[350px] overflow-y-auto space-y-4 p-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl py-2 px-3 ${
                      message.sender === "user"
                        ? "bg-eco-green text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-3">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} className="bg-eco-green hover:bg-eco-green-dark">Send</Button>
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatbot;
