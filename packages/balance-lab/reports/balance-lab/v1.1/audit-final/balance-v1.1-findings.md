# SOULS Balance Lab v1.1 — findings

Os findings são sinais para investigação; não alteram atributos, custos ou regras.

| Gravidade | Assunto | Evidência | Recomendação |
|---|---|---|---|
| INFO | Telemetria de dano | As partidas auditadas não apresentam divergências entre dano de combate no trace e nos eventos. | Manter o teste de simetria causado/recebido em futuras alterações do motor. |
| LOW | Prioridade inicial sem sinal global forte | Primeiro jogador: 54.7%; segundo jogador: 45.3%. | Continuar a acompanhar por confronto; o agregado global pode esconder assimetrias locais. |
| HIGH | Diferença de desempenho entre perfis de custo | Low Cost venceu 95.5% e High Cost venceu 25.75% nas respetivas amostras, sem concluir por si só que uma carta individual é forte. | Investigar ritmo de Souls, acesso a cartas iniciais e pressão de nível antes de alterar custos ou atributos. |
| MEDIUM | Perfil Defensive com taxa de vitória muito elevada | Defensive venceu 93% dos seus jogos; a métrica é de perfil/baralho, não de carta isolada. | Separar efeito de DEF, composição e prioridade em confrontos dedicados antes de qualquer decisão de balanceamento. |
| MEDIUM | Cobertura incompleta do catálogo nos baralhos auditados | 4 cartas oficiais não aparecem nos seis perfis: Batedora do Breu, Escudeiro das Cinzas, Lanceiro de Ferro, Mago. | Adicionar cenários de cobertura por carta; não classificar estas cartas como fracas ou fortes com esta bateria. |
| MEDIUM | Utilização baixa de nível 4 | A utilização percentual média de nível 4 entre estratégias foi 0.44%; a disponibilidade, Souls e compra devem ser distinguidas. | Manter testes determinísticos e executar mais partidas/cenários de nível 4 antes de alterar o custo. |
| INFO | Dano por carta não atribuível | Os eventos oficiais identificam o jogador-alvo, mas não transportam o ID da carta que causou cada dano. | Se a análise por carta de dano for necessária, adicionar proveniência ao trace/evento sem alterar a resolução das regras. |
