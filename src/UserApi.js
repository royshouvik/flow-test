// @flow
export type UserResponse = {
  status: string,
  data: User
};
type Group = {
  role: "group_admin" | "member",
  updated_at: string,
  attributes: {
    status: "active" | "inactive",
    tag: string,
    name: string,
    description: ?string
  },
  id: number,
  type: string
};

type User = {
  is_company_admin: boolean,
  user: {
    id: number,
    created_at: string,
    attributes: {
      email: string,
      status: string,
      first_name: string,
      phone_number: string,
      profile_image: ?string,
      preferred_channel: "slack" | "web_chat",
      slack_id: string,
      time_zone: string,
      last_name: string,
      title: ?string
    },
    groups: Group[]
  }
};

export const getCurrentUser = (client: any): Promise<UserResponse> => {
  const url = "/v2/user/self";
  return client.fetch("GET", url);
};
