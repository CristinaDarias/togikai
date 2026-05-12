export type RankTier = '鬼王 Oni-ō' | '鬼 Oni' | '修羅 Shura' | '戦士 Senshi' | '見習い Minarai';

export type Fighter = {
  alias: string;
  codename: string;
  fullName: string;
  publicPhrase: string;
  imageUrl?: string;
  imageHoverUrl?: string;
  points: number;
  wins: number;
  losses: number;
  kos: number;
  style: string;
  status: 'Activo' | 'Lesionado' | 'Suspendido';
};

export type FightRecord = {
  id: string;
  date: string;
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  pointsDelta: {
    winner: number;
    loser: number;
  };
  chronicle: string;
};

export type SpecialFight = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
};

export type CalendarEvent = {
  id: string;
  eventDate: string;
  eventTime: string;
  fightName: string;
  fightersCalled: string;
  matchups: string;
};

export const fighters: Fighter[] = [
  { alias: 'Amaterasu', codename: '悪魔', fullName: 'Akari Nishimura', publicPhrase: 'La luz que rompe mandíbulas en silencio', imageUrl: '/images/fighters/amaterasu.png', points: 2360, wins: 18, losses: 3, kos: 11, style: 'Kenpo de precisión y contraataque', status: 'Activo' },
  { alias: 'Gyuki', codename: '悪魔', fullName: 'Kentaro Nishimura', publicPhrase: 'Presión constante, cero piedad', imageUrl: '/images/fighters/gyuki.png', points: 2110, wins: 16, losses: 5, kos: 9, style: 'Lucha de presión, clinch brutal', status: 'Activo' },
  { alias: 'Taraku', codename: '悪魔', fullName: 'Kaori Karasu', publicPhrase: 'Codos de acero, sangre en cada round', points: 1765, wins: 13, losses: 6, kos: 6, style: 'Muay boran y codos cortos', status: 'Activo' },
  { alias: 'Konjou', codename: '悪魔', fullName: 'Kaos Castellanos', publicPhrase: 'Golpea donde duele y no suelta', points: 1680, wins: 12, losses: 7, kos: 5, style: 'Boxeo sucio y trabajo al cuerpo', status: 'Activo' },
  { alias: 'Nobita', codename: '悪魔', fullName: 'Raymond Manson', publicPhrase: 'Te arrastra al suelo y apaga tu aire', points: 1430, wins: 11, losses: 8, kos: 4, style: 'Grappling callejero y control', status: 'Lesionado' },
  { alias: 'Kage', codename: '悪魔', fullName: 'Yuu', publicPhrase: 'No lo ves venir hasta que ya es tarde', points: 1310, wins: 9, losses: 8, kos: 3, style: 'Ninjutsu moderno y evasión', status: 'Activo' },
  { alias: 'Ryu', codename: '悪魔', fullName: 'Kenzo', publicPhrase: 'Puños rectos, impacto de tren', points: 1120, wins: 8, losses: 10, kos: 2, style: 'Karate de potencia lineal', status: 'Activo' },
];

export const fights: FightRecord[] = [
  { id: 'TGI-091', date: '2026-05-01', fighterA: 'Nobita', fighterB: 'Kage', winner: 'Empate', method: 'Empate técnico', pointsDelta: { winner: 0, loser: 0 }, chronicle: 'Tras cinco asaltos de control y escapes, ni el suelo ni la distancia dieron ventaja clara. La mesa declaró empate.' },
  { id: 'TGI-090', date: '2026-04-29', fighterA: 'Ryu', fighterB: 'Gyuki', winner: 'Gyuki', method: 'KO R2', pointsDelta: { winner: 31, loser: -21 }, chronicle: 'Ryu abrió fuerte con low kicks, pero Gyuki cerró el ángulo y conectó una derecha al hígado que apagó la ofensiva.' },
  { id: 'TGI-089', date: '2026-04-28', fighterA: 'Amaterasu', fighterB: 'Taraku', winner: 'Taraku', method: 'Decisión unánime', pointsDelta: { winner: 29, loser: -20 }, chronicle: 'Taraku impuso ritmo de codos y rodillas en corto; Amaterasu no encontró la lectura a tiempo.' },
  { id: 'TGI-088', date: '2026-04-27', fighterA: 'Konjou', fighterB: 'Nobita', winner: 'Konjou', method: 'TKO R3', pointsDelta: { winner: 27, loser: -18 }, chronicle: 'Konjou castigó al cuerpo durante tres rounds hasta romper la respiración de Nobita y forzar la detención.' },
  { id: 'TGI-087', date: '2026-04-25', fighterA: 'Kage', fighterB: 'Amaterasu', winner: 'Amaterasu', method: 'Sumisión R4', pointsDelta: { winner: 30, loser: -19 }, chronicle: 'Kage quiso oscurecer el ritmo, pero Amaterasu lo atrapó en transición y cerró llave al brazo en el cuarto.' },
  { id: 'TGI-086', date: '2026-04-23', fighterA: 'Taraku', fighterB: 'Ryu', winner: 'Empate', method: 'Empate dividido', pointsDelta: { winner: 0, loser: 0 }, chronicle: 'Una guerra de distancia media sin caída ni control sostenido. El veredicto terminó partido y en tablas.' },
  { id: 'TGI-085', date: '2026-04-21', fighterA: 'Gyuki', fighterB: 'Konjou', winner: 'Gyuki', method: 'Decisión dividida', pointsDelta: { winner: 23, loser: -16 }, chronicle: 'Gyuki ganó los intercambios cerrados, Konjou dominó volumen. La decisión cayó por mínima diferencia.' },
  { id: 'TGI-084', date: '2026-04-27', fighterA: 'Amaterasu', fighterB: 'Gyuki', winner: 'Amaterasu', method: 'TKO R4', pointsDelta: { winner: 34, loser: -22 }, chronicle: 'Bajo una lluvia de neón rojo, Amaterasu rompió la guardia en el cuarto asalto y cerró la noche con una secuencia limpia al mentón.' },
  { id: 'TGI-083', date: '2026-04-13', fighterA: 'Taraku', fighterB: 'Konjou', winner: 'Taraku', method: 'Decisión dividida', pointsDelta: { winner: 26, loser: -18 }, chronicle: 'Taraku sobrevivió al castigo interno de Konjou y robó los dos últimos rounds con codos precisos en corta distancia.' },
  { id: 'TGI-082', date: '2026-03-29', fighterA: 'Kage', fighterB: 'Ryu', winner: 'Kage', method: 'Sumisión R3', pointsDelta: { winner: 24, loser: -17 }, chronicle: 'Kage desapareció del intercambio frontal, llevó la pelea al suelo y cerró un estrangulamiento en silencio total.' },
];

export const specialFights: SpecialFight[] = [
  { id: 'SP-001', title: 'Crimson Crown', description: 'Combate ceremonial donde solo los invictos pueden desafiar al líder.', imageUrl: '/images/base/fondo-home-togikai.png', displayOrder: 1 },
  { id: 'SP-002', title: 'Black Docks', description: 'Pelea nocturna en el muelle con reglas de resistencia extrema.', imageUrl: '/images/base/background.png', displayOrder: 2 },
  { id: 'SP-003', title: 'Silent Katana', description: 'Sin público y sin campana: solo termina por KO o rendición.', imageUrl: '/images/base/fondo-home-togikai.png', displayOrder: 3 },
  { id: 'SP-004', title: 'Iron Oath', description: 'Encuentro de honor entre escuelas rivales con jueces del clan.', imageUrl: '/images/base/background.png', displayOrder: 4 },
  { id: 'SP-005', title: 'Blood Lantern', description: 'Evento especial bajo faroles rojos en la arena subterránea.', imageUrl: '/images/base/fondo-home-togikai.png', displayOrder: 5 },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'CAL-001',
    eventDate: '2026-05-20',
    eventTime: '22:30',
    fightName: 'Bloody Contract',
    fightersCalled: 'Amaterasu, Gyuki, Taraku, Konjou',
    matchups: 'Amaterasu vs Gyuki, Taraku vs Konjou',
  },
];

export const upcomingEvent = {
  name: 'Noche de Hierro: Subsuelo IX',
  date: '2026-05-18',
  headline: 'Gyuki vs Taraku',
  venue: 'Muelle 7, Yokohama',
};

export function getRank(points: number): RankTier {
  if (points >= 2200) return '鬼王 Oni-ō';
  if (points >= 1800) return '鬼 Oni';
  if (points >= 1400) return '修羅 Shura';
  if (points >= 1000) return '戦士 Senshi';
  return '見習い Minarai';
}

export const ranking = [...fighters]
  .sort((a, b) => b.points - a.points)
  .map((fighter, index) => ({
    position: index + 1,
    ...fighter,
    rank: getRank(fighter.points),
  }));
