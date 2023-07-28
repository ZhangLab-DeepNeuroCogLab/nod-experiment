import $ from "jquery";
import { JsPsychPlugin, ParameterType, TrialType, JsPsych } from "jspsych";
import randomInteger from "random-int";
import { serverUrl } from "./main";

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const info = {
  name: "unsupervised_demo",
  parameters: {
    images: {
      type: ParameterType.OBJECT,
      default: [],
    },
    duration: {
      type: ParameterType.INT,
      default: 60,
    },
  },
};

type Info = typeof info;

type Image = string;

class UnsupervisedDemoPlugin implements JsPsychPlugin<Info> {
  static info = info;
  private jsPsych: JsPsych;
  private images: Image[] = [];
  private rootEl: HTMLElement;
  private startTime = performance.now();
  private triangleIdx: number;
  private showTriangle = false;
  private duration: number;
  private keepSubtracting = true;

  // Show a triangle after a random delay
  private delay: number;

  constructor(jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    this.rootEl = display_element;
    this.images = trial.images;
    this.duration = trial.duration;
    this.triangleIdx = randomInteger(0, this.images.length - 1);
    this.delay = randomInteger(5, this.duration - 5);

    $(this.rootEl).html(`
    <div class="w-full absolute left-0 top-0">
    <div class="text-center flex flex-col gap-2">
    <h3 class="text-3xl my-4">Spend ${this.duration} seconds to view the objects.</h3>
    <div id="unsupervised-timer" class="text-xl font-semibold mb-4"></div>
    <div>
      <button id="unsupervised-button" class="bg-blue-500 text-blue-50 h-10 px-4 appearance-none rounded-md">Press this when you see the triangles.</button>
    </div>
    <div id="unsupervised-container"></div>
  </div>
  </div>`);

    const timer = setInterval(() => {
      this.delay--;
      if (this.delay <= 0) {
        clearInterval(timer);
        this.showTriangle = true;
        this.render();
      }
    }, 1000);
    this.render();
    this.showTimer(
      document.getElementById("unsupervised-timer"),
      this.duration
    );
  }

  render() {
    this.keepSubtracting = !this.showTriangle;
    let removableTimer: number;
    const cols = this.images.length === 3 ? 3 : 5;

    if (this.showTriangle) {
      removableTimer = setTimeout(() => {
        alert("Click on the triangle as soon as you see it.");
      }, 2000);

      $("#unsupervised-button").on("click", () => {
        clearTimeout(removableTimer);
        this.showTriangle = false;
        this.render();
      });
    }

    // grid-cols-3 grid-cols-5
    $("#unsupervised-container").addClass(`p-12 grid grid-cols-${cols} gap-4`)
      .html(`
    ${this.images
      .map(
        (image) => `<div class="relative">
    ${
      this.showTriangle
        ? `<img id="unsupervised-triangle" src="${serverUrl}/images/attention_triangle.png" class="cursor-pointer">`
        : `<img src="${image}">`
    }
    </div>
  `
      )
      .join("")}
      
</div>`);

    $("#unsupervised-triangle").on("click", () => {
      this.showTriangle = false;
      clearTimeout(removableTimer);
      this.render();
    });
  }

  showTimer(el: HTMLElement, duration: number) {
    let timeLeft = duration;
    $(el).html(`Time Left: ${timeLeft} seconds`);

    const x = setInterval(() => {
      if (this.keepSubtracting) --timeLeft;
      $(el).html(`Time Left: ${timeLeft} seconds`);

      if (timeLeft <= 0) {
        clearInterval(x);
        this.finishTrial();
      }
    }, 1000);
  }

  finishTrial() {
    let data = {
      kind: "unsupervised-demo",
      startTime: this.startTime,
      endTime: performance.now(),
    };
    this.jsPsych.finishTrial(data);
  }
}

export default UnsupervisedDemoPlugin;
