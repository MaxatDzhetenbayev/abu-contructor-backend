'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE news ADD COLUMN title_vector TSVECTOR',
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE news ADD COLUMN description_vector TSVECTOR',
    );

    await queryInterface.sequelize.query(
      'CREATE INDEX title_vector_idx ON news USING GIN(title_vector)',
    );

    await queryInterface.sequelize.query(
      'CREATE INDEX description_vector_idx ON news USING GIN(description_vector)',
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('news', 'title_vector');
    await queryInterface.removeColumn('news', 'description_vector');

    await queryInterface.sequelize.query('DROP INDEX title_vector_idx');
    await queryInterface.sequelize.query('DROP INDEX description_vector_idx');
  },
};
