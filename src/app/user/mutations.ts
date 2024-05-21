export const mutations = `#graphql
    createUser(firstName:String!, lastName:String, email:String!, password:String!):String
    updateUserSetting(userId: String!,lastName:String,bio:String,gender:String,relationship:String):String
    UpdateUserPassword(userId: String!,currentpassword:String!,newpassword:String!):String
`