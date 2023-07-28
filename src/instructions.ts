import jsPsychInstructions from "@jspsych/plugin-instructions";

export const instructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="prose-lg">
    <h1>Instructions</h1>
    <p><b>Please read these instructions carefully! After this you will go through a simple demo
    of the experiment.</b></p>
    <p>This experiment will test you on recognizing Novel Objects.
    There are a total of 5 families of these objects, each with a different family name.</p>

    <p>We will reveal what they look like and the family names in the actual experiment. </p>

    The experiment has <b>4 phases</b>. Each phase consists of 2 parts: training and testing. 

    <h3>Preview</h3>

    <p>
    In the preview phase, we show 15 objects (3 objects each from the 5 families) in a random order, for 75 seconds.
    The objects will be continuously rotating and your task is to learn the general as well as discriminatitve features of the rotating objects.
    </p>
    <p>
    A yellow triangle will be flashed once during the phase over one of the fifteen objects. 
    You are supposed to click on the yellow triangle as fast as possible. 
    </p>

    <p>Once time is up, you'll move to the training part of the first phase.

    <h3>Training</h3>
    <p>In the training part of the first phase, you will be introduced to two new family of objects.
    During the training part of the remaining phases, you will be introduced to one new family of objects.
    </p>
    <p>You will be given 30 seconds to learn the features of the families in the first phase, followed by 15 seconds in
    the subsequent phases. The
    objects will be continuously rotating and you have to do your best to learn the features of these
    objects.</p>

    <p>A yellow triangle will be flashed once during training and you are required to click on
     the button below the training gifs only when you see the shape appear. </p>

    <p>Once time is up, you will immediately move to the testing part of the phase.</p>
    <p class="font-bold">Press <kbd>Next</kbd> to move to the next page.</p>
    </div>   
    `,
    `
    <div class="prose-lg">
    <h1>Instructions</h1>
    <h3>Testing</h3>
    <p>In the testing part of the phase, you will be tested with a series of multiple choice questions.
    You will be shown objects belonging to the families you have seen and will have to identify which
    family it belongs to.</p>

    <p>For each question, there will be button that when clicked, a GIF will be presented to you.
    Note that the GIF can only be played once. so click the button only if you are ready.
    </p>

    <p>In the GIF, a grey screen with a black cross will appear for 2 seconds. After that an
    image of the object will appear for 200 milliseconds.</p>

    <p>You are to identify which family the object belongs to by choosing one of the options below the GIF. </p>

    <p class="font-bold">Press <kbd>Next</kbd> to start the demo.</p>
    </div>   
    `,
  ],
  allow_backward: false,
  key_forward: "Enter",
  show_clickable_nav: true,
};

export const thanksInstructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="prose-lg">
      <h1>Thanks!</h1>
      <p>
      That's it for the experiment. Thank you for participating!
      </p>
      </div>
      `,
  ],
  allow_backward: false,
  key_forward: "Enter",
  show_clickable_nav: true,
};

export const finalInstructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="prose-lg">
      <h1>Instructions</h1>
      <p>
      That's it for the demo. Press <kbd>Next</kbd> to move to the actual experiment.
      </p>
      </div>   
      `,
  ],
  allow_backward: false,
  key_forward: "Enter",
  show_clickable_nav: true,
};

export const nextTrainingInstructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="prose-lg">
      <h1>Instructions</h1>
      <p>
      That was the demo for the preview phase. Press <kbd>Next</kbd> to move to the demo for the training and
      testing parts of a phase.
      </p>
      </div>   
      `,
  ],
  allow_backward: false,
  key_forward: "Enter",
  show_clickable_nav: true,
};

export const nextExperimentInstructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="prose-lg">
      <h1>Instructions</h1>
      <p>
      That's the end of the preview phase. The training and testing parts 
      of the four phases will start now.
      </p>
      <p>Press <kbd>Next</kbd> to continue.</p>
      </div>   
      `,
  ],
  allow_backward: false,
  key_forward: "Enter",
  show_clickable_nav: true,
};
