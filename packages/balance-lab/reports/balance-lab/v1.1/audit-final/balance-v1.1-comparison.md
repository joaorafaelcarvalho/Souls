# SOULS Balance Lab v1.1 — comparação v1.0/v1.1

| Problema observado na v1.0 | Correção v1.1 | Evidência desta auditoria | Estado |
|---|---|---|---|
| Aggressive só tinha cartas caras e não começava com 0 Souls | Baralho ofensivo com níveis 0–4 e cartas gratuitas | Aggressive invocou em 300 partidas auditadas | corrigido |
| Dano era agregado pelo alvo, parecendo dano recebido | Dano causado/recebido separado pelo trace | 0 inconsistências em 1000 partidas | validado |
| Níveis superiores não tinham cobertura determinística | Cenários controlados 0–4 e alertas de cobertura | cobertura determinística: OK | corrigido |
| Estratégia, baralho e posição ficavam ambíguos | Métricas identificam estratégia, baralho, jogador, seed e prioridade | 1000 partidas com estes campos | corrigido |
| Swapped usava seeds/prioridade pouco controladas | Quatro células de 25 partidas, equilibrando posição e prioridade | 10 confrontos, 1000 partidas | corrigido |
| Não havia leitura por carta/Souls | Telemetria por definição, economia e diagnóstico | 26 cartas e seis estratégias reportadas | corrigido |
