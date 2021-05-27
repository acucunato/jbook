import path from "path";
import { Command } from "commander";
import { serve } from "@jsnote-asc/local-api";

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("open a file for editing")
  .option("-p, --port <number>", "port to run server on", "4005")
  .action((filename = "notebook.js", options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `opened ${filename}. navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (err) {
      if (err.code === "EADDRINUSE") {
        console.error("port is in use, try running on a different port");
      } else {
        console.log("here's the problem", err.message);
      }
      process.exit(1);
    }
  });
