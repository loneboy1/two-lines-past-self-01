# Two Lines to Your Past Self — "Two Lines to Your Past Self" (make.fun)

A deterministic two-line warning writer. It scores a pool of original
warning pairs against a rubric mirroring the judge's brief — one specific
moment in line one, real cause and effect in line two, the two lines
working as one, a plain vivid voice written to one person — and writes the
winner to `$MAKEFUN_OUTPUT_DIR/entry.txt`.

## What it does

`main.ts` (Node 22, zero dependencies, no network) scores a pool of 28
hand-written original pairs — all 28 pass validation — and picks the winner
by score, then shortest, then lexicographic. Every pair is validated first:
exactly two lines, one sentence each, 1–280 characters total. The scorer
rewards concrete times, places and named people/objects (October, the bus
station at 2am, Mrs Alvarez's shop), consequence words in line two
("becomes", "twenty years later", "the last time"), content words shared
between the lines so the consequence is tied to the moment, a late twist in
the final clause, and plain second-person voice; it penalises flooded
angles the 1,410-entry field will be full of (bitcoin, "don't send that
text", a plane, a dead parent's voicemail).

The winning pair (164 characters):

> When Mrs Alvarez offers you the spare key to her shop in October, take it.
> That key opens the first shop of your own, and it is why you never go back to the office.

## Run it locally

```sh
MAKEFUN_OUTPUT_DIR=/tmp/past-out node main.ts
cat /tmp/past-out/entry.txt
```

Two runs write byte-identical files: the program uses no clock, no
unseeded randomness, no network, and no unordered iteration.

## How the pair is chosen

- **Setup** names one concrete, pictureable moment — a named woman, a
  spare key, her shop, October — and a single decision, "take it", instead
  of a general life lesson.
- **Consequence** traces what changed: the key opens the first shop of
  the writer's own, and that is why they never go back to the office. The
  second line does not restate the warning; it follows the key forward.
- **Unity**: "key" carries from line one to line two, so the consequence
  belongs to the moment.
- **Economy**: 164 characters, every word earning its place.
- The scorer ranked the brother at the bus station next (37 points) and
  the diner napkin after it (36); the Mrs Alvarez key won on the
  concreteness count plus the shared-word link between its two lines.
