import fs from "fs";
import { join } from "path";

const prepareInput = (path: string) => {
  const content = fs.readFileSync(path).toString();
  const lines = content.split("\n");
  return lines;
};

const _01 = () => {
  console.log("Part 1");
  const lines = prepareInput("src/inputs/01.txt");

  const groups: number[][] = [];
  let buffer: number[] = [];
  for (const line of lines) {
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
  console.log("Part 2");
  let lines = prepareInput("src/inputs/02.txt");
  lines = lines.filter((value) => value.length != 0);

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
  for (const line of lines) {
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

const main = () => {
  _01();
  _02();
};

main();
