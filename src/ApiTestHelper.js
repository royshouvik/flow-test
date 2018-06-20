import ApiClient from "./ApiClient";

export function createTestClient() {
  return new ApiClient(
    ApiClient.createToken("tommy@hihenry.co", "supersecret")
  );
}

export default {
  createTestClient
};
