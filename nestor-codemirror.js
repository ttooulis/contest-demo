 // Code highlighting required definitions and declarations
CodeMirror.defineMode("prudens", function() {
	return {
	  token: function(stream) {

		if (stream.match(/implies|#|@KnowledgeBase|@Code|@Knowledge|@Procedures/)) {
			return "keyword";
		}
  
		if (stream.match(/[A-Z][a-zA-Z0-9_]*::/)) {
			stream.backUp(2); // Step back to before the name operator
			return "rname";
		}
  
		if (stream.match(/[A-Z][a-zA-Z0-9_]*/)) {
			return "variable";
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
  
		if (stream.match(/::|_|!|-|;|,|\(|\)/)) {
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

var generatedLogicTextarea = CodeMirror.fromTextArea(document.getElementById('generatedLogic'), {
    mode: "text/x-prudens",
    lineNumbers: true,
    lineWrapping: true,
    theme: "default",
	readOnly: true  // Make the editor read-only
});
