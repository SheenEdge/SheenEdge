import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";



// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI();
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export default function TechLearningChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchRoadmap = async (topic: string) => {
    const prompt = `Provide a roadmap for learning ${topic}.`;
    
    // Generate content using the model
    const result = await model.generateContent(prompt);
    return result.response.text(); // Adjust based on the actual structure of the response
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue('');

    // Fetch the roadmap from the API
    try {
      const roadmapMessage = await fetchRoadmap(inputValue);
      const aiResponse: Message = {
        id: Date.now(),
        text: roadmapMessage,
        sender: 'ai',
      };

      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now(),
        text: `Sorry, I couldn't fetch the roadmap for "${inputValue}". Please try again later.`,
        sender: 'ai',
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Tech Learning Chat</h1>
      </header>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.sender === 'user' ? '/placeholder.svg?height=32&width=32' : '/placeholder.svg?height=32&width=32&text=AI'} alt={message.sender === 'user' ? 'User Avatar' : 'AI Avatar'} />
                <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
              </Avatar>
              <div className={`mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-800">
        <div className="flex">
          <Input
            type="text"
            placeholder="Enter the tech you want to learn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow mr-2 bg-gray-700 text-white"
            aria-label="Enter the technology you want to learn about"
          />
          <Button type="submit" variant="secondary">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
