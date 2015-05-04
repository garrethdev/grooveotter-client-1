/* globals _ */

angular.module('gotr')
    .directive('gotrArchiveDisplay', ArchiveDisplayDirective);

ArchiveDisplayDirective.$inject = [];
function ArchiveDisplayDirective() {
    var directive = {
        restrict: 'EA',
        replace: true,
        templateUrl: 'archive-display.html',
        scope: {
            taskList: '='
        },
        controller: ArchiveDisplayController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

ArchiveDisplayController.$inject = ['$filter'];
function ArchiveDisplayController($filter) {
    var vm = this;

    var format = $filter('date');

    var tasks = mockTasks();

    vm.weeks = _.chain(tasks)
        .groupBy(dayOf)
        .map(function(tasks, day) {
            return {
                date: new Date(day),
                tasks: tasks,
                open: false
            };
        })
        .groupBy(weekOf)
        .value();

    function dayOf(task) {
        var time = task.createdAt;
        return new Date(time.getFullYear(), time.getMonth(), time.getDate());
    }

    function weekOf(day) {
        var sunday = new Date(day.date);
        sunday.setDate(sunday.getDate() - sunday.getDay());

        var saturday = new Date(sunday);
        saturday.setDate(saturday.getDate() + 6);

        return format(sunday, 'MMM d') + ' - ' + format(saturday, 'MMM d');
    }

    function mockTasks() {
        var tasks = [];

        var now = new Date();
        var day = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        tasks.push(makeTask('Do a thing', day));
        backpedal();
        tasks.push(makeTask('Do another thing', day));
        backpedal();
        tasks.push(makeTask('Something', day));
        backpedal();
        backpedal();
        backpedal();
        backpedal();
        tasks.push(makeTask('Lorem Ipsum dolor sit amet', day));
        backpedal();
        tasks.push(makeTask('Hm...', day));
        backpedal();
        backpedal();
        backpedal();
        backpedal();
        backpedal();
        backpedal();
        tasks.push(makeTask('Something something something', day));
        backpedal();
        tasks.push(makeTask('Finish writing these mock task names', day));
        backpedal();
        tasks.push(makeTask('Foo bar baz', day));
        backpedal();
        tasks.push(makeTask('quux', day));
        backpedal();
        tasks.push(makeTask('Jessie Pinkmann will die :(', day));
        backpedal();

        return tasks;

        function backpedal() {
            day = new Date(day);
            day.setHours(day.getHours() - 16);
        }
    }

    function makeTask(title, createdAt) {
        return {
            title: title,
            completed: true,
            duration: new Date(0).setMinutes(20),
            createdAt: createdAt,
            updatedAt: createdAt
        };
    }
}
