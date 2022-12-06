import { existsSync, readFileSync } from "fs";
import { EOL } from "os";
import path from "path";

const prepareLevel = (level: number): string[] => {
  const levelString = level.toString().padStart(2, "0");
  const filePath = path.join("src", "inputs", `${levelString}.txt`);

  console.log(`Day ${levelString} (${filePath})`);

  if (existsSync(filePath)) {
    const input = readFileSync(filePath).toString().split(EOL);

    // The EOL split can leave an empty line at the end of the array, which is
    // not part of the input. Remove it.
    if (input.at(-1)?.length === 0) {
      input.pop();
    }

    return input;
  } else {
    console.log(`Could not read ${filePath}`);
  }

  return [];
};

const _01 = () => {
  const input = prepareLevel(1);

  const groups: number[][] = [];
  let buffer: number[] = [];
  for (const line of input) {
    if (line.length === 0) {
      groups.push(buffer);
      buffer = [];
    } else {
      buffer.push(+line);
    }
  }

  const totals = [];
  for (const group of groups) {
    const total = group.reduce((total, current) => total + current, 0);
    totals.push(total);
  }

  // Part 1
  console.log(Math.max(...totals));

  // Part 2
  totals.sort((a, b) => a - b);
  const [one, two, three] = totals.slice(-3);
  console.log(one + two + three);
};

const _02 = () => {
  const input = prepareLevel(2);

  const myOptions = { Rock: "X", Paper: "Y", Scissors: "Z" };
  const opponentOptions = { Rock: "A", Paper: "B", Scissors: "C" };
  const resultOptions = { Lose: "X", Draw: "Y", Win: "Z" };
  const outcomePoints = { Lose: 0, Draw: 3, Win: 6 };
  const selectionPoints = {
    [myOptions.Rock]: 1,
    [myOptions.Paper]: 2,
    [myOptions.Scissors]: 3,
  };
  const outcomes = {
    Lose: {
      [opponentOptions.Rock]: myOptions.Scissors,
      [opponentOptions.Paper]: myOptions.Rock,
      [opponentOptions.Scissors]: myOptions.Paper,
    },
    Draw: {
      [opponentOptions.Rock]: myOptions.Rock,
      [opponentOptions.Paper]: myOptions.Paper,
      [opponentOptions.Scissors]: myOptions.Scissors,
    },
    Win: {
      [opponentOptions.Rock]: myOptions.Paper,
      [opponentOptions.Paper]: myOptions.Scissors,
      [opponentOptions.Scissors]: myOptions.Rock,
    },
  } as const;

  let totalScore = 0;
  let totalScore2 = 0;
  for (const line of input) {
    const [opponent, me] = line.split(" ");

    totalScore += selectionPoints[me];
    totalScore += {
      [myOptions.Rock]: {
        [opponentOptions.Rock]: 3,
        [opponentOptions.Paper]: 0,
        [opponentOptions.Scissors]: 6,
      },
      [myOptions.Paper]: {
        [opponentOptions.Rock]: 6,
        [opponentOptions.Paper]: 3,
        [opponentOptions.Scissors]: 0,
      },
      [myOptions.Scissors]: {
        [opponentOptions.Rock]: 0,
        [opponentOptions.Paper]: 6,
        [opponentOptions.Scissors]: 3,
      },
    }[me][opponent];

    // Part 2
    const result = me;
    let myMove;
    switch (result) {
      case resultOptions.Lose:
        totalScore2 += outcomePoints.Lose;
        myMove = outcomes.Lose[opponent];
        break;
      case resultOptions.Win:
        totalScore2 += outcomePoints.Win;
        myMove = outcomes.Win[opponent];
        break;
      default:
        totalScore2 += outcomePoints.Draw;
        myMove = outcomes.Draw[opponent];
        break;
    }
    totalScore2 += selectionPoints[myMove];
  }

  console.log(totalScore);
  console.log(totalScore2);
};

const _03 = () => {
  const input = prepareLevel(3);

  const getPriority = (itemType: string) => {
    // Map lowercase values to 1 - 26...
    if (itemType === itemType.toLowerCase()) {
      // ASCII 'a' is 97.
      return itemType.charCodeAt(0) - 96;
    }
    // and uppercase values to 27 - 52.
    else {
      // ASCII 'A' is 65.
      return itemType.charCodeAt(0) - 65 + 27;
    }
  };

  // Each line will always have an even number of characters.
  const partOneResult = input
    .map((line) => [
      new Set([...line.slice(0, line.length / 2)]),
      new Set([...line.slice(line.length / 2, line.length)]),
    ])
    .flatMap(([first, second]) =>
      Array.from(first).filter((e) => second.has(e))
    )
    .map(getPriority)
    .reduce((accumulator, current) => (accumulator += current), 0);

  console.log(partOneResult);

  // Part 2
  // Group in sets of 3.
  let groups: string[][] = [];
  let temp: string[] = [];
  for (const line of input) {
    if (temp.length === 3) {
      groups.push(temp);
      temp = [];
    }
    temp.push(line);
  }

  const part2Result = groups
    .map(([first, second, third]) => [
      new Set([...first]),
      new Set([...second]),
      new Set([...third]),
    ])
    .flatMap(([first, second, third]) =>
      Array.from(first).filter((e) => second.has(e) && third.has(e))
    )
    .map(getPriority)
    .reduce((accumulator, current) => (accumulator += current), 0);

  console.log(part2Result);
};

const _04 = () => {
  const input = prepareLevel(4);

  const ranges = input
    .map((line) => line.split(","))
    .map(([first, second]) => {
      const [beginA, endA] = first.split("-");
      const [beginB, endB] = second.split("-");
      return [
        { begin: +beginA, end: +endA },
        { begin: +beginB, end: +endB },
      ];
    });

  const part1Result = ranges.filter(
    ([rangeA, rangeB]) =>
      (rangeA.begin <= rangeB.begin && rangeA.end >= rangeB.end) ||
      (rangeB.begin <= rangeA.begin && rangeB.end >= rangeA.end)
  );
  console.log(part1Result.length);

  const part2Result = ranges.filter(
    ([rangeA, rangeB]) =>
      (rangeB.begin <= rangeA.begin && rangeA.begin <= rangeB.end) ||
      (rangeB.begin <= rangeA.end && rangeA.end <= rangeB.end) ||
      (rangeA.begin <= rangeB.begin && rangeB.begin <= rangeA.end) ||
      (rangeA.begin <= rangeB.end && rangeB.end <= rangeA.end)
  );
  console.log(part2Result.length);
};

const _05 = () => {
  /* Given starting position:

     [M] [H]         [N]
     [S] [W]         [F]     [W] [V]
     [J] [J]         [B]     [S] [B] [F]
     [L] [F] [G]     [C]     [L] [N] [N]
     [V] [Z] [D]     [P] [W] [G] [F] [Z]
     [F] [D] [C] [S] [W] [M] [N] [H] [H]
     [N] [N] [R] [B] [Z] [R] [T] [T] [M]
     [R] [P] [W] [N] [M] [P] [R] [Q] [L]
      1   2   3   4   5   6   7   8   9
 */

  const initialStacks = [
    ["R", "N", "F", "V", "L", "J", "S", "M"],
    ["P", "N", "D", "Z", "F", "J", "W", "H"],
    ["W", "R", "C", "D", "G"],
    ["N", "B", "S"],
    ["M", "Z", "W", "P", "C", "B", "F", "N"],
    ["P", "R", "M", "W"],
    ["R", "T", "N", "G", "L", "S", "W"],
    ["Q", "T", "H", "F", "N", "B", "V"],
    ["L", "M", "H", "Z", "N", "F"],
  ];

  // deep copy
  let workingStacks = initialStacks.map((array) => array.slice());

  const input = prepareLevel(5);

  for (const line of input) {
    // format: move (count) from (src) to (dest)

    // Yes, the parseInt function is not passed directly to map on purpose:
    // https://stackoverflow.com/questions/262427/why-does-parseint-yield-nan-with-arraymap
    let [count, src, dest] = line
      .match(/\d+/g)
      ?.map((s) => parseInt(s)) as number[];

    for (let i = 0; i < count; i++) {
      workingStacks[dest - 1].push(workingStacks[src - 1].pop() || "");
    }
  }

  const part1Result = workingStacks.flatMap((stack) => stack.at(-1));
  console.log(part1Result.join(""));

  // Part 2
  workingStacks = initialStacks.map((array) => array.slice());

  for (const line of input) {
    let [count, src, dest] = line
      .match(/\d+/g)
      ?.map((s) => parseInt(s)) as number[];

    workingStacks[dest - 1].push(
      ...workingStacks[src - 1].splice(-count, count)
    );
  }
  const part2Result = workingStacks.flatMap((stack) => stack.at(-1));
  console.log(part2Result.join(""));
};

const _06 = () => {
  const input = prepareLevel(6)[0];

  const solve = (bufferSize: number) => {
    const ringBuffer = [];

    for (let i = 0; i < input.length; i++) {
      ringBuffer[i % bufferSize] = input[i];
      if (new Set([...ringBuffer]).size === bufferSize) return i + 1;
    }
  };

  console.log(solve(4));
  console.log(solve(14));
};

const main = () => {
  _01();
  _02();
  _03();
  _04();
  _05();
  _06();
};

main();
