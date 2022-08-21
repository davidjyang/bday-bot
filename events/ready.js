const { Sequelize, DataTypes } = require('sequelize');

// // const sequelize = new Sequelize('database', 'user', 'password', {
// const sequelize = new Sequelize('sqlite::memory:', {
// 	host: 'localhost',
// 	dialect: 'sqlite',
// 	logging: false,
// 	// SQLite only
// 	storage: 'database.sqlite',
// });

// const Tags = sequelize.define('Tags', {
// 	name: {
// 		type: DataTypes.STRING,
// 		unique: true,
// 	},
// 	description: { 
//         type: DataTypes.STRING,
//     }
// });

// console.log('check:')
// console.log(Tags === sequelize.models.Tags)

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        // Tags.sync({ force: true });
        console.log(`Logged in as ${client.user.tag}!`);	},
};