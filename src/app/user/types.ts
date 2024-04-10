export const typeDefs = `#graphql
 
    input createUserData {
        firstName: String!
        lastName: String
        email: String!
        password: String!
    }
    type User {
        id : ID!
        firstName: String!
        lastName: String
        email: String!
        avatar: String
        # password: String!
    }
`