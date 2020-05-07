$(document).ready(function(){
	// listen for key presses
	$("#prompt").on("keydown", function(e){
		if(e.keyCode === 13){
			sendCommand($(this).val());
			$(this).select();
		} else if(e.keyCode === 27){
			$(this).val(null);
		}
	});

	$("#prompt").focus();
});

function addMessage(content){
	let element = document.createElement("div");
	element.className = "message";
	element.innerHTML = content;
	$("#messages").append(element);
};

function sendCommand(command){
	socket.emit("command", command);
}

socket.on("message", function(content){
	addMessage(content);
});