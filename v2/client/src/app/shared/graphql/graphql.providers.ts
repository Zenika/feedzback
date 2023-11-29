import { FactoryProvider, importProvidersFrom } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../../../environments/environment';

export const apolloOptionsFactory = (httpLink: HttpLink): ApolloClientOptions<unknown> => ({
  link: httpLink.create(environment.apolloOptions),
  cache: new InMemoryCache(),
});

export const provideApolloOptions = (): FactoryProvider => ({
  provide: APOLLO_OPTIONS,
  useFactory: apolloOptionsFactory,
  deps: [HttpLink],
});

export const provideGraphQL = () => [importProvidersFrom(ApolloModule), provideApolloOptions()];
