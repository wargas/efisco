import { workerAvaliacao } from "../src/queue-avaliacao";
import { workerDoacao } from "../src/queue-doacao";

await Promise.all([
    workerDoacao.run(),
    workerAvaliacao.run()
]) 