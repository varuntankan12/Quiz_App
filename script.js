const setup = document.getElementById('setupp');
const loader = document.getElementById('loader');
const qarea = document.getElementById('qarea');
const failed = document.getElementById('fail');
const fail1 = document.getElementById('fail1');
const fail2 = document.getElementById('fail2');
const final = document.getElementById('final');
const yourname = document.getElementById('u_name');
const save = document.getElementById('save');
const inp = document.getElementById('inp');
const output = document.getElementById('output');
const out = document.getElementById('out');

let amount = document.getElementById('number');
let category = document.getElementById('category');
let difficulty = document.getElementById('difficulty');
let type = document.getElementById('type');

let questionlist = document.getElementById('questionlist');
let question = document.getElementById('question');
let answers = document.getElementById('answers');
let qno = document.getElementById("qno");
let ch = Array.from(document.getElementsByClassName('choice'));
let number = Array.from(document.getElementsByClassName('number'));
let button = Array.from(document.getElementsByClassName('button'));
let questionnumber;

let answer_choice;
let ans_no;
let ans_p;
let ques;
let quesno = 0;
let score = 0;
let correct = [];


var api;

var min = 0;
var sec = 0;
var problem;



const chalu = () => {

    loader.classList.remove('hidden');
    setup.classList.add('hidden');

    if (amount.value == 10) {
        if (difficulty.value == "hard") {
            min = 3;
        }
        else if (difficulty.value == "medium") {
            min = 2;
        }
        else {
            min = 1;
        }
    }
    else if (amount.value == 20) {
        min = 5;
        if (difficulty.value == "hard") {
            min = 15;
        }
        else if (difficulty.value == "medium") {
            min = 10;
        }
        else {
            min = 5;
        }
    }
    else if (amount.value == 30) {
        min = 10;
        if (difficulty.value == "hard") {
            min = 30;
        }
        else if (difficulty.value == "medium") {
            min = 20;
        }
        else {
            min = 10;
        }
    }
    else if (amount.value == 40) {
        min = 15;
        if (difficulty.value == "hard") {
            min = 45;
        }
        else if (difficulty.value == "medium") {
            min = 30;
        }
        else {
            min = 15;
        }
    }
    else {
        min = 20;
        if (difficulty.value == "hard") {
            min = 60;
        }
        else if (difficulty.value == "medium") {
            min = 40;
        }
        else {
            min = 20;
        }
    }

    api = `https://opentdb.com/api.php?amount=${amount.value}${category.value == "any" ? "" : "&category=" + category.value}${difficulty.value == "any" ? "" : "&difficulty=" + difficulty.value}${type.value == "any" ? "" : "&type=" + type.value}`;

    startfetching(api);
}

function startfetching(api) {

    // fetching the api.....
    fetch(
        `${api}`
    ).then((res) => {
        return res.json();
    }).then((loadedQuestions) => {

        if (loadedQuestions.response_code == '1' || loadedQuestions.results == []) {
            throw "wrong data";
        }

        problem = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        if (problem.length < amount) {
            throw "wrong data";
        }

        start();

    }).catch((err) => {

        setup.classList.add('hidden');
        loader.classList.add('hidden');
        qarea.classList.add('hidden');
        failed.classList.remove('hidden');

        if (err == "wrong data") {
            fail1.classList.add('hidden');
            fail2.classList.remove('hidden');
        }
        else {
            fail1.classList.remove('hidden');
            fail2.classList.add('hidden');
        }
    });
}

const start = async () => {

    loader.classList.add('hidden');
    qarea.classList.remove('hidden');

    questionlist = document.getElementById('questionlist');
    question = document.getElementById('question');
    answers = document.getElementById('answers');
    qno = document.getElementById("qno");
    ch = Array.from(document.getElementsByClassName('choice'));
    // number = Array.from(document.getElementsByClassName('number'));
    button = Array.from(document.getElementsByClassName('button'));



    try {
        addquestionlist();
        timer(min, 0);
    }
    catch {
        console.log("an error occured");
    }

    // console.log(problem);
}

const addquestionlist = () => {
    for (let i in problem) {
        i = Number.parseInt(i);
        questionlist.innerHTML = questionlist.innerHTML + `<div class="select" id="Q${i + 1}"><span>${i + 1}</span><p>${problem[i].question.slice(0, 13)}...</p></div>`;
    }

    questionnumber = Array.from(document.getElementsByClassName("select"));
    answer_choice = Array.from(document.getElementsByClassName("answer_choice"));
    ans_no = Array.from(document.getElementsByClassName("ans_no"));
    ans_p = Array.from(document.getElementsByClassName("ans_p"));

    try {
        addquestion(0);
        addlistner();
    }
    catch {
        console.log("an error occured");
    }
}

const addquestion = (num) => {

    if (num == 0) {
        button[1].style.visibility = "hidden";
        button[2].style.visibility = "visible";
    }
    else if (num == problem.length - 1) {
        button[1].style.visibility = "visible";
        button[2].style.visibility = "hidden";
    }
    else {
        button[1].style.visibility = "visible";
        button[2].style.visibility = "visible";
    }

    let x = 1;

    quesno = num;
    qno.innerHTML = num + 1;
    question.innerHTML = problem[num]["question"];

    ch.forEach(element => {

        if (problem[num]["choice" + x] == undefined) {
            element.parentNode.style.display = "none";
        }
        else {
            element.parentNode.style.display = "flex";
        }

        element.innerHTML = problem[num]["choice" + x];
        x += 1
    });
}

const addlistner = () => {

    questionnumber.forEach((elem, index) => {
        elem.addEventListener('click', () => {
            addquestion(index);
        });
    });

    ans_no.forEach((elem) => {
        elem.addEventListener('click', (e) => {
            let exists;
            document.getElementById(`Q${quesno + 1}`).classList.add('attempted');
            e.target.parentNode.classList.add('');
            if (e.target.id == problem[quesno]["answer"]) {
                exists = correct.includes(quesno);
                if (!exists) {
                    correct.push(quesno);
                }
            }
            else {
                exists = correct.includes(quesno);
                if (exists) {
                    correct = correct.filter((c) => { return c !== quesno });
                }
            }
            if (quesno < problem.length - 1) {
                addquestion(quesno + 1);
            }
        });
    });

    ans_p.forEach((elem) => {
        elem.addEventListener('click', (e) => {
            let exists;
            document.getElementById(`Q${quesno + 1}`).classList.add('attempted');
            if (e.target.id == problem[quesno]["answer"]) {
                exists = correct.includes(quesno);
                if (!exists) {
                    correct.push(quesno);
                }
            }
            else {
                exists = correct.includes(quesno);
                if (exists) {
                    correct = correct.filter((c) => { return c !== quesno });
                }
            }
            if (quesno < problem.length - 1) {
                addquestion(quesno + 1);
            }
        });
    });



    button.forEach(data => {
        data.addEventListener('click', (e) => {
            ques = Number.parseInt(document.getElementById('qno').innerHTML);
            if (e.target.innerHTML == "Finish") {

                if (confirm("do you really want to finish..?")) {
                    finishgame();
                }
            }
            else if (e.target.innerHTML == "Next" && ques < problem.length) {
                addquestion(ques);
            }
            else if (e.target.innerHTML == "Prev" && ques > 1) {
                ques = ques - 2;
                addquestion(ques);
            }
        });
    });

    yourname.addEventListener('keyup', () => {
        save.disabled = !yourname.value;
    });
}



const finishgame = () => {
    clearInterval(timeid);
    score = correct.length * 10;

    document.getElementById('yourscore').innerHTML = score;

    loader.classList.add("hidden");
    qarea.classList.add("hidden");
    failed.classList.add("hidden");
    fail1.classList.add("hidden");
    fail2.classList.add("hidden");
    final.classList.remove("hidden");
}

const savegame = () => {

    localStorage.setItem(yourname.value, `{"score":"${score}", "questions":"${amount.value}", "difficulty":"${difficulty.value}"}`);

    window.location.reload();
}

const showlist = () => {

    setup.classList.add('hidden');
    inp.classList.add('hidden');
    final.classList.add('hidden');
    output.classList.remove('hidden');
    let data = localStorage;
    let jdata;

    for (i = 0; i < data.length; i++) {
        jdata = JSON.parse(data.getItem(data.key(i)));
        out.innerHTML = out.innerHTML + `<div class="card"><p>Name = <span>${data.key(i)}</span></p><p>Score = <span>${jdata.score}</span></p><p>Questions = <span>${jdata.questions}</span></p><p>Difficulty = <span>${jdata.difficulty}</span></p></div>`;
    }
}

const home = () => {
    setup.classList.remove('hidden');
    output.classList.add('hidden');
}

var timeid;

const timer = (min, sec) => {

    let inmin = document.getElementById("min");
    let insec = document.getElementById("sec");

    timeid = setInterval(() => {
        if (min <= 0 && sec <= 0) {
            alert("Time is over.!!!");
            finishgame();
            clearInterval(timeid);
        }
        else {
            if (sec < 1) {

                if (min < 1) {

                    min = 59;
                }

                min -= 1;
                inmin.innerHTML = (min < 10 ? "0" + min : min);
                sec = 59;
            }

            sec -= 1;
            insec.innerHTML = (sec < 10 ? "0" + sec : sec);
        }
    }, 1000);

    return timeid;
}

document.addEventListener('contextmenu', event => event.preventDefault());

if (window.innerWidth < 750 ) { 
    document.getElementById('width').classList.remove('hidden');
}
