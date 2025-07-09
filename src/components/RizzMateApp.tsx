import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/useCredits";
import { Upload, Copy, Sparkles, MessageCircle, Loader2, CreditCard } from "lucide-react";
import LoginPromptDialog from "./LoginPromptDialog";
import OutOfCreditsDialog from "./OutOfCreditsDialog";

const RizzMateApp = () => {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [conversationText, setConversationText] = useState("");
  const [selectedTone, setSelectedTone] = useState("flirty");
  const [generatedReply, setGeneratedReply] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showOutOfCredits, setShowOutOfCredits] = useState(false);
  const { toast } = useToast();
  
  const { credits, loading: creditsLoading, useCredit } = useCredits(
    () => setShowLoginPrompt(true),
    () => setShowOutOfCredits(true)
  );

  const tones = [
    { id: "flirty", label: "Flirty", emoji: "😍" },
    { id: "funny", label: "Funny", emoji: "😂" },
    { id: "casual", label: "Casual", emoji: "😊" }
  ];

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setScreenshot(file);
        toast({
          title: "Screenshot uploaded",
          description: "Ready to analyze your conversation!"
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive"
        });
      }
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (data:image/jpeg;base64,)
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeConversation = async () => {
    if (!screenshot && !conversationText.trim()) {
      toast({
        title: "Missing input",
        description: "Please upload a screenshot or paste conversation text",
        variant: "destructive"
      });
      return;
    }

    // Check and use credit before proceeding
    const canProceed = await useCredit();
    if (!canProceed) {
      return;
    }

    setIsAnalyzing(true);
    try {
      let analysisPrompt = "";
      let imageData = "";
      
      if (screenshot) {
        imageData = await convertImageToBase64(screenshot);
        analysisPrompt = `Analyze this dating app conversation screenshot and generate a ${selectedTone} reply. Please read the conversation in the image and create an engaging response that matches the ${selectedTone} tone.`;
      } else {
        analysisPrompt = `Analyze this dating app conversation and generate a ${selectedTone} reply: "${conversationText}"`;
      }

      const contextPrompt = `You are RizzMate, an AI dating assistant. Your job is to analyze dating app conversations and generate perfect replies. 

Context: User wants a ${selectedTone} response.
Conversation: ${conversationText || "Screenshot uploaded - please analyze the image"}

Generate a ${selectedTone} reply that is:
- Engaging and conversation-continuing
- Matches the ${selectedTone} tone perfectly
- Natural and authentic
- Not too long (1-2 sentences max)
- Appropriate for dating app context

Return ONLY the reply text, no explanations or quotes.`;

      const requestBody: any = {
        prompt: analysisPrompt,
        context: contextPrompt
      };

      if (imageData) {
        requestBody.image = imageData;
      }

      console.log('Calling openrouter-chat with:', requestBody);
      const { data, error } = await supabase.functions.invoke('openrouter-chat', {
        body: requestBody
      });

      console.log('OpenRouter response:', { data, error });
      if (error) {
        console.error('OpenRouter error details:', error);
        throw error;
      }

      if (data?.response) {
        setGeneratedReply(data.response);
        toast({
          title: "Reply generated! ✨",
          description: "Your perfect response is ready to copy"
        });
      } else {
        console.error('No response in data:', data);
        throw new Error('No response received from OpenRouter');
      }
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again or check your connection",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyReply = async () => {
    if (generatedReply) {
      try {
        await navigator.clipboard.writeText(generatedReply);
        toast({
          title: "Copied to clipboard! 📋",
          description: "Paste it into your dating app and watch the magic happen"
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Please select and copy manually",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <>
      <LoginPromptDialog 
        open={showLoginPrompt} 
        onOpenChange={setShowLoginPrompt} 
      />
      <OutOfCreditsDialog 
        open={showOutOfCredits} 
        onOpenChange={setShowOutOfCredits} 
      />
      <div className="min-h-screen bg-gradient-card pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Generate Your Perfect Reply
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload a screenshot or paste your conversation to get the perfect reply
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="text-lg px-3 py-1">
                {creditsLoading ? "Loading..." : `${credits} Credits`}
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Conversation
                </CardTitle>
                <CardDescription>
                  Upload a screenshot or paste your conversation text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="screenshot">Screenshot Upload</Label>
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="cursor-pointer"
                  />
                  {screenshot && (
                    <p className="text-sm text-muted-foreground mt-1">
                      📸 {screenshot.name}
                    </p>
                  )}
                </div>

                <div className="text-center text-muted-foreground">
                  <span>OR</span>
                </div>

                <div>
                  <Label htmlFor="conversation">Paste Conversation</Label>
                  <Textarea
                    id="conversation"
                    placeholder="Paste your dating app conversation here..."
                    value={conversationText}
                    onChange={(e) => setConversationText(e.target.value)}
                    className="min-h-32"
                  />
                </div>

                <div>
                  <Label>Select Tone</Label>
                  <div className="flex gap-2 mt-2">
                    {tones.map((tone) => (
                      <Badge
                        key={tone.id}
                        variant={selectedTone === tone.id ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => setSelectedTone(tone.id)}
                      >
                        {tone.emoji} {tone.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={analyzeConversation}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Perfect Reply
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Your Perfect Reply
                </CardTitle>
                <CardDescription>
                  AI-generated response ready to copy and paste
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedReply ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-lg">{generatedReply}</p>
                    </div>
                    <Button 
                      onClick={copyReply}
                      variant="romantic"
                      className="w-full"
                      size="lg"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Reply
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your perfect reply will appear here after analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RizzMateApp;