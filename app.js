const express = require('express');
const bodyParser = require('body-parser');
const sheetdb = require('sheetdb-node');
const client = sheetdb({ address: 'zf1v907ypzcei' })

const app = express();
const Port = 3000;
//middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.post("/", (req, res)=>{
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  client
  .read({ search: { First_Name: fName, Last_Name: lName, E_mail: email } })
  .then(
    function (data) {
      const da = JSON.parse(data);
      if (da.length === 0) {
        client
          .create({ First_Name: fName, Last_Name: lName, E_mail: email })
          .then(
            function (data) {
              const da = JSON.parse(data);

              if (data) {
                res.sendFile(`${__dirname}/success.html`);
              }
            },
            function (err) {
              console.log(err);
            }
          );
      }
      else {
          res.sendFile(`${__dirname}/failure.html`)
      }
    },
    function (err) {
      console.log(err);
    }
  );
});
app.post('/failure', (req, res)=>{
  res.redirect('/')
})

app.get("/", (req, res) => {
res.sendFile(`${__dirname}/index.html`);
});

app.listen(process.env.PORT || Port, () => {
console.log(`Server is running on port ${Port}`);
});
