var app = require('./index')

const port = 3000;

app.listen(port, function (error) {
  if (error) {
    console.log('Unable to listen for connections', error)
    process.exit(10)
  }
  console.log('express is listening on ' + port)
})