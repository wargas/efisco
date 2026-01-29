import { workerAvaliacao } from "../src/queue-avaliacao";
import { workerDoacao } from "../src/queue-doacao";
import { queueLogin, workerLogin } from "../src/queue-login";

await queueLogin.upsertJobScheduler('schedule', {
    pattern: '0 * * * *'
})

await Promise.all([
    workerDoacao.run(),
    workerAvaliacao.run(),
    workerLogin.run()
]) 