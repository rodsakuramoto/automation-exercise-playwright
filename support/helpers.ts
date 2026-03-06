import { faker } from '@faker-js/faker';

export function generateRandomUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 12 }),
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    country: 'United States',
    state: faker.location.state(), // Vai gerar estados reais dos EUA
    city: faker.location.city(),
    zipcode: faker.location.zipCode(), // Vai gerar no formato americano
    mobileNumber: faker.phone.number()
  };
}