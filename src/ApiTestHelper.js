import ApiClient from "./ApiClient";

export function createTestClient() {
  return new ApiClient(
    ApiClient.createToken("tommy@hihenry.co", "supersecret"),
    jest.fn()
  );
}

export default {
  createTestClient
};
