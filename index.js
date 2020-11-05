"use strict";
const animation = require("./animation");
const readline = require("readline");

const toTerm = (frameGrid) => {
  const cutTop =
    process.stdout.rows >= animation.FRAME_HEIGHT
      ? 0
      : process.stdout.rows * 0.5 * 0.5;

  console.log(process.stdout.rows > animation.FRAME_HEIGHT);
  console.log(process.stdout.rows - animation.FRAME_HEIGHT);
  console.log(process.stdout.rows);

  return frameGrid
    .slice(cutTop, -cutTop || void 0)
    .reduce(
      (frame, row) =>
        (frame +=
          row
            .padStart(
              row.length + process.stdout.columns / 2,
              animation.spaceDot
            )
            .padEnd(row.length + process.stdout.columns, animation.spaceDot) +
          "\n"),
      ""
    )
    .trim();
};

const waitFor = (milli) => new Promise((r) => setTimeout(r, milli));

const clearConsole = async () => {
  const code = await new Promise((r) => {
    console.clear();
    readline.clearScreenDown(process.stdout, r);
  });

  return void readline.cursorTo(process.stdout, 0, 0) || code;
};

const animate = async () => {
  while (true) {
    for (const frame of animation) {
      await clearConsole();
      readline.cursorTo(process.stdout, 0, 0);
      process.stdout.write(toTerm(frame));
      // console.log(toTerm(frame));
      await waitFor(100);
    }
  }
};
// console.log(toTerm(animation[0]));
// console.log(animation[0].join("\n"));
animate();

process.on("SIGINT", () => clearConsole().then(process.exit));
