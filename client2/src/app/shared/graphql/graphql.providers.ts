import { FactoryProvider, importProvidersFrom } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

const uri = 'http://localhost:4000/graphql'; // <-- add the URL of the GraphQL server here

export const apolloClientOptionsFactory = (httpLink: HttpLink): ApolloClientOptions<unknown> => ({
  link: httpLink.create({ uri }),
  cache: new InMemoryCache(),
});

export const provideApolloOptions = (): FactoryProvider => ({
  provide: APOLLO_OPTIONS,
  useFactory: apolloClientOptionsFactory,
  deps: [HttpLink],
});

export const provideGraphQL = () => [importProvidersFrom(ApolloModule), provideApolloOptions()];
