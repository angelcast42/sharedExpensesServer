
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const eventSchema=new Schema({
    name:String,
    description: String,
    createdDate: String,
    splitType: Number,
    amount: Number,
    members: Array,
    transferTo: Array,
    status: String,
    groupID: String
})
const event=mongoose.model('events',eventSchema)

export default event