var Audio = (function() {
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioCtx = new AudioContext();

	var frameCount = audioCtx.sampleRate * 0.5;
	var buffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate);
	var bufferData = buffer.getChannelData(0);

	for (var i = 0; i < frameCount; i++) {
		bufferData[i] = (Math.sin(i/frameCount * 1500) + Math.sin(i/frameCount * 2000)) * 0.05;
	}

	var src = audioCtx.createBufferSource();
	src.buffer = buffer;
	src.loop = true;

	src.connect(audioCtx.destination);
	//src.start();

	return {
		audioCtx: audioCtx
	};
})();