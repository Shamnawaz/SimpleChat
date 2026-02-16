import { useApi } from "@/lib/axios";
import { IMessageSender } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
    const { apiWithAuth } = useApi();

    const result = useMutation({
        mutationFn: async () => {
            const { data } = await apiWithAuth<IMessageSender>({ method: 'POST', url: '/auth/callback' });
            return data;
        }
    });

    return result;
}