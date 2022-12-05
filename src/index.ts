import fs from "fs";

const prepareLevel = (level: number) => {
  const levelString = level.toString().padStart(2, "0");
  console.log(`Day ${level}`);
  return fs.readFileSync(`src/inputs/${levelString}.txt`).toString();
};

const _01 = () => {
  const input = prepareLevel(1).split("\n");

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
  const input = prepareLevel(2)
    .split("\n")
    .filter((value) => value.length != 0);

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
  const input = prepareLevel(3).split("\n");

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
    .split("\n")
    .filter((value) => value.length != 0)
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

const main = () => {
  _01();
  _02();
  _03();
  _04();
};

main();
