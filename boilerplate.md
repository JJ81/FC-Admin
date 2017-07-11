  **pool & async**
  ```javascript
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        (callback) => {
          connection.query(QUERY.foo,
            [ parametes ],
            (err, rows) => {
              if (err) {
                callback(err, null);
              } else {
                callback(null, rows);
              }
            });
        }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
        }
      }
    );
  });
  ```

pool.getConnection((err, connection) => {
  if (err) throw err;
});


// pool with transaction
pool.getConnection((err, connection) => {
  if (err) throw err;

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: err
      });
    }

    async.series(
      [
        (callback) => {
          connection.query(QUERY.foo,
            [ ],
            (err, rows) => {
              if (err) {
                callback(err, null);
              } else {
                callback(null, rows);
              }
            });
        }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          connection.rollback(() => {
            return res.status(500).send({
              success: false,
              message: err
            });
          });
        } else {
          connection.commit((err) => {
            if (err) {
              return res.status(500).send({
                success: false,
                message: err
              });
            } else {
              // success code
            }
          });
        }
      }
    );
  });
});