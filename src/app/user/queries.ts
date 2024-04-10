export const queries = `#graphql
     verifyGoogleToken(token: String!): String
     getUserToken(email: String! , password: String!): String
     getCurrentUser: User
`