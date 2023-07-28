import $ from "jquery";
import { JsPsychPlugin, ParameterType, TrialType, JsPsych } from "jspsych";

const info = {
  name: "questions",
  parameters: {
    phase: {
      type: ParameterType.INT,
    },
    question: {
      type: ParameterType.OBJECT,
    },
  },
};

type Info = typeof info;

export type Question = {
  image: string;
  choices: string[];
  answerIndex: number;
  isAttentionCheck: boolean
};

class QuestionsPlugin implements JsPsychPlugin<Info> {
  static info = info;
  private phase: number;
  private rootEl: HTMLElement;
  private question: Question;
  private choices: string[];
  private startTime: number;
  private endTime: number;
  private clickTime: number;
  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    this.phase = trial.phase;
    this.rootEl = display_element;

    this.startTime = performance.now();

    $(this.rootEl).html(
      `<div class="text-center"><h2 class="text-3xl font-medium tracking-wide">Phase ${this.phase}: Which family does the object belong to?</h2></div>`
    );
    this.question = trial.question;
    this.choices = trial.question.choices;

    $(this.rootEl).append(
      `<div class="flex justify-center items-center mt-8 flex-col">
        <div id="banner" class="w-[640px] h-[480px] grid place-items-center">
          <button class="bg-blue-500 text-white py-2 px-4 rounded-md">Load the GIF!</button>
        </div> 
        <form id="form" class="flex flex-col gap-4 mt-8 items-center mb-4">
          <div class="flex gap-8 text-lg">
          ${this.choices
            .map((choice, index) => {
              return `<label class="flex items-center">
              <input type="radio" name="choice" value="${index}" disabled />
              <span class="ml-2">${choice}</span>
            </label>`;
            })
            .join("")}
          </div>
          <button id="submit" disabled class="bg-blue-500 text-white py-2 px-4 rounded-md w-fit disabled:bg-blue-200" type="submit">Submit</button>
        </form>
      </div>`
    );

    $("#banner button").on("click", () => {
      this.clickTime = performance.now();
      $("#banner").html(`<img src="${this.question.image}" />`);
      $("#submit").prop("disabled", false);

      $('input[name="choice"]').prop("disabled", false);
    });

    $("#form").on("submit", (e) => {
      e.preventDefault();
      const choice = $('input[name="choice"]:checked').val();
      if (choice === undefined) {
        alert("Please select an answer");
        return;
      }
      if (this.question.isAttentionCheck) {
        if (choice != 0) {
          alert("Wrong answer! Please try again.");
          return;
        }
      }
      this.endTime = performance.now();
      const data = {
        kind: "question",
        phase: this.phase,
        question: this.question,
        answer: choice,
        startTime: this.startTime,
        endTime: this.endTime,
        clickTime: this.clickTime,
      };
      this.jsPsych.finishTrial(data);
    });
  }
}

export default QuestionsPlugin;
