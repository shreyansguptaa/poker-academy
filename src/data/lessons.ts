export type LessonCheck = {
  question: string
  kind: 'choice' | 'number'
  choices?: string[]
  answer: string | number
  hint: string
}

export type LessonBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'formula'; eq: string; note: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; text: string }

export type Lesson = {
  id: string
  title: string
  chapter: string
  minutes: number
  summary: string
  widget: string
  blocks: LessonBlock[]
  checks: LessonCheck[]
}

export const CHAPTERS = [
  'Start here',
  'How the table works',
  'The money math',
  'Counting hands',
  'Groups of hands',
  'Before the flop',
  'Bet sizes',
  'After the flop',
] as const

export const LESSONS: Lesson[] = [
  {
    id: 'what-is-nlhe',
    title: 'What game are we learning?',
    chapter: 'Start here',
    minutes: 5,
    summary: 'No-limit Texas Hold’em, six players, cash chips. That is all “NLHE 6-max cash” means.',
    widget: 'game',
    blocks: [
      {
        type: 'p',
        text: 'Poker is a game of cards and bets. This classroom teaches one version: Texas Hold’em, with no limit on how much you can bet, at a table of six people, where chips stand for money you can pick up and leave with. Players abbreviate that as “NLHE 6-max cash.” You never needed to know the abbreviation to start.',
      },
      {
        type: 'list',
        items: [
          'Texas Hold’em: two secret cards each, five shared cards in the middle.',
          'No-limit: you may bet any amount of your remaining chips, including all of them.',
          'Six-max: six seats. Fewer opponents than a full “full ring” table.',
          'Cash: you can sit down or stand up between hands. Not a tournament.',
        ],
      },
      {
        type: 'callout',
        title: 'This app does not play for money',
        text: 'Nothing here is gambling. You are learning the rules and the prices so that when you do play — for fun or for stakes — you know why you clicked a button.',
      },
      {
        type: 'p',
        text: 'Great players are not lucky guessers. They know what beats what, they know when a call is a good price, and they think about the group of hands the other person might have — not one magic guess. Those three skills are the whole course.',
      },
    ],
    checks: [
      {
        question: 'NLHE means…',
        kind: 'choice',
        choices: [
          'A secret poker club',
          'No-limit Texas Hold’em',
          'Nine-handed limit Omaha',
          'A type of bet size',
        ],
        answer: 'No-limit Texas Hold’em',
        hint: 'N = no-limit, LHE = (Texas) Hold’em. That is the game on TV.',
      },
      {
        question: 'In this app, how many people sit at the table?',
        kind: 'choice',
        choices: ['Two', 'Six', 'Ten', 'As many as want'],
        answer: 'Six',
        hint: 'Six-max. A common online cash setup.',
      },
      {
        question: '“No-limit” means…',
        kind: 'choice',
        choices: [
          'You cannot bet',
          'Bets are always $1',
          'You may bet any amount of your chips, including all of them',
          'The cards have no ranks',
        ],
        answer: 'You may bet any amount of your chips, including all of them',
        hint: 'That freedom is why the math matters: a call can be cheap or it can be your whole stack.',
      },
    ],
  },
  {
    id: 'how-a-hand-works',
    title: 'How one hand is played',
    chapter: 'Start here',
    minutes: 6,
    summary: 'Secret cards, then three shared cards, then a fourth, then a fifth. Betting between each step.',
    widget: 'streetsWalk',
    blocks: [
      {
        type: 'p',
        text: 'A “hand” is one deal, from the moment cards come out until someone wins the pot. Use the stepper on the right. Each pause with betting is called a street — just “a round.”',
      },
      {
        type: 'list',
        items: [
          'Preflop: you look at your two secret cards (hole cards). You fold, call, or raise.',
          'Flop: three shared cards appear. Another betting round.',
          'Turn: a fourth shared card. Another betting round.',
          'River: the fifth shared card. Last betting round. Then anyone still in shows their cards if needed (showdown).',
        ],
      },
      {
        type: 'p',
        text: 'You make the best five-card poker hand from your two cards plus the five in the middle. You do not have to use both hole cards. If everyone else folds, you win without showing. Most pots never reach a showdown.',
      },
      {
        type: 'callout',
        title: 'If you remember one thing',
        text: 'Folding is allowed and usually correct with junk. You are not a coward for throwing 7-2 away. You are paying rent to see a flop only when the price and the cards are worth it.',
      },
    ],
    checks: [
      {
        question: 'How many cards does each player get in secret?',
        kind: 'choice',
        choices: ['One', 'Two', 'Five', 'Seven'],
        answer: 'Two',
        hint: 'Those are hole cards. Everyone shares the five in the middle.',
      },
      {
        question: 'The flop is…',
        kind: 'choice',
        choices: ['The last card', 'The first three shared cards', 'Your two secret cards', 'The pot'],
        answer: 'The first three shared cards',
        hint: 'Flop (3), turn (4th), river (5th).',
      },
      {
        question: 'If everyone folds except you, you…',
        kind: 'choice',
        choices: [
          'Must show your cards',
          'Win the pot immediately',
          'Split the pot',
          'Get your blinds back only',
        ],
        answer: 'Win the pot immediately',
        hint: 'No showdown. The last person standing takes it.',
      },
    ],
  },
  {
    id: 'hand-rankings',
    title: 'What beats what',
    chapter: 'Start here',
    minutes: 7,
    summary: 'A pair beats high card. Two pair beats one pair. A flush beats a straight. Click through the list.',
    widget: 'rankings',
    blocks: [
      {
        type: 'p',
        text: 'At showdown, the ranking is fixed. It does not matter who is bravest. Click the list on the right from the bottom (high card) toward the top (royal flush). You will see most real hands in the bottom half: pairs, two pair, the occasional trips.',
      },
      {
        type: 'list',
        items: [
          'Same category: higher rank wins. Two pair aces-and-fives beats aces-and-threes.',
          'Kickers: leftover cards that break ties. Ace-king vs ace-queen, both with one pair of aces — king wins.',
          'Suits never beat suits in Hold’em. Spades are not “higher” than hearts.',
        ],
      },
      {
        type: 'callout',
        title: 'A set vs trips',
        text: 'If you started with a pair in the hole and a third one hits the board, that is a set. If the board pairs and you have one of that rank, that is trips. Same strength category. Set is just hidden better.',
      },
    ],
    checks: [
      {
        question: 'Which wins: a flush or a straight?',
        kind: 'choice',
        choices: ['Straight', 'Flush', 'They always split', 'Whoever bet more'],
        answer: 'Flush',
        hint: 'Flush is number 5, straight is number 6. Lower number on our list is stronger.',
      },
      {
        question: 'You have one pair. They have two pair. Who wins?',
        kind: 'choice',
        choices: ['You', 'They do', 'The pot splits', 'Whoever has the ace'],
        answer: 'They do',
        hint: 'Two pair always beats one pair.',
      },
      {
        question: 'Do spades beat hearts in Hold’em?',
        kind: 'choice',
        choices: ['Yes', 'No — suits do not rank against each other', 'Only on the river', 'Only in the blinds'],
        answer: 'No — suits do not rank against each other',
        hint: 'Suits make flushes. They do not break ties between different suits.',
      },
    ],
  },
  {
    id: 'betting-actions',
    title: 'Fold, check, call, bet, raise',
    chapter: 'Start here',
    minutes: 6,
    summary: 'Five buttons. That is the whole language of a turn.',
    widget: 'betting',
    blocks: [
      {
        type: 'p',
        text: 'When it is your turn you pick one action. Tap the buttons on the right until each sentence feels obvious. People get fancy later (3-bet, jam, limp). Those are just raises and calls with nicknames.',
      },
      {
        type: 'list',
        items: [
          'Fold: you are done. You cannot win this pot.',
          'Check: stay in for free. Only if nobody has bet yet this street.',
          'Call: match their bet.',
          'Bet: put in the first chips this street.',
          'Raise: they already bet; you make it more.',
        ],
      },
      {
        type: 'callout',
        title: 'A 3-bet is not a third game',
        text: 'Blinds are the first chips. An open is the second bet. A re-raise is the third bet — a “3-bet.” When someone says 3-bet they mean “I re-raised before the flop.”',
      },
    ],
    checks: [
      {
        question: 'Nobody has bet yet. You want to stay in for free. You…',
        kind: 'choice',
        choices: ['Fold', 'Check', 'Call', 'Raise'],
        answer: 'Check',
        hint: 'Check = pass, stay in. Call is only for matching a bet that already exists.',
      },
      {
        question: 'They bet $10. You put in $10. That is a…',
        kind: 'choice',
        choices: ['Check', 'Call', 'Raise', 'Blind'],
        answer: 'Call',
        hint: 'Matching a bet is a call.',
      },
      {
        question: 'They bet $10. You put in $30. That is a…',
        kind: 'choice',
        choices: ['Call', 'Check', 'Raise', 'Fold'],
        answer: 'Raise',
        hint: 'More than their bet = raise.',
      },
    ],
  },
  {
    id: 'blinds-and-chips',
    title: 'Blinds, the pot, and your stack',
    chapter: 'Start here',
    minutes: 6,
    summary: 'Two seats pay before they see cards so there is always something to fight for.',
    widget: 'blinds',
    blocks: [
      {
        type: 'p',
        text: 'If nobody were forced to put chips in, everyone would wait for aces and the game would die. So two seats post blinds: the small blind (half a unit) and the big blind (one unit). Those chips are already in the pot. Change the big-blind number on the right and watch a 100-big-blind stack scale.',
      },
      {
        type: 'list',
        items: [
          'The pot is every chip already in the middle.',
          'Your stack is the chips still in front of you.',
          'We measure in big blinds (bb) so $1/$2 and $5/$10 feel like the same game.',
          'A typical cash stack is 100bb. At $1/$2 that is $200.',
        ],
      },
      {
        type: 'callout',
        title: 'You will be in the blinds every few hands',
        text: 'Those forced chips are why we later “defend” the big blind — you already paid, so the price to see a flop is cheaper than it looks.',
      },
    ],
    checks: [
      {
        question: 'Why do blinds exist?',
        kind: 'choice',
        choices: [
          'To punish new players',
          'To start a pot so someone has a reason to play',
          'To choose the dealer',
          'To replace the flop',
        ],
        answer: 'To start a pot so someone has a reason to play',
        hint: 'Forced money creates something to fight over.',
      },
      {
        question: 'If the big blind is $2, a 100bb stack is…',
        kind: 'number',
        answer: 200,
        hint: '100 × $2 = $200.',
      },
      {
        question: 'The pot is…',
        kind: 'choice',
        choices: ['Your remaining chips', 'The chips already in the middle', 'The next bet', 'The dealer tip'],
        answer: 'The chips already in the middle',
        hint: 'Stack = yours. Pot = the middle.',
      },
    ],
  },
  {
    id: 'what-is-a-range',
    title: 'What “a range” means',
    chapter: 'Start here',
    minutes: 7,
    summary: 'You never know their exact cards. You think in groups of hands they would still play this way.',
    widget: 'rangePlain',
    blocks: [
      {
        type: 'p',
        text: 'Beginners try to guess one hand: “they have aces.” That is almost always wrong. Strong players ask: “of all the hands they would raise from this seat, which ones are still in?” That list is a range.',
      },
      {
        type: 'p',
        text: 'The grid on the right is every starting-hand type. Pairs sit on the diagonal. Suited hands sit above it (AKs = ace-king, same suit). Offsuit hands sit below (AKo = ace-king, different suits). Green means “I raise with this from first seat.” Dark means fold. You are not memorizing tonight. You are learning that strategy is a painted shape, not a single card.',
      },
      {
        type: 'callout',
        title: 'Starting hands comes later',
        text: 'The Starting hands room is this grid with drills. Use it after you finish a few more lessons. If you jump there now, it will feel like a wall of letters. That is normal.',
      },
    ],
    checks: [
      {
        question: 'A range is…',
        kind: 'choice',
        choices: [
          'The exact two cards they hold',
          'The group of hands they might still have',
          'The size of the pot',
          'A type of flush',
        ],
        answer: 'The group of hands they might still have',
        hint: 'You think in groups because you cannot see their cards.',
      },
      {
        question: 'AKs means…',
        kind: 'choice',
        choices: ['Ace-king offsuit', 'Ace-king suited (same suit)', 'Two aces', 'Any ace'],
        answer: 'Ace-king suited (same suit)',
        hint: 's = suited. o = offsuit. AA is a pair of aces.',
      },
      {
        question: 'Why not just guess “they have aces”?',
        kind: 'choice',
        choices: [
          'Aces never get dealt',
          'They usually have a mix of many hands, and aces are rare',
          'Guessing is illegal',
          'Aces always fold',
        ],
        answer: 'They usually have a mix of many hands, and aces are rare',
        hint: 'A pair of aces is 6 combinations out of 1,326. Most raises are something else.',
      },
    ],
  },
  {
    id: 'table-and-positions',
    title: 'The table and positions',
    chapter: 'How the table works',
    minutes: 6,
    summary: 'Why UTG is tight and the button is wide — position is the first leak most players have.',
    widget: 'positions',
    blocks: [
      {
        type: 'p',
        text: 'You already know a hand has streets. Now: where you sit changes how wide you can play. Six seats, clockwise from first to act before the flop: Under the Gun (UTG), Hijack (HJ), Cutoff (CO), Button (BTN), Small Blind (SB), Big Blind (BB). The button token moves one seat left every hand. After the flop, the button acts last — that is the prize seat.',
      },
      {
        type: 'h',
        text: 'Position is information',
      },
      {
        type: 'p',
        text: 'Acting last means you see what everyone else does before you choose. That is worth real money. The button acts last on every postflop street, so it opens the widest. UTG acts first postflop against five unknown ranges, so it opens the tightest.',
      },
      {
        type: 'list',
        items: [
          'Early position (UTG, HJ): play stronger hands. You will often be out of position.',
          'Late position (CO, BTN): steal more. You realize equity better.',
          'Blinds: you are forced in. Defend by pot odds, but you will be out of position.',
        ],
      },
      {
        type: 'callout',
        title: 'A study habit',
        text: 'When you review a hand, say the positions out loud first: “I am CO vs BTN.” Strategy is meaningless without seats.',
      },
    ],
    checks: [
      {
        question: 'Who acts last on the flop, turn, and river?',
        kind: 'choice',
        choices: ['UTG', 'BB', 'Button', 'Small blind'],
        answer: 'Button',
        hint: 'The button is last to act postflop, which is why it is the most profitable seat.',
      },
      {
        question: 'In an unopened pot, who acts first preflop?',
        kind: 'choice',
        choices: ['Button', 'UTG', 'Small blind', 'Big blind'],
        answer: 'UTG',
        hint: 'Preflop starts left of the big blind — under the gun.',
      },
      {
        question: 'Why does UTG open tighter than the button?',
        kind: 'choice',
        choices: [
          'UTG has worse hole cards on average',
          'Five players still to act, often out of position later',
          'The blinds are larger for UTG',
          'UTG cannot 3-bet',
        ],
        answer: 'Five players still to act, often out of position later',
        hint: 'Tighter opens are about players behind and postflop position, not the cards themselves.',
      },
    ],
  },
  {
    id: 'stacks-and-spr',
    title: 'Stacks, pot, and SPR',
    chapter: 'How the table works',
    minutes: 7,
    summary: 'SPR tells you how committed you are. Low SPR loves top pair; high SPR loves implied-odds hands.',
    widget: 'spr',
    blocks: [
      {
        type: 'p',
        text: 'Cash games are usually played 100 big blinds deep. Effective stack is the smaller of the two stacks in the pot — that is all that can go in. The pot is every chip already in the middle.',
      },
      {
        type: 'formula',
        eq: 'SPR = effective stack ÷ pot',
        note: 'Stack-to-pot ratio. After a single raise preflop to 2.5bb and a call, the pot is ~6.5bb and SPR is about 15.',
      },
      {
        type: 'list',
        items: [
          'SPR 1–4 (low): commitment territory. Top pair and overpairs want to get stacks in.',
          'SPR 5–8 (mid): one more street of value. Be careful inflating vs worse.',
          'SPR 13+ (high): room to fold. Suited connectors and small pairs pick up implied odds.',
        ],
      },
      {
        type: 'callout',
        title: 'Why this matters',
        text: 'The same hand — top pair, top kicker — is a stack-off at SPR 3 and a showdown / pot-control hand at SPR 15. Always compute SPR on the flop before you choose a size.',
      },
    ],
    checks: [
      {
        question: 'Pot is $30, effective stack is $90. What is SPR?',
        kind: 'number',
        answer: 3,
        hint: 'SPR = 90 / 30 = 3. That is a low-SPR pot; strong top pair is often committed.',
      },
      {
        question: 'Which hands gain the most from a high SPR?',
        kind: 'choice',
        choices: [
          'Ace-king offsuit',
          'Small pairs and suited connectors',
          'Any ace',
          'King-high',
        ],
        answer: 'Small pairs and suited connectors',
        hint: 'They miss often, but when they flop a set or straight they can win a huge pot.',
      },
      {
        question: 'Effective stack is defined as…',
        kind: 'choice',
        choices: [
          'Your stack always',
          'The larger of the two stacks',
          'The smaller of the two stacks that can still go in',
          'The pot plus your stack',
        ],
        answer: 'The smaller of the two stacks that can still go in',
        hint: 'You cannot win more than the opponent has left.',
      },
    ],
  },
  {
    id: 'pot-odds',
    title: 'Pot odds',
    chapter: 'The money math',
    minutes: 8,
    summary: 'The price the pot is laying you. Every call starts here.',
    widget: 'potOdds',
    blocks: [
      {
        type: 'p',
        text: 'When you face a bet, you are offered a price. You risk the call to win the current pot plus your call. If your chance of winning (equity) is higher than that price, the call prints money — ignoring future cards and implied odds.',
      },
      {
        type: 'formula',
        eq: 'Equity needed = call ÷ (pot + call)',
        note: 'Pot here already includes their bet. If the pot was $100 and they bet $50, pot = $150, call = $50, you need 25%.',
      },
      {
        type: 'p',
        text: 'Another way to say it: you are getting pot:call odds. $150:$50 is 3:1. Convert “X:1” to a percent with 1 / (X + 1). 3:1 → 25%.',
      },
      {
        type: 'callout',
        title: 'Common sizes',
        text: 'Third-pot bet: you need about 20%. Half-pot: 25%. Pot: 33%. Overbet 2x: 40%. Bigger bets demand more equity — or a plan to fold out better hands.',
      },
    ],
    checks: [
      {
        question: 'Pot (including their bet) is $80. You face $20. Equity needed?',
        kind: 'choice',
        choices: ['20%', '25%', '33%', '40%'],
        answer: '20%',
        hint: '20 / (80 + 20) = 20%.',
      },
      {
        question: 'They bet pot. What equity do you need to call (no implied odds)?',
        kind: 'choice',
        choices: ['25%', '33%', '50%', '67%'],
        answer: '33%',
        hint: 'If pot was P and they bet P, current pot is 2P and you call P → P / 3P = 33%.',
      },
      {
        question: 'Getting 4:1 on a call means you need…',
        kind: 'choice',
        choices: ['20%', '25%', '40%', '80%'],
        answer: '20%',
        hint: '1 / (4 + 1) = 20%.',
      },
    ],
  },
  {
    id: 'equity-and-ev',
    title: 'Equity and expected value',
    chapter: 'The money math',
    minutes: 9,
    summary: 'Equity is how often you win. EV is how much a decision is worth.',
    widget: 'ev',
    blocks: [
      {
        type: 'p',
        text: 'Equity is the share of the pot you win on average if the hand goes to showdown and no more money goes in. AK vs QQ is about 43% equity. A flush draw vs a made hand is often ~35% with one card to come, ~36% with two (plus some pairing outs).',
      },
      {
        type: 'formula',
        eq: 'Call EV = equity × (pot + call) − call',
        note: 'You always put the call in. You get pot+call back when you win. Fold EV is 0.',
      },
      {
        type: 'p',
        text: 'A raise has a second term: fold equity. Sometimes you win the pot immediately. Even a hand with 20% showdown equity can be a profitable raise if they fold often enough.',
      },
      {
        type: 'formula',
        eq: 'Raise EV ≈ fold% × pot + (1 − fold%) × (eq × final pot − (1 − eq) × raise)',
        note: 'This is the toy model used in the Math Lab. Real multi-street play is richer, but the structure is the same.',
      },
    ],
    checks: [
      {
        question: 'If fold EV is 0 and call EV is −$4, you should…',
        kind: 'choice',
        choices: ['Call', 'Fold', 'Always raise', 'Check'],
        answer: 'Fold',
        hint: 'Choose the higher EV. 0 beats −4.',
      },
      {
        question: 'Pot is $100 including their bet. You call $50 with 30% equity. Call EV is…',
        kind: 'choice',
        choices: ['−$5', '+$5', '+$10', '0'],
        answer: '−$5',
        hint: '0.30 × $150 − $50 = $45 − $50 = −$5. You need 33% to break even, so 30% is a small loser.',
      },
    ],
  },
  {
    id: 'implied-odds',
    title: 'Implied and reverse implied odds',
    chapter: 'The money math',
    minutes: 8,
    summary: 'When the call is slightly wrong on this street, future money can still make it right — or very wrong.',
    widget: 'implied',
    blocks: [
      {
        type: 'p',
        text: 'Implied odds are the extra chips you expect to win on later streets when you hit. Small pairs chasing a set and suited connectors chasing a monster live on implied odds. Reverse implied odds are the extra chips you lose when you hit and are still beat (top pair vs a set, a flush vs a bigger flush).',
      },
      {
        type: 'formula',
        eq: 'If call EV is −X, you need about X / equity more from future streets',
        note: 'A −$6 call with 20% equity needs roughly $30 more from the opponent when you hit, on average.',
      },
      {
        type: 'list',
        items: [
          'Implied odds get better: deep stacks, opponent is sticky, you are in position, your hand is hidden.',
          'Implied odds get worse: shallow stacks, opponent is nitty, you are out of position, your hand is obvious.',
          'Reverse implied odds: weak aces, dominated broadway, low flushes on two-tone boards.',
        ],
      },
    ],
    checks: [
      {
        question: 'Which hand most wants implied odds?',
        kind: 'choice',
        choices: ['AK on a king-high board', '22 set-mining', 'KQ on ace-high', 'A high flush on a four-flush board'],
        answer: '22 set-mining',
        hint: 'Pairs flop a set ~12% of the time and can stack overpairs when they do.',
      },
      {
        question: 'Reverse implied odds are largest when…',
        kind: 'choice',
        choices: [
          'You have the nuts',
          'You often make a second-best strong hand',
          'The pot is already huge',
          'You are on the button',
        ],
        answer: 'You often make a second-best strong hand',
        hint: 'Weak aces and small flushes get stacked by better versions of the same hand.',
      },
      {
        question: 'Call EV is −$8 and you have 25% equity. About how much extra do you need to win later?',
        kind: 'number',
        answer: 32,
        hint: '8 / 0.25 = $32 of implied money when you get there.',
      },
    ],
  },
  {
    id: 'combinatorics',
    title: 'Combos and blockers',
    chapter: 'Counting hands',
    minutes: 8,
    summary: '1,326 starting-hand combos. Counting them is how ranges become real.',
    widget: 'combos',
    blocks: [
      {
        type: 'p',
        text: 'There are C(52,2) = 1,326 two-card starting hands. Pairs have 6 combos (C(4,2)). Suited hands have 4. Offsuit hands have 12. AA is rare; AKo is three times as common as AKs.',
      },
      {
        type: 'formula',
        eq: 'Pairs 6 · Suited 4 · Offsuit 12 · Total 1,326',
        note: 'A range that “looks” like the same number of grid squares can be very different in combo weight.',
      },
      {
        type: 'p',
        text: 'Dead cards remove combos. If the board is Q♥ 7♣ 2♠, only 3 combos of QQ remain. If you hold A♠, you block AKs (the spade combo) and every offsuit AK that used A♠. Blockers matter most in 3-bet/4-bet pots and river bluffs: the ace of their suit makes it less likely they have the nut flush.',
      },
    ],
    checks: [
      {
        question: 'How many combos does KK have with no dead cards?',
        kind: 'number',
        answer: 6,
        hint: 'C(4,2) = 6.',
      },
      {
        question: 'How many combos does AKs have?',
        kind: 'number',
        answer: 4,
        hint: 'One per suit.',
      },
      {
        question: 'Board is Qh 7c 2s. How many QQ combos remain?',
        kind: 'number',
        answer: 3,
        hint: 'Three queens left: C(3,2) = 3.',
      },
      {
        question: 'Why does holding As make a river spade-bluff better?',
        kind: 'choice',
        choices: [
          'It always has showdown value',
          'It blocks the nut flush in their range',
          'It unblocks pairs',
          'It increases pot odds',
        ],
        answer: 'It blocks the nut flush in their range',
        hint: 'They have fewer nut-flush combos, so they fold more often.',
      },
    ],
  },
  {
    id: 'the-range-grid',
    title: 'The 13×13 range grid',
    chapter: 'Groups of hands',
    minutes: 6,
    summary: 'Pairs on the diagonal, suited above, offsuit below. This is the language of every solver.',
    widget: 'grid',
    blocks: [
      {
        type: 'p',
        text: 'The grid is 13 ranks by 13 ranks. The diagonal is pairs (AA in the corner down to 22). Above the diagonal are suited hands (AKs, AQs, …). Below are offsuit hands (AKo, AQo, …). When someone says “top of range” they mean the upper-left. “Bottom of range” is the lower-right junk.',
      },
      {
        type: 'list',
        items: [
          'Painted green in this app: raise / open / 3-bet.',
          'Painted gold: call / flat / defend.',
          'Dark: fold.',
        ],
      },
      {
        type: 'callout',
        title: 'Do not memorize squares — memorize shape',
        text: 'UTG is a tight triangle in the top-left plus pairs. The button is a large blob that includes most suited hands. If you can sketch the shape, you can reconstruct the chart.',
      },
    ],
    checks: [
      {
        question: 'Where do suited hands sit on the grid?',
        kind: 'choice',
        choices: ['On the diagonal', 'Above the diagonal', 'Below the diagonal', 'Only the first row'],
        answer: 'Above the diagonal',
        hint: 'AKs is one cell right of AA. AKo is one cell below AA.',
      },
      {
        question: 'Which starting hand has the most combos?',
        kind: 'choice',
        choices: ['AA', 'AKs', 'AKo', '22'],
        answer: 'AKo',
        hint: 'Offsuit = 12 combos. Pairs = 6. Suited = 4.',
      },
      {
        question: 'How many unique starting-hand types are on the grid?',
        kind: 'number',
        answer: 169,
        hint: '13 pairs + 78 suited + 78 offsuit = 169.',
      },
    ],
  },
  {
    id: 'linear-vs-polar',
    title: 'Linear vs polar ranges',
    chapter: 'Groups of hands',
    minutes: 7,
    summary: 'C-bets and 3-bets are not “the best hands.” They are a mix of value and air, or a merged continuum.',
    widget: 'polar',
    blocks: [
      {
        type: 'p',
        text: 'A linear (merged) range is the top X% of hands: opens, most c-bets on dry boards, many button flops. A polar range is nuts and air, with the middle missing: river bets, some 3-bets, small-size probes. The middle of a polar range checks — those hands want to get to showdown cheaply.',
      },
      {
        type: 'list',
        items: [
          'Linear: AA–22, AKs–A2s, KQs… a connected block on the grid.',
          'Polar: AA, KK, AKs for value, plus A5s–A2s and 76s as bluffs. The medium pairs flat instead.',
          'Why polarize: a big bet needs either a hand that wants stacks or a hand that is happy to fold out better.',
        ],
      },
      {
        type: 'callout',
        title: 'Size and polarity travel together',
        text: 'Small bets can be linear — you get called by worse and you do not fold out the hands you beat. Large bets should be more polar. If you bomb the river with top pair, you only get called by better.',
      },
    ],
    checks: [
      {
        question: 'A pot-sized river bet should be closer to…',
        kind: 'choice',
        choices: ['Linear', 'Polar', 'Random', 'Only bluffs'],
        answer: 'Polar',
        hint: 'Big bets want nuts-or-air. Medium-strength hands check.',
      },
      {
        question: 'An UTG open is mostly…',
        kind: 'choice',
        choices: ['Polar', 'Linear', 'Only bluffs', 'Only 72o'],
        answer: 'Linear',
        hint: 'You open the strongest hands, not AA and 72o.',
      },
      {
        question: 'In a polar 3-bet range, 99 often…',
        kind: 'choice',
        choices: ['3-bets as a bluff', 'Flats or folds instead of 3-betting thin', 'Always 4-bets', 'Is never in anyone’s range'],
        answer: 'Flats or folds instead of 3-betting thin',
        hint: 'Medium pairs hate building a huge pot out of position vs a tight open.',
      },
    ],
  },
  {
    id: 'preflop-opens',
    title: 'Why opens get wider in position',
    chapter: 'Before the flop',
    minutes: 7,
    summary: 'Study-chart shape: ~14% UTG, ~20% HJ, ~26% CO, ~43% BTN, ~28% SB.',
    widget: 'preflop',
    blocks: [
      {
        type: 'p',
        text: 'In 100bb 6-max cash, a standard open is 2–2.5bb. The later you are, the more you can steal. You also realize more equity postflop, so speculative suited hands become profitable. The small blind opens wider than UTG but tighter than the button because it will be out of position after the flop.',
      },
      {
        type: 'list',
        items: [
          'UTG: pairs, strong aces, KQ, a few suited connectors.',
          'HJ/CO: add more suited aces, suited gappers, offsuit broadway.',
          'BTN: almost any suited hand, many offsuit connectors and weak aces.',
          'SB: similar idea, trimmed for being out of position.',
        ],
      },
      {
        type: 'callout',
        title: 'These charts are study tools',
        text: 'They are original educational approximations, not a commercial solver dump. Learn the shape, then drill it in Range Trainer until you stop thinking about individual hands.',
      },
    ],
    checks: [
      {
        question: 'Which seat opens the widest?',
        kind: 'choice',
        choices: ['UTG', 'HJ', 'SB', 'BTN'],
        answer: 'BTN',
        hint: 'Button has position and only the blinds left to act.',
      },
      {
        question: '76s is most clearly an open from…',
        kind: 'choice',
        choices: ['UTG only', 'Late position (CO/BTN)', 'Never', 'BB only as an open'],
        answer: 'Late position (CO/BTN)',
        hint: 'Suited connectors need position and implied odds. UTG has neither as often.',
      },
      {
        question: 'Why is the SB open tighter than the BTN open?',
        kind: 'choice',
        choices: [
          'SB has a worse stack',
          'SB will be out of position postflop',
          'SB cannot raise',
          'SB already put in 1bb so it should limp',
        ],
        answer: 'SB will be out of position postflop',
        hint: 'You realize less equity out of position, so you need a stronger range.',
      },
    ],
  },
  {
    id: '3bets-and-defense',
    title: '3-bets and blind defense',
    chapter: 'Before the flop',
    minutes: 8,
    summary: '3-bet for value and as a bluff. Defend the BB by price, not by pride.',
    widget: 'threebet',
    blocks: [
      {
        type: 'p',
        text: 'A 3-bet is a re-raise preflop. Versus a tight UTG open you 3-bet a strong linear/polar mix (TT+, AQ+, some Axs). Versus a button steal you 3-bet much wider. Hands that are too good to fold and too medium to 3-bet — 88, KJs, QTs — often call in position and fold or defend cheaper from the blinds.',
      },
      {
        type: 'p',
        text: 'The big blind closes the action. Facing a 2.5bb open the pot is 4.5bb and you call 1.5bb — you only need about 25% pot equity, plus you have implied odds. That is why BB defend charts look enormous. You still fold offsuit junk that plays poorly postflop (K7o, J4o, 92o).',
      },
      {
        type: 'list',
        items: [
          '3-bet value: hands that beat their continue range.',
          '3-bet bluffs: blockers (Axs, Kxs) and hands that play well if called (suited connectors).',
          'BB defend: suited > offsuit, connected > gappy, high cards > low.',
        ],
      },
    ],
    checks: [
      {
        question: 'Facing a 2.5bb open, BB is calling 1.5bb into ~4.5bb. Approx equity needed?',
        kind: 'choice',
        choices: ['15%', '25%', '40%', '50%'],
        answer: '25%',
        hint: '1.5 / (4.5 + 1.5) = 25%.',
      },
      {
        question: 'A5s is a common 3-bet bluff because…',
        kind: 'choice',
        choices: [
          'It always has a pair',
          'It blocks AA/AK and can flop the nut wheel',
          'It has 12 combos',
          'It dominates KK',
        ],
        answer: 'It blocks AA/AK and can flop the nut wheel',
        hint: 'The ace blocker makes their continue range weaker; the wheel is a hidden monster.',
      },
      {
        question: 'Who should defend the widest vs a button open?',
        kind: 'choice',
        choices: ['UTG', 'HJ', 'BB', 'CO'],
        answer: 'BB',
        hint: 'Best price, closes the action, faces the widest open.',
      },
    ],
  },
  {
    id: 'mdf-and-alpha',
    title: 'MDF and bluff frequency',
    chapter: 'Bet sizes',
    minutes: 9,
    summary: 'How often you must continue, and how many bluffs belong in a bet.',
    widget: 'mdf',
    blocks: [
      {
        type: 'p',
        text: 'If you fold too much, any bet they make prints. Minimum defense frequency (MDF) is how often you must continue (call or raise) so that a pure bluff does not profit. If you fold more than 1 − MDF, they can bet 72o for a living.',
      },
      {
        type: 'formula',
        eq: 'MDF = pot ÷ (pot + bet)',
        note: 'Half-pot: MDF = 67%. Pot: 50%. One-third pot: 75%. Small bets require you to continue very often.',
      },
      {
        type: 'p',
        text: 'On the river, a betting range that makes the caller indifferent uses a specific bluff share, called alpha. Value:bluff for a pot-sized bet is 2:1 — two value bets for each bluff (α = 33%).',
      },
      {
        type: 'formula',
        eq: 'α = bet ÷ (pot + 2 × bet)',
        note: 'Third-pot ≈ 20% bluffs. Half-pot ≈ 25%. Pot ≈ 33%. Double pot ≈ 40%.',
      },
    ],
    checks: [
      {
        question: 'Pot $100, bet $50. MDF is…',
        kind: 'choice',
        choices: ['33%', '50%', '67%', '75%'],
        answer: '67%',
        hint: '100 / 150 ≈ 66.7%.',
      },
      {
        question: 'Pot-sized river bet: what fraction of bets should be bluffs (α)?',
        kind: 'choice',
        choices: ['20%', '25%', '33%', '50%'],
        answer: '33%',
        hint: 'bet / (pot + 2bet) = P / 3P = 1/3.',
      },
      {
        question: 'If you fold more than 1 − MDF, opponent’s pure bluffs are…',
        kind: 'choice',
        choices: ['Break-even', 'Unprofitable', 'Profitable', 'Illegal'],
        answer: 'Profitable',
        hint: 'That is the definition of being exploitable to bluffs.',
      },
    ],
  },
  {
    id: 'bet-sizing',
    title: 'Bet sizing and pot geometry',
    chapter: 'Bet sizes',
    minutes: 8,
    summary: 'Size sets both the price and how many streets you can still bet.',
    widget: 'sizing',
    blocks: [
      {
        type: 'p',
        text: 'Pot geometry is the art of choosing sizes so that the last bet can still get stacks in — or so that it cannot. Three streets of ~2/3 pot roughly triples the pot each time and gets 100bb in from a single-raised pot. Tiny flop bets keep SPR high and leave you awkward on the river.',
      },
      {
        type: 'list',
        items: [
          'Small (25–33%): high MDF, linear range, good on dry boards and as a cheap steal.',
          'Medium (50–75%): default value size, works on many textures.',
          'Large / overbet: polar. Nut advantage + fold equity. Use when they have many bluff-catchers.',
        ],
      },
      {
        type: 'callout',
        title: 'Fold equity is a size',
        text: 'A bigger bet folds out more hands but must be bluffed less often (wait — actually α rises with size). Larger bets demand a stronger value region and a higher bluff share. Do not copy a size without copying the range that belongs to it.',
      },
    ],
    checks: [
      {
        question: 'Which size forces the defender to continue most often?',
        kind: 'choice',
        choices: ['33% pot', '75% pot', 'Pot', '2x pot'],
        answer: '33% pot',
        hint: 'MDF = pot/(pot+bet) is highest for the smallest bet.',
      },
      {
        question: 'Overbets should be paired with a range that is…',
        kind: 'choice',
        choices: ['Linear top pair', 'Polar (nuts and air)', 'Any two cards', 'Only draws'],
        answer: 'Polar (nuts and air)',
        hint: 'Huge sizes get called by the top of their range. Medium hands check.',
      },
      {
        question: 'Pot $30, you want ~2/3 pot. Which bet?',
        kind: 'number',
        answer: 20,
        hint: '30 × 2/3 = 20.',
      },
    ],
  },
  {
    id: 'cbet-and-texture',
    title: 'C-bets and board texture',
    chapter: 'After the flop',
    minutes: 8,
    summary: 'How often you c-bet is a function of who hits the board, not a default 100%.',
    widget: 'texture',
    blocks: [
      {
        type: 'p',
        text: 'A continuation bet is a flop bet from the preflop aggressor. You do not c-bet every flop. You c-bet when your range hits the board better than theirs (range advantage) or when the board is so dry that a small bet folds out their air (nut advantage is less important; fold equity is cheap).',
      },
      {
        type: 'list',
        items: [
          'Dry, high boards (A72r, K83r): PFR range has more aces and kings. High-frequency small c-bet.',
          'Connected, low boards (9♣8♣7♥): caller’s range of suited connectors connects. Check more.',
          'Paired boards (J72, 772): lots of air in both ranges; small bets still work.',
          'Two-tone: both ranges pick up equity. Size up with nut-flush advantage, or check more without it.',
        ],
      },
      {
        type: 'callout',
        title: 'Range advantage vs nut advantage',
        text: 'Range advantage (you have more equity overall) likes small, frequent bets. Nut advantage (you have more of the very best hands) likes larger, more polar bets. A72r: range advantage for PFR. 8♠7♠6♦: more nut advantage questions, lower c-bet frequency.',
      },
    ],
    checks: [
      {
        question: 'On A72 rainbow, the preflop raiser’s c-bet frequency should be…',
        kind: 'choice',
        choices: ['Very low', 'High, usually a small size', 'Only all-in', 'Never'],
        answer: 'High, usually a small size',
        hint: 'PFR has more aces; a small bet folds out a lot of air and gets called by worse.',
      },
      {
        question: 'On 987 two-tone, who often has the range advantage?',
        kind: 'choice',
        choices: [
          'Always the 3-bettor',
          'The caller’s connected/suited range connects more',
          'The blinds always',
          'Whoever has AK',
        ],
        answer: 'The caller’s connected/suited range connects more',
        hint: 'PFR is weighted toward overpairs and broadway that missed.',
      },
      {
        question: 'Nut advantage argues for…',
        kind: 'choice',
        choices: ['Tiny linear bets only', 'Larger, more polar bets', 'Checking 100%', 'Limping'],
        answer: 'Larger, more polar bets',
        hint: 'When you have more of the nuts, you can pressure their bluff-catchers for a bigger price.',
      },
    ],
  },
  {
    id: 'multi-street',
    title: 'Multi-street planning',
    chapter: 'After the flop',
    minutes: 8,
    summary: 'Pick a flop size that leaves a turn and river you actually want to play.',
    widget: 'streets',
    blocks: [
      {
        type: 'p',
        text: 'Every flop decision is a plan for three streets. Ask: if I bet here, what do I do on a blank turn? On a scare card? If I check, can I still barrel later? Value hands want a path to three streets when worse can call three times. Bluffs want a path that still has fold equity on the river.',
      },
      {
        type: 'list',
        items: [
          'Value: bet when worse calls. Thin value on the river is the biggest leak for winning players to add.',
          'Bluffs: leftover air that blocks their calling hands, or draws that missed and still have blockers.',
          'Give up: air that does not block, on boards that smashed their range.',
          'Pot control: medium hands at high SPR. Check back flops you cannot barrel three times.',
        ],
      },
      {
        type: 'callout',
        title: 'A one-sentence plan',
        text: '“I bet 1/3 on A72, barrel most kings and blanks, give up on 8-high turns that complete their connectors.” If you cannot say the plan, you are clicking buttons.',
      },
    ],
    checks: [
      {
        question: 'Thin value means…',
        kind: 'choice',
        choices: [
          'Betting a medium-strong hand that worse still calls',
          'Bluffing with air',
          'Folding top pair',
          'Only betting the nuts',
        ],
        answer: 'Betting a medium-strong hand that worse still calls',
        hint: 'River bets with top pair vs a capped range are the classic example.',
      },
      {
        question: 'Best river bluffs usually…',
        kind: 'choice',
        choices: [
          'Have no blockers',
          'Block their calling hands and unblock their folds',
          'Are top set',
          'Are random 72o',
        ],
        answer: 'Block their calling hands and unblock their folds',
        hint: 'As as a bluff vs a missed flush: they have fewer nut flushes and more unpaired folds.',
      },
      {
        question: 'You flop top pair at SPR 15 on a wet board. Default instinct?',
        kind: 'choice',
        choices: [
          'Jam flop always',
          'Plan one or two streets of value; do not auto-stack off',
          'Fold to any bet',
          'Check-fold every turn',
        ],
        answer: 'Plan one or two streets of value; do not auto-stack off',
        hint: 'High SPR + wet texture = plenty of hands that smash you. Size for the plan, not for ego.',
      },
    ],
  },
]

export function lessonsByChapter(): { chapter: string; lessons: Lesson[] }[] {
  const groups: { chapter: string; lessons: Lesson[] }[] = []
  for (const chapter of CHAPTERS) {
    groups.push({ chapter, lessons: LESSONS.filter((l) => l.chapter === chapter) })
  }
  return groups
}

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id)
}

export function nextLesson(id: string): Lesson | undefined {
  const i = LESSONS.findIndex((l) => l.id === id)
  return i >= 0 ? LESSONS[i + 1] : undefined
}

export function prevLesson(id: string): Lesson | undefined {
  const i = LESSONS.findIndex((l) => l.id === id)
  return i > 0 ? LESSONS[i - 1] : undefined
}
