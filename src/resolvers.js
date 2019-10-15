export default {
    Query: {
      allEvents: async (parent, args, { eventsModel }) => {
        const events = await eventsModel.find();
        return events.map(x => {
          x._id = x._id.toString();
          return x;
        })
      },
      allGroups: async (parent, args, { groupsModel }) => {
        const groups = await groupsModel.find();
        return groups.map(x => {
          x._id = x._id.toString();
          return x;
        })
      },
      getGroup: async (parent, args, { groupsModel }) => {
        const group = await groupsModel.findById(args.groupID);
        group._id = group._id.toString();
        return group
        },
      eventsUser: async(parent,args,{eventsModel})=>{
        const events=await eventsModel.find({"members.userID":args.userID})
        return events.map(x => {
          x._id = x._id.toString();
          return x;
        })
      },
      groupsUser: async(parent,args,{groupsModel})=>{
        const groups=await groupsModel.find({"members.userID":args.userID})
        return groups.map(x => {
          x._id = x._id.toString();
          return x;
        })
      },
      groupEvents: async(parent,args,{eventsModel})=>{
        const events=await eventsModel.find({"groupID":args.groupID})
        return events.map(x => {
          x._id = x._id.toString();
          return x;
        })
      },
      getTransferTo:async(parent,args,{eventsModel})=>{
        let members=args.members
        let transferTo=[]
        for(let i=0;i<members.length;i++){
          if(members[i].variance<0){
            let amount=members[i].variance*-1
            let index=i;            
            for(let j=0;j<members.length;j++){
              if(members[j].variance>0 && j!=index){
                if(members[j].variance>=amount){
                  members[j].variance=members[j].variance-amount
                  members[index].variance=0
                  let debt={
                    lender:members[j].userID,
                    lenderImage:members[j].image,
                    debtor:members[index].userID,
                    debtorImage:members[index].image,
                    debtorName:members[index].name,
                    debtorLastName:members[index].lastname,
                    amount:amount
                  }
                  transferTo.push(debt)
                  j=members.length
                }
                else{
                  let debt={
                    lender:members[j].userID,
                    lenderImage:members[j].image,
                    debtor:members[index].userID,
                    debtorImage:members[index].image,
                    debtorName:members[index].name,
                    debtorLastName:members[index].lastname,
                    amount:members[j].variance
                  }
                  members[j].variance=0
                  members[index].variance=amount-members[j].variance
                  amount=amount-members[j].variance
                  transferTo.push(debt)
        
                }
              }
            }
          }
        }
        console.log("transfer",transferTo)
        return transferTo
      }

    },
    Mutation: {

      createEvent: async (parent, args, { eventsModel }) => {
        console.log("args",args)
        let members=args.evento.members
        let transferTo=[]
        for(let i=0;i<members.length;i++){
          if(members[i].variance<0){
            let amount=members[i].variance*-1
            let index=i;            
            for(let j=0;j<members.length;j++){
              if(members[j].variance>0 && j!=index){
                if(members[j].variance>=amount){
                  members[j].variance=members[j].variance-amount
                  members[index].variance=0
                  let debt={
                    lender:members[j].userID,
                    lenderImage:members[j].image,
                    debtor:members[index].userID,
                    debtorImage:members[index].image,
                    debtorName:members[index].name,
                    debtorLastName:members[index].lastname,
                    amount:amount
                  }
                  transferTo.push(debt)
                  j=members.length
                }
                else{
                  let debt={
                    lender:members[j].userID,
                    lenderImage:members[j].image,
                    debtor:members[index].userID,
                    debtorImage:members[index].image,
                    debtorName:members[index].name,
                    debtorLastName:members[index].lastname,
                    amount:members[j].variance
                  }
                  members[j].variance=0
                  members[index].variance=amount-members[j].variance
                  amount=amount-members[j].variance
                  transferTo.push(debt)
        
                }
              }
            }
          }
        }
        console.log("transfer",transferTo)
        let newEvent={
          name: args.evento.name,
          description: args.evento.description,
          createdDate: args.evento.createdDate,
          amount: args.evento.amount,
          members: args.evento.members,
          transferTo: transferTo,
          groupID: args.evento.groupID,
          status: 'active'
        }
        const event = await new eventsModel(newEvent).save();
        event._id = event._id.toString();
        return event;
      },
      createGroup: async (parent, args, { groupsModel }) => {
        const group = await new groupsModel(args.grupo).save();
        group._id = group._id.toString();
        return group
      },
      changeStatus: async (parent, args, { eventsModel }) => {
        return await eventsModel.findOneAndUpdate({_id:args.eventID},{$set:{status:args.status}},{new:true})
      },
      removeGroup: async (parent, args, { groupsModel }) => {
        return await groupsModel.findOneAndRemove({_id:args.groupID})
      },
      removeMember: async (parent, args, { groupsModel }) => {
        const aux=await groupsModel.updateOne({_id:args.groupID},{$pull:{"members":{"userID":args.userID}}},false,false)
        const selectedGroup=await groupsModel.findById(args.groupID)
        return selectedGroup
      },
      addMember: async (parent, args, { groupsModel, eventsModel}) => {
        const aux=await groupsModel.findById(args.groupID)
        let members=aux.members
        console.log("members",args.members)
        for(let i=0;i<args.members.length;i++){
          console.log("add member ok",args.members[i])
          members.push(args.members[i])
        }
        //asignacion de nuevo usuario a eventos activos
        const events=await eventsModel.find({"groupID":args.groupID})
        events.map(x => {
          x._id = x._id.toString();
          return x;
        })
        events.forEach(snapshot=>{
          if(snapshot.status=='active'){
            let eventMembers=snapshot.members
            for(let i=0;i<args.members.length;i++){
              let newMember={
                image: args.members[i].image,
                lastname: args.members[i].lastname,
                name: args.members[i].name,
                userID: args.members[i].userID,
                payAmount: 0,
                splitAmount: 0,
                variance: 0
              }
              eventMembers.push(newMember)
            }
            eventsModel.findOneAndUpdate({_id:snapshot._id},{$set:{members:eventMembers}},{new:true}).then(snap=>{
              console.log("todo bien")
            }).catch(error=>{
              console.log("error ",error)
            })
          }
        })
        return await groupsModel.findOneAndUpdate({_id:args.groupID},{$set:{members:members}},{new:true})
      }
    }
  }
