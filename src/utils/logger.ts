import pino from "pino";
import { settings } from "../config/env";

export default pino({ level: settings.PINO_LOG_LEVEL });
