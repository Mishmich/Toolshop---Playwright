let faker: any;

async function initializeFaker() {
  const fakerModule = await import("@faker-js/faker");
  faker = fakerModule.faker;
}

export async function getTestValues() {
  if (!faker) {
    await initializeFaker();
  }
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    dob: "2001-06-15",
    street: faker.location.streetAddress(),
    postal_code: faker.location.zipCode(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: "US",
    phone: '111333222',
    emailAddress: faker.internet.email(),
    password: "BabYK0ala!"
  };
}