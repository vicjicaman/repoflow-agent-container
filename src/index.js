import { shutdown } from "./utils";
import * as Command from "./command";
import * as Request from "./request";

const APP_HOME = process.env["APP_HOME"];
const AGENT_SERVICE_PORT = process.env["AGENT_SERVICE_PORT"] || 7999;

const payloadB64 = process.argv[2];
const decoded = Buffer.from(payloadB64, "base64").toString("ascii");
const params = JSON.parse(decoded);

const { command, post } = params;

const cxt = {
  folder: APP_HOME,
  port: AGENT_SERVICE_PORT,
  child: null,
  logger: {
    debug: (type, msg) => console.log(type + "-" + JSON.stringify(msg)),
    error: (type, msg) => console.log(type + "-" + JSON.stringify(msg))
  }
};

(async () => {
  if (command) {
    await Command.loop(command, cxt);
  } else {
    if (post) {
      await Request.post(post, cxt);
    }
  }
})().catch(e => cxt.logger.error("process.error", { error: e.toString() }));

shutdown((signal, err) => {
  cxt.logger.debug("shutdown", { signal });
  if (err) {
    cxt.logger.error("error", { stack: err.stack, error: err.toString() });
  }
});
