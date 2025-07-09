import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  prompt: string;
  context?: string;
  image?: string; // base64 encoded image
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context, image }: ChatRequest = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterApiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const systemPrompt = context || "You are a helpful dating and relationship assistant for RizzMate. You understand and can respond in English, Hindi, and Hinglish (Hindi-English mix). Provide friendly, supportive, and engaging advice in the same language as the user's input.";

    // Prepare messages
    const messages: any[] = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: prompt
      }
    ];

    // Add image if provided (for vision models)
    if (image) {
      messages[1] = {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image}`
            }
          }
        ]
      };
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://rizzmate.app',
        'X-Title': 'RizzMate'
      },
      body: JSON.stringify({
        model: image ? "deepseek/deepseek-r1" : "deepseek/deepseek-r1",
        messages: messages,
        temperature: 0.9,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error('No response generated from DeepSeek');
    }

    return new Response(JSON.stringify({ 
      response: generatedText,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in deepseek-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});