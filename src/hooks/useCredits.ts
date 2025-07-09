import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCredits = (onCreditsExhausted?: () => void) => {
  const { user } = useUser();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get credits from localStorage for non-logged users
  const getGuestCredits = () => {
    const guestCredits = localStorage.getItem('guestCredits');
    return guestCredits ? parseInt(guestCredits) : 5;
  };

  // Set credits in localStorage for non-logged users
  const setGuestCredits = (newCredits: number) => {
    localStorage.setItem('guestCredits', newCredits.toString());
  };

  // Fetch user credits from database
  const fetchUserCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setCredits(data?.credits || 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use a credit
  const useCredit = async (): Promise<boolean> => {
    if (!user) {
      // Handle guest credits
      const currentCredits = getGuestCredits();
      if (currentCredits <= 0) {
        onCreditsExhausted?.();
        return false;
      }
      
      const newCredits = currentCredits - 1;
      setGuestCredits(newCredits);
      setCredits(newCredits);
      
      if (newCredits === 0) {
        // Trigger the login popup after the next credit usage attempt
        setTimeout(() => onCreditsExhausted?.(), 1000);
      }
      return true;
    }

    // Handle logged-in user credits
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const currentCredits = data?.credits || 0;
      if (currentCredits <= 0) {
        toast({
          title: "No credits remaining",
          description: "You've used all your credits. Contact admin for more.",
          variant: "destructive"
        });
        return false;
      }

      // Update credits in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: currentCredits - 1 })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Log transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          credits_used: 1,
          action_type: 'reply_generation'
        });

      setCredits(currentCredits - 1);
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      toast({
        title: "Error",
        description: "Failed to use credit. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserCredits();
    } else {
      setCredits(getGuestCredits());
      setLoading(false);
    }
  }, [user]);

  return {
    credits,
    loading,
    useCredit,
    refetchCredits: fetchUserCredits
  };
};