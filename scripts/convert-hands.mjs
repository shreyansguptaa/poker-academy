import fs from 'node:fs'
import path from 'node:path'

const rawDir = path.resolve('data/raw')
const outFile = path.resolve('src/data/hands.json')

function parseCards(text) {
  const m = [...text.matchAll(/[2-9TJQKA][shdc]/g)]
  return m.map((x) => x[0])
}

function parseStarsFile(text, source) {
  const chunks = text.split(/PokerStars Hand #/).slice(1)
  const hands = []
  for (const chunk of chunks) {
    const block = `PokerStars Hand #${chunk}`
    const idm = block.match(/PokerStars Hand #(\d+)/)
    const stake = block.match(/Hold'em No Limit \((\d+)\/(\d+)\)/)
    const btn = block.match(/Seat #(\d+) is the button/)
    if (!idm || !stake || !btn) continue
    const seats = []
    for (const line of block.matchAll(/Seat (\d+): (\S+) \((\d+)/g)) {
      seats.push({ seat: Number(line[1]), name: line[2], stack: Number(line[3]) })
    }
    const holes = {}
    for (const line of block.matchAll(/Dealt to (\S+) \[([^\]]+)\]/g)) {
      holes[line[1]] = parseCards(line[2])
    }
    const actions = []
    let street = 'preflop'
    const board = []
    const lines = block.split('\n')
    for (const raw of lines) {
      const line = raw.trim()
      if (line.startsWith('*** FLOP')) {
        street = 'flop'
        board.push(...parseCards(line))
        continue
      }
      if (line.startsWith('*** TURN')) {
        street = 'turn'
        const parts = line.split(']')
        const last = parts[parts.length - 1] || line
        const extra = parseCards(last)
        if (extra.length) board.push(extra[extra.length - 1])
        continue
      }
      if (line.startsWith('*** RIVER')) {
        street = 'river'
        const parts = line.split(']')
        const last = parts[parts.length - 1] || line
        const extra = parseCards(last)
        if (extra.length) board.push(extra[extra.length - 1])
        continue
      }
      if (line.startsWith('*** SUMMARY') || line.startsWith('*** SHOW') || line.startsWith('Uncalled')) break
      if (line.includes('posts small blind')) {
        const name = line.split(':')[0]
        const amt = Number(line.match(/(\d+)\s*$/)?.[1] || 0)
        actions.push({ street: 'preflop', player: name, type: 'post', amount: amt })
        continue
      }
      if (line.includes('posts big blind')) {
        const name = line.split(':')[0]
        const amt = Number(line.match(/(\d+)\s*$/)?.[1] || 0)
        actions.push({ street: 'preflop', player: name, type: 'post', amount: amt })
        continue
      }
      const act = line.match(/^(\S+): (folds|checks|calls|bets|raises)(.*)$/)
      if (!act) continue
      const name = act[1]
      const verb = act[2]
      const rest = act[3]
      if (verb === 'folds') actions.push({ street, player: name, type: 'fold' })
      else if (verb === 'checks') actions.push({ street, player: name, type: 'check' })
      else if (verb === 'calls') {
        const amt = Number(rest.match(/(\d+)/)?.[1] || 0)
        actions.push({ street, player: name, type: 'call', amount: amt })
      } else if (verb === 'bets') {
        const amt = Number(rest.match(/(\d+)/)?.[1] || 0)
        actions.push({ street, player: name, type: 'bet', amount: amt })
      } else if (verb === 'raises') {
        const to = Number(rest.match(/to (\d+)/)?.[1] || rest.match(/(\d+)/)?.[1] || 0)
        actions.push({ street, player: name, type: 'raise', amount: to })
      }
    }
    if (seats.length < 2 || actions.length < 3) continue
    hands.push({
      id: `pluribus-${idm[1]}`,
      source,
      event: 'Pluribus vs humans (Brown & Sandholm, Science 2019)',
      stakes: { sb: Number(stake[1]), bb: Number(stake[2]) },
      buttonSeat: Number(btn[1]),
      players: seats.map((s) => ({
        ...s,
        hole: holes[s.name] ?? [],
      })),
      board,
      actions,
    })
  }
  return hands
}

function parseDwan() {
  return {
    id: 'dwan-ivey-2009',
    source: 'phh-dataset / Full Tilt Million Dollar Cash Game',
    event: 'Tom Dwan vs Phil Ivey, 2009 (televised million-dollar pot)',
    stakes: { sb: 1000, bb: 2000 },
    buttonSeat: 3,
    players: [
      { seat: 1, name: 'Phil Ivey', stack: 1125600, hole: ['Ac', '2d'] },
      { seat: 2, name: 'Patrik Antonius', stack: 2000000, hole: [] },
      { seat: 3, name: 'Tom Dwan', stack: 553500, hole: ['7h', '6h'] },
    ],
    board: ['Jc', '3d', '5c', '4h', 'Jh'],
    actions: [
      { street: 'preflop', player: 'Phil Ivey', type: 'post', amount: 500 },
      { street: 'preflop', player: 'Patrik Antonius', type: 'post', amount: 500 },
      { street: 'preflop', player: 'Tom Dwan', type: 'post', amount: 500 },
      { street: 'preflop', player: 'Phil Ivey', type: 'post', amount: 1000 },
      { street: 'preflop', player: 'Patrik Antonius', type: 'post', amount: 2000 },
      { street: 'preflop', player: 'Tom Dwan', type: 'raise', amount: 7000 },
      { street: 'preflop', player: 'Phil Ivey', type: 'raise', amount: 23000 },
      { street: 'preflop', player: 'Patrik Antonius', type: 'fold' },
      { street: 'preflop', player: 'Tom Dwan', type: 'call', amount: 16000 },
      { street: 'flop', player: 'Phil Ivey', type: 'bet', amount: 35000 },
      { street: 'flop', player: 'Tom Dwan', type: 'call', amount: 35000 },
      { street: 'turn', player: 'Phil Ivey', type: 'bet', amount: 90000 },
      { street: 'turn', player: 'Tom Dwan', type: 'raise', amount: 232600 },
      { street: 'turn', player: 'Phil Ivey', type: 'raise', amount: 1067100 },
      { street: 'turn', player: 'Tom Dwan', type: 'call', amount: 834500 },
    ],
  }
}

function interesting(hand) {
  const voluntary = hand.actions.filter((a) => a.type !== 'post')
  const wentFlop = hand.board.length >= 3
  const hadRaise = voluntary.some((a) => a.type === 'raise' || a.type === 'bet')
  const hadCall = voluntary.some((a) => a.type === 'call')
  return wentFlop || (hadRaise && hadCall)
}

function pickHero(hand) {
  const scores = new Map()
  for (const p of hand.players) scores.set(p.name, 0)
  for (const a of hand.actions) {
    if (a.type === 'post' || a.type === 'fold') continue
    scores.set(a.name ?? a.player, (scores.get(a.player) ?? 0) + (a.type === 'check' ? 1 : 3))
  }
  let best = hand.players[0].name
  let bestScore = -1
  for (const [name, score] of scores) {
    if (score > bestScore && hand.players.some((p) => p.name === name && p.hole.length === 2)) {
      best = name
      bestScore = score
    }
  }
  return best
}

const all = []
for (const file of fs.readdirSync(rawDir)) {
  if (!file.startsWith('pluribus_') || !file.endsWith('.txt')) continue
  const text = fs.readFileSync(path.join(rawDir, file), 'utf8')
  all.push(...parseStarsFile(text, `Pluribus session ${file}`))
}

const kept = []
const seenBoards = new Set()
for (const hand of all) {
  if (!interesting(hand)) continue
  const key = `${hand.board.join('')}|${hand.actions.length}`
  if (seenBoards.has(key)) continue
  seenBoards.add(key)
  kept.push({ ...hand, hero: pickHero(hand) })
  if (kept.length >= 48) break
}

kept.unshift({ ...parseDwan(), hero: 'Tom Dwan' })

fs.writeFileSync(outFile, JSON.stringify(kept, null, 2))
console.log('wrote', kept.length, 'hands to', outFile)
console.log(
  'flop+',
  kept.filter((h) => h.board.length >= 3).length,
  'heroes',
  [...new Set(kept.map((h) => h.hero))].join(', '),
)
