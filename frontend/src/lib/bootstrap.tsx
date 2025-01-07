import * as bowlService from "@/go/bowls/BowlsService";
import { bowls } from "@/go/models";

const initialBowlsPromise: Promise<Array<bowls.Bowl>> = bowlService
  .GetAll()
  .catch(() => []);

export { initialBowlsPromise };
