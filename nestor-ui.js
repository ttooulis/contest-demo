let contestDialogue = [
    ["Your loan application should be rejected.", "A001 :: assume implies reject_loan_application | 0;", "Machine"],
    ["Why is my loan application rejected?", "A002 :: assume implies accept_loan_application | 0;", "Human"],
    ["Your loan application has been rejected because your care-giving obligations are considered high and your credit score is low.", "A003 :: assume implies caregiving_obligations(high) | 0;\nA004 :: assume implies credit_score(low) | 0;\nA005 :: caregiving_obligations(high), credit_score(low) implies reject_loan_application | 101;", "Machine"],
    ["My loan application should have been accepted because I am a good existing customer: I own an account for a long time and I make frequent transactions.", "A006 :: good_existing_customer implies accept_loan_application | 103;\nA007 :: true implies account_owner_for(20, year) | 901;\nA008 :: true implies transaction_frequency(high) | 902;\nA009 :: account_owner_for(20, year), transaction_frequency(high) implies good_existing_customer | 102;", "Human"],
    ["You are not qualified as a good existing customer because your account balance is low for more than one year.", "A010 :: true implies account_balance_low_more_than(1, year) | 903;\nA011 :: account_balance_low_more_than(1, year) implies -good_existing_customer | 104;", "Machine"],
    ["Why is my credit score low?", "A012 :: assume implies -credit_score(low) | 0;", "Human"],
    ["Your credit score is considered low because it is 582.", "A013 :: true implies credit_score_value(582) | 907;\nA014 :: credit_score_value(582) implies credit_score(low) | 105;", "Machine"],
    ["My credit score is 590.", "A015 :: true implies credit_score_value(590) | 908;", "Human"],
    ["Your credit score is considered low because it is below 600.", "A016 :: credit_score_value(590) implies credit_score_less_than(600) | 106;\nA017 :: credit_score_less_than(600) implies credit_score(low) | 107;", "Machine"],
    ["Why are my care-giving obligations considered high?", "A018 :: assume implies -caregiving_obligations(high) | 0;", "Human"],
    ["Your care-giving obligations are considered high because you are female and have two children.", "A019 :: true implies gender(female) | 904;\nA020 :: true implies have(child, 2) | 905;\nA021 :: gender(female) implies female_obligations | 108;\nA022 :: have(child, 2), female_obligations implies caregiving_obligations(high) | 109;", "Machine"],
    ["Gender should not be used to determine care-giving obligations.", "A023 :: true implies -female_obligations | 906;", "Human"]
];

let currentArgument = 0;
let currentNLDialogue = '';
let currentPrudensDialogue = '@KnowledgeBase\nC001 :: reject_loan_application # accept_loan_application;\nC002 :: credit_score_value(582) # credit_score_value(590);';

async function loadPage(showOverlay) {

	currentArgument = 0;
	currentNLDialogue = '';
	currentPrudensDialogue = '@KnowledgeBase\nC001 :: reject_loan_application # accept_loan_application;\nC002 :: credit_score_value(582) # credit_score_value(590);';
	let lResponseJSON = '{ "context": [], "inferences" : [], "facts" : [], "graph" : {}, "dilemmas" : [], "defeatedRules" : [], logs : [] }';

	if (showOverlay) {

		overlayOn();

		try {

			lResponseJSON = await prudens_ping();
			responseJSON = lResponseJSON;

			if (responseJSON.type == 'error')
				throw new Error(`${responseJSON.name}: ${responseJSON.message}`);

			else if (responseJSON.inferences[0].name != 'echo')
				throw new Error(`Unexpected Response: ${responseJSON.inferences[0].name}`);

			showPage(showOverlay);
		}

		catch (err) {
			showErrorConnectingToWebService(err);
		}
		
		console.log(lResponseJSON);
	}

	else
		showPage(showOverlay);


}



function showPage(showOverlay) {
	document.getElementById("loader").style.display = "none";
	document.getElementById("nlAdvice").value = "";
	document.getElementById("nestorPageContent").style.display = "block";

	if (showOverlay) {
		// Dirty workaround to load data correctly in control
		let prudensDialogue = currentPrudensDialogue + '\n\n' + contestDialogue[0][1];;
		generatedLogicTextarea.setValue(prudensDialogue);
		prudensDialogue += '\n\n' + contestDialogue[1][1];;
		generatedLogicTextarea.setValue(prudensDialogue);
		prudensDialogue += '\n\n' + contestDialogue[2][1];;
		generatedLogicTextarea.setValue(prudensDialogue);

		document.getElementById("textOverlay").innerHTML = "Contesting dialogue demo is ready! Click on the screen to start...";
		document.getElementById("nestorOverlay").addEventListener("click", overlayOff);
	}

	generatedLogicTextarea.setValue("");
}



function showErrorConnectingToWebService(errorMessage) {
	document.getElementById("loader").style.display = "none";
	document.getElementById("textOverlay").innerHTML = "Connection to Prudens Web Service could not be established (" + errorMessage + ")!"
}



function overlayOn() {
	document.getElementById("nestorOverlay").style.display = "block";
}



function overlayOff() {
	document.getElementById("nestorOverlay").style.display = "none";
}



async function getNextArgument() {

	let animElementName = "animGenerate";

	document.getElementById(animElementName).style.opacity = "1";
    document.getElementById("btnViewSystemOutput").style.opacity = "0";

	try {
		if (currentArgument < contestDialogue.length) {

			let nlArgument = `${contestDialogue[currentArgument][2]}: ${contestDialogue[currentArgument][0]}`;
			let nlDialogue = (currentNLDialogue == '') ? nlArgument : currentNLDialogue + '\n\n' + nlArgument;
			let prudensDialogue = currentPrudensDialogue + '\n\n' + contestDialogue[currentArgument][1];;

			document.getElementById("nlAdvice").value = nlDialogue;
			generatedLogicTextarea.setValue(prudensDialogue);

			currentNLDialogue = nlDialogue;
			currentPrudensDialogue = prudensDialogue;
			currentArgument++;
		}
	}

	catch (err) {
		console.log(err);
	}
		
	console.log(`currentArgument=${currentArgument}`);
	document.getElementById(animElementName).style.opacity = "0";

}






async function inferConclusion() {

	let animElementName = "animGenerate";

	document.getElementById(animElementName).style.opacity = "1";
    document.getElementById("btnViewSystemOutput").style.opacity = "0";

	let lResponseJSON = '{ "context": [], "inferences" : [], "facts" : [], "graph" : {}, "dilemmas" : [], "defeatedRules" : [], logs : [] }';

	try {

		lResponseJSON = await prudens_deduce(currentPrudensDialogue.replace(/[\t\n\r]/g, ''), "assume;");
		responseJSON = lResponseJSON;

		if (lResponseJSON.type == 'error')
			throw new Error(`${responseJSON.name}: ${responseJSON.message}`);

		document.getElementById("btnViewSystemOutput").style.opacity = "1";

		let resultData = "<Inferences>\n"
		resultData += responseJSON.inferences.map(obj => obj ? obj.name : '').join(",\n");
		resultData += "\n\n<Dilemmas>\n";
		resultData += responseJSON.dilemmas.map(arr => arr.filter(obj => obj).map(obj => obj ? obj.name : '').join(" # ")).join("\n");
		translationPolicyTextArea.setValue(resultData);
		setTimeout(function () {
				translationPolicyTextArea.refresh()
			},
			100
		)
	
		//document.getElementById("generatedLogicLabel").innerHTML = lResponseJSON.message;
	}

	catch (err) {
		responseJSON = '{ "type": "", "name" : "", "message" : "" }';
		responseJSON.type =  'error';
		responseJSON.name = "Web call error";
		responseJSON.message =  err;
		document.getElementById("consoleNESTOR").innerHTML = lResponseJSON.message;
	}
	
	console.log(lResponseJSON);
	document.getElementById(animElementName).style.opacity = "0";

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
	systemOutputEditor.set(responseJSON);
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
        }, 1000);
    });

    icon.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.tooltiptext');
        clearTimeout(tooltipTimeout); // Clear the timeout
        tooltip.style.visibility = 'hidden'; // Hide the tooltip immediately
    });
});
