import { useApi } from "@/lib/axios";
import { IChat } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChats = () => {
    const { apiWithAuth } = useApi();
    return useQuery({
        queryKey: ['chats'],
        queryFn: async (): Promise<IChat[]> => {
            const { data } = await apiWithAuth<IChat[]>({ method: 'GET', url: '/chats' });
            return data;
        }
    })
}

export const useGetOrCreateChat = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await apiWithAuth<IChat>({
                method: "POST",
                url: `/chats/with/${participantId}`,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
    });
};