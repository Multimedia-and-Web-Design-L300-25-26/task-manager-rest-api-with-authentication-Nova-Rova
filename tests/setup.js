import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.test" });
process.env.JWT_SECRET;

const mongoUri = process.env.MONGO_URI;

beforeAll(async () => {
	if (!mongoUri) {
		throw new Error("MONGO_URI is not defined. Set it in .env.test (or .env).");
	}

	if (mongoose.connection.readyState === 0) {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 10000
		});
	}

	await mongoose.connection.dropDatabase();
});

afterAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.dropDatabase();
	}

	await mongoose.disconnect();
});