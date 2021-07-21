const connections = require('../app/database');

class AuthorizeService {
  async checkResource(tableName,id, userId) {
    const statement = `SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;`;
    const [result] = await connections.execute(statement, [id, userId]);
    return result.length === 0 ? false : true;
  }
}

module.exports = new AuthorizeService();