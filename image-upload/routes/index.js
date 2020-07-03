const express = require("express");
const Movie = require("../models/movie.js");
const router = express.Router();
const { uploader, cloudinary } = require("../config/cloudinary.js");

router.get("/", (req, res, next) => {
  Movie.find()
    .then(movies => {
      res.render("index", { movies });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/movie/add", (req, res, next) => {
  res.render("movie-add");
});

router.post('/movie/add', uploader.single('photo'), (req, res, next) => {
  const { title, description } = req.body;
  console.log(req.file);
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const imgPublicId = req.file.public_id;
  Movie.create({ title, description, imgPath, imgName, imgPublicId })
    .then(movie => {
      res.redirect('/')
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/movie/delete/:id', (req, res, next) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(movie => {
      // if movie has an image then we also want to delete the img on cloudinary
      if (movie.imgPath) {
        // delete the img on cloudinary - we need the so called public id
        cloudinary.uploader.destroy(movie.imgPublicId);
      }
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
});


module.exports = router;