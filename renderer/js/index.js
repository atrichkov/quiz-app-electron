'use strict';

const { ipcRenderer } = require('electron');
const jQuery = require('jquery');

document.addEventListener('DOMContentLoaded', () => {
    jQuery('#startBtn').on('click', function () {
        ipcRenderer.on('fetch-data-response', (event, questionsArr) => {
            // JSON.parse(Buffer.from(data).toString('utf8'));

            jQuery(this).addClass('animated fadeOutUp');
            setTimeout(() => {
                jQuery(this).hide();
                jQuery('header h1').hide();
            }, 300);

            jQuery('.quiz').addClass('animated fadeInDown').removeClass('hidden');
            jQuery('form').addClass('animated fadeInDown').prepend(buildQuestionTemplate(0));

            let correctAnswersCount = 0;
            (function checkSelectedAnswer() {
                jQuery('.btnQ').on('click', function () {
                    const btnQLabel = jQuery(this);
                    const selectedAnswer = btnQLabel.attr('for');
                    let index = btnQLabel.parent().parent().data('index');

                    if (questionsArr[index].correct_answers[selectedAnswer + '_correct'] === 'true') {
                        correctAnswersCount++;
                    }
                    btnQLabel.parent().parent().addClass('animated fadeOutUp').hide();
                    const nextQuestionIndex = ++index;

                    circle.animate(nextQuestionIndex / questionsArr.length);

                    // Show next question if any
                    if (questionsArr[nextQuestionIndex]) {
                        jQuery('form').addClass('animated fadeInDown').prepend(buildQuestionTemplate(nextQuestionIndex));
                        checkSelectedAnswer();
                    } else {
                        showResult(index, correctAnswersCount);
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

            function showResult(index, correctAnswersCount) {
                jQuery('.q' + index).addClass('animated fadeOutUp');

                let message;
                if (correctAnswersCount === questionsArr.length) {
                    message =
                        'Congratulations on completing the code quiz game with an impressive score! Your knowledge and dedication have shone through, making you a true quiz master.';
                } else if (correctAnswersCount === 0) {
                    message =
                        "Keep up the effort! While you may not have scored any correct answers in the code quiz game, your participation is valuable and provides an opportunity for personal growth. Don't be discouraged, and continue to embrace challenges as a chance to learn and improve.";
                } else {
                    message =
                        'Fantastic work on the code quiz game! Your partially correct answers showcase your knowledge and dedication in tackling the challenging questions. Keep up the excellent work and continue expanding your understanding in various coding subjects.';
                }

                jQuery('.quiz').append(
                    `<div class="end animated bounceInDown">${message} <br />
                    Your score: (${correctAnswersCount} / ${questionsArr.length})</div>
                    <div class="buttons">
                        <button class="btn-green" id="reloadBtn">
                            <img class="icon" src="../../resources/reload-6x-white.png" /> Try again
                        </button>
                    </div>
          `
                );

                jQuery('#reloadBtn').on('click', () => ipcRenderer.send('reload'));
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
        step: (state, circle) => {
            circle.path.setAttribute('stroke', state.color);
        },
    });
});
