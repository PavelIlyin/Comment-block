'use strict'

let comments = [];
let commentsBlock = document.querySelector('.comments');
let btn = document.querySelector('.forms-btn');
let nameError = document.querySelector('.name-block__error');
let textError = document.querySelector('.text-block__error');
let commentNameForValidation = document.querySelector('.name-block__input');
let commentTextForValidation = document.querySelector('.text-block__input');

commentNameForValidation.addEventListener('input', getValidation);
commentTextForValidation.addEventListener('input', getValidation);
btn.addEventListener('click', setComment);
btn.addEventListener('keydown', setCommentEnter);

function getValidation() {
    if (commentNameForValidation.value.length > 0) {
        nameError.classList.remove('active');
    }

    if (commentTextForValidation.value.length > 0) {
        textError.classList.remove('active');
    }
}

function setComment(event) {
    event.preventDefault();
    let commentName = document.querySelector('.name-block__input');
    let commentBody = document.querySelector('.text-block__input');
    let commentDate = document.querySelector('.date-block__input');

    if (commentName.value.length > 0) {
        if (commentBody.value.length > 0) {
            let comment = {
                name: commentName.value,
                body: commentBody.value,
                time: Date.now(),
                timeInput: new Date(commentDate.value).getTime(),
                like: 0
            }

            commentName.value = '';
            commentBody.value = '';
            comments.push(comment);
            saveComments();
            showComments();
            loadComments();

        } else {
            textError.classList.add('active');
        }
    } else {
        nameError.classList.add('active');
    }
}

function setCommentEnter(e) {
    if (e.keyCode === 13) {
        setComment();
    }
}

function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
    if (localStorage.getItem('comments')) {
        comments = JSON.parse(localStorage.getItem('comments'));
        showComments();
    }
}

function showComments() {

    let out = [];

    comments.forEach((item, index) => {
        let commentBox = document.createElement('div');
        commentBox.className = 'comment-box';

        let commentBoxName = document.createElement('p');
        commentBoxName.className = 'comment-box__name';
        commentBoxName.innerHTML = `${(item.name)}`;

        let commentBoxComment = document.createElement('p');
        commentBoxComment.className = 'comment-box__comment';
        commentBoxComment.innerHTML = `${(item.body)}`;

        let commentBoxDate = document.createElement('p');
        commentBoxDate.className = 'comment-box__date';
        commentBoxDate.innerHTML = `${timeConverter(item.time, item.timeInput)}`;

        let commentOption = document.createElement('div');
        commentOption.className = 'comment-option';

        let heart = document.createElement('i');
        heart.className = 'gg-heart';
        heart.id = `${index}`;
        heart.addEventListener('click', like);

        if (item.like > 0) {
            heart.classList.add('active');
        } else {
            heart.classList.remove('active');
        }
        commentOption.appendChild(heart);

        let trash = document.createElement('i');
        trash.className = 'gg-trash';
        trash.id = `${index}`;
        trash.addEventListener('click', del);
        commentOption.appendChild(trash);

        commentBox.appendChild(commentBoxName);
        commentBox.appendChild(commentBoxComment);
        commentBox.appendChild(commentBoxDate);
        commentBox.appendChild(commentOption);

        out.push(commentBox);
    })

    commentsBlock.innerHTML = '';
    out.forEach(i => commentsBlock.appendChild(i));
}

function timeConverter(UNIX_timestamp, specifiedTime) {
    let a = new Date(UNIX_timestamp);
    let b = new Date(specifiedTime);
    let months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();

    if (b.getTime() !== 0) {
        let todayB = ((Date.now() - b.getTime())) / (1000 * 60 * 60 * 24);
        return `${getDateValue(todayB, b, months)}, ${hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    } else {
        let todayA = ((Date.now() - a.getTime())) / (1000 * 60 * 60 * 24);
        return `${getDateValue(todayA, a, months)}, ${hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }
}

function getDateValue(today, date, months) {
    if (today > 0 && today < 1 && (new Date().getDate() - date.getDate() == 0)) {
        return 'сегодня';
    } else if (today < 2 && (new Date().getDate() - date.getDate() == 1)) {
        return 'вчера';
    } else {
        return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear()}`;
    }
}

function like(event) {
    let commentClone = Array.from(JSON.parse(localStorage.getItem('comments')));
    if (commentClone[event.target.id].like == 0) {
        commentClone[event.target.id].like += 1;
    } else {
        commentClone[event.target.id].like -= 1;
    }
    comments = Array.from(commentClone);
    saveComments();
    showComments();
}

function del(event) {
    let commentClone = Array.from(JSON.parse(localStorage.getItem('comments')));
    commentClone.splice(event.target.id, 1);
    comments = Array.from(commentClone);
    saveComments();
    showComments();
}


loadComments();