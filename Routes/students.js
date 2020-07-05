const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");

const {ensureAuthenticated} = require("../helper/auth_protect");

//load student Schemade==
require("../Model/Student");
const Student = mongoose.model("student");

//load storage module
const uploadLocal = require("../config/multer");
var upload = multer({ storage: uploadLocal.storage });

//======================all get routes starts here ===========================
router.get("/add-student",ensureAuthenticated, (req, res) => {
  res.render("./students/add-student");
});

//display all student and no edit field and delete button only student information
router.get("/all-student",ensureAuthenticated, (req,res)=>{
  Student.find({})
  .lean()
  .sort({ date:desc})
  .then({allStudent})
})


//students data from database
router.get("/students",ensureAuthenticated, (req, res) => {
  Student.find({user:req.user.id})
    .sort({ date: "desc" })
    .lean()
    .then((student) => {
      res.render("./students/students", {
        student,
      });
    })
    .catch((err) => console.log(err));
});

//students data from database

// create details Routes
router.get("/student_details/:id",ensureAuthenticated, (req, res) => {
  Student.findOne({ _id: req.params.id })
    .lean()
    .then((std_detail) => {
      res.render("./students/student-details", { std_detail: std_detail });
    })
    .catch((err) => console.log(err));
});

/*------------------edit student route starts here ------------------------------ */

router.get('/edit-student/:id',ensureAuthenticated,(req,res) => {
    Student.findOne({_id : req.params.id})
    .lean()
    .then((editStudent) => {
      if(editStudent.user != req.user.id){
          req.flash("errors_msg","you are not authorized user")
      } else {
        res.render("./students/edit-student",{editStudent: editStudent})

      }
    })
    .catch((err) => console.log(err));
})


/*------------------edit student route ends here ------------------------------ */

//======================all get routes ends here ===========================

//===========================all post routes here ==================================
router.post("/add-student",ensureAuthenticated, upload.single("student_photo"), (req, res) => {
  let {
    student_id,
    student_name,
    student_dob,
    student_location,
    student_education,
    student_email,
    student_skills,
    student_phone,
    student_gender,
    student_percentage,
  } = req.body;

  let newStudent = {
    student_photo: req.file,
    student_id,
    student_name,
    student_dob,
    student_location,
    student_education,
    student_email,
    student_phone,
    student_skills,
    student_gender,
    student_percentage,
    user:req.user.id,
  };
  // save students info in database
  new Student(newStudent)
    .save()
    .then((student) => {
      req.flash('success_msg',"successfully student information  created!");
      res.redirect("/student/students", 304, {
        student: student,
      });
    })
    .catch((err) => console.log(err));
});

//update or modify 
router.put("/edit-student/:id",ensureAuthenticated, upload.single('student_photo'),(req,res) => {
//modify students information so first find a document object by using mongoDB findone method
//we cant use destructer method as it is used only in POST method
  Student.findOne({_id:req.params.id})
  .then(updateStudent => {
    //these old value obtained from database
    //lefthandside is oldValue  = righthandside is new value
        updateStudent.student_photo = req.file;
        updateStudent.student_id = req.body.student_id;
        updateStudent.student_name = req.body.student_email;
        updateStudent.student_email = req.body.student_email;
        updateStudent.student_phone = req.body.student_phone;
        updateStudent.student_skills = req.body.student_skills;
        updateStudent.student_gender = req.body.student_gender;
        updateStudent.student_location = req.body.student_location;
        updateStudent.student_education = req.body.student_education;
        updateStudent.student_percentage = req.body.student_percentage;
        updateStudent.student_dob = req.body.student_dob;

    updateStudent.save()
    .then((update) =>{
      req.flash('success_msg',"succesfully student updated");
      res.redirect('/student/students',201, {update});
    })
    .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
});

/* ---------------delete post route start here -------------- */
router.delete("/student-delete/:id",ensureAuthenticated, (req,res) => {
  //find mangoDB id
  //Student.deleteOne({_id:req.params.id})
   Student.remove({_id:req.params.id})
  .then(() => {
    req.flash('success_msg',"succesfully student deleted");
    res.redirect("/student/students", 201,{})
  })
  .catch((err) => console.log(err));
})

/* ---------------delete post route start here -------------- */

module.exports = router;
