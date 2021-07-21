const connections = require('../app/database');

class CommentService {
  async create(dynamicId, content, userId) {
    const statement = `INSERT INTO comment (content, dynamic_id, user_id) VALUES (?, ?, ?);`;
    const [result] = await connections.execute(statement, [content, dynamicId, userId]);
    return result;
  }

  async reply(dynamicId, content, userId, commentId) {
    const statement = `INSERT INTO comment (content, dynamic_id, user_id, comment_id) VALUES (?, ?, ?, ?);`;
    const [result] = await connections.execute(statement, [content, dynamicId, userId, commentId]);
    return result;
  }

  async update(commentId, content) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?`;
    const [result] = await connections.execute(statement, [content, commentId]);
    return result;
  }

  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?`;
    const [result] = await connections.execute(statement, [commentId]);
    return result;
  }

  async getCommentsByDynamicId(dynamicId) {
    const statement = `
      SELECT
        m.id, m.content, m.comment_id commendId, m.createAt createTime,
        JSON_OBJECT('id', u.id, 'name', u.name) user
      FROM comment m
      LEFT JOIN users u ON u.id = m.user_id
      WHERE dynamic_id = ?;
    `;
    const [result] = await connections.execute(statement, [dynamicId]);
    return result;
  }
}

module.exports = new CommentService();