const connections = require('../app/database')

class dynamicService{
  async create(userId,content){
    const statement = `INSERT INTO dynamic (content, user_id) VALUES (?, ?);`
    const [result] = await connections.execute(statement, [content, userId])
    return result
  }

  async getDynamicById(id){
    const statement = `
    SELECT
	    d.id id,d.content content, d.createAt creatTime,d.updateAt updateTime,
	    JSON_OBJECT('id',u.id,'name',u.name,'avatarUrl', u.avatar_url) author,
      IF(COUNT(l.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', l.id, 'name', l.name)
        ),NULL) labels,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                      'user', JSON_OBJECT('id', cu.id, 'name', cu.name,'avatarUrl', cu.avatar_url))
        ),NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE d.id = c.dynamic_id) comments,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/dynamic/images/', file.filename))
        FROM file WHERE d.id = file.dynamic_id) images
    FROM dynamic d 
    LEFT JOIN users u ON d.user_id=u.id 
    LEFT JOIN dynamic_label dl ON d.id = dl.dynamic_id
    LEFT JOIN label l ON dl.label_id = l.id
    WHERE d.id=?
    GROUP BY d.id;
    `;

    try{
      const [result] = await connections.execute(statement,[id])
      return result[0]
    }catch(error){
      console.log(error)
    }
  }

  async getdynamicList(offset, size){
    const statement = `
      SELECT
	      d.id id,d.content content, d.createAt creatTime,d.updateAt updateTime,
	      JSON_OBJECT('id',u.id,'name',u.name) author,
         (SELECT COUNT(*) FROM comment c WHERE c.dynamic_id = d.id) commentCount,
          (SELECT COUNT(*) FROM dynamic_label dl WHERE dl.dynamic_id = d.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/dynamic/images/', file.filename))
        FROM file WHERE d.id = file.dynamic_id) images
      FROM dynamic d LEFT JOIN users u ON d.user_id=u.id LIMIT ?, ?;
    `;

      const [result] = await connections.execute(statement, [offset, size]);
      return result
  }

  async update(content, dynamicId){
    const statement = `UPDATE dynamic SET content = ? WHERE id = ?;`;
    const [result] = await connections.execute(statement, [content, dynamicId]);
    return result;
  }

  async remove(dynamicId) {
    const statement = `DELETE FROM  dynamic WHERE id = ?`;
    const [result] = await connections.execute(statement, [dynamicId]);
    return result;
  }

  async hasLabel(dynamicId, labelId) {
    const statement = `SELECT * FROM dynamic_label WHERE dynamic_id = ? AND label_id = ?`;
    const [result] = await connections.execute(statement, [dynamicId, labelId]);
    return result[0] ? true : false;
  }

  async addLabel(dynamicId, labelId) {
    const statement = `INSERT INTO dynamic_label (dynamic_id, label_id) VALUES (?, ?);`;
    const [result] = await connections.execute(statement, [dynamicId, labelId]);
    return result;
  }
}

module.exports = new dynamicService()