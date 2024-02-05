import { Injectable } from '@nestjs/common';
import { SearchUsersInMemory } from 'src/core/users-search/users-search-in-cache';
import { User } from './people.types';

@Injectable()
export class PeopleService {
  constructor(private searchUsersInMemory: SearchUsersInMemory) {}

  searchUsers = async (query: string): Promise<User[]> => (await this.searchUsersInMemory.search(query)).items;
}
