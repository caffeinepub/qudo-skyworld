import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, PastelSkyProfile, SkyWorldState, QudoReward, FriendVisit } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();

    const query = useQuery<UserProfile | null>({
        queryKey: ['currentUserProfile'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
    };
}

export function useSaveCallerUserProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: UserProfile) => {
            if (!actor) throw new Error('Actor not available');
            return actor.saveCallerUserProfile(profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
            toast.success('Profile saved successfully!');
        },
        onError: (error: Error) => {
            toast.error(`Failed to save profile: ${error.message}`);
        },
    });
}

// Sky World Queries
export function useGetSkyWorld() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<PastelSkyProfile | null>({
        queryKey: ['skyWorld'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getSkyWorld();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useInitializeSkyWorld() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.initializeSkyWorld();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skyWorld'] });
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
            toast.success('Welcome to your Sky World!');
        },
        onError: (error: Error) => {
            if (!error.message.includes('already exists')) {
                toast.error(`Failed to initialize Sky World: ${error.message}`);
            }
        },
    });
}

export function useUpdateSkyWorld() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (world: SkyWorldState) => {
            if (!actor) throw new Error('Actor not available');
            return actor.updateSkyWorld(world);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skyWorld'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to update Sky World: ${error.message}`);
        },
    });
}

// Rewards Queries
export function useGetRewards() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<QudoReward[]>({
        queryKey: ['rewards'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getRewards();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useRecordReward() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reward: QudoReward) => {
            if (!actor) throw new Error('Actor not available');
            return actor.recordReward(reward);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
            queryClient.invalidateQueries({ queryKey: ['skyWorld'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to record reward: ${error.message}`);
        },
    });
}

// Social Queries
export function useGetMyVisits() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<FriendVisit[]>({
        queryKey: ['myVisits'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getMyVisits();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useGetFriendSkyWorld() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async (friendPrincipal: string) => {
            if (!actor) throw new Error('Actor not available');
            const principal = Principal.fromText(friendPrincipal);
            return actor.getFriendSkyWorld(principal);
        },
    });
}

export function useVisitFriend() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ friendPrincipal, message }: { friendPrincipal: string; message: string }) => {
            if (!actor) throw new Error('Actor not available');
            const principal = Principal.fromText(friendPrincipal);
            return actor.visitFriend(principal, message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myVisits'] });
            toast.success('Visit recorded! Your friend will see your message.');
        },
        onError: (error: Error) => {
            toast.error(`Failed to visit friend: ${error.message}`);
        },
    });
}

export function useGetHighScores() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<PastelSkyProfile[]>({
        queryKey: ['highScores'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getHighScores();
        },
        enabled: !!actor && !actorFetching,
    });
}
