'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {Card, CardContent} from '@/components/ui/card';
import {X, User} from 'lucide-react';
import {
  getPublicStorageURL,
  getProfileInitials,
  getProfileDisplayName,
} from '@/lib/utils';
import {createClient} from '@/lib/supabase/client';
import UserSearch from './UserSearch';
import {
  addProjectMember,
  removeProjectMember,
  getProjectMembers,
  ProjectMemberQueryResult,
  VisibleUsersQueryResult,
} from '@/app/(app)/dashboard/project/[slug]/actions';
import {useUpdateStates} from '@/lib/hooks';

export default function CollaboratorManager({
  projectId,
  currentUserId,
  isOwner,
}: {
  projectId: number;
  currentUserId: string;
  isOwner: boolean;
}) {
  const [members, setMembers] = useState<ProjectMemberQueryResult[]>([]);
  const {loading, setLoading} = useUpdateStates();
  const supabase = createClient();

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getProjectMembers(projectId);
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (user: VisibleUsersQueryResult) => {
    if (isOwner === false) {
      return;
    }
    // TODO: handle case where user is already a member
    const result = await addProjectMember(projectId, user.id);
    if (result.success) {
      loadMembers();
    } else {
      alert('Failed to add collaborator: ' + result.error);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    const result = await removeProjectMember(memberId);
    if (result.success) {
      loadMembers();
    } else {
      alert('Failed to remove collaborator: ' + result.error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add new collaborator */}
      {isOwner && (
        <div className="max-w-md">
          <UserSearch
            onUserSelect={handleAddMember}
            placeholder="Search for collaborators..."
          />
        </div>
      )}

      {/* Current collaborators */}
      <div className="space-y-2">
        {members.map((member) => (
          <Card key={member.id} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        member.profiles.profile_picture_url
                          ? getPublicStorageURL(
                              supabase,
                              'profile-photos',
                              member.profiles.profile_picture_url,
                            ) || undefined
                          : undefined
                      }
                      alt={getProfileDisplayName(member.profiles)}
                    />
                    <AvatarFallback className="select-none">
                      {getProfileInitials(member.profiles)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {getProfileDisplayName(member.profiles)}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {member.role}
                    </div>
                  </div>
                </div>
                {isOwner && member.profiles.id !== currentUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {members.length === 0 && (
          <Card className="p-8 text-center">
            <CardContent className="p-0">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No collaborators yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add collaborators to share your project
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
