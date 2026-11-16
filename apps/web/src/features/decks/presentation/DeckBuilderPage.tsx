import { loadBrowserCardCatalog, loadLoreCatalog } from '@souls/game-content';
import type { CardDefinition, CardType } from '@souls/game-core';
import { useMemo, useState, useEffect } from 'react';
import { Card } from '../../cards/presentation/Card';
import { calculateDeckStats } from '../application/deckStats';
import { entryQuantity, levelQuantity, MAX_CARDS_BY_LEVEL, totalDeckCards, upsertDeckEntry, validateDeckCards } from '../application/deckValidation';
import { prototypeCollectionProvider } from '../application/cardCollection';
import { createSavedDeck, loadSavedDecks, persistSavedDecks, updateSavedDeck } from '../application/deckStorage';
import type { DeckCardEntry, SavedDeck } from '../application/deckTypes';
import styles from './DeckBuilderPage.module.css';

type TypeFilter = 'all' | CardType;
type SortOption = 'name-asc' | 'name-desc' | 'attack-desc' | 'defense-desc' | 'level-asc' | 'level-desc';

export interface DeckBuilderPageProps {
  readonly onBack: () => void;
  readonly onOpenDeckSelection: () => void;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('pt-PT').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function compareDefinitions(left: CardDefinition, right: CardDefinition, sort: SortOption): number {
  const byName = left.name.localeCompare(right.name, 'pt-PT');
  switch (sort) {
    case 'name-desc': return -byName;
    case 'attack-desc': return right.attack - left.attack || byName;
    case 'defense-desc': return right.defense - left.defense || byName;
    case 'level-asc': return left.level - right.level || byName;
    case 'level-desc': return right.level - left.level || byName;
    case 'name-asc':
    default: return byName;
  }
}

export function DeckBuilderPage({ onBack, onOpenDeckSelection }: DeckBuilderPageProps) {
  const catalog = useMemo(() => loadBrowserCardCatalog(), []);
  const loreCatalog = useMemo(() => loadLoreCatalog(), []);
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>(() => loadSavedDecks(catalog));
  const [selectedDeckId, setSelectedDeckId] = useState(() => savedDecks[0]?.id ?? '');
  const selectedDeck = savedDecks.find((deck) => deck.id === selectedDeckId) ?? savedDecks[0];
  const [draftName, setDraftName] = useState(selectedDeck?.name ?? 'Novo Baralho');
  const [draftCards, setDraftCards] = useState<readonly DeckCardEntry[]>(selectedDeck?.cards ?? []);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [factionFilter, setFactionFilter] = useState('all');
  const [sort, setSort] = useState<SortOption>('name-asc');
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | null>(catalog.definitions[0]?.id ?? null);
  const [notice, setNotice] = useState('');

  const loreByCardId = useMemo(
    () => new Map(loreCatalog.cards.map((entry) => [entry.cardId, entry] as const)),
    [loreCatalog.cards]
  );
  const factionsById = useMemo(
    () => new Map(loreCatalog.factions.map((entry) => [entry.id, entry] as const)),
    [loreCatalog.factions]
  );
  const validation = useMemo(() => validateDeckCards(draftCards, catalog), [catalog, draftCards]);
  const stats = useMemo(() => calculateDeckStats(draftCards, catalog, loreByCardId), [catalog, draftCards, loreByCardId]);

  useEffect(() => {
    if (selectedDeck === undefined) return;
    setDraftName(selectedDeck.name);
    setDraftCards(selectedDeck.cards);
  }, [selectedDeckId, selectedDeck?.updatedAt]);

  const filteredDefinitions = useMemo(() => {
    const query = normalize(searchQuery.trim());
    return catalog.definitions
      .filter((definition) => typeFilter === 'all' || definition.type === typeFilter)
      .filter((definition) => levelFilter === null || definition.level === levelFilter)
      .filter((definition) => factionFilter === 'all' || loreByCardId.get(definition.id)?.factionId === factionFilter)
      .filter((definition) => {
        if (query.length === 0) return true;
        const lore = loreByCardId.get(definition.id);
        const faction = lore === undefined ? undefined : factionsById.get(lore.factionId);
        return [definition.name, lore?.epithet, faction?.name]
          .filter((value): value is string => value !== undefined)
          .some((value) => normalize(value).includes(query));
      })
      .slice()
      .sort((left, right) => compareDefinitions(left, right, sort));
  }, [catalog.definitions, factionFilter, factionsById, levelFilter, loreByCardId, searchQuery, sort, typeFilter]);

  const selectedDefinition = selectedDefinitionId === null ? undefined : catalog.byId[selectedDefinitionId];
  const dirty = selectedDeck !== undefined && (selectedDeck.name !== draftName || JSON.stringify(selectedDeck.cards) !== JSON.stringify(draftCards));

  function selectDeck(deckId: string) {
    setSelectedDeckId(deckId);
    setNotice('');
  }

  function createDeck() {
    const next = createSavedDeck(`Novo Baralho ${savedDecks.length + 1}`);
    const nextDecks = [...savedDecks, next];
    setSavedDecks(nextDecks);
    persistSavedDecks(nextDecks);
    setSelectedDeckId(next.id);
    setNotice('Novo rascunho criado.');
  }

  function saveDeck() {
    if (selectedDeck === undefined) return;
    const nextDecks = savedDecks.map((deck) => deck.id === selectedDeck.id ? updateSavedDeck(deck, draftName, draftCards) : deck);
    setSavedDecks(nextDecks);
    persistSavedDecks(nextDecks);
    setNotice(validation.valid ? 'Baralho guardado e válido para jogar.' : 'Rascunho guardado. Completa 20 cartas para o utilizar.');
  }

  function duplicateDeck() {
    const next = createSavedDeck(`${draftName || 'Baralho'} (cópia)`, draftCards);
    const nextDecks = [...savedDecks, next];
    setSavedDecks(nextDecks);
    persistSavedDecks(nextDecks);
    setSelectedDeckId(next.id);
    setNotice('Cópia criada.');
  }

  function deleteDeck() {
    if (selectedDeck === undefined) return;
    const nextDecks = savedDecks.filter((deck) => deck.id !== selectedDeck.id);
    const fallback = nextDecks.length === 0 ? [createSavedDeck('Novo Baralho')] : nextDecks;
    setSavedDecks(fallback);
    persistSavedDecks(fallback);
    setSelectedDeckId(fallback[0]!.id);
    setNotice('Baralho eliminado.');
  }

  function addCard(definition: CardDefinition) {
    if (totalDeckCards(draftCards) >= 20) {
      setNotice('O baralho já tem 20 cartas.');
      return;
    }
    if (levelQuantity(draftCards, catalog, definition.level) >= MAX_CARDS_BY_LEVEL[definition.level]) {
      setNotice(`O nível ${definition.level} já atingiu o limite de ${MAX_CARDS_BY_LEVEL[definition.level]} cartas.`);
      return;
    }
    if (!prototypeCollectionProvider.canUse(definition.id, entryQuantity(draftCards, definition.id) + 1, catalog)) return;
    setSelectedDefinitionId(definition.id);
    setDraftCards((current) => upsertDeckEntry(current, definition.id, 1));
    setNotice('Carta adicionada ao rascunho.');
  }

  function removeCard(cardDefinitionId: string) {
    setDraftCards((current) => upsertDeckEntry(current, cardDefinitionId, -1));
  }

  return (
    <main className={styles.page} data-testid="deck-builder-page" aria-label="Deck Builder SOULS">
      <div className={styles.backdrop} aria-hidden="true" />
      <header className={styles.header}>
        <div className={styles.brandMark} aria-hidden="true">▯</div>
        <div>
          <p className={styles.eyebrow}>SOULS · ARSENAL DE VESPERA</p>
          <h1>CONSTRUTOR DE BARALHOS</h1>
          <p>Organiza as almas que levarás para o campo de batalha.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={onOpenDeckSelection}>PREPARAR PARTIDA</button>
          <button type="button" onClick={onBack}>VOLTAR AO MENU</button>
        </div>
      </header>

      <section className={styles.deckToolbar} aria-label="Gestão dos meus baralhos">
        <label>
          <span>MEUS BARALHOS</span>
          <select value={selectedDeck?.id ?? ''} onChange={(event) => selectDeck(event.target.value)}>
            {savedDecks.map((deck) => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
          </select>
        </label>
        <div className={styles.deckActions}>
          <button type="button" onClick={createDeck}>NOVO</button>
          <button type="button" onClick={duplicateDeck} disabled={selectedDeck === undefined}>DUPLICAR</button>
          <button type="button" onClick={deleteDeck} disabled={selectedDeck === undefined}>ELIMINAR</button>
          <button className={styles.saveButton} type="button" onClick={saveDeck} disabled={!dirty}>GUARDAR</button>
        </div>
      </section>

      <div className={styles.workspace}>
        <section className={styles.catalogPanel} aria-label="Catálogo de cartas para o baralho">
          <div className={styles.panelHeading}>
            <div>
              <span className={styles.sectionKicker}>CATÁLOGO OFICIAL · {catalog.definitions.length} ALMAS</span>
              <h2>Escolhe as cartas</h2>
            </div>
            <span className={styles.resultCount}>{filteredDefinitions.length} encontradas</span>
          </div>
          <div className={styles.filters}>
            <label className={styles.search}>
              <span>PESQUISAR</span>
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Nome ou epíteto..." />
            </label>
            <div className={styles.filterGroup} aria-label="Tipo de carta">
              {(['all', 'melee', 'ranged'] as const).map((filter) => (
                <button key={filter} className={typeFilter === filter ? styles.filterActive : ''} type="button" onClick={() => setTypeFilter(filter)}>
                  {filter === 'all' ? 'TODAS' : filter.toUpperCase()}
                </button>
              ))}
            </div>
            <label className={styles.selectLabel}>
              <span>NÍVEL</span>
              <select value={levelFilter ?? 'all'} onChange={(event) => setLevelFilter(event.target.value === 'all' ? null : Number(event.target.value))}>
                <option value="all">Todos</option>
                {[0, 1, 2, 3, 4].map((level) => <option key={level} value={level}>Nível {level}</option>)}
              </select>
            </label>
            <label className={styles.selectLabel}>
              <span>FACÇÃO</span>
              <select value={factionFilter} onChange={(event) => setFactionFilter(event.target.value)}>
                <option value="all">Todas</option>
                {loreCatalog.factions.map((faction) => <option key={faction.id} value={faction.id}>{faction.name}</option>)}
              </select>
            </label>
            <label className={styles.selectLabel}>
              <span>ORDENAR</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
                <option value="name-asc">Nome A–Z</option>
                <option value="name-desc">Nome Z–A</option>
                <option value="attack-desc">ATK maior</option>
                <option value="defense-desc">DEF maior</option>
                <option value="level-asc">Nível crescente</option>
                <option value="level-desc">Nível decrescente</option>
              </select>
            </label>
          </div>
          <div className={styles.catalogGrid}>
            {filteredDefinitions.map((definition) => {
              const quantity = entryQuantity(draftCards, definition.id);
              const selected = selectedDefinitionId === definition.id;
              return (
                <article className={`${styles.catalogCard} ${selected ? styles.cardSelected : ''}`} key={definition.id}>
                  <button type="button" className={styles.cardPreviewButton} aria-label={`Inspecionar ${definition.name}`} onClick={() => setSelectedDefinitionId(definition.id)}>
                    <Card definition={definition} variant="deck-builder" selected={selected} />
                  </button>
                  <div className={styles.cardActions}>
                    <span>{quantity > 0 ? `NO BARALHO · ${quantity}` : 'DISPONÍVEL'}</span>
                    <div className={styles.quantityButtons}>
                      <button type="button" aria-label={`Adicionar ${definition.name}`} onClick={() => addCard(definition)} disabled={totalDeckCards(draftCards) >= 20 || levelQuantity(draftCards, catalog, definition.level) >= MAX_CARDS_BY_LEVEL[definition.level]}>+</button>
                      <button type="button" aria-label={`Remover ${definition.name}`} onClick={() => removeCard(definition.id)} disabled={quantity === 0}>−</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className={styles.deckPanel} aria-label="Baralho atual e estatísticas">
          <div className={styles.deckHeading}>
            <span className={styles.sectionKicker}>COMPOSIÇÃO ATUAL</span>
            <input aria-label="Nome do baralho" value={draftName} onChange={(event) => setDraftName(event.target.value)} />
            <strong className={validation.valid ? styles.valid : styles.invalid}>{validation.totalCards} / 20 CARTAS</strong>
          </div>

          {selectedDefinition === undefined ? null : (
            <section className={styles.selectedCard} aria-label="Carta selecionada">
              <div className={styles.selectedCardPreview}><Card definition={selectedDefinition} variant="codex-faction" /></div>
              <div className={styles.selectedCardInfo}>
                <div className={styles.selectedMeta}>
                  <span>{selectedDefinition.type.toUpperCase()}</span>
                  <span>NÍVEL {selectedDefinition.level}</span>
                </div>
                <h3>{selectedDefinition.name}</h3>
                <p>{loreByCardId.get(selectedDefinition.id)?.epithet ?? 'História por descobrir.'}</p>
                {loreByCardId.get(selectedDefinition.id)?.factionId ? <small>{factionsById.get(loreByCardId.get(selectedDefinition.id)!.factionId)?.name}</small> : null}
                <div className={styles.selectedStats}>
                  <span><small>ATK</small><b>{selectedDefinition.attack}</b></span>
                  <span><small>DEF</small><b>{selectedDefinition.defense}</b></span>
                  <span><small>SOULS</small><b>{selectedDefinition.level}</b></span>
                </div>
              </div>
              <button className={styles.selectedAdd} type="button" onClick={() => addCard(selectedDefinition)} disabled={totalDeckCards(draftCards) >= 20 || levelQuantity(draftCards, catalog, selectedDefinition.level) >= MAX_CARDS_BY_LEVEL[selectedDefinition.level]}>ADICIONAR AO BARALHO</button>
            </section>
          )}

          <div className={styles.validation} role="status">
            <strong>{validation.valid ? 'BARALHO VÁLIDO PARA JOGAR' : 'RASCUNHO INCOMPLETO'}</strong>
            {validation.errors.map((error) => <span key={error}>• {error}</span>)}
            {notice.length > 0 ? <span>{notice}</span> : null}
          </div>

          <section className={styles.deckSummary} aria-label="Resumo das cartas selecionadas">
            <h3>RESUMO DO BARALHO</h3>
            <p>{draftCards.length} definições distintas · {validation.totalCards} cartas totais.</p>
            <small>Usa + e − diretamente por baixo de cada carta para ajustar as quantidades.</small>
          </section>

          <section className={styles.stats} aria-label="Estatísticas do baralho">
            <h3>LEITURA DO BARALHO</h3>
            <div className={styles.statGrid}>
              <span><b>{stats.meleeCount}</b><small>MELEE</small></span>
              <span><b>{stats.rangedCount}</b><small>RANGED</small></span>
              <span><b>{stats.averageAttack}</b><small>ATK MÉDIO</small></span>
              <span><b>{stats.averageDefense}</b><small>DEF MÉDIA</small></span>
              <span><b>{stats.totalSoulCost}</b><small>CUSTO TEÓRICO</small></span>
              <span><b>{stats.averageSoulCost}</b><small>CUSTO MÉDIO</small></span>
            </div>
            <div className={styles.levelBars} aria-label="Distribuição por nível">
              {[0, 1, 2, 3, 4].map((level) => <span key={level}><i>NÍVEL {level}</i><b style={{ '--bar-size': `${Math.min(100, stats.byLevel[level as 0 | 1 | 2 | 3 | 4] * 5)}%` } as React.CSSProperties}>{stats.byLevel[level as 0 | 1 | 2 | 3 | 4]}</b></span>)}
            </div>
            <div className={styles.factionStats} aria-label="Distribuição por facção">
              {Object.entries(stats.factionCounts).map(([factionId, quantity]) => <span key={factionId}>{factionsById.get(factionId)?.name ?? factionId}: <b>{quantity}</b></span>)}
            </div>
            {stats.warnings.map((warning) => <p className={styles.warning} key={warning}>{warning}</p>)}
          </section>
        </aside>
      </div>

      <footer className={styles.footer}>
        <span>CATÁLOGO OFICIAL · {catalog.definitions.length} DEFINIÇÕES</span>
        <span>{validation.valid ? 'PRONTO PARA PREPARAR PARTIDA' : 'GUARDA UM BARALHO DE 20 CARTAS PARA JOGAR'}</span>
      </footer>
    </main>
  );
}
