import { Client } from "@frejun/teler";
import { config } from "../core/config";

export const client = new Client(config.telerKey);