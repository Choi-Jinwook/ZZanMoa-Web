import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useRef } from "react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      retry: 2,
      retryDelay: 1000,
    },
  },
});

interface ReactQueryWrapperProps {
  children: ReactNode;
}

const ReactQueryWrapper = ({ children }: ReactQueryWrapperProps) => {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = queryClient;
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryWrapper;
