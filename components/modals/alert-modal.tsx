'use client';

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  itemIdentity: string;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  itemIdentity,
  loading,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
    title={`Do you wish to delete this ${itemIdentity}?`}
    description="This action cannot be undone"
    isOpen={isOpen}
    onClose={onClose}>
      <div className="pt-1 gap-2 flex items-center w-full">
        <Button 
        disabled={loading}
        variant='outline'
        onClick={onClose}>
          Cancel
        </Button>

        <Button
        disabled={loading}
        variant='destructive'
        onClick={onConfirm}>
          Delete
        </Button> 
      </div>
    </Modal>
  );
};