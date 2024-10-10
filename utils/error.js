const errorHandler = (err, req, res, next) => {
          console.error(err.stack);
          res.status(500).send('Something went wrong!');
        };
        
        module.exports = errorHandler;
        


// this  is optional not require now  ,  this is an interesting projects so i want to continue this to make like an analytical site