"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(cors());
const port = process.env.PORT;
app.use(express_1.default.json());
const sequelize = new Sequelize('nefturiansDB', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});
sequelize.authenticate()
    .then(() => {
    console.log('Connexion à la base de données établie avec succès.');
})
    .catch((err) => {
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
function addressLinker(address) {
    const hash = crypto_1.default.createHash('sha256').update(address).digest('hex');
    const nefturianIndex = parseInt(hash, 16) % 1240;
    return nefturianIndex;
}
app.post('/index', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.body;
    if (!address) {
        return res.status(400).send('Address is missing in the request body.');
    }
    const nefturianIndex = addressLinker(address);
    try {
        const existingNefturian = yield NefturianSide.findOne({
            where: { nefturianIndex: nefturianIndex }
        });
        if (existingNefturian) {
            res.json({ nefturianIndex });
        }
        else {
            yield NefturianSide.create({
                nefturianIndex,
                side: 3,
            });
            res.json({ nefturianIndex });
        }
    }
    catch (error) {
        console.error('Erreur lors de la recherche ou de la création dans la base de données :', error);
        res.status(500).send('Une erreur est survenue lors de la recherche ou de la création dans la base de données.');
    }
}));
app.post('/side', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nefturianIndex } = req.body;
    const { nefturianSideNb } = req.body;
    if (!nefturianIndex) {
        return res.status(400).send('NefturianIndex is missing in the request body.');
    }
    try {
        yield NefturianSide.create({
            nefturianIndex,
            side: nefturianSideNb,
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'enregistrement dans la base de données :', error);
        res.status(500).send('Une erreur est survenue lors de l\'enregistrement dans la base de données.');
    }
}));
app.get('/side/:nefturianIndex', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nefturianIndex } = req.params;
    if (!nefturianIndex) {
        return res.status(400).send('NefturianIndex is missing in the request parameters.');
    }
    try {
        const nefturian = yield NefturianSide.findOne({
            where: { nefturianIndex: nefturianIndex },
        });
        if (!nefturian) {
            return res.status(404).send('Nefturian not found in the database.');
        }
        res.json({ nefturianSideNb: nefturian.side });
    }
    catch (error) {
        console.error('Erreur lors de la recherche dans la base de données :', error);
        res.status(500).send('Une erreur est survenue lors de la recherche dans la base de données.');
    }
}));
app.post('/setside/:nefturianIndex/:side', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nefturianIndex, side } = req.params;
    if (!nefturianIndex || !side) {
        return res.status(400).send('NefturianIndex and/or side is missing in the request parameters.');
    }
    try {
        const nefturian = yield NefturianSide.findOne({
            where: { nefturianIndex: nefturianIndex },
        });
        if (!nefturian) {
            return res.status(404).send('Nefturian not found in the database.');
        }
        yield nefturian.update({ side: parseInt(side) });
        res.status(200).send({ side: parseInt(side) });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour dans la base de données :', error);
        res.status(500).send('Une erreur est survenue lors de la mise à jour dans la base de données.');
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
