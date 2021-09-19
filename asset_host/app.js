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
  fs.writeFile('./public/test.json', JSON.stringify(json), callback)
}


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
