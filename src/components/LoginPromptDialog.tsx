import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { CreditCard, Sparkles } from "lucide-react";

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginPromptDialog = ({ open, onOpenChange }: LoginPromptDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <CreditCard className="h-6 w-6 text-primary" />
            Credits Exhausted!
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <p>You've used all your free credits!</p>
            <p className="font-semibold text-primary">
              Sign up now to get 100 more credits and continue charming! ✨
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <SignInButton>
            <Button className="w-full" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Sign Up for 100 Free Credits
            </Button>
          </SignInButton>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptDialog;