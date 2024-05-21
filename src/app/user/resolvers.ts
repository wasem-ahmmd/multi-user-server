import { GraphqlContext } from "../../intefaces";
import UserService, { createUserPayload, updateUserPasswordPayload, updateUserPayload } from "../../services/user";




const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const resultToken = await UserService.verifyGoogleAuthToken(token);
    return resultToken;
  },
  getUserToken: async (
    parent: any,
    payload: { email: string; password: string }
  ) => {
    const token = await UserService.getUsersToken({
      email: payload.email,
      password: payload.password,
    });
    return token;
  },
  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    const id = ctx.user?.id;
    if (!id) return null;

    const user = await UserService.getUserById(id);
    return user;
  },
};

const mutations = {
  createUser: async (parent: any, payload: createUserPayload) => {
    const res = await UserService.createUser(payload);
    return res;
  },
  updateUserSetting: async (parent: any, payload: updateUserPayload) => {
    const res = await UserService.updateUserSetting(payload);
    return res.id
  },
  UpdateUserPassword:async (parent: any, payload: updateUserPasswordPayload) => {
    const res = await UserService.UpdateUserPassword(payload);
    return res.id
  }

};

export const resolvers = { queries, mutations };
