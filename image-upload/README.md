#### Open an account here: https://cloudinary.com/

#### The form has to have enctype="multipart/form-data" 

```js
// views/movie-add.hbs
<h2>Upload a new Movie</h2>
  <form action="/movie/add" method="post" enctype="multipart/form-data">
      <label>Title</label>
      <input type="text" name="title">
 
      <label>Description</label>
      <input type="text" name="description">
 
      <label>Poster</label>
      <input type="file" name="photo">
 
      <button type="submit">Add the movie</button>
  </form>
```


```bash
$ npm install cloudinary multer multer-storage-cloudinary
```

```bash
$ mkdir config
$ touch config/cloudinary.js
```

```js
// in config/cloudinary.js
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'movies-app',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, res, cb) {
    cb(null, res.originalname);
  }
});

const uploader = multer({ storage });

module.exports = {
  uploader,
  cloudinary
};
```

#### Enter the credentials in the .env file

#### Require cloudinary in routes/index.js

```js
// routes/index.js
const { uploader, cloudinary } = require("../config/cloudinary.js");
```

#### And add the route to add a movie
```js
// routes/index.js - 'photo' - is the name attribute from the form 
router.post("/movie/add", uploadCloud.single("photo"), (req, res, next) => {
  const { title, description } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  Movie.create({ title, description, imgPath, imgName })
    .then(movie => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});
```

#### Add the image tag to the index view

```js
// views/index.js
<img src="{{this.imgPath}}" alt="">
```

#### Deleting the image on Cloudinary when deleting the movie

```js
// in views/index.js
<a href="/movie/delete/{{this._id}}">❌</a>
```

```js
// in routes/index.js
router.get('/movie/delete/:id', (req, res) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(error);
    });
});
```

#### We have to add this to the delete route, the image is deleted via the public id 

```js
if (movie.imgPath) {
  cloudinary.uploader.destroy(movie.imgPublicId);
}
```

#### Therefore we need to add the public id to the model when we create

```js
// in models/Movie.js
    imgPublicId: String
```

#### We need to get the public id

```js
// routes/index.js 
const imgPublicId = req.file.public_id;

Movie.create({ title, description, imgPath, imgName, imgPublicId })
```