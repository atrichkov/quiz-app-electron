'use strict';

const { ipcRenderer } = require('electron');
const jQuery = require('jquery');
const axios = require('axios');

document.addEventListener('DOMContentLoaded', () => {
    jQuery('#startBtn').on('click', function (e) {
        jQuery('#startBtn').addClass('animated fadeOutUp');
        jQuery('.quiz').addClass('animated fadeInDown').removeClass('hidden');
        axios
            .get(
                'https://quizapi.io/api/v1/questions?apiKey=u8TylbMvsAhol0ktB6xeDv26OIY79ReS0n8pP65N&limit=2'
            )
            .then(function (response) {
                // const questionsArr = response.data;

                const questionsArr = [
                    {
                        id: 1,
                        question: 'How to delete a directory in Linux?',
                        description:
                            'The rmdir commands deletes only empty directories. To delete a folder recursively use the rm -rf command.',
                        answers: {
                            answer_a: 'ls',
                            answer_b: 'delete',
                            answer_c: 'remove',
                            answer_d: 'rmdir',
                            answer_e: null,
                            answer_f: null,
                        },
                        multiple_correct_answers: 'false',
                        correct_answers: {
                            answer_a_correct: 'false',
                            answer_b_correct: 'false',
                            answer_c_correct: 'false',
                            answer_d_correct: 'true',
                            answer_e_correct: 'false',
                            answer_f_correct: 'false',
                        },
                        correct_answer: 'answer_d',
                        explanation: 'rmdir deletes an empty directory',
                        tip: null,
                        tags: [],
                        category: 'Linux',
                        difficulty: 'Easy',
                    },
                    {
                        id: 957,
                        question: 'At its core, Kubernetes is a platform for:',
                        description: null,
                        answers: {
                            answer_a:
                                'Provisioning machines (similar to Puppet, Ansible)',
                            answer_b:
                                'Running and scheduling container applications on a cluster',
                            answer_c: 'Packaging software in containers',
                            answer_d: null,
                            answer_e: null,
                            answer_f: null,
                        },
                        multiple_correct_answers: 'false',
                        correct_answers: {
                            answer_a_correct: 'false',
                            answer_b_correct: 'true',
                            answer_c_correct: 'false',
                            answer_d_correct: 'false',
                            answer_e_correct: 'false',
                            answer_f_correct: 'false',
                        },
                        correct_answer: null,
                        explanation: null,
                        tip: null,
                        tags: [
                            {
                                name: 'Kubernetes',
                            },
                        ],
                        category: 'DevOps',
                        difficulty: 'Easy',
                    },
                ];

                jQuery('form')
                    .addClass('animated fadeInDown')
                    .prepend(parseQuestion(questionsArr[0], 0));

                let correctAnswersCount = 0;
                function handleAnswerBtnClick() {
                    jQuery('.btnQ').on('click', function (e) {
                        const selectedAnswer = jQuery(this).attr('for');
                        let index = jQuery(this)
                            .parent()
                            .parent()
                            .data('index');

                        if (
                            questionsArr[index].correct_answers[
                                selectedAnswer + '_correct'
                            ] === 'true'
                        )
                            correctAnswersCount++;
                        jQuery(this)
                            .parent()
                            .parent()
                            .addClass('animated fadeOutUp')
                            .hide();
                        const nextQuestionIndex = ++index;

                        circle.animate(nextQuestionIndex / questionsArr.length);

                        if (questionsArr[nextQuestionIndex]) {
                            jQuery('form')
                                .addClass('animated fadeInDown')
                                .prepend(
                                    parseQuestion(
                                        questionsArr[nextQuestionIndex],
                                        nextQuestionIndex
                                    )
                                );
                            handleAnswerBtnClick();
                        } else {
                            jQuery('.q' + index).addClass('animated fadeOutUp');
                            jQuery('.quiz').append(
                                `<div class="end animated bounceInDown">Results: (${correctAnswersCount} / ${questionsArr.length})</div>`
                            );
                        }
                    });
                }
                handleAnswerBtnClick();
            });

        function parseQuestion(question, index) {
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
    var circle = new ProgressBar.Circle('#circle-container', {
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
