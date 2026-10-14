export type GlossaryEntry = {
  term: string
  say?: string
  plain: string
  extra?: string
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'NLHE',
    say: 'N-L-H-E, or “no-limit hold’em”',
    plain: 'The game this app teaches. Each player gets two private cards. Five shared cards come out in the middle. Whoever makes the best five-card poker hand (or makes everyone else quit) wins the pot.',
    extra: '“No-limit” means you can bet any amount of your chips at any time, up to everything you have.',
  },
  {
    term: 'Hold’em',
    plain: 'The family of poker where you use two hole cards plus a shared board. Texas Hold’em is the world-standard version.',
  },
  {
    term: '6-max / six-max',
    plain: 'A table with six seats, not nine or ten. Fewer players means you play more hands, because there are fewer people to beat.',
  },
  {
    term: 'Cash game',
    plain: 'Chips are real money (or play-money practice). You can sit down or leave between hands. This app teaches cash games, not tournaments.',
    extra: 'A tournament is different: you pay one buy-in, get chips with no cash value, and play until one person has them all.',
  },
  {
    term: 'Academy / Lessons',
    plain: 'The classroom. Short chapters that teach one idea, then ask a few questions so it sticks.',
  },
  {
    term: 'Math Lab / Calculators',
    plain: 'A sandbox of number toys. You type a pot size or a bet, and the app shows the formula. Use this after the early lessons, not first.',
  },
  {
    term: 'Range',
    plain: 'The set of hands a player might still have. You never know their exact two cards, so you think in groups: “they would play ace-king, big pairs, and a few suited connectors here.”',
  },
  {
    term: 'Starting hands',
    plain: 'The two cards you are dealt. There are 169 types (AA, AKs, AKo, 72o…). The grid in Starting hands is a map of all of them.',
  },
  {
    term: 'Practice / Quizzes',
    plain: 'Short questions. After a lesson, you try a similar spot and the app shows the arithmetic. Not a test of your worth — just reps.',
  },
  {
    term: 'Hole cards',
    plain: 'Your two private cards. Only you can see them until showdown.',
  },
  {
    term: 'Board',
    plain: 'The shared cards in the middle that everyone can use. Flop is three, turn is the fourth, river is the fifth.',
  },
  {
    term: 'Street',
    plain: 'A betting round. Preflop (before any board cards), flop, turn, river. Each street, people take turns acting.',
  },
  {
    term: 'Preflop',
    plain: 'The first betting round, when you only have your two hole cards.',
  },
  {
    term: 'Flop / turn / river',
    plain: 'Flop = first three shared cards. Turn = fourth. River = fifth and last. Then remaining players show their cards if needed.',
  },
  {
    term: 'Showdown',
    plain: 'If two or more people are still in after the last bet, they flip their cards. Best five-card hand wins.',
  },
  {
    term: 'Pot',
    plain: 'All the chips already in the middle. The winner of the hand takes this.',
  },
  {
    term: 'Stack',
    plain: 'How many chips you have in front of you. “100 big blinds” is a typical cash-game starting stack.',
  },
  {
    term: 'Blind',
    plain: 'Forced bets that start the pot so someone has something to fight for. Small blind is half a big blind. The big blind is the unit of the table (“this is a $1/$2 game”).',
  },
  {
    term: 'Button (BTN)',
    plain: 'A token that marks the dealer. That seat acts last after the flop, which is the best seat at the table. The button moves one seat left every hand.',
  },
  {
    term: 'UTG / HJ / CO / SB / BB',
    plain: 'Seat names around a six-max table: Under the Gun, Hijack, Cutoff, Small Blind, Big Blind. You do not need to memorize them on day one — the first lessons walk the table.',
  },
  {
    term: 'Position',
    plain: 'Whether you act before or after the other player. Acting last is “in position.” You see what they did first. That is a huge advantage.',
  },
  {
    term: 'Fold',
    plain: 'Give up the hand. You put no more chips in. You cannot win this pot.',
  },
  {
    term: 'Check',
    plain: 'Pass the action without betting, but stay in the hand. You can only check if nobody has bet yet on this street.',
  },
  {
    term: 'Call',
    plain: 'Match the bet that is in front of you so you can stay in the hand.',
  },
  {
    term: 'Bet',
    plain: 'Put chips in when nobody has bet yet this street. You are charging the other player to continue.',
  },
  {
    term: 'Raise',
    plain: 'Put in more than the current bet. You make it more expensive for them to stay.',
  },
  {
    term: 'Open',
    plain: 'The first raise before the flop, when nobody has entered the pot yet besides the blinds.',
  },
  {
    term: '3-bet',
    plain: 'A re-raise. Someone opened (that is the 2nd bet, after the blinds), you raise again. That is the third bet.',
  },
  {
    term: 'Equity',
    plain: 'How often your hand would win if you ran the rest of the cards out many times. 30% equity means “I win about 3 times in 10.”',
  },
  {
    term: 'Pot odds',
    plain: 'The price the pot is offering you. If you must put in $20 to try to win a $80 pot, you need to win more than 20% of the time for a call to pay (ignoring future bets).',
  },
  {
    term: 'EV (expected value)',
    plain: 'The average profit or loss of a decision if you made it thousands of times. Positive EV is a good decision even if you lose this one hand.',
  },
  {
    term: 'SPR',
    say: 'stack-to-pot ratio',
    plain: 'How many chips you have left compared with the pot. A small SPR means you are close to putting all your chips in. A big SPR means there is still a lot of room.',
  },
  {
    term: 'Combo',
    plain: 'One specific version of a hand. Ace-king suited has 4 combos (one per suit). Ace-king offsuit has 12. A pair like queens has 6.',
  },
  {
    term: 'Blocker',
    plain: 'A card in your hand that the other player cannot have. If you hold an ace, they have fewer ace-king and ace-ace combinations.',
  },
  {
    term: 'MDF',
    say: 'minimum defense frequency',
    plain: 'How often you must keep playing (call or raise) when they bet, so they cannot profit by betting any two cards. You can skip this until the later lessons.',
  },
  {
    term: 'Alpha (α)',
    plain: 'How many of your bets on the last street should be bluffs so a calling opponent is stuck. Advanced. Skip until the street-math chapter.',
  },
  {
    term: 'GTO',
    say: 'game theory optimal',
    plain: 'A strategy that does not leak money no matter how the other person plays. Solvers compute this. This app teaches the ideas behind it; it is not a commercial solver.',
  },
  {
    term: 'Solver',
    plain: 'Software that computes those unexploitable strategies. GTO Wizard is one. You do not need one to start. You need the words and the math first.',
  },
  {
    term: 'bb',
    plain: 'Big blinds. We measure stacks and bets in this unit so a $1/$2 game and a $5/$10 game use the same numbers. “Open to 2.5bb” means 2.5 times the big blind.',
  },
  {
    term: 'Play a table',
    plain: 'A room where you sit in a hand that already happened. The other seats replay their real actions. After you act, a coach compares you to the real player and to the classroom math.',
  },
  {
    term: 'Pluribus',
    plain: 'A 2019 poker AI (Carnegie Mellon / Facebook) that beat humans in six-player no-limit hold’em. Its 10,000 hands were published with a Science paper. This app uses a public sample of those hands.',
  },
  {
    term: 'Coach',
    plain: 'After you act on a real hand, the app explains in English: did you take the same kind of action, what the price was, and whether our study charts agree.',
  },
  {
    term: 'Suited / offsuit / pair',
    plain: 'Suited = both hole cards the same suit (A♠ K♠ is AKs). Offsuit = different suits (A♠ K♦ is AKo). Pair = both the same rank (Q♥ Q♣ is QQ).',
  },
]

export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return GLOSSARY
  return GLOSSARY.filter((entry) => {
    const blob = `${entry.term} ${entry.say ?? ''} ${entry.plain} ${entry.extra ?? ''}`.toLowerCase()
    return blob.includes(q)
  })
}
