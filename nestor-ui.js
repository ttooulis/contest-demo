 async function loadPage() {

	overlayOn();

	let lResponseJSON = '{ "message": "Empty Message", "resultCode" : -1, "textData" : "", "jsondata" : "" }'

	try {

		lResponseJSON = await nestor_getInfo();
		responseJSON = lResponseJSON;

		if (lResponseJSON.resultCode == 0) {
			var NESTORInfo = responseJSON.textData.split(/\s*,\s*/);
			document.title = NESTORInfo[0];	  	
    		document.getElementById("headerTextNESTOR").innerHTML = NESTORInfo[0];
		}

		else {
			throw new Error(`${responseJSON.message}: ${responseJSON.resultCode}`);
		}

		showPage();
	}

	catch (err) {
		showErrorConnectingToWebService(err);
	}
	
	console.log(lResponseJSON);

}



function showPage() {
	document.getElementById("loader").style.display = "none";
	generatedLogicTextarea.setValue("");
	document.getElementById("nestorPageContent").style.display = "block";
	document.getElementById("textOverlay").innerHTML = "NESTOR is ready! Click on the screen to start...";
	document.getElementById("nestorOverlay").addEventListener("click", overlayOff);
}



function showErrorConnectingToWebService(errorMessage) {
	document.getElementById("loader").style.display = "none";
	document.getElementById("textOverlay").innerHTML = "Connection to NESTOR Web Service could not be established (" + errorMessage + ")! Please reload in a few seconds..."
}



function overlayOn() {
	document.getElementById("nestorOverlay").style.display = "block";
}



function overlayOff() {
	document.getElementById("nestorOverlay").style.display = "none";
}


async function generateLogic(nestor_webCall = null) {

	let animElementName = "animGenerate";

	document.getElementById(animElementName).style.opacity = "1";
	generatedLogicTextarea.setValue("Generating Logic...");
    document.getElementById("btnViewSystemOutput").style.opacity = "0";

	let nlAdvice = document.getElementById("nlAdvice").value;
	let translationPolicy = activeTranslationPolicy;
	let translationParametersJSON = translationSettings;

	let lResponseJSON = '{ "message": "Empty Message", "resultCode" : -1, "textData" : "", "jsondata" : "" }'

	try {

		if (nestor_webCall) {

			lResponseJSON = await nestor_webCall(nlAdvice, translationPolicy, JSON.stringify(translationParametersJSON));
			responseJSON = lResponseJSON;

			if (lResponseJSON.resultCode == 0) {
				generatedLogicTextarea.setValue(lResponseJSON.textData);
				document.getElementById("btnViewSystemOutput").style.opacity = "1";
				document.getElementById("generatedLogicLabel").innerHTML = lResponseJSON.message;
			}

			else {
				throw new Error(`${responseJSON.message}: ${responseJSON.resultCode}`);
			}
		}

		else {
			responseJSON.message =  "Undefined Web Call Function!";
			responseJSON.resultCode =  -100;
			throw new Error(`Undefined Web Call Function: ${responseJSON.resultCode}`);
		}
	}

	catch (err) {
		responseJSON.message =  err;
		responseJSON.resultCode =  -200;
		document.getElementById("consoleNESTOR").innerHTML = lResponseJSON.message;
	}
	
	console.log(lResponseJSON);
	document.getElementById(animElementName).style.opacity = "0";

}



function editTranslationPolicy() {
	translationPolicyTextArea.setValue(activeTranslationPolicy);
	setTimeout(function () {
    		translationPolicyTextArea.refresh()
        },
		100
	)
}



function loadTranslationPolicy() {
	translationPolicyTextArea.setValue(defaultTranslationPolicy);
	setTimeout(function () {
    		translationPolicyTextArea.refresh()
        },
		100
	)
}



function clearTranslationPolicy() {
	translationPolicyTextArea.setValue("");
	setTimeout(function () {
    		translationPolicyTextArea.refresh()
        },
		100
	)
}



function downloadTranslationPolicy(popupElement) {

	try {
		var textBlob = new Blob([translationPolicyTextArea.getValue()], {type:'text/plain'});
		var downloadLink = document.createElement("a");
		downloadLink.download = "TranslationPolicy.prudens";
		downloadLink.innerHTML = "Download File";
		downloadLink.href = window.URL.createObjectURL(textBlob);
		downloadLink.click();
		delete downloadLink;
		delete textBlob;
	}

	catch (err) {
		closePopup(popupElement);
		document.getElementById("consoleNESTOR").innerHTML = err;
		console.log(err);
	}

}



function useTranslationPolicy(popupElement) {
	activeTranslationPolicy = translationPolicyTextArea.getValue();
	console.log(activeTranslationPolicy);
	closePopup(popupElement);
}



function editTranslationSettings() {
	translationSettingstEditor.set(translationSettings);
}



function viewSystemOutput() {
	systemOutputEditor.set(JSON.parse(responseJSON.jsondata));
}



function useTranslationSettings(popupElement) {
	translationSettings = translationSettingstEditor.get();
	console.log(translationSettings);
	closePopup(popupElement);
}



function openPopup(popupElement, actionNESTOR = null) {
	if (actionNESTOR)
		actionNESTOR();
    document.getElementById(popupElement).style.display = "block";
}



function closePopup(popupElement) {
    document.getElementById(popupElement).style.display = "none";
}



document.querySelectorAll('.actionCommandIcon, .checkmark, .actionIcon').forEach(icon => {
    let tooltipTimeout;

    icon.addEventListener('mouseover', function() {
        const tooltip = this.querySelector('.tooltiptext');
        clearTimeout(tooltipTimeout); // Clear any existing timeout
        tooltip.style.visibility = 'visible';

        // Set a timeout to hide the tooltip after 2 seconds
        tooltipTimeout = setTimeout(() => {
            tooltip.style.visibility = 'hidden';
        }, 1500);
    });

    icon.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.tooltiptext');
        clearTimeout(tooltipTimeout); // Clear the timeout
        tooltip.style.visibility = 'hidden'; // Hide the tooltip immediately
    });
});
