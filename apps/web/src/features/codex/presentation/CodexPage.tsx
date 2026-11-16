import { loadBrowserCardCatalog, loadLoreCatalog, type CardLoreDefinition } from '@souls/game-content';
import type { CardDefinition, CardType } from '@souls/game-core';
import { useMemo, useState, type CSSProperties } from 'react';
import { Card } from '../../cards/presentation/Card';
import styles from './CodexPage.module.css';

type TypeFilter = 'all' | CardType;
type SortOption = 'name-asc' | 'name-desc' | 'attack-asc' | 'attack-desc' | 'defense-asc' | 'defense-desc' | 'level-asc' | 'level-desc';

function normalize(value: string): string {
  return value.toLocaleLowerCase('pt-PT').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function compareDefinitions(left: CardDefinition, right: CardDefinition, sort: SortOption): number {
  const tieBreak = left.name.localeCompare(right.name, 'pt-PT');
  const numeric = (difference: number) => difference === 0 ? tieBreak : difference;

  switch (sort) {
    case 'name-desc': return -tieBreak;
    case 'attack-asc': return numeric(left.attack - right.attack);
    case 'attack-desc': return numeric(right.attack - left.attack);
    case 'defense-asc': return numeric(left.defense - right.defense);
    case 'defense-desc': return numeric(right.defense - left.defense);
    case 'level-asc': return numeric(left.level - right.level);
    case 'level-desc': return numeric(right.level - left.level);
    case 'name-asc':
    default: return tieBreak;
  }
}

export interface CodexPageProps {
  readonly onBack: () => void;
}

type CodexView = 'cards' | 'factions';

export function CodexPage({ onBack }: CodexPageProps) {
  const catalog = useMemo(() => loadBrowserCardCatalog(), []);
  const loreCatalog = useMemo(() => loadLoreCatalog(), []);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(catalog.definitions[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [factionFilter, setFactionFilter] = useState('all');
  const [selectedFactionId, setSelectedFactionId] = useState(loreCatalog.factions[0]?.id ?? '');
  const [view, setView] = useState<CodexView>('cards');
  const [sort, setSort] = useState<SortOption>('name-asc');
  const loreByCardId = useMemo(() => new Map(loreCatalog.cards.map((entry) => [entry.cardId, entry] as const)), [loreCatalog.cards]);
  const factionsById = useMemo(() => new Map(loreCatalog.factions.map((entry) => [entry.id, entry] as const)), [loreCatalog.factions]);

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
        return [definition.name, lore?.epithet, lore?.shortDescription, faction?.name]
          .filter((value): value is string => value !== undefined)
          .some((value) => normalize(value).includes(query));
      })
      .slice()
      .sort((left, right) => compareDefinitions(left, right, sort));
  }, [catalog.definitions, factionFilter, factionsById, levelFilter, loreByCardId, searchQuery, sort, typeFilter]);

  const selectedDefinition = filteredDefinitions.find((definition) => definition.id === selectedCardId)
    ?? filteredDefinitions[0];
  const lore: CardLoreDefinition | undefined = selectedDefinition === undefined ? undefined : loreByCardId.get(selectedDefinition.id);
  const selectedFaction = lore === undefined ? undefined : factionsById.get(lore.factionId);
  const availableLevels = new Set<number>(catalog.definitions.map((definition) => definition.level));
  const faction = factionsById.get(selectedFactionId);
  const factionCards = faction === undefined ? [] : catalog.definitions.filter((definition) => loreByCardId.get(definition.id)?.factionId === faction.id);

  return (
    <main className={styles.page} data-testid="codex-page" aria-label="Códice das Almas">
      <div className={styles.backdrop} aria-hidden="true" />
      <header className={styles.header}>
        <div className={styles.brandMark} aria-hidden="true">🔥︎</div>
        <div className={styles.headingCopy}>
          <p className={styles.eyebrow}>ARQUIVO DAS ALMAS · ENCICLOPÉDIA</p>
          <h1>CÓDICE DAS ALMAS</h1>
          <p>Os guerreiros esquecidos aguardam nos arquivos.</p>
        </div>
        <button className={styles.backButton} type="button" onClick={onBack}>VOLTAR AO MENU</button>
      </header>

      <div className={styles.scrollArea}>
        <nav className={styles.views} aria-label="Secções do Códice">
          <button className={view === 'cards' ? styles.viewActive : ''} type="button" onClick={() => setView('cards')}>CARTAS</button>
          <button className={view === 'factions' ? styles.viewActive : ''} type="button" onClick={() => setView('factions')}>FACÇÕES</button>
        </nav>

        {view === 'factions' ? (
        <section className={styles.factionWorkspace} aria-label="Galeria de facções">
          <div className={styles.factionGallery}>
            {loreCatalog.factions.map((entry) => (
              <button
                key={entry.id}
                className={`${styles.factionCard} ${entry.id === faction?.id ? styles.factionSelected : ''}`}
                type="button"
                onClick={() => setSelectedFactionId(entry.id)}
              >
                <span className={styles.factionEmblem} aria-hidden="true">{entry.emblem}</span>
                <strong>{entry.name}</strong>
                <small>{entry.motto}</small>
                <span>{catalog.definitions.filter((definition) => loreByCardId.get(definition.id)?.factionId === entry.id).length} cartas</span>
              </button>
            ))}
          </div>
          {faction === undefined ? null : (
            <article className={styles.factionDetails} style={{ '--faction-accent': faction.colors[0] } as CSSProperties}>
              <span className={styles.factionEmblem} aria-hidden="true">{faction.emblem}</span>
              <p className={styles.eyebrow}>FACÇÃO DE VESPERA</p>
              <h2>{faction.name}</h2>
              <p className={styles.factionMotto}>“{faction.motto}”</p>
              <p className={styles.factionDescription}>{faction.description}</p>
              <h3>CARTAS ASSOCIADAS · {factionCards.length}</h3>
              <div className={styles.factionCards}>
                {factionCards.map((definition) => (
                  <button
                    key={definition.id}
                    type="button"
                    aria-label={definition.name}
                    onClick={() => { setSelectedCardId(definition.id); setView('cards'); setFactionFilter(faction.id); }}
                  >
                    <Card definition={definition} variant="codex-faction" />
                  </button>
                ))}
              </div>
            </article>
          )}
        </section>
      ) : (
        <>

      <section className={styles.toolbar} aria-label="Pesquisar e filtrar cartas">
        <label className={styles.search}>
          <span>PESQUISAR NO CÓDICE</span>
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Nome da carta..." />
          {searchQuery.length > 0 ? <button type="button" aria-label="Limpar pesquisa" onClick={() => setSearchQuery('')}>×</button> : null}
        </label>
        <div className={styles.filters} aria-label="Filtros de cartas">
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
              {[0, 1, 2, 3, 4].map((level) => <option key={level} value={level} disabled={!availableLevels.has(level)}>Nível {level}{availableLevels.has(level) ? '' : ' · vazio'}</option>)}
            </select>
          </label>
          <label className={styles.selectLabel}>
            <span>FAÇÃO</span>
            <select value={factionFilter} onChange={(event) => setFactionFilter(event.target.value)}>
              <option value="all">Todas</option>
              {loreCatalog.factions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
            </select>
          </label>
          <label className={styles.selectLabel}>
            <span>ORDENAR</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
              <option value="name-asc">Nome A–Z</option>
              <option value="name-desc">Nome Z–A</option>
              <option value="attack-asc">ATK crescente</option>
              <option value="attack-desc">ATK decrescente</option>
              <option value="defense-asc">DEF crescente</option>
              <option value="defense-desc">DEF decrescente</option>
              <option value="level-asc">Nível crescente</option>
              <option value="level-desc">Nível decrescente</option>
            </select>
          </label>
        </div>
      </section>

      <div className={styles.resultCount}>{filteredDefinitions.length} de {catalog.definitions.length} almas encontradas</div>

      <section className={styles.workspace}>
        <section className={styles.gallery} aria-label="Galeria de cartas">
          {filteredDefinitions.length === 0 ? (
            <div className={styles.empty}>
              <span aria-hidden="true">◈</span>
              <h2>NENHUMA ALMA ENCONTRADA</h2>
              <p>Os arquivos não contêm guerreiros com essa descrição.</p>
              <button type="button" onClick={() => { setSearchQuery(''); setTypeFilter('all'); setLevelFilter(null); }}>Limpar filtros</button>
            </div>
          ) : filteredDefinitions.map((definition) => (
            <button
              key={definition.id}
              className={`${styles.cardButton} ${selectedDefinition?.id === definition.id ? styles.cardSelected : ''}`}
              type="button"
              aria-label={`Selecionar ${definition.name}`}
              aria-pressed={selectedDefinition?.id === definition.id}
              onClick={() => setSelectedCardId(definition.id)}
            >
              <Card definition={definition} variant="hand" selected={selectedDefinition?.id === definition.id} />
            </button>
          ))}
        </section>

        <aside className={styles.details} aria-label="Detalhes da carta selecionada">
          {selectedDefinition === undefined ? (
            <div className={styles.detailsEmpty}><span aria-hidden="true">◈</span><p>Seleciona uma carta para consultar os seus arquivos.</p></div>
          ) : (
            <>
              <div className={styles.detailsCard}><Card definition={selectedDefinition} variant="inspection" /></div>
              <div className={styles.detailsHeading}>
                <span className={styles.typeBadge}>{selectedDefinition.type.toUpperCase()}</span>
                <span>NÍVEL {selectedDefinition.level}</span>
                <h2>{selectedDefinition.name}</h2>
                {lore?.epithet ? <p>{lore.epithet}</p> : null}
                {selectedFaction ? <button className={styles.factionLink} type="button" onClick={() => { setSelectedFactionId(selectedFaction.id); setView('factions'); }}>{selectedFaction.name}</button> : null}
              </div>
              <dl className={styles.attributes}>
                <div><dt>ATK</dt><dd>{selectedDefinition.attack}</dd></div>
                <div><dt>DEF</dt><dd>{selectedDefinition.defense}</dd></div>
                <div><dt>SOULS</dt><dd>{selectedDefinition.level}</dd></div>
              </dl>
              <section className={styles.lore}>
                <h3>REGISTO NARRATIVO</h3>
                <p>{lore?.shortDescription ?? 'História por descobrir.'}</p>
                <p>{lore?.story ?? 'História por descobrir.'}</p>
                <small>CRÓNICA DA ALMA · Conteúdo narrativo oficial v1.0.</small>
              </section>
            </>
          )}
        </aside>
      </section>
        </>
        )}
      </div>

      <footer className={styles.footer}>
        <span>ARQUIVO OFICIAL SOULS · CÓDICE DAS ALMAS</span>
        <span>Conteúdo narrativo v1.0</span>
      </footer>
    </main>
  );
}
