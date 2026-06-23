"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import { getApolloClient } from "@/lib/apollo-client";

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseApolloProvider client={getApolloClient()}>
      {children}
    </BaseApolloProvider>
  );
}
