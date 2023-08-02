const fs = require('fs');
const _ = require('lodash');
const path = require('path');


function readFileContents(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    // Use the parsed object or array as needed
    return data;
  } catch (error) {
    console.error('Error reading or parsing file:', error);
  }
}



function getCurriculum(data) {
  let families = _.flatten(data.filter(i => i.families != undefined).map(i => i.families));

  families = families.filter(i => i.name != 'Cube').map(i => i.images[0].split('/')[4])

  return families
}

function phaseAccuracy(data, phase) {
  let questions = data.filter(i => i.kind && i.kind == "question" && i.phase == phase);
  questions = questions.filter(i => !i.question.isAttentionCheck);

  return questions.filter(i => Number(i.answer) == i.question.answerIdx).length / questions.length;
}

function phaseForgetfullness(data, phase) {
  let curr = getCurriculum(data);
  let questions = data.filter(i => i.kind && i.kind == "question" && i.phase == phase);
  questions = questions.filter(i => !i.question.isAttentionCheck).filter(i => {
    let cat = i.question.image.split('/')[4];
    return cat == curr[0] || cat == curr[1]
  });

  let x = questions.filter(i => Number(i.answer) == i.question.answerIdx).length / questions.length;
  return x
}


function getAccuracy(data) {
  return [1, 2, 3, 4].map(x => phaseAccuracy(data, x));
}

function getForgetfulness(data) {
  let z = [1, 2, 3, 4].map(x => phaseForgetfullness(data, x));
  return z.map(x => x - z[0]);
}

function getReactionTime(data) {
  let attention = data.filter(i => i.kind && i.kind == "question" && i.question.isAttentionCheck);
  attention = attention.filter(a => a.phase > 0).map(a => a.endTime - a.clickTime);
  attention = attention.map(i => i / 1000).map(i => Math.round(i * 100) / 100);
  const avg =  attention.reduce((a, b) => a + b, 0) / attention.length;
  return Math.round(avg * 100) / 100;
}

function parseData(data) {

  return {
    curriculum: getCurriculum(_.cloneDeep(data)),
    accuracy: getAccuracy(_.cloneDeep(data)).map(i => Math.round(i * 100) / 100),
    forgetfulness: getForgetfulness(_.cloneDeep(data)).map(i => Math.round(i * 100) / 100),
    reactionTime: getReactionTime(_.cloneDeep(data))
  }
}


function readDetails() {
  let details = readFileContents('metadata.json');


  details = details.data[0].studyResults;


  return details.map(d => [d.id, path.resolve(process.cwd(), `study_result_${d.id}`, `comp-result_${d.componentResults[0].id}/data.txt`)]);
}

const str = (JSON.stringify(readDetails().map(i => {
  return {
    id: i[0],
    ...parseData(readFileContents(i[1]))
  };
})));

const prompts = require('prompts');

(async () => {
  // get filename and write to file
  const response = await prompts({
    type: 'text',
    name: 'filename',
    message: 'File name?'
  });

  fs.writeFileSync(`${response.filename}.json`, str);
})();