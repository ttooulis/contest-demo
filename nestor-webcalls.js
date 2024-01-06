var serverURL='https://dynamic---nestor-service-pec5yiptqq-uc.a.run.app';
//var serverURL='https://localhost';

var responseJSON = '{ "message": "Empty Message", "resultCode" : -1, "textData" : "", "jsondata" : "" }';

var translationSettings = JSON.parse('{ "NLP_CustomNameEntityPatterns": "Fevipiprant\\tBRAND\\nESP\\tSYSTEM", "Policy_Language" : "prudensjs-web", "Policy_PredicateMode" : 0, "Policy_VersionPredicate" : "metakbinfo(version);", "Policy_VersionDataPredicate" : "metakbinfo_data", "Policy_GeneratePredicate" : "!generate", "Policy_ArgumentSeparator" : "args", "Policy_PredicateSeparator" : "next", "Policy_VarPlaceholder" : "vph_", "Policy_DynamicVarPlaceholder" : "dvph_", "Policy_NegationConstant" : "negation", "Policy_ActionConstant" : "action", "PrudensJava_RuleImportance" : "desc", "Generate_PredNameConcatChar" : "", "Generate_PredNameCapitalize" : true, "Generate_PredNameCapitalizeExceptions" : "-|!|(|)", "Generate_NeckSymbol" : "implies", "Generate_ConflictNeckSymbol" : "#", "Generate_AddName" : false, "Generate_NameSeparator" : "::", "Generate_VariableName" : "X", "Generate_IgnoreBodyGroups" : true }');

const defaultTranslationPolicy = '@Knowledge\nE001 :: cop(W1, P1, be, PBe),\n    nsubj(W1, P1, W2, P2) implies\n    sdclause(_, W1, P1, W1, W2, P2, W2);\n\nE002 :: token(Word1, POS_Tag, NER_Flag, NER_Tag, W1, P1),\n    ?startsWith(POS_Tag, vb),\n    dobj(W1, P1, W2, P2) implies\n    siclause(_, W1, P1, W1, W2, P2, W2);\n\nE003 :: siclause(Prefix, W1, P1, WPredicate1, W2, P2, WPredicate2),\n    ?partOf(activate_deactivate_increase_decrease, W1) implies\n    aclause(action, W1, P1, WPredicate1, W2, P2, WPredicate2);\n\nE004 :: root(root, 0, W1, P1),\n    sdclause(Prefix, W1, P1, WPredicate1, W2, P2, WPredicate2) implies\n    !generate(head, 0, Prefix, WPredicate1, args, vph_1, next, WPredicate2, args, vph_1);\n\nE005 :: root(root, 0, W1, P1),\n    aclause(Prefix, W1, P1, WPredicate1, W2, P2, WPredicate2) implies\n    !generate(head, 0, Prefix, WPredicate1, args, vph_1, next, WPredicate2, args, vph_1);\n\nE006 :: advcl(WParent, PParent, W1, P1),\n    sdclause(_, W1, P1, WPredicate1, W2, P2, WPredicate2) implies\n    !generate(body, 1, _, WPredicate1, args, vph_1, next, WPredicate2, args, vph_1);\n\nE007 :: root(root, 0, W1, P1),\n    token(Word2, POS_Tag, ner, NER_Tag, W2, P2),\n    sdclause(Prefix, W1, P1, WPredicate1, W2, P2, WPredicate2) implies\n    !generate(head, 0, Prefix, WPredicate1, args, WPredicate2);\n\nE008 :: root(root, 0, W1, P1),\n    token(Word2, POS_Tag, ner, NER_Tag, W2, P2),\n    aclause(Prefix, W1, P1, WPredicate1, W2, P2, WPredicate2) implies\n    !generate(head, 0, Prefix, WPredicate1, args, WPredicate2);\n\nE009 :: advcl(WParent, PParent, W1, P1),\n    token(Word2, POS_Tag, ner, NER_Tag, W2, P2),\n    sdclause(_, W1, P1, WPredicate1, W2, P2, WPredicate2) implies\n    !generate(body, 1, _, WPredicate1, args, WPredicate2);\n\nE010 :: !generate(TYPE, GROUP, Prefix, WPredicate1, args, WPredicate2) #\n    !generate(TYPE, GROUP, Prefix, WPredicate1, args, vph_1, next, WPredicate2, args, vph_1);\n\nE011 :: aux(W1, P1, be, PBe),\n    nsubj(W1, P1, W2, P2) implies\n    sdclause(_, W1, P1, W1, W2, P2, W2);\n\nE012 :: siclause(Prefix, W1, P1, WPredicate1, W2, P2, WPredicate2),\n    ?startsWith(W1, engage) implies\n    aclause(action, W1, P1, activate, W2, P2, WPredicate2);\n\n@Procedures\nfunction startsWith(word, start) {\n    return word.startsWith(start);\n}\n\nfunction partOf(list, word) {\n    return list.split("_").includes(word);\n}';

var activeTranslationPolicy = defaultTranslationPolicy;


const nestor_getInfo = async () => {

	responseJSON = '{ "message": "Empty Message", "resultCode" : -1, "textData" : "", "jsondata" : "" }';

    try {

		let serviceURL = serverURL + '/control?command=4';
		console.log(serviceURL);

		const response = await fetch(serviceURL);
		if (!response.ok) {
			console.log(response);
			throw new Error(`Error! Status: ${response.status}`);
		}

		responseJSON = await response.json();
		console.log(responseJSON);
	}

	catch (err) {
		responseJSON.message =  err;
		responseJSON.resultCode =  -10;
		console.log(err);
	}

	return responseJSON;

}



const nestor_generateLogicExpressions = async (nlTextInput, translationPolicyInput, translationParametersJSONInput) => {

	responseJSON = '{ "message": "Empty Message", "resultCode" : -1, "textData" : "", "jsondata" : "" }';

	try {

		if (translationPolicyInput != '')
			translationPolicyInput = translationPolicyInput + '\n';

		let serviceURL = serverURL + '/generatelogicexpressions';
		console.log(serviceURL);

		const response = await fetch(serviceURL, {
			method: 'POST',
			body: JSON.stringify({nlText: nlTextInput, translationPolicy: translationPolicyInput, translationParametersJSON: translationParametersJSONInput}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.log(response);
			throw new Error(`Error! Status: ${response.status}`);
		}

		responseJSON = await response.json();
		console.log(responseJSON);
	}

	catch (err) {
		responseJSON.message =  err;
		responseJSON.resultCode =  -10;
		console.log(err);
	}

	return responseJSON;

}



const nestor_generateLogicPredicates   = async (nlTextInput) => {

	responseJSON = '{ "message": "Empty Message", "resultCode" : -1, "textData" : "", "jsondata" : "" }';

    try {

		let serviceURL = serverURL + '/generatelogicpredicates';
		console.log(serviceURL);

	    const response = await fetch(serviceURL, {
    	    method: 'POST',
			body: nlTextInput,
			headers: {
				'Content-Type': 'application/json'
			}
  	    });

	    if (!response.ok) {
		    console.log(response);
		    throw new Error(`Error! status: ${response.status}`);
	    }

  	    responseJSON = await response.json();
  	    if (responseJSON.resultCode == 0) {
			responseJSON.textData = responseJSON.textData.replaceAll("; ", ";\n").replace("\n\n", "\n");
       	}
		console.log(responseJSON);
    }

	catch (err) {
		responseJSON.message =  err;
		responseJSON.resultCode =  -20;
		console.log(err);
	}

	return responseJSON;

}



function getServerURL() {
	return serverURL;
}



function getServerSwaggerURL() {
	return serverURL + '/swagger-ui/index.html';
}
