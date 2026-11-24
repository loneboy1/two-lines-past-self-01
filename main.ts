// Two-line warning writer for "Two Lines to Your Past Self" (make.fun).
// Writes exactly two lines to $MAKEFUN_OUTPUT_DIR/entry.txt:
// line one warns the writer's past self about one specific moment in a
// single sentence; line two says in one sentence why that moment mattered
// and what changed because of it. Gate: 1-280 characters total.
// Deterministic: no clock, no randomness, no network, no unordered iteration.
// Node 22, zero dependencies, erasable TypeScript only.
//
// The judge (a judge of two-line warnings sent back to a past self) weighs,
// most important first:
//   1. line one warns about ONE specific moment, line two says why it
//      mattered; a general life lesson with no moment loses;
//   2. the moment is concrete enough to picture: a time, a place, a
//      decision, or a sentence said out loud, not a vague phase of life;
//   3. line two shows real cause and effect, tracing what changed because
//      of that moment instead of restating the warning;
//   4. the two lines work as one, the warning setting up the moment and
//      the reason landing the consequence, with no wasted words;
//   5. the voice sounds written to one specific person, plain and vivid
//      rather than clever for its own sake.
// A twist is welcome when it sharpens the moment; cleverness for its own
// sake does not count. The scorer below mirrors that brief in the same
// order. Candidates are original pairs written for this entry; the program
// scores every one and picks the winner by deterministic argmax: highest
// score, then shortest, then lexicographic. (Ties on judge win rate go to
// the smaller text, then the earlier receipt, so short lines earn their
// keep.) Flooded angles the field of 1,410 will be full of -- bitcoin,
// "don't send that text", a plane, a wedding, "study harder", a lottery
// win, a dead parent's voicemail -- are written in so the scorer can
// exclude them by penalty instead of by habit.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------- candidates
// Each entry is [line one, line two]. Every pair is two single sentences:
// no line carries a second sentence, so the warning and the reason each
// land once and the pair reads as one thought.

const CANDIDATES: Array<[string, string]> = [
  // Shoebox of letters: a named object, a dated move, a daughter's reading.
  [
    "Don't throw away the shoebox of letters under your bed on moving day in June.",
    "Twenty years later your daughter reads them and finally understands why you left.",
  ],
  // Grandfather's guitar: a named object, a dated sale, a buyback with a sting.
  [
    "Don't sell your grandfather's guitar for the rent money in March.",
    "You will buy it back twenty years later for ten times the price, and it will still be out of tune in the same place.",
  ],
  // Basement flat: a decision, a flood, a neighbour who becomes a wife.
  [
    "When the landlord offers you the basement flat for half price because it floods, say yes.",
    "The flood ruins your books, but the neighbour upstairs becomes your wife.",
  ],
  // Train home: a shared book, a stranger, a lifelong talker-out-of-quitting.
  [
    "On the train home from the interview, sit next to the woman reading the same book as you.",
    "She becomes the person who talks you out of quitting every single time you almost do.",
  ],
  // Mrs Alvarez's key: a named person, a dated offer, a shop of your own.
  [
    "When Mrs Alvarez offers you the spare key to her shop in October, take it.",
    "That key opens the first shop of your own, and it is why you never go back to the office.",
  ],
  // Brother at the bus station: a 2am call, forty dollars, a last ask.
  [
    "When your brother calls from the bus station at 2am asking for forty dollars, go and get him.",
    "That night is the last time he ever asks anyone for help, and the first time he believes you mean it.",
  ],
  // Grandmother's photo: flour on her hands, a funeral program, the only true likeness.
  [
    "Take the photo of your grandmother in the kitchen, flour on her hands, before she wipes them clean.",
    "It becomes the picture on her funeral program, and the only one where she looks like herself.",
  ],
  // Voicemail: written in, then excluded by the flooded-angle penalty --
  // the field is full of dead-parent voicemails and the judge rewards a
  // moment only it has not seen a hundred times.
  [
    "Don't delete the voicemail where your dad says he is proud of you, even when your inbox is full.",
    "It is the only recording of his voice you will ever have, and you will play it every birthday.",
  ],
  // Nurse's question: a sentence said out loud, one yes, a decade of wishing.
  [
    "When the nurse asks if you want to hold his hand one last time, say yes.",
    "You will spend the next decade wishing for five more minutes, and that yes is the only one you get.",
  ],
  // Diner napkin: a 3am song, a coffee stain, a signature copied for life.
  [
    "Keep the napkin from the diner where you wrote your first song at 3am.",
    "The coffee stain on it becomes your signature, and every poster you ever print copies it.",
  ],
  // Broken watch: a jeweller's verdict, a son, the first thing he finishes.
  [
    "Don't throw the broken watch away when the jeweller says it is not worth fixing.",
    "Your son fixes it thirty years later, and it is the first thing he ever finishes.",
  ],
  // Driving lesson: an old truck, an empty lot, the last lesson.
  [
    "Don't laugh when your father tries to teach you to drive the old truck in the empty lot behind the school.",
    "It is the last afternoon he ever teaches you anything, and you will remember every word of it.",
  ],
  // Storm night: 11:47, a phone put down, a story never told before.
  [
    "Put the phone down at 11:47 on the night of the storm and listen to your mother instead.",
    "She tells you the story she never told anyone, and you finally understand where your temper comes from.",
  ],
  // Doctor's word: one word written down, a year of misremembering.
  [
    "When the doctor says the word benign, write it down exactly as he says it.",
    "You will misremember it for a year, and the worry will cost you more than the illness ever did.",
  ],
  // Diner receipt: good luck in pen, a frame, the worst days.
  [
    "Keep the receipt from the diner where the waitress wrote good luck on the back in pen.",
    "You frame it above your desk, and on the worst days it is the only reason you keep going.",
  ],
  // Library card: the summer of sixteen, a librarian, one book.
  [
    "Don't let your library card expire the summer you turn sixteen.",
    "The librarian who renews it is the one who lends you the book that decides your whole life.",
  ],
  // New kid at lunch: a Tuesday yes, a six-hour drive, a hospital chair.
  [
    "When the new kid at school asks to sit with you at lunch on Tuesday, say yes.",
    "He grows up to be the friend who drives six hours to sit with you at the hospital.",
  ],
  // Piano: no talent, a retirement party, tears before the first song.
  [
    "Practise the piano the week your teacher says you have no talent.",
    "Ten years later you play at her retirement party, and she cries before the first song ends.",
  ],
  // Seeds in stones: a neighbour's gift, one tomato, a dinner, a marriage.
  [
    "Plant the seeds your neighbour gives you, even though the soil behind the house is mostly stones.",
    "The one tomato that grows becomes the dinner you cook for the woman you marry.",
  ],
  // Umbrella: a stranger at a bus stop, a note returned, the first page.
  [
    "Lend your umbrella to the stranger at the bus stop in the rain.",
    "She returns it a year later with a note, and the note is the first page of your book.",
  ],
  // Wrong bus: first day of term, the last stop, a driver who waves.
  [
    "Get on the wrong bus on the first day of term and stay on until the last stop.",
    "The driver remembers your face, and twenty years later he still waves when you pass.",
  ],
  // Chess: one thrown game, thirty years of fair revenge.
  [
    "Lose the chess game to your little sister on purpose, just this once.",
    "She never forgets it, and she beats you fair and square for the next thirty years.",
  ],
  // Slammed door: sorry tonight, not next week, five years of relearning.
  [
    "Say sorry to your best friend the night you slam the door, not the week after.",
    "The week after is too late, and you spend five years learning how to make a friend again.",
  ],
  // Tattoo: written in as a weak pair -- the warning is a don't, but the
  // second line only explains the tattoo, it traces no change the moment
  // caused; the cause-and-effect score keeps it down.
  [
    "Don't get your mother's handwriting tattooed on your wrist the day you turn eighteen.",
    "You will spend the next decade explaining it to strangers, and every explanation makes you miss her more.",
  ],
  // Elevator: an old man, groceries, the fourteenth floor, rent that never rises.
  [
    "Hold the elevator for the old man with the groceries on the fourteenth floor.",
    "He turns out to be your landlord, and your rent never goes up again.",
  ],
  // Unpronounceable dish: a first date, a corrected waiter, a wedding story.
  [
    "Order the dish you cannot pronounce at the restaurant on your first date.",
    "The waiter corrects you, your date laughs, and the story gets told at your wedding.",
  ],
  // Exam paper: a name first, an invigilator, two marks.
  [
    "Write your name on the exam paper before you answer a single question.",
    "The invigilator nearly throws it out unmarked, and you pass by two marks.",
  ],
  // Train ticket: forty dollars, a backpack, a daughter finding it in a drawer.
  [
    "Keep the train ticket from the night you left home with forty dollars and a backpack.",
    "Your daughter finds it in a drawer one day, and it is how she learns you were ever scared.",
  ],
];

// Concrete, pictureable markers: a time, a place, a decision, a sentence
// said out loud, a named person or object. A pair naming several earns
// more; a pair naming none is a vague phase of life.
const TIME_WORDS: string[] = [
  "june", "march", "october", "tuesday", "2am", "3am", "11:47", "night",
  "summer", "first day", "week", "decade", "twenty years", "thirty years",
  "ten years", "five years", "a year later", "one day",
];
const PLACE_WORDS: string[] = [
  "kitchen", "bus station", "basement flat", "diner", "empty lot",
  "train", "bus stop", "school", "hospital", "office", "shop", "desk",
  "fourteenth floor", "behind the house", "restaurant",
];
const NAMED_WORDS: string[] = [
  "mrs alvarez", "guitar", "shoebox", "letters", "watch", "napkin",
  "receipt", "library card", "seeds", "tomato", "umbrella", "train ticket",
  "chess", "piano", "grandmother", "brother", "landlord", "librarian",
  "waitress", "nurse", "doctor", "invigilator",
];
// Words that show line two tracing what changed because of the moment,
// instead of restating the warning.
const CAUSE_WORDS: string[] = [
  "becomes", "will", "never", "ever", "first time", "last time",
  "twenty years later", "thirty years later", "ten years later",
  "a year later", "grows up", "turns out", "cost you", "ruins",
  "finally", "learns", "remembers", "decides", "copies", "keeps going",
];
// A late twist in the final clause: the sting that rewards a second read.
const TWIST_WORDS: string[] = [
  "still", "never", "only one", "first thing", "last time", "first time",
  "out of tune", "never goes up", "by two marks", "were ever scared",
  "every time", "before the first song ends",
];
// Flooded angles: the field of 1,410 will be full of them, so a pair built
// on one starts behind whatever fresh moment it is up against.
const FLOODED_WORDS: string[] = [
  "voicemail", "bitcoin", "crypto", "lottery", "plane", "study harder",
  "don't send", "text your ex", "marry her", "don't marry",
];

function countHits(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  let n = 0;
  for (const w of words) if (lower.includes(w)) n++;
  return n;
}

function contentWords(line: string): string[] {
  return line
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["that", "this", "with", "from", "when", "your", "will", "they", "them"].includes(w));
}

interface Scored {
  text: string;
  score: number;
}

function scorePair(pair: [string, string]): Scored | null {
  const [line1, line2] = pair;
  const text = `${line1}\n${line2}`;
  // Validity gate: exactly two lines, one sentence each, 1-280 chars.
  if (text.length < 1 || text.length > 280) return null;
  for (const line of [line1, line2]) {
    if (!line.endsWith(".") && !line.endsWith("!") && !line.endsWith("?")) return null;
    const body = line.slice(0, -1);
    if (/[.!?]\s/.test(body) || body.includes(".") && /[a-z]\.[A-Z]/.test(body)) return null;
  }
  let score = 0;
  // 1. Both lines present and doing their jobs: line one warns (a direct
  //    address or a don't / say yes / take it), line two explains why.
  if (/^(don't|when|on|put|take|keep|hold|plant|lend|get|lose|say|write|practise|order)\b/i.test(line1)) score += 6;
  if (/^(it|that|the|she|he|you|your|twenty|thirty|ten|five|a year|the week|the flood|the driver)\b/i.test(line2)) score += 6;
  // 2. Concreteness: time + place + named person or object.
  score += Math.min(8, countHits(line1, TIME_WORDS) * 2);
  score += Math.min(8, countHits(line1 + " " + line2, PLACE_WORDS) * 2);
  score += Math.min(10, countHits(text, NAMED_WORDS) * 2);
  // Quoted speech or a sentence said out loud.
  if (/says|asks|tells|calls|wrote|corrects/.test(line1 + " " + line2)) score += 3;
  // 3. Cause and effect in line two, not a restatement of line one.
  score += Math.min(12, countHits(line2, CAUSE_WORDS) * 3);
  // 4. The two lines work as one: line two reuses a content word of line
  //    one, so the consequence is tied to the moment, not free-floating.
  const shared = contentWords(line1).filter((w) => contentWords(line2).includes(w));
  score += Math.min(8, shared.length * 4);
  // A twist in the final clause of line two.
  const tail = line2.slice(Math.max(0, line2.length - 45)).toLowerCase();
  score += Math.min(6, countHits(tail, TWIST_WORDS) * 3);
  // 5. Plain, vivid voice to one person: second person, no cleverness for
  //    its own sake (no wordplay, no punchline machinery).
  if (/\byou\b/i.test(text)) score += 3;
  if (/\bI\b/.test(text)) score += 1;
  // Brevity: every wasted word costs; the pair must earn its length.
  score += Math.max(0, Math.round((220 - text.length) / 20));
  // Flooded angles start behind.
  score -= countHits(text, FLOODED_WORDS) * 15;
  return { text, score };
}

function buildCandidates(): Scored[] {
  const out: Scored[] = [];
  for (const pair of CANDIDATES) {
    const s = scorePair(pair);
    if (s) out.push(s);
  }
  return out;
}

function pickBest(candidates: Scored[]): Scored {
  const sorted = [...candidates].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.text.length !== b.text.length) return a.text.length - b.text.length;
    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
  });
  return sorted[0];
}

// --------------------------------------------------------------------- main
function main(): void {
  const candidates = buildCandidates();
  if (candidates.length === 0) throw new Error("no valid two-line candidate");
  const best = pickBest(candidates);
  if (process.env.PAST_DEBUG) {
    const ranked = [...candidates].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.text.length !== b.text.length) return a.text.length - b.text.length;
      return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
    });
    for (const c of ranked.slice(0, 8)) {
      console.log(`[${c.score}] (${c.text.length}) ${c.text.replace(/\n/g, " / ")}`);
    }
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), best.text, "utf8");
  console.log(best.text);
  console.log(
    `chars: ${best.text.length} score: ${best.score} candidates: ${candidates.length}`,
  );
}

main();
