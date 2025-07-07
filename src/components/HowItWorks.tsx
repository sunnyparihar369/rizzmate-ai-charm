import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Upload Your Chat",
      description: "Take a screenshot of your dating app conversation or paste the text directly",
      icon: "📱"
    },
    {
      step: "2", 
      title: "AI Analyzes Context",
      description: "Our AI reads the conversation, understands the vibe, and identifies the perfect response opportunity",
      icon: "🤖"
    },
    {
      step: "3",
      title: "Choose Your Tone",
      description: "Select from Flirty, Funny, or Casual to match your personality and the conversation mood",
      icon: "🎭"
    },
    {
      step: "4",
      title: "Get Your Reply",
      description: "Receive a perfectly crafted response that'll keep the conversation flowing and spark interest",
      icon: "✨"
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From awkward silence to magnetic conversation in just 4 simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="shadow-card hover:shadow-romantic transition-smooth group text-center border-border/50 hover:border-primary/30">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 romantic-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-110 transition-bounce">
                    {step.step}
                  </div>
                  <div className="text-4xl mb-4 group-hover:animate-float">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-smooth">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary/30 text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;