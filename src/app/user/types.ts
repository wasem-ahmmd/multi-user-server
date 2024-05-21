export const typeDefs = `#graphql
 
    input createUserData {
        firstName: String!
        lastName: String
        email: String!
        password: String!
    }
    input createUserSetting {
        userId: String!
        lastName: String
        bio: String
        gender: String
        relationship: String
    }
    input updateUserPassword{
        userId: String!
        currentpassword: String!
        newpassword:String!
    }

    type User {
        id : ID!
        firstName: String!
        lastName: String
        email: String!
        bio: String
        gender: String
        relationship: String
        avatar: String
        
        # password: String!
    }
    
`