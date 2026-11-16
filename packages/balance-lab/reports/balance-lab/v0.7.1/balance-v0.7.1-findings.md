# SOULS Balance Lab v0.7.1 — findings

Resultados reais desta execução: 1000 partidas v0.7, terminadas em 2026-11-14T04:56:20.816Z.

| Gravidade | Assunto | Evidência | Recomendação |
|---|---|---|---|
| INFO | Telemetria de dano | As partidas auditadas não apresentam divergências entre dano de combate no trace e nos eventos. | Manter o teste de simetria causado/recebido em futuras alterações do motor. |
| LOW | Prioridade inicial sem sinal global forte | Primeiro jogador: 52.4%; segundo jogador: 47.6%. | Continuar a acompanhar por confronto; o agregado global pode esconder assimetrias locais. |
| HIGH | Diferença de desempenho entre perfis de custo | Low Cost venceu 92% e High Cost venceu 29.75% nas respetivas amostras, sem concluir por si só que uma carta individual é forte. | Investigar ritmo de Souls, acesso a cartas iniciais e pressão de nível antes de alterar custos ou atributos. |
| MEDIUM | Cobertura incompleta do catálogo nos baralhos auditados | 4 cartas oficiais não aparecem nos seis perfis: Batedora do Breu, Escudeiro das Cinzas, Lanceiro de Ferro, Mago. | Adicionar cenários de cobertura por carta; não classificar estas cartas como fracas ou fortes com esta bateria. |
| MEDIUM | Utilização baixa de nível 4 | A utilização percentual média de nível 4 entre estratégias foi 0.82%; a disponibilidade, Souls e compra devem ser distinguidas. | Manter testes determinísticos e executar mais partidas/cenários de nível 4 antes de alterar o custo. |
| INFO | Dano por carta não atribuível | Os eventos oficiais identificam o jogador-alvo, mas não transportam o ID da carta que causou cada dano. | Se a análise por carta de dano for necessária, adicionar proveniência ao trace/evento sem alterar a resolução das regras. |

## Limitações não mascaradas

- A decomposição A–D não foi executada por falta de motor v0.6 configurável.
- A v0.6 usada na comparação é histórica e não foi reexecutada nesta data.
- Dano por carta individual não é atribuível pelos eventos oficiais atuais.
