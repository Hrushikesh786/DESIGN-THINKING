const express =require("express")
const path=require("path")
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel=require("./models/user")
const Agent=require("./models/agent")

const app=express()
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "../frontend/views"));
// app.set("views", path.join(__dirname, "../frontend/views/privatepolicy"));
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.render("index")
})

//services
app.get("/services",(req,res)=>{
  res.render("services")
})
//about us

app.get("/AboutUs",(req,res)=>{
  res.render("aboutUs")
})

//ContactUs
app.get("/ContactUs",(req,res)=>{
  res.render("contactUs")
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
  app.post("/agent", async (req, res) => {
    try {
        let { email, name, age, mobile } = req.body;
        
        // Create and save agent information
        const agentInfo = await Agent.create({
            name, email, mobile, age
        });

        // Redirect to profile page after successful creation
        res.redirect("profile");
    } catch (err) {
        console.error("Error creating agent:", err);
        res.status(500).send("Internal Server Error");
    }
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


app.post("/agent",(req,res)=>{
  res.redirect("profile")
})
//logout
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});
//profile from here
app.get("/profile",isLoggedIn,(req,res)=>{
  if(isLoggedIn){
    res.render("profile")
  }
  else{
    res.send("please login")
  }
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


// policy section

app.get("/nivabupa",isLoggedIn,(req,res)=>{
  res.render("privatepolicy/nivabupa")
})
app.get("/icic",isLoggedIn,(req,res)=>{
  res.render("privatepolicy/icic")
})
app.get("/reliance",isLoggedIn,(req,res)=>{
  res.render("privatepolicy/reliance")
})
app.get("/star",isLoggedIn,(req,res)=>{
  res.render("privatepolicy/star")
})
app.get("/aditya",isLoggedIn,(req,res)=>{
  res.render("privatepolicy/aditya")
})
app.get("/bajaj",isLoggedIn,(req,res)=>{
  res.render("privatepolicy/bajaj")
})
app.get("/tata",isLoggedIn,(req,res)=>{
  res.render("privatepolicy/tata")
})
app.get("/sbi",isLoggedIn,(req,res)=>{
  res.render("privatepolicy/sbi")
})

//goverment policy
app.get("/aamaadmi",isLoggedIn,(req,res)=>{
  res.render("govermentpolicy/aamaadmi")
})

app.get("/phule",isLoggedIn,(req,res)=>{
  res.render("govermentpolicy/phule")
})
app.listen(3000)