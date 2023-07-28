import $ from "jquery";
import { nanoid } from "nanoid";
import { JsPsychPlugin, ParameterType, TrialType, JsPsych } from "jspsych";
import randomInteger from "random-int";
import { serverUrl } from "./main";

const info = {
  name: "demo",
  parameters: {
    families: {
      type: ParameterType.OBJECT,
      default: [],
    },
    duration: {
      type: ParameterType.INT,
      default: 30,
    },
  },
};

type Info = typeof info;

type Family = {
  name: string;
  images: string[];
};

class DemoPlugin implements JsPsychPlugin<Info> {
  static info = info;
  private jsPsych: JsPsych;
  private id: string;
  private static counter = 0;
  private families: Family[] = [];
  private rootEl: HTMLElement;
  private visible = false;
  private keepSubtracting = true;
  private startTime = performance.now();

  // Show a triangle after a random delay
  private delay: number;

  constructor(jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
    this.id = nanoid();
  }

  showTriangle() {
    this.visible = true;
    $("img").prop("src", `${serverUrl}/images/attention_triangle.png`);
    let counter = 0;
    let x = setTimeout(() => {
      if (this.visible) {
        this.keepSubtracting = false;
        alert("Press the button quickly when the triangle is visible.");
      }
    }, 1000);

    $("#att").on("click", () => {
      if (!this.visible) {
        alert("Press this once only when the triangle is visible.");
        return;
      }
      clearInterval(x);
      let counter = 0;
      this.keepSubtracting = true;
      this.families.forEach((f) => {
        const id = `demo-${this.id}-${counter}`;
        counter++;
        // $(this.rootEl).append($("<div />").attr("id", id));
        this.renderFamily(document.getElementById(id), f);
      });
    });
  }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    const families = trial.families as Family[];
    this.families = families;
    this.rootEl = display_element;
    const duration = trial.duration;

    this.delay = randomInteger(1, duration - 2);

    // Start a timer for every second
    const x = setInterval(() => {
      this.delay--;
      if (this.delay <= 0) {
        clearInterval(x);
        this.showTriangle();
      }
    }, 1000);

    $(display_element).html(`<div class="text-center flex flex-col gap-2">
      <h3 class="text-2xl">Spend ${duration} seconds to learn the families and their respective objects.</h3>
      <div id="demo-${this.id}-timer" class="text-xl font-semibold"></div>
    </div>`);

    this.showTimer(document.getElementById(`demo-${this.id}-timer`), duration);

    // Loop from 0 to 1

    families.forEach((f, idx) => {
      const id = `demo-${this.id}-${idx}`;
      $(display_element).append($("<div />").attr("id", id));
      this.renderFamily(document.getElementById(id), f);
    });

    $(this.rootEl).append(
      `<div class="flex items-center justify-center mt-8 "><button id="att" class="bg-blue-500 rounded-lg text-white h-11 w-fit px-4">Press this when you see the triangle </button></div>`
    );
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
      kind: "demo",
      families: this.families,
      startTime: this.startTime,
      endTime: performance.now(),
    };
    this.rootEl.innerHTML = "";
    this.jsPsych.finishTrial(data);
  }

  private renderFamily(el: HTMLElement, f: Family) {
    $(el).addClass("flex pt-12 justify-center py-6 px-4 flex-col gap-6");
    $(el).html(
      `<h2 class="text-3xl font-medium tracking-wide text-center"><span class="font-bold">${f.name}</span> Family</h2>`
    );

    const images = f.images;

    const imagesNodes = images
      .map((img) => `<img src="${img}" class="w-80" />`)
      .join("");

    $(el).append(`<div class="grid grid-cols-3">${imagesNodes}</div>`);
  }
}

export default DemoPlugin;
