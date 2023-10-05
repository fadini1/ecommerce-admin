'use client';

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import axios from "axios";

import { CategoryColumn } from "./columns";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,  
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface CellActionProps {
  data: CategoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Copied to Clipboard');
  };  

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `/api/${params.storeId}/categories/${data.id}`
      );

      router.refresh();

      toast.success('Category Deleted!');
    } catch (error) {
      toast.error(
        `You must remove all active Products 
        using this Category before proceeding`
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
 
  return (
    <>
      <AlertModal
        itemIdentity="Category" 
        isOpen={open}  
        loading={loading}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className="h-7 w-7 p-0">
            <span className="sr-only">
              Open
            </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="-mt-2" align='end'>
          <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4"/>
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4"/>
            Update
          </DropdownMenuItem>

          <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4"/>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};