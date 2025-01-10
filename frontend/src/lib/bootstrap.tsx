import * as bowlService from "@/go/bowls/BowlsService";
import { bowls } from "@/go/models";

const initialBowlsPromise: Promise<Array<bowls.Bowl>> = bowlService
  .GetAll()
  .catch(() => []);

// const initialBowlsPromise = Promise.resolve<Array<bowls.Bowl>>([]);

export { initialBowlsPromise };
