import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import express from "express";
import * as Api from "./api";
import {wait} from './utils'

const restart = cxt => {
  const { cmd, args } = cxt.command;

  if (cxt.child === null) {
    cxt.logger.error("process.start", { cmd, args });
    cxt.child = spawn(cmd, args, { cwd: cxt.folder });
    cxt.child.stdout.pipe(process.stdout);
    cxt.child.stderr.pipe(process.stderr);

    cxt.child.on("close", function(code) {
      cxt.logger.debug("child.close", { code });
    });

    cxt.child.on("exit", function(code) {
      cxt.logger.debug("child.exit", { code });
      cxt.child = null;
    });
  }
};

export const loop = async (command, outCxt) => {
  const cxt = {
    ...outCxt,
    child: null,
    command
  };

  (async () => {
    while (true) {
      restart(cxt);
      await wait(500);
    }
  })().catch(e => cxt.logger.error("process.loop", { error: e.toString() }));

  var app = express();
  Api.routes(app, cxt);

  app.listen(cxt.port, () => {
    cxt.logger.debug("agent.server.running", { port: cxt.port });
  });
};
