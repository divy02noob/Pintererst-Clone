const mongoose= require('mongoose');
const plm=require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinclone");

const userSchema = mongoose.Schema({
  username:String,
  name:String,
  email:String,
  password:String,
  profileImage:String,
  contact: Number,
  boards: {
    type:Array,
    default:[]
  },
  post:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts"

  }
]

});


userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);