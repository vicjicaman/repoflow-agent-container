import kill from "tree-kill";

export const routes = (app, cxt) => {
  app.post(`/stop`, async function(req, res) {
    if (cxt.child) {
      kill(cxt.child.pid, "SIGINT", function(err) {
        if (err) {
          cxt.logger.error("child.kill.error", { error: err.toString() });
        }
      });

      res.json({ killed: cxt.child.pid });
    }
  });
};
