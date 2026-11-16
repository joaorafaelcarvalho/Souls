import type { LoreCatalog } from './types.js';

export const loreCatalog: LoreCatalog = {
  factions: [
    {
      id: 'last-watch',
      name: 'Ordem da Última Vigília',
      motto: 'Enquanto a última chama arder, permaneceremos.',
      summary: 'Proteção, honra, disciplina e resistência.',
      description: 'Quando Vespera caiu, os últimos cavaleiros juraram proteger os sobreviventes, independentemente de quem reclamasse o trono. A Ordem acredita que o dever para com os vivos vale mais do que a fidelidade a qualquer monarca.',
      colors: ['#96714e', '#30485b'],
      emblem: '🛡'
    },
    {
      id: 'pale-moon-veil',
      name: 'Véu da Lua Pálida',
      motto: 'A lua revela aquilo que as sombras escondem.',
      summary: 'Observação, precisão, sobrevivência e segredos.',
      description: 'Nas florestas e regiões abandonadas de Vespera, caçadores e exploradores formaram uma aliança que procura vestígios capazes de revelar a verdade sobre a Noite da Fenda.',
      colors: ['#9aa4a0', '#2c483d'],
      emblem: '☾'
    },
    {
      id: 'rift-conclave',
      name: 'Conclave da Fenda',
      motto: 'Toda a alma deixa um eco.',
      summary: 'Conhecimento arcano, investigação e poder espiritual.',
      description: 'O Conclave reúne estudiosos e investigadores que procuram compreender a energia libertada pela Fenda. Uns desejam reparar o equilíbrio; outros querem dominar a força espiritual.',
      colors: ['#9180e8', '#171a20'],
      emblem: '◈'
    },
    {
      id: 'sepulchral-oath',
      name: 'Juramento dos Sepulcros',
      motto: 'O que foi selado deve permanecer em silêncio.',
      summary: 'Memória, segredos enterrados e resistência ancestral.',
      description: 'Muito antes da queda, uma ordem protegia túmulos, catacumbas e fortalezas erguidas sobre locais de grande concentração espiritual. Os seus guardiões continuam nos seus postos.',
      colors: ['#514638', '#25272d'],
      emblem: '⚿'
    },
    {
      id: 'ashen-crown',
      name: 'Coroa das Cinzas',
      motto: 'Das cinzas, o trono voltará a erguer-se.',
      summary: 'Ambição, exílio, vingança e legitimidade perdida.',
      description: 'Os seguidores do soberano deposto acreditam que o trono foi usurpado. Reúnem-se em torno da antiga linhagem, determinados a recuperar o poder e revelar a sua versão da catástrofe.',
      colors: ['#6b2730', '#171217'],
      emblem: '♛'
    }
  ],
  cards: [
    {
      cardId: '0b4e6d2a-1f83-4c57-8a90-2d6f1b3e4a75',
      factionId: 'last-watch',
      epithet: 'A Lâmina da Vigília',
      shortDescription: 'Um guerreiro que manteve o juramento quando o reino perdeu o trono.',
      story: 'Durante a Noite da Fenda, defendeu os portões de uma das últimas fortalezas. Desde então, ergue a espada em nome dos sobreviventes, não de um soberano.'
    },
    {
      cardId: '2d608f4c-3ba5-4e79-8c12-4f8b3d5a6c97',
      factionId: 'last-watch',
      epithet: 'O Último Baluarte',
      shortDescription: 'Uma muralha de ferro entre os inocentes e a destruição.',
      story: 'Diz-se que permaneceu sozinho à entrada de uma fortaleza enquanto os habitantes escapavam pelos túneis. O seu escudo conserva as marcas desse cerco.'
    },
    {
      cardId: '7a1d4c2e-6f83-4b90-8c15-2e7d9a4f6b30',
      factionId: 'last-watch',
      epithet: 'O Herdeiro do Juramento',
      shortDescription: 'Um jovem guerreiro que procura conquistar o seu lugar entre os defensores.',
      story: 'Ainda não tinha recebido o título de cavaleiro quando a Fenda surgiu. Sobreviveu transportando o escudo de um guerreiro caído e aprendeu que a honra se conquista através das escolhas.'
    },
    {
      cardId: 'ad4f7b51-9c16-4e23-bf48-5b0a2d7c9e63',
      factionId: 'last-watch',
      epithet: 'A Primeira Linha',
      shortDescription: 'Um soldado que enfrenta o perigo antes que alcance os companheiros.',
      story: 'Combateu em inúmeras campanhas nas antigas fronteiras de Vespera. Quando a monarquia caiu, recusou abandonar os soldados sob o seu comando.'
    },
    {
      cardId: 'be508c62-ad27-4f34-8059-6c1b3e8daf74',
      factionId: 'last-watch',
      epithet: 'O Guardião dos Sinos',
      shortDescription: 'Um sentinela das últimas capelas onde os sobreviventes encontram refúgio.',
      story: 'Protege uma capela transformada em abrigo e mantém uma vigília silenciosa junto aos sinos que outrora anunciavam o amanhecer.'
    },
    {
      cardId: 'edb08720-b1b8-4c94-ad13-3a94bab76349',
      factionId: 'last-watch',
      epithet: 'O Juramento Inquebrável',
      shortDescription: 'Um dos campeões mais respeitados da Ordem da Última Vigília.',
      story: 'Pertence ao grupo de guerreiros que testemunhou a fundação da Ordem. A sua armadura conserva símbolos da guarda real, mas o seu juramento pertence aos habitantes de Vespera.'
    },
    {
      cardId: '68c2dc9a-cc43-4119-b339-c03f0b147946',
      factionId: 'last-watch',
      epithet: 'A Fortaleza Silenciosa',
      shortDescription: 'Um guardião monumental de um dos últimos santuários do reino.',
      story: 'A grande catedral sobreviveu parcialmente à Noite da Fenda. A Sentinela permanece diante das suas portas, protegendo refugiados e arquivos.'
    },
    {
      cardId: '1c5f7e3b-2a94-4d68-9b01-3e7a2c4f5b86',
      factionId: 'pale-moon-veil',
      epithet: 'O Olhar da Lua',
      shortDescription: 'Uma arqueira encapuzada cuja precisão se tornou lendária.',
      story: 'Atravessa as florestas sem deixar vestígios. Foi uma das primeiras a encontrar sinais de que a Noite da Fenda poderia ter sido antecipada por alguém dentro do reino.'
    },
    {
      cardId: '8b2e5d3f-7a94-4c01-9d26-3f8e0b5a7c41',
      factionId: 'pale-moon-veil',
      epithet: 'A Sombra entre as Árvores',
      shortDescription: 'Uma exploradora das regiões mais perigosas de Vespera.',
      story: 'Conhece caminhos que já não aparecem nos mapas. Foi através das suas explorações que o Véu descobriu passagens esquecidas entre torres de vigia.'
    },
    {
      cardId: 'cf619d73-be38-405a-916a-7d2c4f9eb085',
      factionId: 'pale-moon-veil',
      epithet: 'A Flecha do Horizonte',
      shortDescription: 'Uma caçadora que prefere agir quando a última luz desaparece.',
      story: 'Protegia aldeias das ameaças nas estradas abandonadas. Agora percorre as fronteiras, procurando desaparecidos e recolhendo testemunhos sobre a queda.'
    },
    {
      cardId: '76a72481-f831-4a46-ad9b-5072defa7513',
      factionId: 'pale-moon-veil',
      epithet: 'A Guardiã dos Rastros',
      shortDescription: 'Uma veterana capaz de interpretar os sinais das almas errantes.',
      story: 'Dedicou anos a seguir rastos espirituais. Os seus registos sugerem que as Souls se concentram em locais específicos, despertando o interesse do Conclave.'
    },
    {
      cardId: '3e71905d-4cb6-4f8a-9d23-5a9c4e6b7da8',
      factionId: 'rift-conclave',
      epithet: 'O Estudioso do Véu',
      shortDescription: 'Um conjurador dedicado a compreender a energia espiritual.',
      story: 'Abandonou os estudos tradicionais depois de testemunhar a transformação da energia durante a Noite da Fenda. Acredita que compreender as Souls é o caminho para restaurar o equilíbrio.'
    },
    {
      cardId: 'd072ae84-cf49-416b-a27b-8e3d5f0ac196',
      factionId: 'rift-conclave',
      epithet: 'O Aprendiz dos Ecos',
      shortDescription: 'Um jovem estudioso fascinado pelos fragmentos de memória da névoa.',
      story: 'Ingressou no Conclave depois de descobrir que certas manifestações conservavam fragmentos de acontecimentos antigos. Procura compreender essas visões sem perder a identidade.'
    },
    {
      cardId: 'c5c7f3d9-b49e-46b0-b7c0-3d829e5fa641',
      factionId: 'rift-conclave',
      epithet: 'O Intérprete dos Fragmentos',
      shortDescription: 'Um estudioso das ligações entre as manifestações espirituais.',
      story: 'Acredita que as Souls não são fragmentos isolados, mas partes de uma estrutura maior. As suas investigações dividem o Conclave.'
    },
    {
      cardId: '2d63165c-9200-47fa-ba55-f04214e6f873',
      factionId: 'rift-conclave',
      epithet: 'A Voz da Fenda',
      shortDescription: 'Uma feiticeira que procura compreender a origem da ruptura espiritual.',
      story: 'Esteve presente numa das primeiras investigações junto da Fenda. Afirma escutar ecos vindos do outro lado; alguns veem uma visionária, outros uma ameaça.'
    },
    {
      cardId: 'ae5bdd73-f2f2-472b-9192-9926c7f75c46',
      factionId: 'rift-conclave',
      epithet: 'O Guardião da Última Fórmula',
      shortDescription: 'Um arquimago dedicado aos limites da energia espiritual.',
      story: 'Conserva textos anteriores à Fenda, incluindo referências a experiências apagadas dos registos. Recusa revelar o conteúdo completo desses documentos.'
    },
    {
      cardId: '9c3f6e40-8b05-4d12-ae37-4a9f1c6b8d52',
      factionId: 'sepulchral-oath',
      epithet: 'A Pedra que Permanece',
      shortDescription: 'Um guerreiro encarregado de proteger as estruturas mais antigas.',
      story: 'Vigia as ruínas de uma fortaleza erguida antes da fundação do reino. O seu juramento impede-o de abandonar o local.'
    },
    {
      cardId: 'a3a5d1b7-f27c-449e-95ae-1b607c3df429',
      factionId: 'sepulchral-oath',
      epithet: 'O Vigia dos Mortos',
      shortDescription: 'Um protetor silencioso das câmaras funerárias ancestrais.',
      story: 'Permanece junto a um sepulcro que repousa sobre informações ligadas às primeiras manifestações da energia espiritual.'
    },
    {
      cardId: 'fb57bcb1-18ff-41d1-9514-0fd3e9b64256',
      factionId: 'sepulchral-oath',
      epithet: 'O Portador dos Selos',
      shortDescription: 'Um guerreiro que protege mecanismos de contenção espiritual.',
      story: 'As correntes que transporta pertencem a um sistema de selos nas profundezas de Vespera. Impede que sejam destruídos ou usados sem compreensão.'
    },
    {
      cardId: '4d744c98-d167-4e74-9e11-78cee560f32d',
      factionId: 'sepulchral-oath',
      epithet: 'O Monumento Esquecido',
      shortDescription: 'Um guardião colossal associado às estruturas mais antigas do reino.',
      story: 'A sua origem é desconhecida. Permaneceu imóvel junto a um portão subterrâneo até voltar a mover-se depois da Noite da Fenda.'
    },
    {
      cardId: 'e723386a-c9cd-4a6a-849d-13e09230be3f',
      factionId: 'sepulchral-oath',
      epithet: 'A Guardiã do Silêncio',
      shortDescription: 'Uma antiga guardiã dos santuários funerários e dos segredos selados de Vespera.',
      story: 'A Matriarca dos Selos é uma antiga guardiã dos santuários funerários de Vespera, dedicada a proteger segredos enterrados e forças espirituais seladas. Após a Noite da Fenda, regressou das profundezas dos sepulcros envolta em magia ritual, tornando-se um dos maiores poderes do Juramento dos Sepulcros. Invoca runas funerárias, correntes espirituais e ecos de almas aprisionadas para impedir que os segredos do passado sejam libertados.'
    },
    {
      cardId: '4f82a16e-5dc7-409b-8e34-6bad5f7c8eb9',
      factionId: 'ashen-crown',
      epithet: 'A Sombra do Trono',
      shortDescription: 'Um guerreiro temido que serve a causa do soberano exilado.',
      story: 'Ninguém conhece a sua identidade. A armadura surgiu nos campos pouco depois da queda da monarquia e tornou-se o símbolo mais temido da Coroa.'
    },
    {
      cardId: 'e183bf95-d05a-427c-b38c-9f4e6a1bd207',
      factionId: 'ashen-crown',
      epithet: 'O Executor sem Reino',
      shortDescription: 'Um antigo executor real que segue os últimos decretos da Coroa.',
      story: 'Depois da queda, percorreu as estradas de Vespera à procura dos responsáveis que, segundo acredita, traíram o soberano.'
    },
    {
      cardId: 'f294c0a6-e16b-438d-849d-0a5f7b2ce318',
      factionId: 'ashen-crown',
      epithet: 'A Lâmina da Coroa Partida',
      shortDescription: 'Um duelista que jurou restaurar a honra da família real.',
      story: 'Serviu na guarda pessoal de um herdeiro. Depois da queda, recusou a Última Vigília e seguiu a linhagem real para o exílio.'
    },
    {
      cardId: '8ad0df27-9075-4bee-9145-d04e1f11dbf8',
      factionId: 'ashen-crown',
      epithet: 'O Desafio das Trevas',
      shortDescription: 'Um guerreiro que procura adversários dignos da sua reputação.',
      story: 'Surgiu entre os seguidores da Coroa depois de sobreviver a uma expedição próxima da Fenda. Pouco fala sobre o que encontrou.'
    },
    {
      cardId: '1a853caf-208d-4339-8ee6-e17a0553a87e',
      factionId: 'ashen-crown',
      epithet: 'O Herdeiro das Cinzas',
      shortDescription: 'O soberano deposto que reclama o direito de restaurar o trono.',
      story: 'Governava quando a Noite da Fenda mergulhou o reino no caos. Acusado pela catástrofe, perdeu a coroa e agora reúne os antigos seguidores.'
    }
  ]
};

export function loadLoreCatalog(): LoreCatalog {
  return loreCatalog;
}
