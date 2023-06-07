'use strict';

const { ipcRenderer } = require('electron');
const jQuery = require('jquery');

document.addEventListener('DOMContentLoaded', () => {
  jQuery('#startBtn').on('click', function (e) {
    ipcRenderer.on('fetch-data-response', (event, questionsArr) => {
      // JSON.parse(Buffer.from(data).toString('utf8'));

      jQuery(this).addClass('animated fadeOutUp');
      setTimeout(() => {
        jQuery(this).hide();
        jQuery('header h1').hide();
      }, 300);

      jQuery('.quiz').addClass('animated fadeInDown').removeClass('hidden');

      jQuery('form')
        .addClass('animated fadeInDown')
        .prepend(buildQuestionTemplate(0));

      let correctAnswersCount = 0;
      (function checkSelectedAnswer() {
        jQuery('.btnQ').on('click', function (e) {
          const selectedAnswer = jQuery(this).attr('for');
          let index = jQuery(this).parent().parent().data('index');

          if (
            questionsArr[index].correct_answers[selectedAnswer + '_correct'] ===
            'true'
          ) {
            correctAnswersCount++;
          }
          jQuery(this).parent().parent().addClass('animated fadeOutUp').hide();
          const nextQuestionIndex = ++index;

          circle.animate(nextQuestionIndex / questionsArr.length);

          // If there is next question show it
          if (questionsArr[nextQuestionIndex]) {
            jQuery('form')
              .addClass('animated fadeInDown')
              .prepend(buildQuestionTemplate(nextQuestionIndex));
            checkSelectedAnswer();
          } else {
            jQuery('.q' + index).addClass('animated fadeOutUp');
            jQuery('.quiz').append(
              `<div class="end animated bounceInDown">Results: (${correctAnswersCount} / ${questionsArr.length})</div>
                <div class="buttons">
                  <button class="btn-green" id="reloadBtn">
                    <img class="icon" src="../../resources/reload-6x-white.png" /> Try again
                  </button>
                </div>
              `,
            );

            jQuery('#reloadBtn').on('click', () => ipcRenderer.send('reload'));
          }
        });
      })();

      function buildQuestionTemplate(index) {
        const question = questionsArr[index];

        return `<fieldset data-index=${index} class="q q${index}">
                      <div class="content">
                          <legend>1. ${question.question}</legend>
                          <input type="radio" name="q${index}" id="${question.answers.answer_a}" class="btnQ">
                              <label for="answer_a" class="btnQ"><span>${question.answers.answer_a}</span></label>
                          <input type="radio" name="q${index}" id="${question.answers.answer_b}">
                              <label for="answer_b" class="btnQ"><span>${question.answers.answer_b}</span></label>
                          <input type="radio" name="q${index}" id="${question.answers.answer_c}">
                              <label for="answer_c" class="btnQ"><span>${question.answers.answer_c}</span></label>
                          <input type="radio" name="q${index}" id="${question.answers.answer_d}">
                              <label for="answer_d" class="btnQ"><span>${question.answers.answer_d}</span></label>
                      </div>
                      <div class="button-space">
  
                      </div>
                  </fieldset>`;
      }
    });

    ipcRenderer.send('fetch-data');
  });
  const circle = new ProgressBar.Circle('#circle-container', {
    duration: 200,
    strokeWidth: 5,
    trailWidth: 5,
    trailColor: '#ddd',
    from: {
      color: '#218CCC',
    },
    to: {
      color: '#047E3C',
    },
    step: function (state, circle) {
      circle.path.setAttribute('stroke', state.color);
    },
  });
});
