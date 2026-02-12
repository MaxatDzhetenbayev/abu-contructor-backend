'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем новое значение 'rector' в ENUM тип appeal_type
    await queryInterface.sequelize.query(
      "ALTER TYPE enum_appeals_appeal_type ADD VALUE 'rector'",
    );
  },

  async down(queryInterface, Sequelize) {
    // Удаление значения из ENUM в PostgreSQL требует пересоздания типа
    // Это более сложная операция, поэтому здесь оставляем комментарий
    // В случае необходимости отката нужно будет пересоздать ENUM тип
    // без значения 'rector' и обновить все записи в таблице
    throw new Error('Cannot remove enum value directly. Manual rollback required.');
  },
};
