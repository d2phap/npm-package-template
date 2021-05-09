import { author, Person } from '@/modules/person';

const user: Person = {
  firstName: 'Alice',
  lastName: 'Smith',
};

console.log('Current users', author, user);
