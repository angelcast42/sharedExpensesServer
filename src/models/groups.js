
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const groupsSchema=new Schema({
    name:String,
    description: String,
    createdDate: String,
    image: String,
    members: Array,

})
const group=mongoose.model('groups',groupsSchema)

export default group