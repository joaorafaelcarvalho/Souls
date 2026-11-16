# Coleção de cartas

O protótipo usa `prototypeCollectionProvider`, que torna todas as definições oficiais utilizáveis no Deck Builder. Esta é uma decisão de desenvolvimento e não representa propriedade persistente do jogador.

A futura implementação deve fornecer um `CardCollectionProvider` autoritativo que responda, por `cardDefinitionId`, à quantidade realmente disponível. A validação do Deck Builder já recebe um catálogo e está preparada para consultar essa camada.

A coleção não deve guardar cópias dos atributos das cartas nem instâncias de partidas. A relação correta é:

```text
CardDefinition (catálogo) -> PlayerCardOwnership (coleção) -> SavedDeck (composição)
```

Não existe ainda autenticação, sincronização com backend ou economia.
