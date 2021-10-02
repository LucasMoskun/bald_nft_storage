const express = require('express')
const fileupload = require('express-fileupload')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const fs = require('fs')
const dirTree = require("directory-tree");

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
  console.log("Hello from post")
  console.log(req.body)
  saveToFile(req.body, function(err)
    {
      if(err){
        console.log("Save to File Error:", err)
        res.status(404).send("data not saved");
        return;
      }      
      res.send('data written')
    })
})

app.post('/compile_main', (req, res) => {
  console.log("req.body")

  writeMain(req.body, function(err)
  {
    if(err){
      console.log("Couldn't write main:", err )
      res.status(404).send("main not written");
      return;
    }
    res.send('main written')
  })
  
})

function saveToFile(json, callback) {
  console.log("Hello from save")
  const fullPath = json.directory + json.fileName
  console.log("writing to path: ",fullPath)
  const data = json.storageURI
  //fs.writeFile('./public/test.json', JSON.stringify(json), callback)
  fs.mkdir(json.directory, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.writeFile(fullPath, JSON.stringify(data), callback)
}


function writeMain(json, callback) {
  const tree = dirTree(json.storageURIDir);

  const children = tree.children

  const fullPath = json.storageURIDir + "/main_storage_uri_list.json"


  //Create object to write out
  var mainObj = {}
  let fileCount = 0;

  for(let i = 0; i < children.length; i++){
    if(children[i].children !== undefined){
      const childArray = children[i].children;
      for(let j = 0; j < childArray.length; j++){
        //get name of file to load
        console.log(childArray[j].path)
        //get storage uri from file
        const filepath = childArray[j].path
        var jsonURI = JSON.parse(fs.readFileSync(filepath, 'utf8'))
        for(var key in jsonURI){
          console.log(jsonURI[key])
          mainObj[fileCount] = jsonURI[key]
          fileCount++
        }
      }
    }
  }


  fs.mkdir(json.storageURIDir, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.writeFile(fullPath, JSON.stringify(mainObj), callback)
  
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
