import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    // make sure file exists
    // if it fdoes not exist add in default list of cells

    // read throws error if it doesnt exsit
    //  read the file
    // parse a list of cells out of it
    // send list of cells back to browser

    try {
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      res.send(JSON.parse(result));
    } catch (err) {
      if (err.code === "ENOENT") {
        // add code to create file and add defauly scells

        await fs.writeFile(fullPath, "[]", "utf-8");
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // make sure file exists
    // if it does not create it
    // take list of cells from request object
    // turn them into a format that can be safely written into the file

    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });
  return router;
};
