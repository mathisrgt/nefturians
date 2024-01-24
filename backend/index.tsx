import express, { Request, Response } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

dotenv.config();
const app = express();

app.use(cors());

const port = process.env.PORT;

app.use(express.json());

const sequelize = new Sequelize('nefturiansDB', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
});

sequelize.authenticate()
	.then(() => {
		console.log('Connexion à la base de données établie avec succès.');
	})
	.catch((err: Error) => {
		console.error('Erreur de connexion à la base de données :', err);
	});

const NefturianSide = sequelize.define('NefturianSide', {
	nefturianIndex: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
	},
	side: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

/**
 * Generates a unique Nefturian index based on the given Ethereum address.
 *
 * @param {string} address - The Ethereum address to be linked to a Nefturian index.
 * @returns {number} - A unique Nefturian index derived from the address.
 */
function addressLinker(address: string): number {
	const hash = crypto.createHash('sha256').update(address).digest('hex');

	const nefturianIndex = parseInt(hash, 16) % 1240;

	return nefturianIndex;
}

/**
 * POST route handler for '/index'. Retrieves or creates a Nefturian index based on the provided Ethereum address.
 *
 * @param {Request} req - Express Request object containing the Ethereum address in the request body.
 * @param {Response} res - Express Response object to send the Nefturian index or error response.
 */
app.post('/index', async (req: Request, res: Response) => {
	const { address } = req.body;

	if (!address) {
		return res.status(400).send('Address is missing in the request body.');
	}

	const nefturianIndex = addressLinker(address);

	try {
		const existingNefturian = await NefturianSide.findOne({
			where: { nefturianIndex: nefturianIndex }
		});

		if (existingNefturian) {
			res.json({ nefturianIndex });
		} else {
			await NefturianSide.create({
				nefturianIndex,
				side: 3,
			});
			res.json({ nefturianIndex });
		}
	} catch (error) {
		console.error('Erreur lors de la recherche ou de la création dans la base de données :', error);
		res.status(500).send('Une erreur est survenue lors de la recherche ou de la création dans la base de données.');
	}
});

/**
 * POST route handler for '/side'. Creates a new Nefturian record with the specified Nefturian index and side number.
 *
 * @param {Request} req - Express Request object containing Nefturian index and side number in the request body.
 * @param {Response} res - Express Response object to handle error responses.
 */
app.post('/side', async (req, res) => {
	const { nefturianIndex } = req.body;
	const { nefturianSideNb } = req.body;

	if (!nefturianIndex) {
		return res.status(400).send('NefturianIndex is missing in the request body.');
	}

	try {
		await NefturianSide.create({
			nefturianIndex,
			side: nefturianSideNb,
		});

	} catch (error) {
		console.error('Erreur lors de l\'enregistrement dans la base de données :', error);
		res.status(500).send('Une erreur est survenue lors de l\'enregistrement dans la base de données.');
	}
});

/**
 * GET route handler for '/side/:nefturianIndex'. Retrieves the Nefturian side number for a given Nefturian index.
 *
 * @param {Request} req - Express Request object containing Nefturian index in the request parameters.
 * @param {Response} res - Express Response object to handle the retrieval process and error responses.
 */
app.get('/side/:nefturianIndex', async (req, res) => {
	const { nefturianIndex } = req.params;

	if (!nefturianIndex) {
		return res.status(400).send('NefturianIndex is missing in the request parameters.');
	}

	try {
		const nefturian = await NefturianSide.findOne({
			where: { nefturianIndex: nefturianIndex },
		});

		if (!nefturian) {
			return res.status(404).send('Nefturian not found in the database.');
		}

		res.json({ nefturianSideNb: nefturian.side });
	} catch (error) {
		console.error('Erreur lors de la recherche dans la base de données :', error);
		res.status(500).send('Une erreur est survenue lors de la recherche dans la base de données.');
	}
});

/**
 * POST route handler for '/setside/:nefturianIndex/:side'. Updates the Nefturian side number for a given Nefturian index.
 *
 * @param {Request} req - Express Request object containing Nefturian index and side number in the request parameters.
 * @param {Response} res - Express Response object to handle the update process and error responses.
 */
app.post('/setside/:nefturianIndex/:side', async (req, res) => {
	const { nefturianIndex, side } = req.params;

	if (!nefturianIndex || !side) {
		return res.status(400).send('NefturianIndex and/or side is missing in the request parameters.');
	}

	try {
		const nefturian = await NefturianSide.findOne({
			where: { nefturianIndex: nefturianIndex },
		});

		if (!nefturian) {
			return res.status(404).send('Nefturian not found in the database.');
		}

		await nefturian.update({ side: parseInt(side) });

		res.status(200).send({ side: parseInt(side) });
	} catch (error) {
		console.error('Erreur lors de la mise à jour dans la base de données :', error);
		res.status(500).send('Une erreur est survenue lors de la mise à jour dans la base de données.');
	}
});


app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
