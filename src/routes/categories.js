import { Router } from 'express';

const routes = Router();

const MOCK_DATA = [
  { id: 16, name: 'ABC Gefahrenstoffe', quote: '65' },
  { id: 17, name: 'Atemschutz', quote: '12' },
  { id: 18, name: 'Besondere Gefahren im Zivilschutz', quote: '54' },
  { id: 19, name: 'Brennen', quote: '45' },
  { id: 20, name: 'Fahrzeugkunde', quote: '17' },
  {
    id: 21,
    name: 'Geräte für die technische Hilfeleistung',
    quote: '87',
  },
  {
    id: 22,
    name: 'Grundlagen des Zivil- und Katastrophenschutzes',
    quote: '98',
  },
  { id: 23, name: 'Hygiene', quote: '58' },
  { id: 24, name: 'Lebensrettende Sofortmaßnahmen', quote: '37' },
  { id: 25, name: 'Löscheinsatz', quote: '75' },
  { id: 26, name: 'Löschen', quote: '89' },
  { id: 27, name: 'Löschgeräte, Schläuche, Amaturen', quote: '28' },
  { id: 28, name: 'Persönliche Ausrüstung', quote: '96' },
  { id: 29, name: 'Physische und Psyschiche Belastung', quote: '37' },
  { id: 30, name: 'Rechtsgrundlagen', quote: '89' },
  { id: 31, name: 'Rettung', quote: '25' },
  { id: 32, name: 'Rettungsgeräte', quote: '55' },
  { id: 33, name: 'Sonstige Geräte', quote: '64' },
  { id: 34, name: 'Sprechfunk', quote: '73' },
  { id: 35, name: 'Technische Hilfeleistung', quote: '82' },
  {
    id: 36,
    name: 'Unfallverhütung - Unfallversicherung',
    quote: '17',
  },
  { id: 37, name: 'Verhalten bei Gefahr', quote: '83' },
  { id: 38, name: 'Wasserförderung', quote: '83' },
  { id: 39, name: 'Brandsicherheitsdienst', quote: '54' },
];

routes.get('/', (req, res) => {
  res.json({ categories: MOCK_DATA });
});

export default routes;
