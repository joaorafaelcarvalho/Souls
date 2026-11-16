# MainMenu

## Responsabilidade

Apresentar a entrada principal do SOULS com identidade Dark Fantasy Medieval. `JOGAR` encaminha para o menu secundário de modos, sem misturar as opções na composição principal.

## Ações

- `JOGAR`: disponível e chama a transição para o ecrã de partida;
- `CÓDICE DAS ALMAS`: abre o [CodexPage](../codex-of-souls.md) com o catálogo oficial;
- `CONFIGURAÇÕES`: desativado com estado `EM BREVE`.
- `REGRAS DO JOGO`: abre o `GameRulesDialog` reutilizável sem sair do menu.

O menu reutiliza o logo, o wallpaper cinematográfico e o estandarte local `apps/web/public/images/branding/souls-menu-banner.png` como camada decorativa atrás da composição. Os botões usam o mesmo tratamento ornamental em ferro, bronze e dourado envelhecido; os estados hover, focus, active e disabled são definidos em CSS Modules.

## Props

```ts
interface MainMenuProps {
  onOpenModes: () => void;
}
```
