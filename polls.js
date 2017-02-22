//Constructor
function Poll() {
	this.poll = {
		"active":false,
		"timer":0,
		"endTime":0,
		"timeLeft":0,
		"options":[],
		"text":[],
		"creator":"",
		"res":[],
		"users":[],
		"votes":0
	};
}
Poll.prototype.pollCommand = function(msg, isMod) {
	var returnText;
	//Need this long if to prevent unessecary polls
	if((!this.poll["active"] && msg.content.substring(5) != "") || (!this.poll["active"] && msg.content.substring(6) != "")) {	
		this.poll["timer"] = new Date().getTime();
		//console.log("poll timer: "+this.poll["timer"]);
		this.poll["options"] = msg.content.substring(5).split(",");
		//clear spaces from !poll foo, bar
		for(var i = 0; i < this.poll['options'].length; i++) {
			if(this.poll['options'][i][0] == ' ') {
				this.poll['options'][i] = this.poll['options'][i].substring(1);
			}
		}

		this.poll["text"] = "A poll has been started by " + msg.author + " please enter a number. Type '!poll' to close.";

		for(var i = 1; i < this.poll['options'].length + 1; i++) {
			this.poll["text"] += "\n" + i + ". ";
			this.poll["text"] += this.poll["options"][i-1];
		}
		
		returnText = this.poll["text"]
		
		this.poll["active"] = true;
		this.poll["channel"] = msg.channel;
		this.poll["creator"] = msg.author;
		
		for(var i = 0; i < this.poll['options'].length; i++) {
			this.poll["res"][i] = 0;
		}
	} else if(this.poll["active"]) {
		this.poll["endTime"] = new Date().getTime();
		//console.log(this.poll["endTime"] - this.poll["timer"]);
		if(msg.content.split(" ").length > 1) {
			returnText =  "A poll is already active on this server. Close the previous poll with '!poll' and try again";
		} else if((msg.author == this.poll["creator"]) || ((this.poll["endTime"] - this.poll["timer"]) > 120000) || isMod) {
			returnText = this.closePoll();
		} else {
			this.poll["timeLeft"] = 120 - ((this.poll["endTime"] - this.poll["timer"]) / 1000);
			returnText =  "this poll needs to be closed by " + this.poll["creator"].username + " or by anyone in " + Math.round(this.poll["timeLeft"]) + " seconds.";
		}
	} else {
		returnText = "No poll is active, start a poll by typing !poll option1, option2, option3...";
	}
	return returnText;
}
Poll.prototype.closePoll = function() {
	this.poll["text"] = "--------------------------" + "\n" + "The poll is now closed" + "\n" + "--------------------------" + "\n";
	if(this.poll["votes"] === 0) {
		this.poll["text"] += "There were no votes for this poll\n";
	} else {
		for(i = 1 ; i < this.poll['options'].length + 1; i++) {

			var percentage = this.poll["res"][i-1]/this.poll["votes"]*100;
			this.poll["text"] += Math.round(percentage);

			if(percentage < 10) {
				this.poll["text"] += "%\t\t\t"
			} else if(percentage === 100) {
				this.poll["text"] += "%\t\t"
			} else if((percentage < 100) && (percentage >= 10)) {
				this.poll["text"] += "%\t\t\t"
			}
			if(this.poll["res"][i-1] === 1) {
				this.poll["text"] += this.poll["options"][i-1] + " (" + this.poll["res"][i-1] + " vote)" +"\n";
			} else {
				this.poll["text"] += this.poll["options"][i-1] + " (" + this.poll["res"][i-1] + " votes)" +"\n";
			}
			
		}
	}
	var retrunText = this.poll["text"] + "--------------------------";
	
	//Reset poll array
	this.poll = {
		"active":false,
		"timer":0,
		"endTime":0,
		"timeLeft":0,
		"options":[],
		"text":[],
		"creator":"",
		"res":[],
		"users":[],
		"votes":0
	};
	return retrunText;
}
Poll.prototype.vote = function(msg) {
	if(msg.channel === this.poll["channel"]) {
		if((parseInt(msg.content) < (this.poll['options'].length + 1)) && (this.poll["users"].indexOf(msg.author) < 0) && ((parseInt(msg.content) != 0))) {
			this.poll["res"][parseInt(msg.content) - 1]++;
			this.poll["users"].push(msg.author);
			this.poll["votes"]++;	
		}
	}
} 

Poll.prototype.showPoll = function() {
	if(!this.poll['active'])
		return "No poll is active, start a poll by typing !poll option1, option2, option3...";
	var showPoll = "\n-------------" + "\n" + "Active poll" + "\n" + "-------------" + "\n";
	if(this.poll['votes'] > 0) {
		for(i = 1 ; i < this.poll["options"].length + 1; i++) {
			var percentage = this.poll["res"][i-1]/this.poll["votes"]*100;
			showPoll += Math.round(percentage);

			if(percentage < 10) {
				showPoll += "%\t\t\t"
			} else if(percentage === 100) {
				showPoll += "%\t\t"
			} else if((percentage < 100) && (percentage >= 10)) {
				showPoll += "%\t\t\t"
			}
			if(this.poll["res"][i-1] === 1) {
				showPoll += this.poll["options"][i-1] + " (" + this.poll["res"][i-1] + " vote)" +"\n";
			} else {
				showPoll += this.poll["options"][i-1] + " (" + this.poll["res"][i-1] + " votes)" +"\n";
			}
		}
		return showPoll;
	} else {
		for(var i = 1; i < this.poll['options'].length + 1;i++) {
			showPoll += i+'. '+this.poll['options'][i-1] + " (0 votes)\n";
		}
		return showPoll;
	}
}

// export class
module.exports = Poll;
