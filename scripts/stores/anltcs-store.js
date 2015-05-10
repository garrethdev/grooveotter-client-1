var React = require('react');
var Fluxxor = require('fluxxor');
var constants = require('../constants');
var lodash = require('lodash');

var AnltcsStore = module.exports = Fluxxor.createStore({
    initialize: function() {
        var flux = this.flux;

        this.lastAction = this.started = Date.now();

        this.triggerAction = lodash.debounce(function() {
            flux.actions.userLeave();
        }, 10 * 1000);

        this.bindActions(
            constants.COMPLETE_TASK, this.onCompleteTask,
            constants.USER_ACTION, this.onUserAction,
            constants.USER_LEAVE, this.onUserLeave
        );
    },

    onCompleteTask: function(payload) {
        var task = payload.task;
        var flux = this.flux;
        var lastAction = this.lastAction;
        var started = this.started;
        var session = flux.store('SessionStore').getSession();
        var sessionTask = session.get('task');

        if (task.id === sessionTask.id) {
            var time = session.elapsedTime();
            this.logSessionTime(time);
            this.logSiteTime(lastAction - started);
            this.started = Date.now();
            this.emit('change');
        }
    },

    onUserAction: function() {
        if (this.started == null) {
            this.started = Date.now();
        }

        this.lastAction = Date.now();
    },

    onUserLeave: function() {
        var started = this.started;
        var lastAction = this.lastAction;
        var session = this.flux.store('SessionStore').getSession();

        if (started != null && !session.isStarted()) {
            this.logSiteTime(lastAction - started);
            this.started = null;
            this.emit('change');
        }
    },

    logSessionTime: function(time) {
        var total = this.getSessionTime();

        localStorage.setItem('session-time', time + total);
    },

    logSiteTime: function(time) {
        var total = this.getSiteTime();

        localStorage.setItem('site-time', time + total);
    },

    getSessionTime: function() {
         var time = localStorage.getItem('session-time');

         if (time == null) {
             return 0;
         } else {
             return +time;
         }
    },

    getSiteTime: function() {
         var time = localStorage.getItem('site-time');

         if (time == null) {
             return 0;
         } else {
             return +time;
         }
    }
});