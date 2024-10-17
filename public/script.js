document.addEventListener('DOMContentLoaded', function () {
	const ws = new WebSocket('ws://localhost:8080');
	const popup = document.getElementById('popup');
	const openPopupButton = document.getElementById('openPopup');
	const closePopupButton = document.getElementById('closePopup');
	const startButton = document.getElementById('start');
	const groupSelect = document.getElementById('groupSelect');
	const prevButton = document.getElementById('prev');
	const nextButton = document.getElementById('next');
	const specificInput = document.getElementById('specificInput');
	const sendSpecificButton = document.getElementById('sendSpecific');
	const audio = document.getElementById('audio');
	const switchStatus = document.getElementById('switchStatus');

	let smartSwitches = [];
	let filteredSwitches = [];
	let currentIndex = 0;

	openPopupButton.onclick = () => {
		popup.classList.remove('hidden');
	};

	closePopupButton.onclick = () => {
		popup.classList.add('hidden');
		switchStatus.classList.add('hidden');
	};

	startButton.onclick = () => {
		startConfiguration();
	};

	nextButton.onclick = () => {
		ws.send(JSON.stringify({ type: 'next' }));
	};

	prevButton.onclick = () => {
		ws.send(JSON.stringify({ type: 'prev' }));
	};

	sendSpecificButton.onclick = () => {
		const entityId = specificInput.value.trim();
		if (entityId) {
			ws.send(
				JSON.stringify({
					type: 'change-specific',
					entityId,
					state: true,
				})
			);
			specificInput.value = '';
		}
	};

	ws.onmessage = (event) => {
		const data = JSON.parse(event.data);

		switch (data.type) {
			case 'smartSwitchList':
				smartSwitches = data.switches;
				populateGroupOptions(smartSwitches);
				break;
			case 'configure-switch':
				displaySwitch(data.switch);
				break;
			case 'success':
				playAudio();
				break;
			case 'config-complete':
				playAudio();
				switchStatus.classList.add('hidden');
				break;
			case 'error':
				showSwitchStatus(`Error: ${data.message}`);
				break;
		}
	};

	function startConfiguration() {
		const selectedGroup = groupSelect.value;
		filteredSwitches = smartSwitches.filter((s) =>
			s.id.startsWith(selectedGroup)
		);
		currentIndex = 0; // Setze den Index zurück, damit die Konfiguration immer von vorne beginnt
		if (filteredSwitches.length > 0) {
			displaySwitch(filteredSwitches[currentIndex]);
			ws.send(
				JSON.stringify({ type: 'start-config', group: selectedGroup })
			);
		}
	}

	function displaySwitch(switchConfig) {
		switchStatus.textContent = `Configure: ${switchConfig.id}`;
		switchStatus.classList.remove('hidden');
	}

	function populateGroupOptions(switches) {
		const groups = [...new Set(switches.map((s) => s.id.split('.')[0]))];
		groupSelect.innerHTML = '';

		groups.forEach((group) => {
			const option = document.createElement('option');
			option.value = group;
			option.textContent = group.charAt(0).toUpperCase() + group.slice(1);
			groupSelect.appendChild(option);
		});
	}

	function playAudio() {
		audio.play();
	}
});
