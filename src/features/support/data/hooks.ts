import { useState, useEffect } from "react";
import { apiGetTickets } from "./endpoints";
import { GetTicketsQuery } from "@/features/support/domain/types";

export function useTickets(query: GetTicketsQuery) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    apiGetTickets(query)
      .then((response) => {
        setTickets(Array.isArray(response?.data) ? response.data : []);
      })
      .catch((err) => {
        setError(err);
        setTickets([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [JSON.stringify(query)]);

  return { tickets, isLoading, error };
}
