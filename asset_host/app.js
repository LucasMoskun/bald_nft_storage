const express = require('express')
const fileupload = require('express-fileupload')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const fs = require('fs')

const app = express()
const port = 3000
//app.use(fileupload())

app.use(
  express.static('public')
)

app.use(
  express.json()
)

app.post('/storage_uri', (req, res) => {
  console.log(req.body)
  saveToFile(req.body, function(err)
    {
      if(err){
        console.log(err)
        res.status(404).send("data not saved");
        return;
      }      
      res.send('data written')
    })
})

function saveToFile(json, callback) {
  const fullPath = json.directory + json.path
  console.log("writing to path: ". uri)
  const data = json.nftData
  //fs.writeFile('./public/test.json', JSON.stringify(json), callback)
  fs.mkdir(json.directory, { recursive: true }, (err) => {
  if (err) throw err;
});
  fs.writeFile(fullPath, JSON.stringify(data), callback)
}


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
