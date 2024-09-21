const { format } = require('date-fns');
const pool = require('./pool');

async function saveSignupFormToDatabase(
	firstName,
	lastName,
	username,
	email,
	password,
	defaultMembershipStatus
) {
	try {
		await pool.query(
			`INSERT INTO users (first_name, last_name, username, email, password, membership_status)
        VALUES ($1, $2, $3, $4, $5, $6)`,
			[firstName, lastName, username, email, password, defaultMembershipStatus]
		);
	} catch (error) {
		console.error('Error saving signup form to database:', error);
		throw error;
	}
}

async function findUserByEmail(email) {
	const query = 'SELECT * FROM users WHERE email = $1';
	const values = [email];

	const result = await pool.query(query, values);
	return result.rows[0]; // Return the user if found
}

async function findUserNameByEmail(email) {
	const query = 'SELECT first_name FROM users WHERE email = $1';
	const values = [email];

	const result = await pool.query(query, values);
	return result.rows[0].first_name; // Return the user if found
}

async function findUserById(id) {
	const query = 'SELECT * FROM users WHERE id = $1';
	const values = [id];

	try {
		const result = await pool.query(query, values);
		return result.rows[0]; // Return the user object
	} catch (error) {
		console.error('Error finding user by ID:', error);
		throw error;
	}
}

async function changeMembershipStatus(user) {
	try {
		await pool.query(
			` UPDATE users SET membership_status = 'Member' WHERE email = $1`,
			[user.email]
		);
	} catch (error) {
		console.error('Error updating database', error);
		throw error;
	}
}

async function checkMembershipStatus(user) {
	try {
		const result = await pool.query(
			`SELECT membership_status FROM users WHERE email = $1`,
			[user.email]
		);
		const memberStatus = result.rows[0]?.membership_status; // Access the correct row
		if (memberStatus === 'Admin' || memberStatus === 'Member') {
			return true;
		} else return false;
	} catch (error) {
		console.error('Error fetching membership status', error);
		throw error;
	}
}

async function checkAdminStatus(user) {
	try {
		const result = await pool.query(
			`SELECT membership_status FROM users WHERE email = $1`,
			[user.email]
		);
		const memberStatus = result.rows[0]?.membership_status; // Access the correct row
		if (memberStatus === 'Admin') {
			return true;
		} else return false;
	} catch (error) {
		console.error('Error checking admin status', error);
		throw error;
	}
}

async function saveMessagetoDatabase(title, message, user) {
	try {
		await pool.query(
			`INSERT INTO messages 
			( user_id, title, text ) VALUES ($1, $2, $3)`,
			[user.id, title, message]
		);
	} catch (error) {
		console.error('Error inserting message to database', error);
		throw error;
	}
}

async function fetchMessages() {
	try {
		const result = await pool.query(`
            SELECT messages.id, messages.title, messages.text, messages.timestamp, users.username
            FROM messages
            JOIN users ON messages.user_id = users.id
            ORDER BY messages.timestamp DESC;
        `);

		const messages = result.rows.map((message) => ({
			...message,
			formattedTimestamp: format(new Date(message.timestamp), 'PPP, h:mm a'),
		}));

		return messages;
	} catch (error) {
		console.error('Error fetching messages from database', error);
		throw error;
	}
}

async function deleteMessage(messageId) {
	try {
		await pool.query(`DELETE FROM messages WHERE id = $1`, [messageId]);
	} catch (error) {
		console.error('Error deleting message', error);
		throw error;
	}
}

module.exports = {
	saveSignupFormToDatabase,
	findUserByEmail,
	findUserNameByEmail,
	findUserById,
	changeMembershipStatus,
	checkMembershipStatus,
	checkAdminStatus,
	saveMessagetoDatabase,
	fetchMessages,
	deleteMessage,
};
