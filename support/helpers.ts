import { faker } from '@faker-js/faker';

export function generateRandomUser() {
  // automationexercise.com rejects duplicate emails; parallel workers + faker can rarely collide.
  const unique = `${Date.now()}-${faker.string.alphanumeric(10)}`;
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `e2e.${unique}@mailinator.com`.toLowerCase(),
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