//app/helpers/helpers.js

import dbQuery from '../db/dev/dbQuery';

const checkExist = async (id, table) => {
  let query = ""
  if (table.toLowerCase() == "lineString".toLowerCase()) {
    query = "SELECT id from lineString where id=$1"
  } else if (table.toLowerCase() == "polygon".toLowerCase()) {
    query = "SELECT id from polygon where id=$1"
  } else if (table.toLowerCase() == "point".toLowerCase()) {
    query = "SELECT id from point where id=$1"
  }

  try {
    const {rows} = await dbQuery.query(query, [id])
    if (rows.length == 0) {
      return false
    } else {
      return true
    }
  } catch (err) {
    console.log(err)
    return err
  }

}

export {
  checkExist
}
