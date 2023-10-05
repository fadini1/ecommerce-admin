'use client';

import { toast } from "react-hot-toast";
import { Copy, Server } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: 'public' | 'admin';
};

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin'
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive'
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = 'public'
}) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success('Copied to Clipboard');
  };  

  return (
    <Alert className="mt-6">
      <Server className="h-5 w-5 mt-0.5" />
      <AlertTitle className="flex items-center gap-1  ">
        {title}
        <Badge 
        className="mt-0.5"
        variant={variantMap[variant]}>
          {textMap[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-1.5 flex items-center 
      gap-2 justify-between">
        <code className="bg-muted rounded-lg px-3 py-0.5 font-bold font-sans">
          {description}
        </code>
        <Button 
        size='sm'
        variant='outline' 
        onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};