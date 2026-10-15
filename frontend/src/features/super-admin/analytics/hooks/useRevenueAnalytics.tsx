import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export const useRevenues = () => {
    return useQuery({
        queryKey: ['analytics', 'revenue'],
        queryFn: analyticsApi.getRevenue
    })

}