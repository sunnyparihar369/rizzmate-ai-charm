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
    console.log('🎯 Starting gemini-chat function');
    const { prompt, context, image }: ChatRequest = await req.json();
    console.log('📥 Request received:', { 
      promptLength: prompt?.length, 
      hasContext: !!context, 
      hasImage: !!image 
    });

    if (!prompt) {
      console.error('❌ No prompt provided');
      throw new Error('Prompt is required');
    }

    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    console.log('🔑 OpenRouter API Key configured:', !!openrouterApiKey);
    
    if (!openrouterApiKey) {
      console.error('❌ OPENROUTER_API_KEY not found in environment');
      return new Response(JSON.stringify({ 
        error: 'OPENROUTER_API_KEY not configured. Please add it in Supabase Edge Function Secrets.',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
      // For now, let's skip image processing as the free model doesn't support vision
      console.log('🖼️ Image provided but using text-only model');
      messages[1] = {
        role: "user",
        content: prompt + " (Note: Image was provided but cannot be processed with current model)"
      };
    }

    console.log('🚀 Making request to OpenRouter...');
    console.log('📋 Request payload:', {
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messagesCount: messages.length,
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://rizzmate.app',
        'X-Title': 'RizzMate'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    console.log('📡 OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API full error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      return new Response(JSON.stringify({ 
        error: `OpenRouter API error: ${response.status} - ${errorText}`,
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('✅ OpenRouter response received:', { 
      hasChoices: !!data.choices?.length,
      firstChoiceHasMessage: !!data.choices?.[0]?.message,
      contentLength: data.choices?.[0]?.message?.content?.length
    });

    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      console.error('❌ No response from AI, full data:', data);
      return new Response(JSON.stringify({ 
        error: 'No response generated from AI',
        success: false,
        debug: data
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🎉 Success! Generated text length:', generatedText.length);
    return new Response(JSON.stringify({ 
      response: generatedText,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in gemini-chat function:', error);
    console.error('📋 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      success: false,
      debug: {
        name: error.name,
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});