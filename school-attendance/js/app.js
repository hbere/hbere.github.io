// 10/26/18
// app.js

let model = {
    init: function () {
        let students = [
            { name: 'Slappy the Frog', attended: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Lilly the Lizard', attended: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Paulrus the Walrus', attended: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Gregory the Goat', attended: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Adam the Anaconda', attended: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ];
        localStorage.students = JSON.stringify(students);
    },
    getStudents: function () {
        return JSON.parse(localStorage.students);
    },
    updateStudents: function (students) {
        localStorage.students = JSON.stringify(students);
    },
    getAttendanceTotals: function () {
        let students = JSON.parse(localStorage.students);
        let totalAttended = [];
        for (student of students) {
            totalAttended.push(student.attended.reduce((a, b) => a + b));
        }
        return totalAttended;
    }
}

let octopus = {
    init: function () {
        model.init();
        view.init(model.getStudents());
    },
    updateAttendance: function (studentIndex, dayIndex, attendedYN) {
        let students = model.getStudents();
        students[studentIndex].attended[dayIndex] = attendedYN;
        model.updateStudents(students);
    },
    updateAttendanceTotals() {
        let totalAttended = model.getAttendanceTotals();
        view.updateAttendanceTotals(totalAttended);
    }
}

let view = {
    init: function (students) {
        // Generate table
        students.forEach((student, studentIndex) => {
            let html = '<tr class="student">';
            html += `<td class="name-col">${student.name}</td>`;
            student.attended.forEach((day, dayIndex) => {
                html += `<td class="attend-col"><input type="checkbox" studentindex="${studentIndex}" dayindex="${dayIndex}"></td>`;
            });
            html += `<td class="att-col-value">0</td></tr>`;
            document.querySelector('tbody').insertAdjacentHTML('beforeend', html);
        });
        // Add checkbox handler
        document.addEventListener('change', function (event) {
            let studentIndex = Number(event.target.getAttribute("studentindex"));
            let dayIndex = Number(event.target.getAttribute("dayindex"));
            if (event.target.checked) {
                octopus.updateAttendance(studentIndex, dayIndex, 1);
            } else {
                octopus.updateAttendance(studentIndex, dayIndex, 0);
            }
            octopus.updateAttendanceTotals();
        });
    },
    updateAttendanceTotals: function (attendanceTotals) {
        let elements = document.getElementsByClassName('att-col-value');
        attendanceTotals.forEach((total, studentIndex) => {
            elements[studentIndex].innerText = total;
        });
    }
}

octopus.init();