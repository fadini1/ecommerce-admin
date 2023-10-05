'use client';

import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Store } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
};

export default function StoreSwitcher({ 
  className, 
  items = []
}: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string, label: string }) => {
    setOpen(false);

    router.push(`/${store.value}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
        variant='outline'  
        role='combobox'
        aria-label="Select a Store"
        aria-expanded={open}
        className={cn('w-[220px] gap-2 items-center justify-start group', 
        className)}>
          <StoreIcon className="h-5 w-5 opacity-70 group-hover:opacity-100
          transition" />
          <div className="text-black opacity-80 group-hover:opacity-100
          transition">
            {currentStore?.label}
          </div>
          <ChevronsUpDown className="h-4 w-4 ml-auto shrink-0 opacity-70
          group-hover:opacity-100 transition"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0 mt-0.5">
        <Command>

          <CommandList>
            <CommandInput placeholder="Search Store" />

            <CommandEmpty>
              No Stores Found
            </CommandEmpty>
            
            <CommandGroup heading='Your Stores' >
              {formattedItems.map((store) => (
                <CommandItem
                key={store.value}
                onSelect={() => onStoreSelect(store)}
                className="text-sm cursor-pointer">
                  <StoreIcon className="h-5 w-5 mr-2" />
                  {store.label}
                  <Check 
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore?.value === store.value
                      ? 'opacity-100'
                      : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <CommandSeparator />

          <CommandList>
            <CommandGroup>

              <CommandItem
              className="cursor-pointer"
              onSelect={() => { setOpen(false); storeModal.onOpen(); }}>
                <PlusCircle className="h-5 w-5 mr-2"/>
                <div className="font-medium">
                  Create Store
                </div>
              </CommandItem>

            </CommandGroup>
          </CommandList>

        </Command>
      </PopoverContent>
    </Popover>
  );
};