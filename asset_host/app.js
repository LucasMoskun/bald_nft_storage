const express = require('express')
const fileupload = require('express-fileupload')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

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
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
