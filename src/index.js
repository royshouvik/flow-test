// @flow
import { createTestClient } from "./ApiTestHelper";
import { getCurrentUser } from "./UserApi";
import type { UserResponse } from "./UserApi";

const setup = (): Promise<any> =>
  new Promise(async resolve => {
    const client = createTestClient();
    await client.requestJWT();
    resolve(client);
  });

setup()
  .then(client => getCurrentUser(client))
  .then((response: UserResponse) => {
    console.log(JSON.stringify(response, null, 2));
  });
