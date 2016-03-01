var Fluxxor = require('fluxxor');
var Newsfeed = require('../models/newsfeed');
var Notification = require('../models/notification');
var constants = require('../constants');
var _ = require('lodash');

var NewsfeedStore = module.exports = Fluxxor.createStore({
    initialize: function() {
        this.currentItemIndex = 0;
        this.newsfeed = new Newsfeed();

        this.newsfeed.on('reset add remove change', function() {
            this.emit('change');
        }, this);
        this.newsfeed.fetch({reset: true});
        this.bindActions(
            constants.CYCLE_NEWSFEED, this.onCycleNewsfeed,
            constants.LIKE_SHARED_ITEM, this.onLikeSharedItem,
            constants.COMPLETE_TASK, this.onCompleteTask
        );
    },

    onCycleNewsfeed: function() {
        var index = this.currentItemIndex;
        var newsfeed = this.newsfeed;

        this.currentItemIndex = (index + 1) % newsfeed.length;


        this.emit('change');
    },

    onLikeSharedItem: function(payload) {
        var item = payload.item;
        console.log(payload);
        item.like();
    },

    getCurrentItem: function() {
        return this.newsfeed.at(this.currentItemIndex);
    },

    onCompleteTask: function() {
        var taskDay = localStorage.getItem('taskDay');
        var currentDay = new Date().getDate();
        var userName = gotrUser.get('full_name');
        var text = userName + ' finished their first task of the day';
        var randomInt = Math.floor(Math.random() * 5);
        if (taskDay != currentDay && randomInt === 4) {
            var notification = new Notification({'text': text,'user_id': gotrUser.id, type: 'first_task'});
            notification.save();
            localStorage.setItem('taskDay', currentDay);
        }
    }


});
