// print data/set-${x}.json where x is read as argument
const _ = require("lodash");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Usage: node generate.js <number>");
  process.exit(1);
}

const set = parseInt(args[0]);

if (isNaN(set)) {
  console.error("Argument must be a number");
  process.exit(1);
}

// read data/set-${set}.json as json object into variable data
const data = require(`./data/set_${set}.json`);

const curriculums = data.curriculum;

const train_list = _.chunk(_.flattenDeep(data.train_list), 3);

const unsupervised_list = curriculums.map((curriculum, idx) => {
  // get list of files from novel_rotating_gif_compressed/${curriculum} and remove extension
  const files = fs
    .readdirSync(
      path.join(__dirname, `novel_rotating_gif_compressed/${curriculum}`)
    )
    .map((file) => file.split(".")[0]);

  // get entries in files that is not in train_list[idx]
  const unsupervised = _.difference(files, train_list[idx]);
  // get one random entry from train_list[idx]
  const supervised = _.sample(train_list[idx]);

  // return merged array of supervised and unsupervised
  return _.shuffle([...unsupervised, supervised]);
});

data.unsupervised_list = unsupervised_list;

// write data/set-${set}.json
fs.writeFileSync(
  path.join(__dirname, `data/set_${set}.json`),
  JSON.stringify(data, null, 2)
);
