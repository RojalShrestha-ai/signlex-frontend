import { sgnlexAxios } from "..";

export const loginAdminApi = async ({ username, password }:{username:string; password:string}) => {
  const { data } = await sgnlexAxios.post("/api/v1/users/login", {
    username,
    password,
  });
  return data;
};

export const loginOrganizationApi = async ({ username, password }:{username:string; password:string}) => {
  const { data } = await sgnlexAxios.post("/api/v1/users/login", {
    username,
    password,
    is_admin: false,
    is_organization: true
  });
  return data;
};

export const loginApi = async ({ username, password }:{username:string; password:string}) => {
  const { data } = await sgnlexAxios.post("/api/v1/users/login", {
    email:username,
    password,
  });
  return data;
};

export const signupApi = async ({firstName, lastName, email, password }:{firstName:string, lastName: string,email:string; password:string}) => {
  const { data } = await sgnlexAxios.post("/api/v1/users/register", {
    displayName: `${firstName} ${lastName}`,
    email,
    password,
  });
  return data;
};

export const getUserIdApi = async () => {
  const { data } = await sgnlexAxios.get("/api/user");
  return data;
};

export const refreshTokenAdminApi = async () => {
  const { data } = await sgnlexAxios.get("/api/v1/users/refresh-token");
  return data;
};


export const refreshTokenApi = async () => {
  const { data } = await sgnlexAxios.get("/api/v1/users/refresh-token");
  return data;
};
