import { ServerInterface } from "../Server";

class ProdServer implements ServerInterface {
  get buildId(): string {
    return 'not implmented';
  }
}
