import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export const useSubscriptionAnalytics = () => {
    return useQuery({
        queryKey: ['analytics', 'subscriptions'],
        queryFn: analyticsApi.getSubscriptions
    })



}