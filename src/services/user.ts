import { prisma } from "../clients/db";
import * as bcrypt from "bcrypt";
import axios from "axios";
import JWTService from "./jwt";

const saltRounds = 10;

export interface createUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}
interface GoogleTokenResult {
  iss?: string;
  nbf?: string;
  aud?: string;
  sub?: string;
  email: string;
  email_verified: string;
  azp?: string;
  name?: string;
  picture?: string;
  given_name: string;
  family_name?: string;
  iat?: string;
  exp?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
  password?:string
}

export interface getUserTokenPayload{
  email: string,
  password: string,
}

class UserService {
  public static async verifyGoogleAuthToken(token: string) {
    const googleToken = token;
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleOauthURL.searchParams.set("id_token", googleToken);
    const { data } = await axios.get<GoogleTokenResult>(
      googleOauthURL.toString(),
      {
        responseType: "json",
      }
    );
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          avatar: data.picture,
          password: ""
        },
      });
    }
    const userInDb = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!userInDb) throw new Error("User with email not found");
    const userToken = JWTService.generateTokenForUser(userInDb);

    return userToken;
  }

  private static generateHashPass(password:string, saltRounds:number){
    const hashPasword = bcrypt.hash(password, saltRounds);
    return hashPasword
  }

  private static async compereHashPass(password: string, dbPassword: string) {
    const isMatch = await bcrypt.compare(password, dbPassword);
    return isMatch;
  }

  public static async createUser(payload: createUserPayload) {
    const { firstName, lastName, email, password } = payload;
    if (!firstName || !email || !password)
      throw new Error("All Filed Are Requried");
    const hashPasword = await UserService.generateHashPass(password,saltRounds)
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (user) throw new Error("User with email Is Already Exists");
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPasword,
      },
    });
    const token = JWTService.generateTokenForUser(newUser);
    return token 
  }

  private static getUserByEmail(email: string){
    return prisma.user.findUnique({where: {email}})
  }

  public static async getUsersToken(payload: getUserTokenPayload){
    const { email, password} = payload;
    const user = await UserService.getUserByEmail(email)
    if(!user) throw new Error('User Not Found')
    const userHashPasword = await UserService.compereHashPass(password,user.password)
    if(!userHashPasword) throw new Error('Incorrect Password')
    const Token = JWTService.generateTokenForUser(user)
    return Token;
  }

  public static getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
  
}

export default UserService;
