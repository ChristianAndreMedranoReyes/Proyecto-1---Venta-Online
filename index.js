import { config } from "dotenv";

import { initServer } from './config/server.js';

config();
initServer()