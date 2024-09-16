'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('contents', '"order"', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Обновляем существующие записи, чтобы установить значение order
    await queryInterface.sequelize.query(`
      WITH ranked_contents AS (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY widget_id ORDER BY "createdAt") AS "order"
        FROM contents
      )
      UPDATE contents
      SET "order" = ranked_contents.order
      FROM ranked_contents
      WHERE contents.id = ranked_contents.id;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('contents', '"order"');
  }
};
