export default `
  type member{
    image: String!
    lastname: String!
    name: String!
    uid: String
    userID: String!
    payAmount: Float!
    splitAmount: Float!
    variance: Float!
  }
  type transferType{
    lender: String!,
    lenderImage: String!,
    debtor: String!,
    debtorImage: String!,
    debtorName: String!,
    debtorLastName: String!,
    amount: Float!
  }
  type memberGroup{
    image: String!
    lastname: String!
    name: String!
    uid: String
    userID: String!
    phone: String
  }
  type event {
    _id: String!
    name: String!
    description: String
    createdDate: String!
    amount:Float
    members: [member!]!,
    transferTo: [transferType!],
    status: String!
    groupID: String
}
  type group{
    _id: String!
    name: String
    description: String
    createdDate: String!
    image: String
    members: [memberGroup!]!

  }
  input memberInput{
    image: String!
    lastname: String!
    name: String!
    uid: String
    userID: String!
    payAmount: Float!
    splitAmount: Float!
    variance: Float!
  }
  input eventInput{
    name: String!
    description: String
    createdDate: String!
    splitType: Int
    amount:Float
    members: [memberInput]
    status: String!
    groupID: String

  }
  input memberGroupInput{
    image: String!
    lastname: String!
    name: String!
    uid: String
    userID: String!
    phone: String

  }
  input groupInput{
    name: String
    description: String
    createdDate: String!
    image: String
    members: [memberGroupInput]
  }
  type Query {
    allEvents: [event!]!
    eventsUser(userID:String):[event!]!
    allGroups: [group!]!
    getGroup(groupID:String): group!
    groupsUser(userID:String):[group!]
    groupEvents(groupID:String):[event!]
    getTransferTo(members:[memberInput]):[transferType!]
  }
  type Mutation {
    createEvent(
        evento: eventInput!   
    ): event!

    createGroup(
        grupo: groupInput!
    ): group!

    changeStatus(
      status: String,
      eventID: String
    ):event!

    removeGroup(
      groupID: String
    ):group

    removeMember(
      groupID: String
      userID: String
    ):group

    addMember(
      groupID: String!
      members: [memberGroupInput]!
    ):group
  }
`;