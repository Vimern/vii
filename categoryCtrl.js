
const { default: mongoose } = require("mongoose");
const categorymodel = require("../model/categorymodel");


exports.createRoomCategory = async(req,res)  =>{
  try {
    const{ roomCategoryName,rooms } = req.body;
    const newRoomCategory = new RoomCategory({roomCategoryName,rooms});
    const savedRoomCategory = await newRoomCategory.save();
    res.status(201).send(savedRoomCategory);

  } catch (error) {
    res.status(400).send({messgae:error});
  }
};

exports.deactivateRoom = async (req,res) =>{
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const{ roomCategoryId } = req.body;
    const roomCategory = await roomCategory.findByIdAndUpdate(roomCategoryId, { isActive: false }, {new:true }).session(session);

    if(!roomCategory){
      return res.status(404).send({messgae:"room category not found"});
      
    }
    const rooms = await Room.updateMany({roomCategory:roomCategoryId},{isActive:false},{session});
    const roomIds = rooms.map(room => room._id);
    await Bed.updateMany({room:{$in: roomIds}},{isActive:false},{session});

    await session.commitTransaction();
    res.status(200).send({message:"room category,rooms,beds deactivated"});
  } catch(error){
    await session.abortTransaction();
    res.status(400).send({messgae:error})
  }finally{
    Session.endSession();
  }
};

exports.activateRoom = async(req,res)=>{
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const{roomCategoryId}  = req.body;

    const roomCategory = await roomCategory.findByIdAndUpdate(
      roomCategoryId,
      {isActive:true},
      {new:true,session}
    );
if(!roomCategory){
  return res.status(400).send({message:" No Room Category"});
}
const rooms = await Room.updateMany(
  {roomCategory:roomCategoryId},
  {isActive:true},
  {session}
);

const roomIds=(await Room.find({roomCategory:roomCategoryId})).map(room=>room._id);
await Bed.updateMany(
  {room:{$in:roomIds}},
  {isActive:true},
  {session}
);
await session.commitTransaction();
return res.status(200).send({message:"room category,room,bed activated"});

  } catch (error) {
    await session.abortTransaction();
    return res.status(200).send({messgae:"error"})
  }finally{
    session.endSession();
  }
};


    


  









