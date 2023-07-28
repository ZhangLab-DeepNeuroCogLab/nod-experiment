import "tailwindcss/tailwind.css";
import _ from "lodash";

import { initJsPsych } from "jspsych";
import DemoPlugin from "./demo";
import QuestionsPlugin from "./questions";
import jsPsychPreload from "@jspsych/plugin-preload";
import "./main.css";
import {
  finalInstructions,
  instructions,
  nextExperimentInstructions,
  nextTrainingInstructions,
  thanksInstructions,
} from "./instructions";
import { experimentData } from "./training-data";
import UnsupervisedDemoPlugin from "./unsupervised_demo";

export const serverUrl = "https://novelobjects.sgp1.digitaloceanspaces.com";

const jsPsych = initJsPsych({
  display_element: document.getElementById("app"),
  on_finish: () => {
    const data = jsPsych.data.get().json();
    jatos.endStudy(data);
  },
});

const demoQuestions = {
  type: DemoPlugin,
  families: [
    {
      name: "Cube",
      images: [
        "/images/demo/cube1.gif",
        "/images/demo/cube2.gif",
        "/images/demo/cube3.gif",
      ].map((x) => `${serverUrl}${x}`),
    },
  ],
  duration: 10,
};

const unsupervisedDemo = {
  type: UnsupervisedDemoPlugin,
  images: [
    "/images/demo/cube1.gif",
    "/images/demo/cube2.gif",
    "/images/demo/cube3.gif",
  ].map((x) => `${serverUrl}${x}`),
  duration: 15,
};

const cubeQuestions = {
  type: QuestionsPlugin,
  phase: 0,
  question: {
    image: `${serverUrl}/images/demo/cube2_a60_b300.gif`,
    choices: ["Cube", "Sphere", "Cylinder"],
    answerIdx: 0,
    isAttentionCheck: true,
  },
};

function getQuestions(
  data: string[],
  phase: number,
  choices: string[],
  curriculum: string[]
) {
  const phase1 = data.map((image) => {
    const parts = image.split("/");
    const answer = parts[parts.length - 2];
    const answerIdx = curriculum.indexOf(answer);
    const isAttentionCheck = answer == "cub";
    return {
      type: QuestionsPlugin,
      phase: phase,
      question: {
        image,
        choices: isAttentionCheck ? ["Cube", "Sphere", "Cylinder"] : choices,
        answerIdx,
        isAttentionCheck,
      },
    };
  });

  return phase1;
}

async function runExperiment(set: number): Promise<any[]> {
  const data = await experimentData(set);

  const trials = [
    {
      type: UnsupervisedDemoPlugin,
      duration: 75,
      images: _.shuffle(_.flatten(data.unsupervised_list)),
    },
    {
      type: DemoPlugin,
      duration: 30,
      families: [
        { name: "Adams", images: data.train_list[0] },
        { name: "Bennings", images: data.train_list[1] },
      ],
    },
    {
      type: DemoPlugin,
      duration: 15,
      families: [{ name: "Clark", images: data.train_list[2] }],
    },
    {
      type: DemoPlugin,
      duration: 15,
      families: [{ name: "Davis", images: data.train_list[3] }],
    },

    {
      type: DemoPlugin,
      duration: 15,
      families: [{ name: "Evans", images: data.train_list[4] }],
    },
  ];

  const preload = {
    type: jsPsychPreload,
    images: [
      ...demoQuestions.families[0].images,
      cubeQuestions.question.image,
      _.flatten(data.unsupervised_list),
      _.flatten(data.train_list),
      _.flatten(data.test_list),
    ],
  };

  let timeline = [
    instructions,
    preload,
    unsupervisedDemo,
    nextTrainingInstructions,
    demoQuestions,
    cubeQuestions,
    finalInstructions,
    trials[0],
    nextExperimentInstructions,
    trials[1],
    ...getQuestions(
      data.test_list[0],
      1,
      ["Adams", "Bennings"],
      data.curriculum
    ),
    ...getQuestions(
      data.test_list[1],
      2,
      ["Adams", "Bennings", "Clark"],
      data.curriculum
    ),
    trials[2],
    ...getQuestions(
      data.test_list[2],
      3,
      ["Adams", "Bennings", "Clark", "Davis"],
      data.curriculum
    ),
    trials[3],
    ...getQuestions(
      data.test_list[3],
      4,
      ["Adams", "Bennings", "Clark", "Davis", "Evans"],
      data.curriculum
    ),
    thanksInstructions,
  ];

  return timeline;
}

let set = 53;
console.log(`Using curriculum set ${set}`);
runExperiment(set).then((timeline) => {
  jsPsych.run(timeline);
});
