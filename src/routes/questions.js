import { Router } from 'express';

const routes = Router();

const MOCK_DATA = [
  {
    id: 1,
    question: 'Devolved demand-driven hardware',
    answerA: 'Effertz LLC',
    answerB: 'Husain',
    answerC: 'GT-Power',
    correctAnswer: 'c',
  },
  {
    id: 2,
    question: 'Grass-roots intermediate moratorium',
    answerA: 'West, MacGyver and Kessler',
    answerB: 'Laetitia',
    answerC: 'Commercial Aviation',
    correctAnswer: 'a',
  },
  {
    id: 3,
    question: 'Optimized disintermediate product',
    answerA: 'Schoen, Barrows and Armstrong',
    answerB: 'Ellswerth',
    answerC: 'ZK',
    correctAnswer: 'a',
  },
  {
    id: 4,
    question: 'Future-proofed system-worthy groupware',
    answerA: 'Halvorson-Boyer',
    answerB: 'Gwenore',
    answerC: 'National Association of Realtors',
    correctAnswer: 'b',
  },
  {
    id: 5,
    question: 'Profit-focused uniform firmware',
    answerA: 'King-Harber',
    answerB: 'Briny',
    answerC: 'Fleet Management',
    correctAnswer: 'c',
  },
  {
    id: 6,
    question: 'Fully-configurable content-based benchmark',
    answerA: 'Kshlerin Group',
    answerB: 'Burke',
    answerC: 'Whole Life',
    correctAnswer: 'a',
  },
  {
    id: 7,
    question: 'Centralized maximized function',
    answerA: 'Price Inc',
    answerB: 'Arlee',
    answerC: 'Office Administration',
    correctAnswer: 'b',
  },
  {
    id: 8,
    question: 'Cross-platform object-oriented extranet',
    answerA: 'Nitzsche, Schimmel and Shields',
    answerB: 'Geno',
    answerC: 'Property &amp; Casualty Insurance',
    correctAnswer: 'c',
  },
  {
    id: 9,
    question: 'Upgradable global installation',
    answerA: 'Quigley, Sipes and Legros',
    answerB: 'Nettie',
    answerC: 'Online Reputation Management',
    correctAnswer: 'c',
  },
  {
    id: 10,
    question: 'Intuitive non-volatile capability',
    answerA: 'Ondricka, Waelchi and Yundt',
    answerB: 'Jsandye',
    answerC: 'Strategic Alliances',
    correctAnswer: 'c',
  },
  {
    id: 11,
    question: 'Digitized responsive knowledge user',
    answerA: 'Quitzon-Hirthe',
    answerB: 'Mab',
    answerC: 'Mobile Communications',
    correctAnswer: 'c',
  },
  {
    id: 12,
    question: 'Universal eco-centric contingency',
    answerA: 'Beer, Harvey and Stark',
    answerB: 'Aldridge',
    answerC: 'LDPC',
    correctAnswer: 'b',
  },
  {
    id: 13,
    question: 'Focused leading edge secured line',
    answerA: 'Beatty-Schiller',
    answerB: 'Irvin',
    answerC: 'Offset Printing',
    correctAnswer: 'b',
  },
  {
    id: 14,
    question: 'Open-source exuding local area network',
    answerA: 'Heaney Group',
    answerB: 'Mohandas',
    answerC: 'Final Cut Pro',
    correctAnswer: 'c',
  },
  {
    id: 15,
    question: 'Innovative explicit neural-net',
    answerA: 'Huel-Adams',
    answerB: 'Garrett',
    answerC: 'SLA',
    correctAnswer: 'a',
  },
];

routes.get('/', (req, res) => {
  res.json({ questions: MOCK_DATA });
});

export default routes;
