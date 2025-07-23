'use client';

import {useState, useEffect} from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import {ChevronsUpDown, UserPlus} from 'lucide-react';
import {getProfileDisplayName} from '@/lib/utils';
import {useUpdateStates} from '@/lib/hooks';
import {
  searchVisibleUsers,
  VisibleUsersQueryResult,
} from '@/app/(app)/dashboard/project/[slug]/actions';
import ProfileHead from './ProfileHead';

interface UserSearchProps {
  onUserSelect(user: VisibleUsersQueryResult): void;
  placeholder?: string;
}

export default function UserSearch({
  onUserSelect,
  placeholder = 'Search users...',
}: UserSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<VisibleUsersQueryResult[]>([]);
  const {loading, setLoading} = useUpdateStates();

  useEffect(() => {
    async function searchUsers() {
      if (searchTerm.trim()) {
        setLoading(true);
        const results = await searchVisibleUsers(searchTerm);
        setUsers(results);
        setLoading(false);
      } else {
        setUsers([]);
      }
    }

    searchUsers();
  }, [searchTerm]);

  const handleSelect = (user: VisibleUsersQueryResult) => {
    onUserSelect(user);
    setOpen(false);
    setSearchTerm('');
    setUsers([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add collaborator
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty className="px-6 pt-4 pb-3 text-sm">
              {loading
                ? 'Searching...'
                : searchTerm
                  ? 'No users found.'
                  : 'Users with their profile set to visible will appear here.'}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => handleSelect(user)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ProfileHead profile={user} className="h-8 w-8" />
                    <span>{getProfileDisplayName(user)}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
