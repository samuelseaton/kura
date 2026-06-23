'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

let client: ApolloClient | null = null;

export function getApolloClient() {
  if (!client) {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: '/api/graphql' }),
    });
  }
  return client;
}
