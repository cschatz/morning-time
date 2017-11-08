//Create a new Vue instance
new Vue({
	//Bind this Vue instance to our container div with an ID of todo
	el: "#todo",
	//This is where we will register the values that hold data for our application
	data: {
		newTask: "",
		newTime: "23:30",
		taskList: [],
		colorOptions: ["#888", "#800", "#080", "#008", "#808"],
		inEntryMode: true,
		index: -1,
		item: "",
		color: "",
		nextAlarm: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		interval: null,
		now: 0
	},
	methods: {
		addTask: function () {
			var task = this.newTask.trim();
			var t = moment(this.newTime, "HH:mm").format("X");
			var tf = moment(this.newTime, "HH:mm").format("h:mma");
			if (task) {
				var formattedTime = moment(this.newTime, "HH:mm").format("X");
				this.taskList.push({ text: task, rawTime: t, time: tf, color: "#888", colorBeingPicked: false});
				this.newTask = "";
				this.taskList.sort(function(a, b) { return (a.rawTime-b.rawTime); });
			}
		},
		removeTask: function (task) {
			var index = this.taskList.indexOf(task);
			this.taskList.splice(index, 1);
		},
		clearList: function () {
			this.taskList = [];
		},
		colorChosen: function (whichTask, whichColor) {
			whichTask.color = whichColor;
			whichTask.colorBeingPicked = false;
		},
		toggleEntryMode: function(val) {
			this.inEntryMode = val;
			if (!this.inEntryMode) {
				this.setup();
			} else {
				clearInterval(this.interval);
			}
		},
		loadItem: function() {
			if (this.index == -1) {
				this.color = "#000";
				this.item = "DONE!";
			} else {
				this.item = this.taskList[this.index].text;
				this.color = this.taskList[this.index].color;
				this.nextAlarm = this.taskList[this.index].rawTime;
			}
		},
		setup: function() {
			this.index = -1;
			var now = moment().format("X");
			this.now = now; // TODO: remove this!!
			for (var i = 0; i < this.taskList.length; i++) {
				var t = this.taskList[i].rawTime;
				if (t > now) {
					this.index = i;
					break;
				}
			}
			this.loadItem();
			var that = this;
			this.interval = setInterval(function() {
				that.now ++;
				that.update();
			}, 100);
		},
		update: function() {
			var duration = (this.nextAlarm - this.now);
			if (duration <= 0) {
				this.index ++;
				if (this.index >= this.taskList.length) {
					this.index = -1;
					clearInterval(this.interval);
				}
				this.loadItem();
			}
			this.hours = Math.floor(duration / 3600);
			this.minutes = Math.floor(duration / 60) % 60;
			this.seconds = duration % 60;
		}
	},
	computed: {
		areAllSelected: function () {
			return this.taskList.length > 0 &&
				this.taskList.every(function (task) { return task.checked; });
		}
	}
});
