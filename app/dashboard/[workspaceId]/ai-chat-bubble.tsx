"use client";

import { generateAIResponse } from "@/actions/ai";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const AIChatBubble = ({ workspaceId }: { workspaceId: string }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; message: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAIPrompt = async (e: any) => {
    e.preventDefault();
    if (!prompt) return;
    try {
      setIsLoading(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", message: prompt },
      ]);
      setPrompt("");
      const aiResponse = await generateAIResponse({
        workspaceId,
        prompt,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", message: aiResponse },
      ]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div className="size-14 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center cursor-pointer group">
          <Sparkles className="size-8 text-slate-200 transition duration-500 group-hover:rotate-180" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-full p-2">
        <ScrollArea className="w-full h-full mb-4 noscrollbar">
          <h1 className="flex items-center justify-center gap-x-2 text-3xl text-indigo-300 mt-2">
            Chat with AI <Sparkles className="size-7" />
          </h1>
          {messages.length > 0 ? (
            <div className="mt-6 w-full flex flex-col gap-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "max-w-[300px] bg-neutral-800 rounded-lg text-sm",
                    message.role === "user" ? "self-end" : "self-start"
                  )}
                >
                  <p className="p-2">{message.message}</p>
                </div>
              ))}
              {isLoading && <span>Generating AI Response...</span>}
            </div>
          ) : (
            <p className="text-center mt-4">No messages yet...</p>
          )}
          <form onSubmit={handleAIPrompt}>
            <Input
              placeholder="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-2"
            />
            <button type="submit" className="hidden"></button>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AIChatBubble;
