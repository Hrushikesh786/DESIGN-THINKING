const express=require("express")
const mongoose=require("mongoose")

const connection=mongoose.connect("mongodb://127.0.0.1:27017/DT-Project")

const userSchema=mongoose.Schema({
    username:String,
    name:String,
    age:Number,
    email:String,
    password:String,
})

//make the model

const model=mongoose.model("user",userSchema)

module.exports=model;