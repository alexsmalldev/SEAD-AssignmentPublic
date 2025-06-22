// External libraries
import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

// Internal
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Command, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandInput } from '../components/ui/command';
import { cn } from '../lib/utils';

const FilterButton = ({ options, selectedValue, onSelect, placeholder, showSearch, emptyText, getOptionLabel = (option) => option.name }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between px-4"
                >
                    <span className="truncate max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {selectedValue ? getOptionLabel(selectedValue) : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    {
                        showSearch && (
                            <CommandInput placeholder="Search" />

                        )
                    }
                    <CommandList>
                        {
                            (showSearch && emptyText) && (
                                <CommandEmpty>{emptyText}</CommandEmpty>

                            )
                        }
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.id}
                                    onSelect={() => {
                                        onSelect(option.id === selectedValue?.id ? null : option);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValue?.id === option.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {getOptionLabel(option)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default FilterButton;