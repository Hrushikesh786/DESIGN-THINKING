const express =require("express")
const path=require("path")
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel=require("./models/user")

const app=express()
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "../frontend/views"));
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/register",(req,res)=>{
    res.render("createAccount")
})
app.post("/register", async (req, res) => {
    let { email, username, password, name, age } = req.body;
    // userModel.findOne({ email });
    let user = await userModel.findOne({ email });
  
    if (user) {
      return res.send("User Already Registered");
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({
          username,
          age,
          name,
          email,
          password: hash,
        });
        let token = jwt.sign({ email: email, userid: user._id }, "secured");
        res.cookie("token", token);
        res.send("registered Successfully");
      });
    });
  });

  //Login Option
  app.get("/login",(req,res)=>{
    res.render("loginAccount")
})
app.post("/login",async(req,res)=>{
  let { email, username, password, name, age } = req.body;
    // userModel.findOne({ email });
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.send("!!OOPS SOMETHING WENT WRONG");
    }
    bcrypt.compare(password,user.password,function(err,result){
      if(result){
        let token=jwt.sign({email:email,userid:user._id},"secured#321")
        res.cookie("token",token)
        res.status(200).redirect("profile")
      }
      else{
        res.redirect("login")
      }
    })
})
//logout
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});
//profile from here
app.get("/profile",isLoggedIn,(req,res)=>{
  res.render("profile")
})

// Check if user is logged in
app.get("/check-login", isLoggedIn, (req, res) => {
  res.status(200).json({ message: "User is logged in" });
});

// Update the isLoggedIn function
function isLoggedIn(req, res, next) {
  if (!req.cookies && req.cookies.token === "") {
      // User is not logged in
      return res.status(401).json({ message: "Please log in or register first." });
  }
  try {
      let data = jwt.verify(req.cookies.token, "secured#321");
      req.user = data;
      next();
  } catch (error) {
      // Token is invalid
      return res.status(401).json({ message: "Please log in or register first." });
  }
}

app.listen(3000)