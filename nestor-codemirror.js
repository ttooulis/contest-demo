 // Code highlighting required definitions and declarations
CodeMirror.defineMode("richtext", function() {
	return {
	  token: function(stream) {

	  if (stream.match(/Bank Officer:|Loan Applicant:|\(A[0-9]*\)|Suggestion:|Justification:/)) {
			return "strong";
		}
  
		stream.next();
		return null;
	  }
	};
});
  
CodeMirror.defineMIME("text/x-richtext", "richtext");


CodeMirror.defineMode("prudens", function() {
	return {
	  token: function(stream) {
 
		// Special Words
		if (stream.match(/reject_loan_application|\-reject_loan_application/)) {
			return "function";
		}

		// Keywords
		if (stream.match(/implies|@KnowledgeBase|@Code|@Knowledge|@Procedures/)) {
			return "keyword";
		}
  
		if (stream.match(/Inferences:|Dilemmas:|Key Supporting Arguments:/)) {
			return "strong";
		}
  
		if (stream.match(/[A-Z][a-zA-Z0-9_ ]*::/)) {
			stream.backUp(2); // Step back to before the name operator
			return "rname";
		}
  
		if (stream.match(/[A-Z][a-zA-Z0-9_]*/)) {
			return "variable";
		}
  
		// Handle special predicates
		if (stream.match(/assume|true|good_existing_customer/)) {
			return "predicate";
		}
  
		// Handle negation predicates
		if (stream.match(/-[a-z][a-zA-Z0-9_]*[ ,\()]/)) {
			stream.backUp(1); // Step back to before the opening parenthesis
			return "predicate";
		}
  
		// Handle predicates
		if (stream.match(/[a-z][a-zA-Z0-9_]*\(/)) {
			stream.backUp(1); // Step back to before the opening parenthesis
			return "predicate";
		}
  
		// Handle functions
		if (stream.match(/\?=|\?>|\?</)) {
			return "function";
		}

		if (stream.match(/\?[a-z][a-zA-Z0-9_]*\(/)) {
			stream.backUp(1); // Step back to before the opening parenthesis
			return "function";
		}
  
		if (stream.match(/[a-z][a-zA-Z0-9_]*/)) {
			return "literal";
		}
  
		if (stream.match(/\d+/)) {
			return "literal";
		}
  
		if (stream.match(/::|#|_|!|-|;|,|\||\(|\)/)) {
			return "operator";
		}
  
		stream.next();
		return null;
	  }
	};
});
  
CodeMirror.defineMIME("text/x-prudens", "prudens");


var translationPolicyTextArea = CodeMirror.fromTextArea(document.getElementById('translationPolicy'), {
    mode: "text/x-prudens",
    lineNumbers: true,
    lineWrapping: true,
    theme: "default"
});

var nlArgumentsTextArea = CodeMirror.fromTextArea(document.getElementById('nlAdvice'), {
    mode: "text/x-richtext",
    lineWrapping: true,
    theme: "default",
	readOnly: true  // Make the editor read-only
});

var nlConclusionsTextArea = CodeMirror.fromTextArea(document.getElementById('inferredNLConclusions'), {
    mode: "text/x-richtext",
    lineWrapping: true,
    theme: "default",
	readOnly: true  // Make the editor read-only
});

var formalConclusionsTextArea = CodeMirror.fromTextArea(document.getElementById('inferredFormalConclusions'), {
    mode: "text/x-prudens",
    lineNumbers: true,
    lineWrapping: true,
    theme: "default",
	readOnly: true  // Make the editor read-only
});

var generatedLogicTextarea = CodeMirror.fromTextArea(document.getElementById('generatedLogic'), {
    mode: "text/x-prudens",
    lineNumbers: true,
    lineWrapping: true,
    theme: "default",
	readOnly: true  // Make the editor read-only
});
