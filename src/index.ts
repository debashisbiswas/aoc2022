import fs from "fs";

const prepareInput = (path: string) => {
  const content = fs.readFileSync(path).toString();
  const lines = content.split("\n");
  return lines;
};

const _1 = () => {
  console.log("Part 1");
  const lines = prepareInput("src/1.txt");

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

const main = () => {
  _1();
};

main();
