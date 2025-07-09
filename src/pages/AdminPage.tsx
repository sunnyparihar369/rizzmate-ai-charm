import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const AdminPage = () => {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      if (!user) return;

      try {
        // Create profile if it doesn't exist for admin email
        if (user.primaryEmailAddress?.emailAddress === 'classroom2cash@gmail.com') {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (!existingProfile) {
            await supabase
              .from('profiles')
              .insert({
                user_id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                full_name: user.fullName || '',
                credits: 1000,
                is_admin: true
              });
          }

          setIsAdmin(true);
          await loadData();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [profilesRes, transactionsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('credit_transactions').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      if (profilesRes.data) setProfiles(profilesRes.data);
      if (transactionsRes.data) setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const updateCredits = async (profileId: string, newCredits: number) => {
    try {
      await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', profileId);
      
      await loadData();
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16 container mx-auto px-4 py-8">
        <div>Loading admin panel...</div>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16 container mx-auto px-4 py-8">
        <div>Access denied. Admin privileges required.</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profiles ({profiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profiles.map(profile => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium">{profile.full_name || profile.email}</div>
                      <div className="text-sm text-muted-foreground">{profile.email}</div>
                      <div className="text-sm">Credits: {profile.credits} | Admin: {profile.is_admin ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateCredits(profile.id, profile.credits + 100)}
                      >
                        +100 Credits
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCredits(profile.id, Math.max(0, profile.credits - 100))}
                      >
                        -100 Credits
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions ({transactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between text-sm p-2 border rounded">
                    <span>{transaction.action_type}</span>
                    <span>{transaction.credits_used} credits</span>
                    <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;