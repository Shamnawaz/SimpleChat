import { useApi } from "@/lib/axios";
import { IChat } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useChats = () => {
    const { apiWithAuth } = useApi();
    return useQuery({
        queryKey: ['chats'],
        queryFn: async (): Promise<IChat[]> => {
            const { data } = await apiWithAuth<IChat[]>({ method: 'GET', url: '/chat' });
            return data;
        }
    })
}