import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, ShoppingCart } from "lucide-react";

interface OutOfCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutOfCreditsDialog = ({ open, onOpenChange }: OutOfCreditsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <CreditCard className="h-6 w-6 text-primary" />
            Out of Credits!
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <p>You've used all your credits!</p>
            <p className="font-semibold text-primary">
              Contact admin to purchase more credits and continue using RizzMate! 💰
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button className="w-full" size="lg" disabled>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy More Credits (Contact Admin)
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutOfCreditsDialog;