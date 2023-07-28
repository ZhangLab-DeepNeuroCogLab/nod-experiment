const serverUrl = "https://novelobjects.sgp1.digitaloceanspaces.com";
const originalServerUrl = "https://humancurriculum.s3.amazonaws.com";

import _ from "lodash";

export interface TrainingData {
  curriculum: string[];
  train_list: string[][];
  test_list: string[][];
  unsupervised_list: string[][];
}

export async function experimentData(set: number): Promise<TrainingData> {
  const response = await fetch(`${serverUrl}/data/set_${set}.json`);
  const data: TrainingData = await response.json();

  // data.train_list contains six elements
  // split it into two groups of three

  data.test_list = data.test_list.map((x) =>
    x.map((y) => `${originalServerUrl}/${y}.gif`)
  );

  data.unsupervised_list = data.unsupervised_list.map((x, idx) =>
    x.map(
      (y) =>
        `${originalServerUrl}/novel_rotating_gif_compressed/${data.curriculum[idx]}/${y}.gif`
    )
  );

  let train_list = [];
  data.train_list.forEach((x) => {
    x.forEach((y) => {
      train_list.push(y);
    });
  });

  data.train_list = _.chunk(train_list, 3).map((x, idx) =>
    x.map(
      (y) =>
        `${originalServerUrl}/novel_rotating_gif_compressed/${data.curriculum[idx]}/${y}.gif`
    )
  );

  return data;
}
